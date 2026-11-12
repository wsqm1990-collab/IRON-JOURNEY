# Makes the app's signing key from the IJ_KEY_PASS repository secret.
# The same secret always gives the same key and certificate, so every build is signed the same
# way (new versions install over the old one) and nothing secret is ever stored in the repository.
# Usage: IJ_KEY_PASS=... python3 native/ci/signing-key.py native/keystore/ironjourney.p12
import datetime
import hashlib
import hmac
import os
import sys

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

secret = os.environ.get('IJ_KEY_PASS', '').encode()
if len(secret) < 16:
    sys.exit('IJ_KEY_PASS is missing or too short (use at least 16 characters)')


class Stream:
    """Deterministic random bytes from the secret (HMAC-SHA256 in counter mode)."""
    def __init__(self, seed):
        self.key = hmac.new(b'iron-journey-signing-v1', seed, hashlib.sha256).digest()
        self.n = 0

    def take(self, k):
        out = b''
        while len(out) < k:
            self.n += 1
            out += hmac.new(self.key, self.n.to_bytes(8, 'big'), hashlib.sha256).digest()
        return out[:k]

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


rng = Stream(secret)
e = 65537
p = prime(rng, 1024, e)
q = prime(rng, 1024, e)
while q == p:
    q = prime(rng, 1024, e)
if p < q:
    p, q = q, p
n = p * q
d = pow(e, -1, (p - 1) * (q - 1))
key = rsa.RSAPrivateNumbers(p, q, d, d % (p - 1), d % (q - 1), pow(q, -1, p), rsa.RSAPublicNumbers(e, n)).private_key()

name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Iron Journey')])
utc = datetime.timezone.utc
cert = (x509.CertificateBuilder()
        .subject_name(name).issuer_name(name).public_key(key.public_key()).serial_number(1)
        .not_valid_before(datetime.datetime(2026, 1, 1, tzinfo=utc))
        .not_valid_after(datetime.datetime(2125, 12, 31, tzinfo=utc))
        .sign(key, hashes.SHA256()))

out = sys.argv[1] if len(sys.argv) > 1 else 'native/keystore/ironjourney.p12'
os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
with open(out, 'wb') as f:
    f.write(pkcs12.serialize_key_and_certificates(b'ironjourney', key, cert, None, serialization.BestAvailableEncryption(secret)))
print('signing certificate SHA-256:', cert.fingerprint(hashes.SHA256()).hex())
