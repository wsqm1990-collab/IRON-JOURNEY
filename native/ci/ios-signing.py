# Gets what Apple needs to accept a TestFlight build, through the App Store Connect API:
# the app's bundle ID, an "Apple Distribution" certificate and an App Store provisioning profile.
#
# The certificate's private key is made from the IJ_KEY_PASS secret (like the Android key), so
# every build finds the same certificate again and nothing secret is stored anywhere. This only
# creates or replaces things made for Iron Journey (the bundle ID com.wsqm1990.ironjourney, the
# profile "Iron Journey CI"); nothing else in the Apple account is changed or removed.
#
# Usage: python ios-signing.py OUTDIR
#   env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 (the .p8 file's text), IJ_KEY_PASS, APPLE_TEAM_ID (optional)
# Writes OUTDIR/dist.p12, OUTDIR/p12.pass, OUTDIR/profile.mobileprovision and OUTDIR/out.env
# (team=, profile=, uuid=, app=true|false).
import base64
import datetime
import hashlib
import hmac
import json
import os
import secrets
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

BUNDLE = 'com.wsqm1990.ironjourney'
APP_NAME = 'Iron Journey'
PROFILE = 'Iron Journey CI'
API = 'https://api.appstoreconnect.apple.com'

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
key_id = os.environ.get('ASC_KEY_ID', '').strip()
issuer = os.environ.get('ASC_ISSUER_ID', '').strip()
p8 = os.environ.get('ASC_KEY_P8', '')
seed = os.environ.get('IJ_KEY_PASS', '').encode()
team_secret = os.environ.get('APPLE_TEAM_ID', '').strip()
if not (key_id and issuer and p8.strip()):
    sys.exit('Missing ASC_KEY_ID, ASC_ISSUER_ID or ASC_KEY_P8')
if len(seed) < 16:
    sys.exit('IJ_KEY_PASS is missing or too short')


def pem(text):
    """The .p8 key as PEM, also when it was pasted without its line breaks."""
    t = text.strip().replace('\r', '')
    body = t.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '')
    body = ''.join(body.split())
    lines = [body[i:i + 64] for i in range(0, len(body), 64)]
    return ('-----BEGIN PRIVATE KEY-----\n' + '\n'.join(lines) + '\n-----END PRIVATE KEY-----\n').encode()


try:
    asc_key = serialization.load_pem_private_key(pem(p8), password=None)
except Exception as e:
    sys.exit('ASC_KEY_P8 is not a valid .p8 key (paste the whole text of the AuthKey file): %s' % e)


def b64u(b):
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode()


def token():
    now = int(time.time())
    head = b64u(json.dumps({'alg': 'ES256', 'kid': key_id, 'typ': 'JWT'}).encode())
    body = b64u(json.dumps({'iss': issuer, 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'}).encode())
    r, s = decode_dss_signature(asc_key.sign(('%s.%s' % (head, body)).encode(), ec.ECDSA(hashes.SHA256())))
    return '%s.%s.%s' % (head, body, b64u(r.to_bytes(32, 'big') + s.to_bytes(32, 'big')))


TOKEN = token()


def api(method, path, body=None):
    url = path if path.startswith('http') else API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {'errors': [{'title': 'HTTP %s' % e.code, 'detail': raw[:300].decode('utf-8', 'replace')}]}


def why(j):
    errs = j.get('errors') or []
    return '; '.join('%s: %s' % (x.get('title', ''), x.get('detail', '')) for x in errs) or json.dumps(j)[:300]


def get_all(path):
    items, url = [], path
    while url:
        st, j = api('GET', url)
        if st == 401:
            sys.exit('Apple did not accept the API key (check ASC_KEY_ID, ASC_ISSUER_ID and ASC_KEY_P8): ' + why(j))
        if st != 200:
            sys.exit('App Store Connect answered %s for %s: %s' % (st, path, why(j)))
        items += j.get('data', [])
        url = (j.get('links') or {}).get('next')
    return items


# ---------------------------------------------------------------- the private key, from the secret
class Stream:
    """Deterministic random bytes from the secret (HMAC-SHA256 in counter mode)."""
    def __init__(self, s):
        self.key = hmac.new(b'iron-journey-apple-distribution-v1', s, hashlib.sha256).digest()
        self.n = 0

    def take(self, k):
        b = b''
        while len(b) < k:
            self.n += 1
            b += hmac.new(self.key, self.n.to_bytes(8, 'big'), hashlib.sha256).digest()
        return b[:k]

    def number(self, bits):
        return int.from_bytes(self.take(bits // 8), 'big')


SMALL = [p for p in range(3, 2000, 2) if all(p % d for d in range(3, int(p ** 0.5) + 1, 2))]


def probably_prime(n, rng, rounds=48):
    if any(n % p == 0 for p in SMALL):
        return n in SMALL
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for _ in range(rounds):
        a = 2 + rng.number(1024) % (n - 3)
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True


def prime(rng, bits, e):
    while True:
        c = rng.number(bits) | (3 << (bits - 2)) | 1
        if (c - 1) % e and probably_prime(c, rng):
            return c


rng = Stream(seed)
E = 65537
P = prime(rng, 1024, E)
Q = prime(rng, 1024, E)
while Q == P:
    Q = prime(rng, 1024, E)
if P < Q:
    P, Q = Q, P
N = P * Q
D = pow(E, -1, (P - 1) * (Q - 1))
key = rsa.RSAPrivateNumbers(P, Q, D, D % (P - 1), D % (Q - 1), pow(Q, -1, P), rsa.RSAPublicNumbers(E, N)).private_key()

# ---------------------------------------------------------------- 1. the bundle ID
q = urllib.parse.urlencode({'filter[identifier]': BUNDLE, 'limit': 200})
found = [b for b in get_all('/v1/bundleIds?' + q) if b['attributes'].get('identifier') == BUNDLE]
if found:
    bundle_id = found[0]['id']
    print('Bundle ID: %s (already registered)' % BUNDLE)
else:
    st, j = api('POST', '/v1/bundleIds', {'data': {'type': 'bundleIds', 'attributes': {
        'identifier': BUNDLE, 'name': APP_NAME, 'platform': 'IOS'}}})
    if st != 201:
        sys.exit('Could not register the bundle ID %s: %s' % (BUNDLE, why(j)))
    bundle_id = j['data']['id']
    print('Bundle ID: %s (registered now)' % BUNDLE)

# ---------------------------------------------------------------- 2. the distribution certificate
now = datetime.datetime.now(datetime.timezone.utc)
mine_n = key.public_key().public_numbers().n
cert_id, cert = None, None
q = urllib.parse.urlencode({'filter[certificateType]': 'DISTRIBUTION', 'limit': 200})
for c in get_all('/v1/certificates?' + q):
    content = c['attributes'].get('certificateContent')
    if not content:
        continue
    x = x509.load_der_x509_certificate(base64.b64decode(content))
    pk = x.public_key()
    if isinstance(pk, rsa.RSAPublicKey) and pk.public_numbers().n == mine_n and x.not_valid_after_utc > now + datetime.timedelta(days=2):
        cert_id, cert = c['id'], x
        break
if cert:
    print('Certificate: Apple Distribution, valid until %s (already made)' % cert.not_valid_after_utc.date())
else:
    csr = x509.CertificateSigningRequestBuilder().subject_name(x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, 'Iron Journey CI'),
        x509.NameAttribute(NameOID.COUNTRY_NAME, 'BR'),
    ])).sign(key, hashes.SHA256())
    st, j = api('POST', '/v1/certificates', {'data': {'type': 'certificates', 'attributes': {
        'certificateType': 'DISTRIBUTION', 'csrContent': csr.public_bytes(serialization.Encoding.PEM).decode()}}})
    if st != 201:
        sys.exit('Apple did not create the distribution certificate: %s\n'
                 'If the account already has the maximum number of Apple Distribution certificates, '
                 'one that is no longer used has to be revoked at developer.apple.com first.' % why(j))
    cert_id = j['data']['id']
    cert = x509.load_der_x509_certificate(base64.b64decode(j['data']['attributes']['certificateContent']))
    print('Certificate: Apple Distribution, valid until %s (made now)' % cert.not_valid_after_utc.date())

ous = cert.subject.get_attributes_for_oid(NameOID.ORGANIZATIONAL_UNIT_NAME)
team = team_secret or (ous[0].value if ous else '')
if not team:
    sys.exit('Could not find the Team ID (set the APPLE_TEAM_ID secret)')
print('Team: found')  # logs of a public repository are public

# ---------------------------------------------------------------- 3. the App Store profile
profile = None
q = urllib.parse.urlencode({'filter[name]': PROFILE, 'limit': 50})
ours = [p for p in get_all('/v1/profiles?' + q) if p['attributes'].get('name') == PROFILE]
for p in ours:
    a = p['attributes']
    if a.get('profileState') != 'ACTIVE' or a.get('profileType') != 'IOS_APP_STORE':
        continue
    st, j = api('GET', '/v1/profiles/%s/certificates?limit=50' % p['id'])
    certs = [c['id'] for c in j.get('data', [])] if st == 200 else []
    st, j = api('GET', '/v1/profiles/%s/bundleId' % p['id'])
    bid = (j.get('data') or {}).get('id') if st == 200 else None
    exp = a.get('expirationDate') or ''
    fresh = not exp or datetime.datetime.fromisoformat(exp.replace('Z', '+00:00')) > now + datetime.timedelta(days=2)
    if cert_id in certs and bid == bundle_id and fresh and a.get('profileContent'):
        profile = p
        break
for p in ours:  # only our own profile, by its exact name
    if profile is None or p['id'] != profile['id']:
        api('DELETE', '/v1/profiles/%s' % p['id'])
if profile:
    print('Profile: "%s" (already made)' % PROFILE)
else:
    st, j = api('POST', '/v1/profiles', {'data': {
        'type': 'profiles',
        'attributes': {'name': PROFILE, 'profileType': 'IOS_APP_STORE'},
        'relationships': {
            'bundleId': {'data': {'type': 'bundleIds', 'id': bundle_id}},
            'certificates': {'data': [{'type': 'certificates', 'id': cert_id}]},
        }}})
    if st != 201:
        sys.exit('Apple did not create the provisioning profile: %s' % why(j))
    profile = j['data']
    print('Profile: "%s" (made now)' % PROFILE)

# ---------------------------------------------------------------- 4. is there an app in App Store Connect?
q = urllib.parse.urlencode({'filter[bundleId]': BUNDLE, 'limit': 50})
apps = [a for a in get_all('/v1/apps?' + q) if a['attributes'].get('bundleId') == BUNDLE]
if apps:
    print('App in App Store Connect: "%s"' % apps[0]['attributes'].get('name'))
else:
    print('::warning::There is no app with the bundle ID %s in App Store Connect yet, so the build cannot be sent '
          'to TestFlight. Create it at appstoreconnect.apple.com > Apps > + > New App.' % BUNDLE)

# ---------------------------------------------------------------- files for the build
password = secrets.token_hex(16)
enc = (serialization.PrivateFormat.PKCS12.encryption_builder()
       .kdf_rounds(50000)
       .key_cert_algorithm(pkcs12.PBES.PBESv1SHA1And3KeyTripleDESCBC)
       .hmac_hash(hashes.SHA1())
       .build(password.encode()))
with open(os.path.join(out, 'dist.p12'), 'wb') as f:
    f.write(pkcs12.serialize_key_and_certificates(b'Iron Journey CI', key, cert, None, enc))
with open(os.path.join(out, 'p12.pass'), 'w') as f:
    f.write(password)
with open(os.path.join(out, 'profile.mobileprovision'), 'wb') as f:
    f.write(base64.b64decode(profile['attributes']['profileContent']))
with open(os.path.join(out, 'out.env'), 'w') as f:
    f.write('team=%s\nprofile=%s\nuuid=%s\napp=%s\n' % (team, PROFILE, profile['attributes']['uuid'], 'true' if apps else 'false'))
print('Signing files ready.')
