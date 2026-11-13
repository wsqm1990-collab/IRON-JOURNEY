/* ---------- exercise figure ----------
   A small 3D mannequin drawn by the app itself (no photos from the internet): each exercise is a
   pose function of k (0 = start position, 1 = the other end of the rep), animated with the tempo of
   a good rep. Joints come from forward kinematics or two-bone IK (hands on the bar, feet on the
   floor), are projected with a fixed camera and drawn back to front. */
const RAD = Math.PI / 180;
const vAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vMul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const vDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vLen = a => Math.hypot(a[0], a[1], a[2]);
const vNorm = a => { const l = vLen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const vLerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const vMir = a => [a[0], a[1], -a[2]];
const nLerp = (a, b, k) => a + (b - a) * k;
/* a direction: azimuth (0 = forward, 90 = to the person's right) and elevation (90 = up, -90 = down) */
const D = (az, el) => [Math.cos(el * RAD) * Math.cos(az * RAD), Math.sin(el * RAD), Math.cos(el * RAD) * Math.sin(az * RAD)];
function vSlerp(a, b, k) {
  a = vNorm(a); b = vNorm(b);
  const w = Math.acos(clamp(vDot(a, b), -1, 1));
  if (w < 1e-4) return a;
  if (Math.PI - w < 1e-3) return vNorm(vLerp(a, b, k));
  const s = Math.sin(w);
  return vAdd(vMul(a, Math.sin((1 - k) * w) / s), vMul(b, Math.sin(k * w) / s));
}
/* two bones from a toward a target, bending toward the pole */
function ik2(a, alvo, l1, l2, polo) {
  const d = vSub(alvo, a), dir = vNorm(d), dist = clamp(vLen(d), Math.abs(l1 - l2) + 0.01, l1 + l2 - 0.01);
  const x = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  let p = vSub(polo, vMul(dir, vDot(polo, dir)));
  p = vLen(p) < 1e-6 ? [0, 1, 0] : vNorm(p);
  return [vAdd(vAdd(a, vMul(dir, x)), vMul(p, h)), vAdd(a, vMul(dir, dist))];
}
const vCross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/* where the chest faces, for a torso along T with the right side along lat */
const peitoDe = (T, lat = [0, 0, 1]) => vNorm(vCross(vNorm(T), lat));
const C = { T: 50, N: 17, OMB: 17, QUA: 9, UA: 29, FA: 26, MAO: 6, COXA: 43, PERNA: 42, PE: 14 };

/* the whole body from the pelvis (or the neck), torso direction and a spec for each limb:
   arm {m: hand target, polo} or {ua, fa}; leg {a: ankle target, polo, pe} or {th, sh, pe}.
   The left side mirrors the right one unless given. */
function corpo(o) {
  const lat = vNorm(o.lat || [0, 0, 1]), T = vNorm(o.tr || [0, 1, 0]);
  const P = o.P || vSub(o.nk, vMul(T, C.T));
  const nk = vAdd(P, vMul(T, C.T)), hd = vAdd(nk, vMul(vNorm(o.hd || T), C.N));
  const J = { P, nk, hd, T, lat };
  const espelho = s => (s ? Object.fromEntries(Object.entries(s).map(([k, v]) => [k, Array.isArray(v) ? vMir(v) : v])) : null);
  for (const [lado, sgn] of [['R', 1], ['L', -1]]) {
    const br = o['b' + lado] || (lado === 'L' ? espelho(o.bR) : null) || { ua: D(0, -90), fa: D(0, -90) };
    const pr = o['p' + lado] || (lado === 'L' ? espelho(o.pR) : null) || { th: D(0, -90), sh: D(0, -90) };
    const s = vAdd(vSub(nk, vMul(T, 4)), vMul(lat, C.OMB * sgn));
    let e, w;
    if (br.m) [e, w] = ik2(s, br.m, C.UA, C.FA, br.polo || [0, -1, 0]);
    else { e = vAdd(s, vMul(vNorm(br.ua), C.UA)); w = vAdd(e, vMul(vNorm(br.fa), C.FA)); }
    const h = vAdd(w, vMul(vNorm(br.mao || vSub(w, e)), C.MAO));
    const q = vAdd(P, vMul(lat, C.QUA * sgn));
    let k, a;
    if (pr.a) [k, a] = ik2(q, pr.a, C.COXA, C.PERNA, pr.polo || [1, 0, 0]);
    else { k = vAdd(q, vMul(vNorm(pr.th), C.COXA)); a = vAdd(k, vMul(vNorm(pr.sh), C.PERNA)); }
    const pe = vNorm(pr.pe || D(sgn * 12, -8));
    Object.assign(J, { ['s' + lado]: s, ['e' + lado]: e, ['w' + lado]: w, ['h' + lado]: h, ['q' + lado]: q, ['k' + lado]: k, ['a' + lado]: a, ['t' + lado]: vAdd(a, vMul(pe, C.PE)) });
  }
  return J;
}
function primsCorpo(J) {
  const L = (a, b, w, lado = 'C') => ({ t: 'l', a, b, w, c: 'b', lado });
  return [
    L(vSub(J.P, vMul(J.T, 3)), vSub(J.nk, vMul(J.T, 6)), 21), L(J.sL, J.sR, 11), L(J.qL, J.qR, 15),
    L(J.nk, vLerp(J.nk, J.hd, 0.55), 8), { t: 'c', p: J.hd, r: 10, c: 'b', lado: 'C' },
    ...['R', 'L'].flatMap(s => [
      L(J['s' + s], J['e' + s], 9.5, s), L(J['e' + s], J['w' + s], 7.5, s), { t: 'c', p: J['h' + s], r: 3.6, c: 'b', lado: s },
      L(J['q' + s], J['k' + s], 13, s), L(J['k' + s], J['a' + s], 9.5, s), L(J['a' + s], J['t' + s], 5.5, s),
    ]),
  ];
}

/* ---------- equipment ---------- */
const Q = { l: (a, b, w, c) => ({ t: 'l', a, b, w, c }), disco: (p, n, r, c = 'pl') => ({ t: 'd', p, n: vNorm(n), r, c }), caixa: (min, max, c = 'pd') => ({ t: 'x', min, max, c }) };
/* an oriented box: centre, three half-axis vectors */
const caixaO = (c, u, v, w, cor = 'pd') => ({ t: 'o', c, u, v, w, c2: cor });
function barra(c, lat = [0, 0, 1], meia = 62, r = 21) {
  const L = vNorm(lat);
  return [Q.l(vSub(c, vMul(L, meia)), vAdd(c, vMul(L, meia)), 3, 'eq'),
    Q.disco(vAdd(c, vMul(L, meia - 15)), L, r), Q.disco(vSub(c, vMul(L, meia - 15)), L, r),
    Q.disco(vAdd(c, vMul(L, meia - 12)), L, r * 0.7), Q.disco(vSub(c, vMul(L, meia - 12)), L, r * 0.7)];
}
function halter(p, eixo, r = 7.5) {
  const e = vNorm(eixo);
  return [Q.l(vSub(p, vMul(e, 8)), vAdd(p, vMul(e, 8)), 3, 'eq'), Q.disco(vAdd(p, vMul(e, 8)), e, r), Q.disco(vSub(p, vMul(e, 8)), e, r)];
}
const cabo = (de, ate) => [Q.l(de, ate, 1.4, 'cb'), { t: 'c', p: de, r: 3.2, c: 'eqf' }];
const banco = (x0, x1, topo, meia = 14) => [Q.caixa([x0, topo - 7, -meia], [x1, topo, meia]), Q.l([x0 + 7, 0, 0], [x0 + 7, topo - 7, 0], 4, 'eq'), Q.l([x1 - 7, 0, 0], [x1 - 7, topo - 7, 0], 4, 'eq')];
/* a pad lying along direction dir, from point a, length len, width 2*meia, on the side "lado" of a */
function prancha3(a, dir, len, normal, meia = 14, esp = 7, cor = 'pd') {
  const d = vNorm(dir), n = vNorm(normal);
  return caixaO(vAdd(a, vAdd(vMul(d, len / 2), vMul(n, -esp / 2))), vMul(d, len / 2), vMul(n, esp / 2), [0, 0, meia], cor);
}
const trilhos = (x, y0, y1, z = 66) => [Q.l([x, y0, z], [x, y1, z], 3, 'eqf'), Q.l([x, y0, -z], [x, y1, -z], 3, 'eqf')];

/* ---------- camera and drawing ---------- */
function camera(yaw, pitch) {
  const f = yaw * RAD, p = pitch * RAD;
  const r = [Math.cos(f), 0, -Math.sin(f)], c0 = [Math.sin(f), 0, Math.cos(f)];
  return { r, c: vAdd(vMul(c0, Math.cos(p)), [0, Math.sin(p), 0]), u: vSub([0, Math.cos(p), 0], vMul(c0, Math.sin(p))) };
}
const proj = (cam, p) => [vDot(p, cam.r), -vDot(p, cam.u), vDot(p, cam.c)];
function poligonoDisco(d) {
  const n = d.n, a = vNorm(Math.abs(n[1]) < 0.9 ? [n[2], 0, -n[0]] : [1, 0, 0]);
  const b = [n[1] * a[2] - n[2] * a[1], n[2] * a[0] - n[0] * a[2], n[0] * a[1] - n[1] * a[0]];
  return Array.from({ length: 18 }, (_, i) => { const t = (i / 18) * Math.PI * 2; return vAdd(d.p, vAdd(vMul(a, Math.cos(t) * d.r), vMul(b, Math.sin(t) * d.r))); });
}
function facesCaixa(x) {
  const [a, b] = [x.min, x.max], P = (i, j, k) => [i ? b[0] : a[0], j ? b[1] : a[1], k ? b[2] : a[2]];
  return [[P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1), [0, 1, 0]], [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1), [0, -1, 0]],
    [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1), [0, 0, 1]], [P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0), [0, 0, -1]],
    [P(1, 0, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1, 0), [1, 0, 0]], [P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0), [-1, 0, 0]]];
}
function facesCaixaO(x) {
  const S = (i, j, k) => vAdd(x.c, vAdd(vMul(x.u, i), vAdd(vMul(x.v, j), vMul(x.w, k))));
  const f = (a, b, c, d, n) => [a, b, c, d, vNorm(n)];
  return [f(S(-1, 1, -1), S(1, 1, -1), S(1, 1, 1), S(-1, 1, 1), x.v), f(S(-1, -1, -1), S(1, -1, -1), S(1, -1, 1), S(-1, -1, 1), vMul(x.v, -1)),
    f(S(-1, -1, 1), S(1, -1, 1), S(1, 1, 1), S(-1, 1, 1), x.w), f(S(-1, -1, -1), S(1, -1, -1), S(1, 1, -1), S(-1, 1, -1), vMul(x.w, -1)),
    f(S(1, -1, -1), S(1, -1, 1), S(1, 1, 1), S(1, 1, -1), x.u), f(S(-1, -1, -1), S(-1, -1, 1), S(-1, 1, 1), S(-1, 1, -1), vMul(x.u, -1))];
}
/* everything as flat shapes with a depth, ready to sort */
function achatar(prims, cam, J) {
  const out = [], perto = J && vDot(cam.c, J.lat) < 0 ? 'L' : 'R', pts = ps => ps.map(p => proj(cam, p));
  const media = ps => ps.reduce((s, p) => s + p[2], 0) / ps.length;
  const cor = q => (q.c === 'b' ? (q.lado === 'C' || q.lado === perto ? 'bn' : 'bf') : q.c);
  for (const q of prims) {
    if (q.t === 'l') { const a = proj(cam, q.a), b = proj(cam, q.b); out.push({ k: 'l', a, b, w: q.w, c: cor(q), z: (a[2] + b[2]) / 2 }); }
    else if (q.t === 'c') { const p = proj(cam, q.p); out.push({ k: 'c', p, r: q.r, c: cor(q), z: p[2] + (q.c === 'b' ? 0.5 : 0) }); }
    else if (q.t === 'd') { const ps = pts(poligonoDisco(q)); out.push({ k: 'p', ps, c: q.c, z: media(ps) }); }
    else if (q.t === 'x' || q.t === 'o') {
      for (const f of q.t === 'x' ? facesCaixa(q) : facesCaixaO(q)) {
        if (vDot(f[4], cam.c) <= 0.02) continue;
        const ps = pts(f.slice(0, 4));
        const cl = q.c2 || q.c;
        out.push({ k: 'p', ps, c: cl + (Math.abs(f[4][1]) > 0.7 ? '' : '2'), z: media(ps) - (cl === 'pd' ? 16 : 0.5) });
      }
    }
  }
  return out.sort((a, b) => a.z - b.z);
}
const n1 = v => Math.round(v * 10) / 10;
function svgFormas(formas) {
  return formas.map(f => f.k === 'l' ? `<line x1="${n1(f.a[0])}" y1="${n1(f.a[1])}" x2="${n1(f.b[0])}" y2="${n1(f.b[1])}" stroke-width="${f.w}" class="${f.c}"/>`
    : f.k === 'c' ? `<circle cx="${n1(f.p[0])}" cy="${n1(f.p[1])}" r="${f.r}" class="${f.c}"/>`
      : `<polygon points="${f.ps.map(p => n1(p[0]) + ',' + n1(p[1])).join(' ')}" class="${f.c}"/>`).join('');
}
function cena(fig, k) {
  const r = fig.pose(k);
  const J = corpo(r.corpo);
  const eq = r.eq ? r.eq(J) : [];
  const sombra = { t: 'd', p: [J.P[0], 0.2, 0], n: [0, 1, 0], r: 48, c: 'sh' };
  return { J, prims: [sombra, ...(r.atras ? r.atras(J) : []), ...eq, ...primsCorpo(J)] };
}
/* a fixed frame that fits every moment of the movement */
function enquadrar(fig, cam) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const k of [0, 0.25, 0.5, 0.75, 1]) {
    const { prims, J } = cena(fig, k);
    for (const f of achatar(prims, cam, J)) {
      const ps = f.k === 'l' ? [f.a, f.b] : f.k === 'c' ? [[f.p[0] - f.r, f.p[1] - f.r], [f.p[0] + f.r, f.p[1] + f.r]] : f.ps;
      for (const p of ps) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    }
  }
  const m = 12, w = x1 - x0 + 2 * m, h = y1 - y0 + 2 * m, W = Math.max(w, h * 1.15), H = Math.max(h, W / 1.6);
  return [n1(x0 - m - (W - w) / 2), n1(y0 - m - (H - h) / 2), n1(W), n1(H)];
}

/* ---------- poses ---------- */
const nkDe = (P, T) => vAdd(P, vMul(vNorm(T), C.T));
const ombroDe = (P, T) => vAdd(vSub(nkDe(P, T), vMul(vNorm(T), 4)), [0, 0, C.OMB]);
const emPe = (z = 13, x = 0, az = 14) => ({ a: [x, 3, z], polo: [1, 0.15, 0.25], pe: D(az, -6) });
const giro90 = v => [-v[1], v[0], 0]; /* rotate a direction in the side plane by +90° */
const meio = J => vLerp(J.hR, J.hL, 0.5);
/* home versions: hands on the hips, a loaded backpack, bands from under the feet */
const naCintura = P => ({ m: vAdd(P, [3, 4, 19]), polo: [-1, 0.2, 1] });
const mochila = (c, frente, cima) => caixaO(c, vMul(vNorm(frente), 6), vMul(vNorm(cima), 13), [0, 0, 12], 'pd');
const elasticos = J => ['R', 'L'].map(s => Q.l(vAdd(vLerp(J['a' + s], J['t' + s], 0.5), [0, -1.5, 0]), J['h' + s], 1.4, 'cb'));
const pegaZ = (J, z = 6) => [Q.l(vAdd(J.hR, [0, 0, z]), vSub(J.hR, [0, 0, z]), 4, 'eq'), Q.l(vAdd(J.hL, [0, 0, z]), vSub(J.hL, [0, 0, z]), 4, 'eq')];
const rolo = (p, meia = 16) => Q.l(vAdd(p, [0, 0, meia]), vSub(p, [0, 0, meia]), 8, 'pd');
const assento = (x0, x1, y, encosto) => [...banco(x0, x1, y), ...(encosto ? [prancha3(encosto.a, encosto.d, encosto.len || 70, encosto.n)] : [])];
const FIG = {
  supino: { cam: [32, 18], exc: true, pose(k, o) {
    const inc = o.inc || 0, chao = !!o.chao, T = D(180, inc), P = chao ? [24, 10, 0] : inc ? [16, 57, 0] : [24, 53, 0], nk = nkDe(P, T), sh = ombroDe(P, T), N = peitoDe(T);
    const hal = o.imp === 'halter', fech = !!o.fechada;
    const topo = [sh[0] + (inc ? 3 : 1), sh[1] + 50, 0], fundo = chao ? [sh[0] + 4, 31, 0] : vAdd(vSub(nk, vMul(T, fech ? 20 : 14)), vMul(N, hal ? 6 : 12));
    const c = vLerp(topo, fundo, k), z = chao ? nLerp(15, 40, k) : nLerp(hal ? 15 : fech ? 14 : 26, hal ? 30 : fech ? 14 : 26, k);
    return {
      corpo: { P, tr: T, hd: D(180, inc + 6), bR: { m: [c[0], c[1], z], polo: chao ? [0.1, -0.35, 1] : fech ? [0.45, -0.8, 0.3] : [0.2, -0.55, 0.8] }, pR: chao ? { a: [P[0] + 40, 3, 16], polo: [0.3, 1, 0.2] } : { a: [P[0] + 36, 3, 24], polo: [0.4, 1, 0.3], pe: D(10, -10) } },
      eq: J => [
        ...(chao ? [] : inc ? [...banco(P[0] - 8, P[0] + 28, P[1] - 9), prancha3(vSub(vSub(P, vMul(N, 10)), vMul(T, 6)), T, 78, N)] : banco(-62, 58, 46)),
        ...(hal ? [...halter(J.hR, [0, 0, 1]), ...halter(J.hL, [0, 0, 1])] : barra(meio(J))),
        ...(o.imp === 'smith' ? trilhos(c[0], 0, 172) : []),
      ],
    };
  } },
  supinoMaq: { cam: [42, 12], exc: false, pose(k) {
    const P = [0, 56, 0], T = D(180, 82), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 5, sh[1] - 5, 25], [sh[0] + 52, sh[1] - 3, 20], k), polo: [-0.2, -0.7, 0.6], mao: [0, 1, 0] }, pR: { a: [44, 3, 15], polo: [0.3, 1, 0.2] } },
      eq: J => [...assento(-16, 26, 47, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }), ...pegaZ(J).map(q => ({ ...q, a: vAdd(q.a, [0, -8, 0]), b: vAdd(q.b, [0, 8, 0]) })),
        Q.l(J.hR, [-6, sh[1] + 42, 34], 3, 'eqf'), Q.l(J.hL, [-6, sh[1] + 42, -34], 3, 'eqf')],
    };
  } },
  crucifixo: { cam: [62, 30], exc: true, pose(k) {
    const T = D(180, 0), P = [24, 53, 0], sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, hd: D(180, 6), bR: { m: vLerp([sh[0] + 2, sh[1] + 46, 9], [sh[0] + 3, sh[1] - 4, 66], k), polo: [0.15, -1, 0.25] }, pR: { a: [P[0] + 36, 3, 24], polo: [0.4, 1, 0.3], pe: D(10, -10) } },
      eq: J => [...banco(-62, 58, 46), ...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])],
    };
  } },
  crossover: { cam: [72, 10], exc: false, pose(k) {
    const P = [-2, 86, 0], T = D(0, 80), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] - 4, sh[1] + 2, 64], [sh[0] + 40, sh[1] - 22, 7], k), polo: [-0.3, -0.7, 0.6] }, pR: { a: [14, 3, 12], polo: [1, 0.1, 0.2] }, pL: { a: [-20, 3, -12], polo: [1, 0.1, -0.2], pe: D(-12, -8) } },
      eq: J => [Q.l([-26, 0, 86], [-26, 192, 86], 4, 'eqf'), Q.l([-26, 0, -86], [-26, 192, -86], 4, 'eqf'), ...cabo([-26, 176, 82], J.hR), ...cabo([-26, 176, -82], J.hL)],
    };
  } },
  voador: { cam: [80, 22], exc: false, pose(k) {
    const P = [0, 56, 0], T = D(180, 86), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] - 3, sh[1] - 2, 64], [sh[0] + 40, sh[1] - 2, 8], k), polo: [0, -1, 0.1] }, pR: { a: [40, 3, 15], polo: [0.3, 1, 0.2] } },
      eq: J => [...assento(-16, 26, 47, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }), ...pegaZ(J, 2).map(q => ({ ...q, a: vAdd(q.a, [0, -10, 0]), b: vAdd(q.b, [0, 10, 0]) })),
        Q.l(J.hR, [-10, sh[1] + 30, 30], 3, 'eqf'), Q.l(J.hL, [-10, sh[1] + 30, -30], 3, 'eqf')],
    };
  } },
  flexao: { cam: [24, 10], exc: true, pose(k, o) {
    const inc = !!o.inc, dec = !!o.dec, th = inc ? nLerp(38, 23, k) : dec ? nLerp(3, -11, k) : nLerp(19, 6, k), A = [-58, dec ? 50 : 13, 10];
    const q = vAdd(A, vMul(D(0, th), 85)), P = [q[0], q[1], 0], T = D(0, th), sh = ombroDe(P, T);
    const m = inc ? [57, 47, 25] : dec ? [73, 3, 25] : [sh[0] + 3, 3, o.diamante ? 6 : 25];
    return {
      corpo: { P, tr: T, hd: D(0, th + 10), bR: { m, polo: o.diamante ? [-0.8, 0.5, 0.25] : [-0.5, 0.6, 0.7], mao: [1, 0, 0.15] }, pR: { th: D(180, -th), sh: D(180, -th), pe: D(0, -70) } },
      ...(inc ? { eq: () => banco(42, 76, 44, 32) } : dec ? { eq: () => banco(-74, -36, 38, 22) } : {}),
    };
  } },
  mergulho: { cam: [28, 8], exc: true, pose(k) {
    const T = vSlerp(D(0, 86), D(0, 62), k), nk = vLerp([-3, 173, 0], [4, 141, 0], k);
    const barra2 = z => [Q.l([-34, 113, z], [34, 113, z], 4.5, 'eq'), Q.l([-28, 0, z], [-28, 113, z], 4, 'eqf'), Q.l([28, 0, z], [28, 113, z], 4, 'eqf')];
    return { corpo: { nk, tr: T, bR: { m: [0, 114, 24], polo: [-1, 0.3, 0.1], mao: [1, 0, 0] }, pR: { th: D(6, -72), sh: D(180, -42), pe: D(180, -25) } }, eq: () => [...barra2(25), ...barra2(-25)] };
  } },
  puxada: { cam: [52, 4], exc: false, pose(k, o) {
    const P = [0, 54, 0], T = vSlerp(D(180, 84), D(180, 74), k), nk = nkDe(P, T), sh = ombroDe(P, T);
    const z = o.neutra ? 7 : o.uni ? 22 : 40, m = vLerp([sh[0] + 4, 184, z], [nk[0] + 11, nk[1] - 4, z], k);
    return {
      corpo: { P, tr: T, bR: { m, polo: o.neutra ? [-0.5, -0.85, 0.15] : [-0.25, -0.7, 0.66], mao: [0, 1, 0] }, ...(o.uni ? { bL: { m: [P[0] + 26, 62, -12], polo: [0, -1, -0.2] } } : {}), pR: { a: [38, 3, 15], polo: [0.3, 1, 0.3] } },
      eq: J => {
        const c = o.uni ? J.hR : meio(J);
        const pega = o.uni ? pegaZ(J).slice(0, 1) : o.neutra ? [Q.l(J.hR, vAdd(c, [0, 10, 0]), 3, 'eq'), Q.l(J.hL, vAdd(c, [0, 10, 0]), 3, 'eq')] : [Q.l(vAdd(c, [0, 0, -58]), vAdd(c, [0, 0, 58]), 3.2, 'eq')];
        return [...banco(-14, 24, 46), rolo([30, 74, 0], 20), ...pega, ...cabo([c[0], 214, c[2]], vAdd(c, [0, o.neutra ? 10 : 0, 0]))];
      },
    };
  } },
  barraFixa: { cam: [38, 2], exc: false, pose(k, o) {
    const nk = vLerp([0, 157, 0], [-1, 196, 0], k), T = vSlerp(D(180, 89), D(180, 78), k);
    return {
      corpo: { nk, tr: T, hd: vSlerp(D(0, 90), D(0, 84), k), bR: { m: [5, 205, 33], polo: [0, -0.6, 0.8], mao: [0, 1, 0] }, pR: o.grav ? { th: D(8, -88), sh: D(180, -4), pe: D(180, -20) } : { th: D(8, -84), sh: D(180, -68), pe: D(0, -60) } },
      eq: J => [Q.l([5, 207, -64], [5, 207, 64], 3.5, 'eq'), Q.l([5, 207, 64], [5, 0, 64], 4, 'eqf'), Q.l([5, 207, -64], [5, 0, -64], 4, 'eqf'),
        ...(o.grav ? [prancha3(vAdd(J.kR, [-26, -5, -9]), [1, 0, 0], 32, [0, 1, 0], 20, 6), Q.l(vAdd(J.kR, [-10, -10, -9]), [-30, 0, 0], 4, 'eqf')] : [])],
    };
  } },
  remadaCurvada: { cam: [26, 8], exc: false, pose(k, o) {
    const P = [-22, 80, 0], T = D(0, 35), sh = ombroDe(P, T), N = peitoDe(T), z = o.tbar || o.mochila ? 7 : o.halter ? 19 : 23;
    const cima = vAdd(vAdd(P, vMul(T, 30)), vMul(N, 13)), m = vLerp([sh[0] + 1, sh[1] - 52, z], [cima[0], cima[1], z], k);
    return {
      corpo: { P, tr: T, hd: D(0, 22), bR: { m, polo: [-0.6, 0.75, 0.25] }, pR: emPe(15) },
      eq: J => {
        const c = meio(J);
        if (o.halter) return [...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])];
        if (o.mochila) return [mochila(vAdd(c, [0, -15, 0]), [1, 0, 0], [0, 1, 0])];
        if (!o.tbar) return barra(c);
        const ponta = vAdd(c, [9, 0, 0]), dir = vSub(ponta, [-100, 3, 0]);
        return [Q.l([-100, 3, 0], ponta, 3.5, 'eq'), Q.disco(vAdd(c, [4, 0, 0]), dir, 20), Q.l(J.hR, J.hL, 3, 'eq')];
      },
    };
  } },
  serrote: { cam: [38, 16], exc: false, pose(k) {
    const P = [-6, 84, 0], T = D(0, 9), nk = nkDe(P, T), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, hd: D(0, -8), bR: { m: vLerp([sh[0] - 1, 36, 21], [P[0] + 10, 77, 19], k), polo: [-0.5, 1, 0.2], mao: [0, -1, 0] }, bL: { m: [nk[0] + 1, 45, -20], polo: [-1, 0, 0], mao: [1, 0, 0] },
        pR: { a: [-22, 3, 25], polo: [1, 0.1, 0.3] }, pL: { a: [-46, 46, -18], polo: [0.6, -1, 0], pe: D(180, -10) } },
      eq: J => [Q.caixa([-58, 35, -34], [52, 42, -4]), Q.l([-50, 0, -19], [-50, 35, -19], 4, 'eq'), Q.l([44, 0, -19], [44, 35, -19], 4, 'eq'), ...halter(J.hR, [1, 0, 0])],
    };
  } },
  remadaApoiada: { cam: [28, 10], exc: false, pose(k) {
    const T = D(0, 36), P = [-26, 72, 0], sh = ombroDe(P, T), N = peitoDe(T), alvo = vAdd(vAdd(P, vMul(T, 26)), vMul(N, 12));
    return {
      corpo: { P, tr: T, hd: D(0, 22), bR: { m: vLerp([sh[0] + 1, sh[1] - 53, 22], [alvo[0], alvo[1], 22], k), polo: [-0.6, 0.8, 0.2] }, pR: { a: [-62, 3, 14], polo: [1, 0, 0.2] } },
      eq: J => [prancha3(vAdd(vAdd(P, vMul(N, 11)), vMul(T, -6)), T, 76, vMul(N, -1)), Q.l([-12, 0, 0], vAdd(P, vMul(N, 16)), 4, 'eqf'), ...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])],
    };
  } },
  remadaBaixa: { cam: [22, 10], exc: false, pose(k, o) {
    const P = [0, 44, 0];
    if (o.maq) {
      const T = D(180, 88), sh = ombroDe(P, T);
      return { corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 47, sh[1] - 14, 18], [sh[0] + 6, sh[1] - 18, 21], k), polo: [-0.7, -0.6, 0.2], mao: [0, 1, 0] }, pR: { a: [40, 3, 15], polo: [0.3, 1, 0.2] } },
        eq: J => [...banco(-18, 22, 36), prancha3([16, 70, 0], [0, 1, 0], 34, [-1, 0, 0], 13), ...pegaZ(J, 2).map(q => ({ ...q, a: vAdd(q.a, [0, -8, 0]), b: vAdd(q.b, [0, 8, 0]) })), Q.l(J.hR, [60, 120, 20], 3, 'eqf'), Q.l(J.hL, [60, 120, -20], 3, 'eqf')] };
    }
    const T = vSlerp(D(0, 72), D(180, 86), k), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 50, 64, 7], [P[0] + 15, 68, 7], k), polo: [-0.7, -0.6, 0.15], mao: [0, 1, 0] }, pR: { a: [56, 20, 13], polo: [0.3, 1, 0.1], pe: D(0, 60) } },
      eq: J => { const c = meio(J); return [...banco(-30, 30, 36), caixaO([66, 20, 0], [2, 0, 0], [0, 14, 0], [0, 0, 22], 'eqf'), Q.l(J.hR, vAdd(c, [8, 0, 0]), 3, 'eq'), Q.l(J.hL, vAdd(c, [8, 0, 0]), 3, 'eq'), ...cabo([104, 22, 0], vAdd(c, [8, 0, 0]))]; },
    };
  } },
  pulldownBracos: { cam: [18, 6], exc: false, pose(k) {
    const P = [-12, 82, 0], T = D(0, 64), a = vSlerp(D(0, 38), D(0, -68), k);
    return {
      corpo: { P, tr: T, bR: { ua: a, fa: vSlerp(a, D(0, -90), 0.08) }, pR: emPe(13) },
      eq: J => { const c = meio(J); return [Q.l(vAdd(c, [0, 0, -22]), vAdd(c, [0, 0, 22]), 3, 'eq'), ...cabo([98, 188, 0], c)]; },
    };
  } },
  desenv: { cam: [56, 8], exc: false, pose(k, o) {
    const sentado = o.imp !== 'barra', P = sentado ? [0, 56, 0] : [0, 87, 0], T = sentado ? D(180, 84) : D(0, 89), sh = ombroDe(P, T), hal = o.imp === 'halter';
    const m = vLerp([sh[0] + (hal ? 2 : 9), sh[1] + (hal ? 7 : 2), hal ? 30 : 24], [sh[0] - 1, sh[1] + 53, hal ? 13 : 24], k);
    return {
      corpo: { P, tr: T, bR: { m, polo: vSlerp(hal ? [0, -1, 0.6] : [0.8, -0.6, 0.2], [0, -0.3, 1], k), mao: [0, 1, 0] }, pR: sentado ? { a: [42, 3, 17], polo: [0.3, 1, 0.2] } : emPe(15) },
      eq: J => [
        ...(sentado ? assento(-16, 26, 47, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }) : []),
        ...(hal ? [...halter(J.hR, [0, 0, 1]), ...halter(J.hL, [0, 0, 1])] : o.imp === 'maquina' ? pegaZ(J) : barra(meio(J))),
        ...(o.imp === 'smith' ? trilhos(meio(J)[0], 0, 192) : []),
      ],
    };
  } },
  elevLateral: { cam: o => (o.cabo ? [70, 10] : [84, 6]), exc: false, pose(k, o) {
    const sentado = !!o.maq, P = sentado ? [0, 56, 0] : [0, 87, 0], T = sentado ? D(180, 86) : D(0, 87);
    const ua = vSlerp(D(68, -80), D(64, -3), k), fa = o.maq ? vSlerp(D(20, -10), D(10, 2), k) : vSlerp(D(55, -74), D(58, 8), k);
    const bR = { ua, fa };
    return {
      corpo: { P, tr: T, bR, ...(o.cabo ? { bL: { m: vAdd(P, [8, 6, -20]), polo: [-0.5, -0.5, -1] } } : {}), pR: sentado ? { a: [40, 3, 17], polo: [0.3, 1, 0.2] } : emPe(14) },
      eq: J => [
        ...(sentado ? [...assento(-16, 26, 47, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }), rolo(vLerp(J.eR, J.sR, 0.35), 5), rolo(vLerp(J.eL, J.sL, 0.35), 5)] : []),
        ...(o.cabo ? cabo([8, 14, -46], J.hR) : o.maq ? [] : o.elastico ? elasticos(J) : [...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])]),
      ],
    };
  } },
  crucInverso: { cam: o => (o.maq ? [74, 42] : [52, 18]), exc: false, pose(k, o) {
    if (o.maq) {
      const P = [0, 56, 0], T = D(0, 88), sh = ombroDe(P, T);
      return { corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 44, sh[1] - 2, 8], [sh[0] - 2, sh[1] - 2, 62], k), polo: [0, -1, 0] }, pR: { a: [36, 3, 15], polo: [0.3, 1, 0.2] } },
        eq: J => [...banco(-20, 20, 47), prancha3([12, 64, 0], [0, 1, 0], 40, [-1, 0, 0], 14), ...pegaZ(J, 2).map(q => ({ ...q, a: vAdd(q.a, [0, -9, 0]), b: vAdd(q.b, [0, 9, 0]) }))] };
    }
    const P = [-16, 80, 0], T = D(0, 14), sh = ombroDe(P, T);
    return { corpo: { P, tr: T, hd: D(0, 0), bR: { m: vLerp([sh[0] + 1, sh[1] - 50, 13], [sh[0] - 1, sh[1] - 6, 62], k), polo: [0, 0.3, -1] }, pR: emPe(15) }, eq: J => [...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])] };
  } },
  facePull: { cam: [60, 14], exc: false, pose(k, o) {
    const P = [0, 87, 0], T = D(180, 86), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 50, sh[1] + 5, 8], [sh[0] + 7, sh[1] + 15, 24], k), polo: vSlerp([0, -0.4, 1], [0, 0.6, 1], k) }, pR: emPe(15) },
      eq: J => {
        const ancora = [106, sh[1] + 8, 0];
        if (o.elastico) return [Q.l(ancora, J.hR, 1.4, 'cb'), Q.l(ancora, J.hL, 1.4, 'cb'), { t: 'c', p: ancora, r: 3.2, c: 'eqf' }];
        const e = vAdd(meio(J), [12, 0, 0]); return [Q.l(e, J.hR, 2.6, 'eq'), Q.l(e, J.hL, 2.6, 'eq'), ...cabo(ancora, e)];
      },
    };
  } },
  rosca: { cam: o => [o.barra || o.cabo ? 36 : 18, 6], exc: false, pose(k, o) {
    const P = [0, 87, 0], T = D(0, 89), ua = vSlerp(D(0, -88), D(0, -76), k), fa = vSlerp(D(0, -84), D(0, 66), k);
    const parado = { ua: D(-4, -88), fa: D(-2, -86) };
    return {
      corpo: { P, tr: T, bR: { ua, fa }, ...(o.alt || o.martelo ? { bL: o.alt ? parado : { ua: vMir(ua), fa: vMir(fa) } } : {}), pR: emPe(13) },
      eq: J => {
        if (o.mochila) return [mochila(vAdd(meio(J), [3, -3, 0]), [1, 0, 0], [0, 1, 0])];
        if (o.elastico) return elasticos(J);
        if (o.barra || o.cabo) { const c = meio(J); return [...barra(c, [0, 0, 1], 44, 12), ...(o.cabo ? cabo([62, 12, 0], c) : [])]; }
        const eixo = J2 => (o.martelo ? giro90(vNorm(vSub(J2.w, J2.e))) : [0, 0, 1]);
        return [...halter(J.hR, eixo({ w: J.wR, e: J.eR })), ...halter(J.hL, eixo({ w: J.wL, e: J.eL }))];
      },
    };
  } },
  roscaInclinada: { cam: [16, 8], exc: false, pose(k) {
    const P = [8, 58, 0], T = D(180, 56), N = peitoDe(T);
    return {
      corpo: { P, tr: T, bR: { ua: D(0, -90), fa: vSlerp(D(0, -88), D(0, 50), k) }, pR: { a: [52, 3, 16], polo: [0.3, 1, 0.2] } },
      eq: J => [...banco(-6, 34, 48), prancha3(vSub(vSub(P, vMul(N, 10)), vMul(T, 6)), T, 74, N), ...halter(J.hR, [0, 0, 1]), ...halter(J.hL, [0, 0, 1])],
    };
  } },
  roscaScott: { cam: [16, 8], exc: false, pose(k) {
    const P = [-12, 56, 0], T = D(0, 80);
    return {
      corpo: { P, tr: T, bR: { ua: D(0, -42), fa: vSlerp(D(0, -34), D(0, 78), k) }, pR: { a: [26, 3, 16], polo: [0.3, 1, 0.2] } },
      eq: J => {
        const c = meio(J), pad = vLerp(J.sR, J.eR, 0.55);
        return [...banco(-30, 4, 46), caixaO([pad[0] - 3, pad[1] - 7, 0], vMul(D(0, -42), 18), vMul(D(0, 48), 3), [0, 0, 24]), Q.l([pad[0] - 2, pad[1] - 10, 0], [pad[0] + 2, 0, 0], 4, 'eqf'), ...barra(c, [0, 0, 1], 42, 13)];
      },
    };
  } },
  roscaBayesian: { cam: [22, 8], exc: false, pose(k) {
    const P = [0, 87, 0], T = D(0, 86);
    return {
      corpo: { P, tr: T, bR: { ua: D(180, -66), fa: vSlerp(D(180, -70), D(16, 72), k) }, bL: { m: vAdd(P, [10, 8, -18]), polo: [-0.5, 0, -1] }, pR: { a: [-16, 3, 12], polo: [1, 0.1, 0.2] }, pL: { a: [20, 3, -12], polo: [1, 0.1, -0.2], pe: D(-12, -6) } },
      eq: J => [...pegaZ(J).slice(0, 1), ...cabo([-82, 24, 18], J.hR)],
    };
  } },
  tricepsPolia: { cam: [16, 6], exc: false, pose(k, o) {
    const P = [-4, 86, 0], T = D(0, 82);
    return {
      corpo: { P, tr: T, bR: { ua: D(0, -82), fa: vSlerp(D(0, 32), D(0, -86), k) }, pR: emPe(14) },
      eq: J => {
        const c = meio(J), e = vAdd(c, [0, 12, 0]);
        return [...(o.corda ? [Q.l(e, J.hR, 2.6, 'eq'), Q.l(e, J.hL, 2.6, 'eq')] : [Q.l(vAdd(c, [0, 0, -16]), vAdd(c, [0, 0, 16]), 3.4, 'eq')]), ...cabo([30, 198, 0], o.corda ? e : c)];
      },
    };
  } },
  tricepsOverhead: { cam: [16, 6], exc: false, pose(k) {
    const P = [-2, 85, 0], T = D(0, 68);
    return {
      corpo: { P, tr: T, hd: D(0, 80), bR: { ua: D(0, 58), fa: vSlerp(D(180, 30), D(0, 56), k) }, pR: { a: [22, 3, 12], polo: [1, 0.1, 0.2] }, pL: { a: [-24, 3, -12], polo: [1, 0.1, -0.2], pe: D(-12, -6) } },
      eq: J => { const e = vSub(meio(J), [8, 0, 0]); return [Q.l(e, J.hR, 2.6, 'eq'), Q.l(e, J.hL, 2.6, 'eq'), ...cabo([-66, 112, 0], e)]; },
    };
  } },
  tricepsFrances: { cam: [30, 6], exc: false, pose(k) {
    const P = [0, 87, 0], T = D(0, 89), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] - 13, sh[1] + 12, 3], [sh[0] + 1, sh[1] + 54, 3], k), polo: [0.35, 0.25, 1] }, pR: emPe(13) },
      eq: J => { const c = meio(J), eixo = vNorm(vSub(J.hR, J.wR)); return halter(vAdd(c, vMul(eixo, 4)), giro90(eixo), 9); },
    };
  } },
  tricepsTesta: { cam: [28, 16], exc: true, pose(k) {
    const P = [24, 53, 0], T = D(180, 0);
    return {
      corpo: { P, tr: T, hd: D(180, 6), bR: { ua: D(180, 76), fa: vSlerp(D(180, 78), D(180, -22), k) }, pR: { a: [P[0] + 36, 3, 24], polo: [0.4, 1, 0.3], pe: D(10, -10) } },
      eq: J => [...banco(-62, 58, 46), ...barra(meio(J), [0, 0, 1], 42, 14)],
    };
  } },
  agachamento: { cam: o => [o.sumo ? 40 : 28, 8], exc: true, pose(k, o) {
    const fim = o.sumo ? [-8, 49, 0] : o.goblet ? [-16, 42, 0] : o.smith ? [-12, 47, 0] : [-23, 46, 0];
    const P = vLerp([0, 87, 0], fim, k), T = vSlerp(D(0, 88), D(0, o.sumo ? 74 : o.goblet ? 64 : o.smith ? 66 : 48), k);
    const nk = nkDe(P, T), sh = ombroDe(P, T), N = peitoDe(T), z = o.sumo ? 32 : 19, az = o.sumo ? 40 : 24;
    let bR, eq;
    if (o.goblet) {
      const c = vAdd(vSub(nk, vMul(T, 12)), vMul(N, 15));
      bR = { m: vAdd(c, [0, -3, 6]), polo: [0, -1, 0.5] };
      eq = o.livre ? () => [] : o.mochila ? () => [mochila(c, N, T)] : () => halter(c, [0, 1, 0], 9);
    } else if (o.sumo) {
      bR = { m: [sh[0] + 3, sh[1] - 50, 5], polo: [0, 0, 1] }; eq = J => halter(vAdd(meio(J), [0, -8, 0]), [0, 1, 0], 9);
    } else {
      const c = vAdd(vSub(nk, vMul(T, 5)), vMul(N, -8));
      bR = { m: [c[0], c[1], 40], polo: [-0.4, -0.8, 0.4], mao: [0, 1, 0] };
      eq = () => [...barra(c), ...(o.smith ? trilhos(c[0], 0, 190) : [])];
    }
    return { corpo: { P, tr: T, hd: D(0, vLerp([88], [70], k)[0]), bR, pR: { a: [o.smith ? 14 : 0, 3, z], polo: D(az, 10), pe: D(az, -6) } }, eq };
  } },
  hack: { cam: [22, 8], exc: true, pose(k) {
    const T = D(180, 72), N = peitoDe(T), P = vLerp([0, 90, 0], [-26, 50, 0], k), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vAdd(sh, [8, -2, 6]), polo: [0, -1, 0.3] }, pR: { a: [24, 9, 17], polo: D(20, 10), pe: D(18, 12) } },
      eq: J => [prancha3(vSub(vSub(P, vMul(N, 11)), vMul(T, 10)), T, 76, N), rolo(vAdd(J.sR, [0, 7, 0]), 6), rolo(vAdd(J.sL, [0, 7, 0]), 6), caixaO([30, 6, 0], vMul(D(18, 12), 14), vMul(D(198, 102), 2), [0, 0, 28], 'eqf'), Q.l([-70, 0, 30], [10, 120, 30], 3, 'eqf'), Q.l([-70, 0, -30], [10, 120, -30], 3, 'eqf')],
    };
  } },
  legPress: { cam: [16, 8], exc: true, pose(k, o) {
    const hor = !!o.hor, P = hor ? [0, 52, 0] : [0, 42, 0], T = hor ? D(180, 76) : D(180, 38), N = peitoDe(T);
    const dir = hor ? D(0, 4) : D(0, 45), sobe = hor ? D(0, 94) : D(180, 45), plat = vAdd(P, vMul(dir, nLerp(84, 44, k)));
    const ancora = vSub(vAdd(plat, vMul(sobe, 4)), vMul(dir, 4));
    return {
      corpo: { P, tr: T, bR: { m: [P[0] + 6, P[1] - 2, 27], polo: [0, -1, 0.3] }, pR: { a: [ancora[0], ancora[1], 16], polo: [0.2, 1, 0.45], pe: sobe } },
      eq: () => [prancha3(vSub(vSub(P, vMul(N, 11)), vMul(T, 8)), T, 72, N), caixaO(vAdd(P, [0, -12, 0]), [16, 0, 0], [0, 3, 0], [0, 0, 18]),
        caixaO(vAdd(plat, vMul(sobe, 6)), vMul(dir, 2), vMul(sobe, 22), [0, 0, 28], 'eqf'), Q.l(vAdd(P, vAdd(vMul(dir, 30), [0, -20, 28])), vAdd(P, vAdd(vMul(dir, 120), [0, -20, 28])), 3, 'eqf'), Q.l(vAdd(P, vAdd(vMul(dir, 30), [0, -20, -28])), vAdd(P, vAdd(vMul(dir, 120), [0, -20, -28])), 3, 'eqf')],
    };
  } },
  bulgaro: { cam: [16, 8], exc: true, pose(k, o) {
    const P = vLerp([0, 87, 0], [-4, 50, 0], k), T = vSlerp(D(0, 86), D(0, 76), k);
    return {
      corpo: { P, tr: T, bR: o.livre ? naCintura(P) : { ua: D(0, -90), fa: D(0, -90) }, pR: { a: [30, 3, 10], polo: [1, 0.2, 0.15] }, pL: { a: [-54, 47, -10], polo: [0.2, -1, 0], pe: D(180, 12) } },
      eq: J => [Q.caixa([-76, 36, -26], [-36, 43, 6]), Q.l([-56, 0, -10], [-56, 36, -10], 4, 'eq'), ...(o.livre ? [] : [...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])])],
    };
  } },
  afundo: { cam: [16, 8], exc: true, pose(k, o) {
    const P = vLerp([-2, 86, 0], [-4, 48, 0], k);
    return {
      corpo: { P, tr: D(0, 89), bR: o.livre ? naCintura(P) : { ua: D(0, -90), fa: D(0, -90) }, pR: { a: [32, 3, 11], polo: [1, 0.2, 0.15] }, pL: { a: [-40, 8, -11], polo: [0.3, -1, 0], pe: D(0, -48) } },
      eq: J => (o.livre ? [] : [...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])]),
    };
  } },
  stepUp: { cam: [18, 8], exc: false, pose(k) {
    const P = vLerp([4, 88, 0], [30, 128, 0], k);
    return {
      corpo: { P, tr: vSlerp(D(0, 82), D(0, 89), k), bR: { ua: D(0, -90), fa: D(0, -90) }, pR: { a: [32, 47, 10], polo: [1, 0.2, 0.2] }, pL: { a: vLerp([-14, 3, -11], [26, 62, -11], k), polo: [1, 0.1, -0.1] } },
      eq: J => [Q.caixa([12, 0, -26], [56, 44, 26]), ...halter(J.hR, [1, 0, 0]), ...halter(J.hL, [1, 0, 0])],
    };
  } },
  extensora: { cam: [14, 4], exc: false, pose(k) {
    const P = [0, 52, 0], T = D(180, 80), sh = vSlerp(D(180, -82), D(0, 6), k);
    return {
      corpo: { P, tr: T, bR: { m: [P[0] + 4, P[1] - 4, 26], polo: [0, -1, 0.3] }, pR: { th: D(0, 3), sh, pe: giro90(sh) } },
      eq: J => [...assento(-20, 40, 46, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }), rolo(vAdd(J.aR, vMul(giro90(sh), 5)), 18)],
    };
  } },
  flexora: { cam: o => (o.deitado ? [22, 20] : [14, 4]), exc: false, pose(k, o) {
    if (o.deitado) {
      const P = [-14, 53, 0], T = D(0, 2), nk = nkDe(P, T), sh = vSlerp(D(180, 0), D(0, 82), k), pe = vMul(giro90(sh), -1);
      return { corpo: { P, tr: T, hd: D(0, 10), bR: { m: [nk[0] + 10, 38, 22], polo: [-0.5, 0.2, 0.8] }, pR: { th: D(180, -2), sh, pe } },
        eq: J => [...banco(-60, 46, 44), rolo(vSub(J.aR, vMul(pe, 6)), 16)] };
    }
    const P = [0, 52, 0], T = D(180, 80), sh = vSlerp(D(0, -4), D(180, -58), k), pe = giro90(sh);
    return {
      corpo: { P, tr: T, bR: { m: [P[0] + 4, P[1] - 4, 26], polo: [0, -1, 0.3] }, pR: { th: D(0, 2), sh, pe } },
      eq: J => [...assento(-20, 40, 46, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }), rolo(vAdd(J.kR, [-4, 10, -9]), 18), rolo(vSub(J.aR, vMul(pe, 6)), 18)],
    };
  } },
  stiff: { cam: [22, 6], exc: true, pose(k, o) {
    const th = nLerp(88, o.uni ? 12 : 22, k), h = nLerp(78, o.uni ? 46 : 38, k), shY = h + 55;
    const P = [6 - 46 * Math.cos(th * RAD), shY - 46 * Math.sin(th * RAD), 0], T = D(0, th);
    const pernaTras = D(180, -th);
    return {
      corpo: { P, tr: T, hd: D(0, Math.max(th - 20, 0)), bR: { ua: D(0, -90), fa: D(0, -90) },
        pR: o.uni ? { a: [0, 3, 9], polo: [1, 0.1, 0.1] } : emPe(13, 0, 8), ...(o.uni ? { pL: { th: pernaTras, sh: pernaTras, pe: vSlerp(D(0, -60), D(180, -30), k) } } : {}) },
      eq: J => (o.livre ? [] : o.uni ? halter(J.hL, [1, 0, 0]) : o.imp === 'halter' ? [...halter(J.hR, [0, 0, 1]), ...halter(J.hL, [0, 0, 1])] : [...barra(meio(J)), ...(o.imp === 'smith' ? trilhos(meio(J)[0], 0, 172) : [])]),
    };
  } },
  terra: { cam: [24, 6], exc: false, pose(k) {
    const th = nLerp(41, 90, k), h = nLerp(22, 78, k), shY = h + 55;
    const P = [7 - 46 * Math.cos(th * RAD), shY - 46 * Math.sin(th * RAD), 0];
    return { corpo: { P, tr: D(0, th), hd: D(0, Math.max(th - 15, 10)), bR: { ua: D(0, -90), fa: D(0, -90) }, pR: emPe(13, 0, 8) }, eq: J => barra(meio(J)) };
  } },
  hiper: { cam: [16, 5], exc: true, pose(k) {
    const perna = D(180, -42), A = [-62, 16, 9], q = vSub(A, vMul(perna, 85)), P = [q[0], q[1], 0], T = vSlerp(D(0, 42), D(0, -50), k), N = peitoDe(T), nk = nkDe(P, T);
    const Nf = peitoDe(D(0, 42)), cruz = vAdd(vSub(nk, vMul(T, 14)), vMul(N, 9));
    return {
      corpo: { P, tr: T, hd: vSlerp(D(0, 42), D(0, -40), k), bR: { m: [cruz[0], cruz[1], 5], polo: [0, -1, 0.5] }, pR: { th: perna, sh: perna, pe: D(0, -48) } },
      eq: () => [caixaO(vAdd(vAdd(P, vMul(perna, 12)), vMul(Nf, 13)), vMul(perna, 10), vMul(Nf, 3), [0, 0, 16]), rolo(vSub(A, vMul(Nf, 7)), 16), Q.l(vAdd(vAdd(P, vMul(perna, 12)), vMul(Nf, 16)), [-30, 0, 0], 4, 'eqf'), Q.l(vSub(A, vMul(Nf, 7)), [-62, 0, 0], 4, 'eqf')],
    };
  } },
  hipThrust: { cam: [26, 14], exc: false, pose(k, o) {
    const ponte = !!o.ponte, nk = ponte ? [-36, 10, 0] : [-34, 49, 0];
    const T = vSlerp(ponte ? D(180, 2) : D(180, 40), ponte ? D(180, -28) : D(180, -3), k), P = vSub(nk, vMul(T, C.T)), N = peitoDe(T);
    const barC = vSub(vAdd(P, vMul(N, 14)), vMul(T, 3));
    return {
      corpo: { P, tr: T, hd: vSlerp(T, D(0, 60), 0.5), bR: ponte ? { m: [P[0] - 12, 2, 26], polo: [0, 1, 0.3], mao: [1, 0, 0] } : { m: [barC[0], barC[1], 30], polo: [0, -1, 0.4], mao: [0, 1, 0] }, pR: { a: [ponte ? 40 : 52, 3, 15], polo: [0, 1, 0.25] },
        ...(o.uni ? { pL: (d => ({ th: d, sh: d, pe: giro90(d) }))(vSlerp(D(0, 50), D(0, 24), k)) } : {}) },
      eq: () => (ponte ? [] : [...banco(-66, -26, 44), ...(o.maq ? [rolo(barC, 26)] : [...barra(barC, [0, 0, 1], 62, 22), rolo(barC, 12)]), ...(o.smith ? trilhos(barC[0], 0, 120) : [])]),
    };
  } },
  coice: { cam: o => (o.quad ? [26, 16] : [18, 6]), exc: false, pose(k, o) {
    if (o.quad) {
      const P = [0, 50, 0], T = D(0, 1), sh = ombroDe(P, T);
      const pR = { th: vSlerp(D(0, -88), D(180, 4), k), sh: vSlerp(D(180, -3), D(0, 86), k) };
      pR.pe = vMul(giro90(pR.sh), -1);
      return { corpo: { P, tr: T, hd: D(0, 8), bR: { m: [sh[0] + 2, 2, 17], polo: [-1, 0, 0], mao: [1, 0, 0] }, pR, pL: { th: D(0, -90), sh: D(180, -2), pe: D(180, -10) } },
        eq: J => [caixaO(J.aR, [3, 0, 0], [0, 3, 0], [0, 0, 6], 'eqf')] };
    }
    const P = [-4, 86, 0], T = D(0, 76);
    return {
      corpo: { P, tr: T, bR: { m: [44, 118, 18], polo: [-0.3, -1, 0.3] }, pR: { th: vSlerp(D(8, -92), D(180, -38), k), sh: vSlerp(D(180, -86), D(180, -58), k), pe: D(0, -30) }, pL: { a: [2, 3, -10], polo: [1, 0.1, -0.1] } },
      eq: J => [Q.l([50, 0, 22], [50, 190, 22], 4, 'eqf'), Q.l([50, 0, -22], [50, 190, -22], 4, 'eqf'), Q.l([50, 118, -22], [50, 118, 22], 4, 'eq'), ...(o.maq ? [rolo(vAdd(J.aR, [-6, 6, 0]), 9)] : cabo([56, 8, 10], J.aR))],
    };
  } },
  abdutora: { cam: [84, 22], exc: false, pose(k, o) {
    const P = [0, 52, 0], T = D(180, 84), az = nLerp(o.adu ? 40 : 8, o.adu ? 8 : 40, k);
    return {
      corpo: { P, tr: T, bR: { m: [P[0] + 4, P[1] - 2, 27], polo: [0, -1, 0.3] }, pR: { th: D(az, -2), sh: D(az * 0.3, -86), pe: D(az * 0.5, -6) } },
      eq: J => [...assento(-18, 26, 46, { a: [P[0] - 11, P[1] - 4, 0], d: T, n: [1, 0.1, 0] }),
        ...(o.band ? [Q.l(J.kR, J.kL, 3, 'bd')] : [caixaO(vAdd(J.kR, vMul(D(az + (o.adu ? -90 : 90), 0), 7)), [0, 8, 0], [5, 0, 0], vMul(D(az + 90, 0), 2)), caixaO(vAdd(J.kL, vMul(D(-az - (o.adu ? -90 : 90), 0), 7)), [0, 8, 0], [5, 0, 0], vMul(D(-az - 90, 0), 2))])],
    };
  } },
  panturrilha: { cam: [22, 6], exc: false, pose(k, o) {
    const pe = vSlerp(D(0, 30), D(0, -48), k);
    if (o.sent) {
      const toe = [12, 10, 11], an = vSub(toe, vMul(pe, C.PE)), P = [-38, 52, 0];
      return { corpo: { P, tr: D(180, 88), bR: { m: [P[0] + 30, 62, 20], polo: [0, -1, 0.3] }, pR: { a: an, polo: [0.2, 1, 0], pe } },
        eq: J => [...banco(-58, -18, 45), Q.caixa([4, 0, -22], [24, 8, 22], 'eqf'), rolo(vAdd(J.kR, [-2, 8, -11]), 20)] };
    }
    if (o.leg) {
      const P = [0, 42, 0], T = D(180, 38), N = peitoDe(T), perna = D(0, 45), an = vAdd(P, vMul(perna, 84)), pe2 = vSlerp(D(180, 45), D(0, 92), k), toe = vAdd(an, vMul(pe2, C.PE));
      const plat = vAdd(P, vMul(perna, vDot(vSub(toe, P), perna) + 2));
      return { corpo: { P, tr: T, bR: { m: [P[0] + 6, P[1] - 2, 27], polo: [0, -1, 0.3] }, pR: { th: perna, sh: perna, pe: pe2 } },
        eq: () => [prancha3(vSub(vSub(P, vMul(N, 11)), vMul(T, 8)), T, 72, N), caixaO(vAdd(plat, vMul(D(180, 45), 4)), vMul(perna, 2), vMul(D(180, 45), 22), [0, 0, 28], 'eqf')] };
    }
    const toe = [13, 19, 11], an = vSub(toe, vMul(pe, C.PE)), P = [an[0] - 1, an[1] + 84.5, 0], T = D(0, 89);
    return {
      corpo: { P, tr: T, bR: o.uni ? { m: [34, 112, 22], polo: [0, -1, 0.3] } : { m: vAdd(ombroDe(P, T), [6, 2, 4]), polo: [0, -1, 0.3] },
        pR: { th: D(0, -90), sh: D(0, -90), pe }, ...(o.uni ? { pL: { th: D(0, -96), sh: D(180, -40), pe: D(180, -20) }, bL: { ua: D(0, -90), fa: D(0, -90) } } : {}) },
      eq: J => [Q.caixa([-12, 0, -26], [26, 17, 26], 'eqf'),
        ...(o.uni ? [Q.l([34, 0, 22], [34, 120, 22], 4, 'eqf')] : o.smith ? [...barra(vAdd(vSub(J.nk, vMul(J.T, 5)), [-8, 0, 0])), ...trilhos(J.nk[0] - 13, 0, 200)] : [rolo(vAdd(J.sR, [0, 7, 0]), 6), rolo(vAdd(J.sL, [0, 7, 0]), 6), Q.l(vAdd(J.sR, [-4, 8, 8]), [-30, 200, 30], 3, 'eqf'), Q.l(vAdd(J.sL, [-4, 8, -8]), [-30, 200, -30], 3, 'eqf')])],
    };
  } },
  prancha: { cam: o => (o.lat ? [8, 12] : [24, 10]), iso: true, pose(k, o) {
    const b = Math.sin(k * Math.PI) * 0.5;
    if (o.lat) {
      const th = 15 + b, lat = [0, -1, 0], A = [62, 5, 0], T = D(180, th), q = vAdd(A, vMul(D(180, th), 85)), P = vSub(q, vMul(lat, C.QUA));
      return { corpo: { P, tr: T, lat, hd: D(180, th), bR: { ua: D(0, -90), fa: D(90, -2), mao: D(90, 0) }, bL: { m: vAdd(P, [2, 13, 6]), polo: [0.3, 1, 0.5] }, pR: { th: D(0, -th), sh: D(0, -th), pe: D(90, 0) }, pL: { th: D(0, -th), sh: D(0, -th), pe: D(90, 0) } } };
    }
    const th = 11 + b, A = [-62, 10, 10], q = vAdd(A, vMul(D(0, th), 85)), P = [q[0], q[1], 0], T = D(0, th);
    return { corpo: { P, tr: T, hd: D(0, th + 4), bR: { ua: D(0, -88), fa: D(-8, -3), mao: D(-8, -3) }, pR: { th: D(180, -th), sh: D(180, -th), pe: D(0, -72) } } };
  } },
  abdPolia: { cam: [20, 6], exc: false, pose(k) {
    const P = vLerp([-4, 47, 0], [-12, 44, 0], k), T = vSlerp(D(0, 80), D(0, 12), k), nk = nkDe(P, T), N = peitoDe(T), m = vAdd(vAdd(nk, vMul(T, 4)), vMul(N, 8));
    return {
      corpo: { P, tr: T, hd: vSlerp(D(0, 70), D(0, -20), k), bR: { m: [m[0], m[1], 7], polo: [0.3, -1, 0.6] }, pR: { a: [-42, 6, 12], polo: [1, -0.6, 0.1], pe: D(180, -10) } },
      eq: J => { const e = vAdd(meio(J), vMul(T, 8)); return [Q.l(e, J.hR, 2.6, 'eq'), Q.l(e, J.hL, 2.6, 'eq'), ...cabo([40, 196, 0], e)]; },
    };
  } },
  elevPernas: { cam: o => (o.solo ? [18, 14] : [26, 2]), exc: false, pose(k, o) {
    if (o.solo) {
      const P = [22, 9, 0], perna = vSlerp(D(0, 6), D(0, 86), k);
      return { corpo: { P, tr: D(180, 0), bR: { m: [P[0] - 6, 3, 24], polo: [0, 1, 0.2], mao: [1, 0, 0] }, pR: { th: perna, sh: perna, pe: giro90(perna) } } };
    }
    return {
      corpo: { nk: [0, 156, 0], tr: D(180, 90), bR: { m: [5, 205, 30], polo: [0, -0.6, 0.8], mao: [0, 1, 0] }, pR: { th: vSlerp(D(0, -88), D(0, 18), k), sh: vSlerp(D(0, -88), D(0, -64), k), pe: D(0, -40) } },
      eq: () => [Q.l([5, 207, -64], [5, 207, 64], 3.5, 'eq'), Q.l([5, 207, 64], [5, 0, 64], 4, 'eqf'), Q.l([5, 207, -64], [5, 0, -64], 4, 'eqf')],
    };
  } },
  crunch: { cam: [20, 14], exc: false, pose(k) {
    const P = [12, 10, 0], T = vSlerp(D(180, 0), D(180, 32), k), nk = nkDe(P, T), N = peitoDe(T), m = vAdd(vSub(nk, vMul(T, 12)), vMul(N, 10));
    return { corpo: { P, tr: T, hd: vSlerp(D(180, 4), D(180, 50), k), bR: { m: [m[0], m[1], 5], polo: [0, -1, 0.5] }, pR: { a: [52, 4, 13], polo: [0, 1, 0.2] } } };
  } },
  pallof: { cam: [64, 28], exc: false, pose(k) {
    const P = [0, 86, 0], T = D(0, 89), sh = ombroDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vLerp([sh[0] + 13, sh[1] - 12, 4], [sh[0] + 50, sh[1] - 10, 3], k), polo: [-0.2, -1, 0.3] }, pR: emPe(20) },
      eq: J => cabo([8, sh[1] - 10, -84], meio(J)),
    };
  } },
  /* ---------- home exercises ---------- */
  pike: { cam: [24, 10], exc: true, pose(k) {
    const P = vLerp([0, 80, 0], [8, 72, 0], k), T = vSlerp(D(0, -40), D(0, -66), k);
    return { corpo: { P, tr: T, bR: { m: [52, 3, 24], polo: [-1, 0.4, 0.4], mao: [1, 0, 0.15] }, pR: { a: [-46, 12, 11], polo: [1, 0, 0], pe: D(0, -50) } } };
  } },
  dipCadeira: { cam: [40, 10], exc: true, pose(k) {
    const P = vLerp([6, 56, 0], [6, 31, 0], k);
    return {
      corpo: { P, tr: D(0, 86), bR: { m: [-12, 49, 19], polo: [-1, 0.2, 0.1], mao: [1, 0, 0] }, pR: { a: [54, 3, 12], polo: [0.2, 1, 0.1] } },
      eq: () => [...banco(-52, -8, 44, 24), Q.caixa([-54, 44, -24], [-48, 92, 24], 'pd')],
    };
  } },
  remadaInvertida: { cam: [20, 6], exc: false, pose(k) {
    const th = nLerp(7, 24, k), A = [110, 8, 10], T = D(180, th), P = vAdd(A, vMul(T, 85));
    return {
      corpo: { P: [P[0], P[1], 0], tr: T, bR: { m: [-6, 74, 24], polo: [0.5, -1, 0.5] }, pR: { th: D(0, -th), sh: D(0, -th), pe: D(0, 76) } },
      eq: () => [Q.caixa([-112, 70, -42], [-2, 76, 42], 'pd'), ...[-8, -104].flatMap(x => [Q.l([x, 0, 36], [x, 70, 36], 4, 'eqf'), Q.l([x, 0, -36], [x, 70, -36], 4, 'eqf')])],
    };
  } },
  superman: { cam: [24, 12], exc: false, pose(k) {
    const sobe = el => vSlerp(D(0, 0), D(0, el), k), braco = vSlerp(D(5, 1), D(5, 16), k), perna = vSlerp(D(180, 0), D(180, 11), k);
    return { corpo: { P: [-5, 9, 0], tr: sobe(13), hd: sobe(22), bR: { ua: braco, fa: braco }, pR: { th: perna, sh: perna, pe: vSlerp(D(180, -50), D(180, -30), k) } } };
  } },
  ytw: { cam: [14, 50], exc: false, pose(k) {
    const braco = vSlerp(D(38, -4), D(38, 14), k), perna = D(180, 0);
    return { corpo: { P: [-5, 9, 0], tr: vSlerp(D(0, 0), D(0, 6), k), hd: D(0, 4), bR: { ua: braco, fa: braco, mao: braco }, pR: { th: perna, sh: perna, pe: D(180, -50) } } };
  } },
  hollow: { cam: [22, 12], iso: true, pose(k) {
    const b = Math.sin(k * Math.PI) * 1.5, perna = D(0, 24 + b), braco = D(180, 30 + b);
    return { corpo: { P: [10, 10, 0], tr: D(180, 22 + b), bR: { ua: braco, fa: braco }, pR: { th: perna, sh: perna, pe: D(0, 34) } } };
  } },
  perdigueiro: { cam: [40, 18], exc: false, pose(k) {
    const P = [-20, 49, 0], T = D(0, 6), parado = { ua: D(0, -90), fa: D(0, -90) }, joelho = { th: D(0, -90), sh: D(180, 0), pe: D(180, -30) };
    const braco = vSlerp(D(0, -90), D(0, 4), k), perna = vSlerp(D(0, -90), D(180, 3), k);
    return { corpo: { P, tr: T, hd: D(0, -6), bR: { ua: braco, fa: braco }, bL: parado, pR: joelho, pL: { th: perna, sh: vSlerp(D(180, 0), D(180, 3), k), pe: vSlerp(D(180, -30), D(180, -60), k) } } };
  } },
  escalador: { cam: [24, 10], exc: false, pose(k) {
    const th = 19, A = [-58, 13, 10], q = vAdd(A, vMul(D(0, th), 85)), P = [q[0], q[1], 0], T = D(0, th), sh = ombroDe(P, T), reta = D(180, -th);
    return { corpo: { P, tr: T, hd: D(0, th + 10), bR: { m: [sh[0] + 3, 3, 25], polo: [-0.5, 0.6, 0.7], mao: [1, 0, 0.15] },
      pR: { th: vSlerp(reta, D(0, -30), k), sh: vSlerp(reta, D(180, -15), k), pe: D(0, -70) }, pL: { th: vMir(reta), sh: vMir(reta), pe: D(0, -70) } } };
  } },
  parede: { cam: [30, 8], iso: true, pose(k) {
    const b = Math.sin(k * Math.PI) * 0.6, P = [-18, 46 + b, 0], T = D(0, 89), nk = nkDe(P, T);
    return {
      corpo: { P, tr: T, bR: { m: vAdd(nk, [9, -13, -9]), polo: [0, -1, 0.6] }, pR: { th: D(0, -2), sh: D(0, -90), pe: D(14, -6) } },
      eq: () => [Q.caixa([-42, 0, -46], [-31, 150, 46], 'pd')],
    };
  } },
  flexoraToalha: { cam: [26, 14], exc: false, pose(k) {
    const nk = [-36, 10, 0], T = vSlerp(D(180, -12), D(180, -28), k), P = vSub(nk, vMul(T, C.T)), a = vLerp([95, 4, 12], [42, 4, 12], k);
    return {
      corpo: { P, tr: T, hd: vSlerp(T, D(0, 60), 0.5), bR: { m: [P[0] - 12, 2, 26], polo: [0, 1, 0.3], mao: [1, 0, 0] }, pR: { a, polo: [0, 1, 0.2], pe: D(0, 70) } },
      eq: () => [Q.caixa([a[0] - 12, 0, -24], [a[0] + 8, 1.6, 24], 'pd')],
    };
  } },
  kbSwing: { cam: [26, 6], exc: false, pose(k) {
    const th = nLerp(32, 86, k), shY = nLerp(92, 133, k), P = [6 - 46 * Math.cos(th * RAD), shY - 46 * Math.sin(th * RAD), 0], T = D(0, th);
    const ombros = vSub(nkDe(P, T), vMul(T, 4)), dir = vSlerp(D(180, -64), D(0, -4), k), m = vAdd(ombros, vMul(dir, 56));
    return {
      corpo: { P, tr: T, hd: D(0, Math.max(th - 25, 5)), bR: { m: [m[0], m[1], 5], polo: [0, -1, 0] }, pR: emPe(15, 0, 10) },
      eq: J => { const c = vAdd(meio(J), vMul(dir, 9)); return [Q.l(J.hR, J.hL, 3, 'eq'), { t: 'c', p: c, r: 8.5, c: 'eqf' }]; },
    };
  } },
};
/* which drawing each exercise uses */
const FIG_EX = {
  supino_reto_barra: ['supino'], supino_inclinado_barra: ['supino', { inc: 30 }], supino_reto_halteres: ['supino', { imp: 'halter' }], supino_inclinado_halteres: ['supino', { imp: 'halter', inc: 30 }],
  supino_reto_smith: ['supino', { imp: 'smith' }], supino_inclinado_smith: ['supino', { imp: 'smith', inc: 30 }], supino_maquina: ['supinoMaq'], crucifixo_halteres: ['crucifixo'], crossover: ['crossover'],
  voador: ['voador'], flexao: ['flexao'], mergulho: ['mergulho'],
  puxada_frente: ['puxada'], puxada_neutra: ['puxada', { neutra: 1 }], puxada_unilateral: ['puxada', { uni: 1 }], barra_fixa: ['barraFixa'], barra_graviton: ['barraFixa', { grav: 1 }],
  remada_curvada: ['remadaCurvada'], serrote: ['serrote'], remada_apoiada: ['remadaApoiada'], remada_baixa: ['remadaBaixa'], remada_maquina: ['remadaBaixa', { maq: 1 }],
  remada_cavalinho: ['remadaCurvada', { tbar: 1 }], pulldown_bracos: ['pulldownBracos'],
  desenv_halteres: ['desenv', { imp: 'halter' }], desenv_barra: ['desenv', { imp: 'barra' }], desenv_smith: ['desenv', { imp: 'smith' }], desenv_maquina: ['desenv', { imp: 'maquina' }],
  elev_lateral: ['elevLateral'], elev_lateral_polia: ['elevLateral', { cabo: 1 }], elev_lateral_maquina: ['elevLateral', { maq: 1 }],
  crucifixo_inverso: ['crucInverso', { maq: 1 }], crucifixo_inverso_h: ['crucInverso'], face_pull: ['facePull'],
  rosca_barra: ['rosca', { barra: 1 }], rosca_alternada: ['rosca', { alt: 1 }], rosca_martelo: ['rosca', { martelo: 1 }], rosca_inclinada: ['roscaInclinada'], rosca_scott: ['roscaScott'],
  rosca_polia: ['rosca', { cabo: 1 }], rosca_bayesian: ['roscaBayesian'],
  triceps_corda: ['tricepsPolia', { corda: 1 }], triceps_barra_polia: ['tricepsPolia'], triceps_overhead: ['tricepsOverhead'], triceps_frances: ['tricepsFrances'], triceps_testa: ['tricepsTesta'],
  supino_fechado: ['supino', { fechada: 1 }],
  agachamento: ['agachamento'], agachamento_smith: ['agachamento', { smith: 1 }], hack: ['hack'], pendulo: ['hack'], leg_press: ['legPress'], leg_horizontal: ['legPress', { hor: 1 }],
  bulgaro: ['bulgaro'], afundo: ['afundo'], goblet: ['agachamento', { goblet: 1 }], extensora: ['extensora'], step_up: ['stepUp'],
  stiff: ['stiff'], stiff_unilateral: ['stiff', { uni: 1 }], terra: ['terra'], mesa_flexora: ['flexora', { deitado: 1 }], cadeira_flexora: ['flexora'], hiperextensao: ['hiper'],
  hip_thrust: ['hipThrust'], hip_thrust_smith: ['hipThrust', { smith: 1 }], hip_thrust_maq: ['hipThrust', { maq: 1 }], coice_polia: ['coice'], gluteo_maquina: ['coice', { maq: 1 }],
  abdutora: ['abdutora'], ponte_gluteo: ['hipThrust', { ponte: 1 }], coice_caneleira: ['coice', { quad: 1 }], agach_sumo: ['agachamento', { sumo: 1 }], abducao_elastico: ['abdutora', { band: 1 }], adutora: ['abdutora', { adu: 1 }],
  pant_pe: ['panturrilha'], pant_sentado: ['panturrilha', { sent: 1 }], pant_leg: ['panturrilha', { leg: 1 }], pant_smith: ['panturrilha', { smith: 1 }], pant_unilateral: ['panturrilha', { uni: 1 }],
  prancha: ['prancha'], prancha_lateral: ['prancha', { lat: 1 }], abd_polia: ['abdPolia'], elev_pernas: ['elevPernas'], abd_supra: ['crunch'], elev_pernas_solo: ['elevPernas', { solo: 1 }], pallof: ['pallof'],
  /* home versions */
  flexao_inclinada: ['flexao', { inc: 1 }], flexao_declinada: ['flexao', { dec: 1 }], flexao_diamante: ['flexao', { diamante: 1 }], supino_chao: ['supino', { imp: 'halter', chao: 1 }],
  agach_livre: ['agachamento', { goblet: 1, livre: 1 }], agach_salto: ['agachamento', { goblet: 1, livre: 1 }], agach_mochila: ['agachamento', { goblet: 1, mochila: 1 }],
  afundo_reverso: ['afundo', { livre: 1 }], bulgaro_cadeira: ['bulgaro', { livre: 1 }], stiff_corpo: ['stiff', { uni: 1, livre: 1 }], ponte_unilateral: ['hipThrust', { ponte: 1, uni: 1 }],
  remada_halteres: ['remadaCurvada', { halter: 1 }], remada_mochila: ['remadaCurvada', { mochila: 1 }], barra_supinada: ['barraFixa'],
  rosca_mochila: ['rosca', { mochila: 1 }], rosca_elastico: ['rosca', { elastico: 1 }], elev_lateral_elastico: ['elevLateral', { elastico: 1 }], face_pull_elastico: ['facePull', { elastico: 1 }],
  flexao_pike: ['pike'], mergulho_cadeira: ['dipCadeira'], remada_invertida: ['remadaInvertida'], superman: ['superman'], ytw: ['ytw'], hollow: ['hollow'], perdigueiro: ['perdigueiro'],
  escalador: ['escalador'], agach_parede: ['parede'], flexora_toalha: ['flexoraToalha'], kb_swing: ['kbSwing'],
};
function figuraDe(id) {
  const m = FIG_EX[id];
  if (!m || !FIG[m[0]]) return null;
  const base = FIG[m[0]], o = m[1] || {}, cam = typeof base.cam === 'function' ? base.cam(o) : base.cam;
  return { ...base, o, camA: cam, pose: k => base.pose(k, o) };
}

/* a still picture of the exercise for the workout card (cached: cards redraw often) */
const MINI = {};
function miniFigura(id) {
  if (MINI[id] != null) return MINI[id];
  const f = figuraDe(id);
  if (!f) return (MINI[id] = '');
  const cam = camera(f.camA[0], f.camA[1]), k = f.iso ? 0 : 0.7, { prims, J } = cena(f, k);
  return (MINI[id] = `<svg viewBox="${enquadrar(f, cam).join(' ')}" aria-hidden="true">${svgFormas(achatar(prims, cam, J))}</svg>`);
}

/* ---------- the player inside the "How to" sheet ---------- */
Object.assign(STR, {
  fig_exc: ['Return slowly, in control: 2–3 s', 'Volte devagar, controlando: 2–3 s', 'Vuelve despacio, con control: 2–3 s'],
  fig_con: ['Push or pull with intent: about 1 s', 'Faça força: cerca de 1 s', 'Haz fuerza: alrededor de 1 s'],
  fig_pausa: ['Short pause, muscle stretched', 'Pausa curta, músculo alongado', 'Pausa breve, músculo estirado'],
  fig_topo: ['Squeeze, then the next rep', 'Contraia e vá para a próxima', 'Aprieta y a la siguiente'],
  fig_iso: ['Hold still, brace and keep breathing', 'Segure firme, abdômen contraído, respirando', 'Mantén firme, abdomen apretado, respirando'],
  fig_paused: ['Paused · tap to play', 'Pausado · toque para continuar', 'En pausa · toca para seguir'],
  fig_start: ['Starting position · tap for the other end', 'Posição inicial · toque para ver o fim', 'Posición inicial · toca para ver el final'],
  fig_end: ['End position · tap for the start', 'Posição final · toque para ver o início', 'Posición final · toca para ver el inicio'],
  fig_label: ['Animated demonstration of {x}', 'Demonstração animada de {x}', 'Demostración animada de {x}'],
});
const Fig = { raf: 0, fig: null, cam: null, t0: 0, pausado: false, pausaEm: 0, ultimo: 0, estatico: false, k: 0 };
function figuraHTML(id, nome) {
  const f = figuraDe(id);
  if (!f) return '';
  const vb = enquadrar(f, camera(f.camA[0], f.camA[1]));
  return `<button class="fig" data-a="figPausa" aria-label="${esc(t('fig_label', { x: nome }))}"><svg id="figSvg" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg><span class="fig-fase"><span id="figFase"></span><i><b id="figBarra"></b></i></span></button>`;
}
function desenharFigura(k) {
  const svg = $('#figSvg');
  if (!svg || !Fig.fig) return false;
  const { prims, J } = cena(Fig.fig, k);
  svg.innerHTML = svgFormas(achatar(prims, Fig.cam, J));
  return true;
}
function iniciarFigura(id) {
  cancelAnimationFrame(Fig.raf);
  const f = figuraDe(id);
  if (!f) return;
  Object.assign(Fig, { fig: f, cam: camera(f.camA[0], f.camA[1]), t0: performance.now(), pausado: false, ultimo: 0, k: 0, estatico: matchMedia('(prefers-reduced-motion: reduce)').matches });
  if (Fig.estatico) { desenharFigura(0); $('#figFase').textContent = t('fig_start'); return; }
  const fases = f.iso ? [[0, 1, 2.6, 'fig_iso'], [1, 0, 2.6, 'fig_iso']]
    : f.exc ? [[0, 1, 2.4, 'fig_exc'], [1, 1, 0.5, 'fig_pausa'], [1, 0, 1.1, 'fig_con'], [0, 0, 0.8, 'fig_topo']]
      : [[0, 1, 1.1, 'fig_con'], [1, 1, 0.7, 'fig_topo'], [1, 0, 2.4, 'fig_exc'], [0, 0, 0.5, 'fig_pausa']];
  const total = fases.reduce((s, x) => s + x[2], 0);
  let rotulo = '';
  const passo = agora => {
    if (!$('#figSvg')) return; /* the sheet was closed */
    Fig.raf = requestAnimationFrame(passo);
    if (Fig.pausado || agora - Fig.ultimo < 33) return;
    Fig.ultimo = agora;
    let s = ((agora - Fig.t0) / 1000) % total, i = 0;
    while (i < fases.length - 1 && s > fases[i][2]) { s -= fases[i][2]; i++; }
    const [a, b, dur, chave] = fases[i], u = clamp(s / dur, 0, 1), e = u * u * (3 - 2 * u);
    Fig.k = a + (b - a) * e;
    desenharFigura(Fig.k);
    if (rotulo !== chave) { rotulo = chave; $('#figFase').textContent = t(chave); $('#figBarra').className = chave === 'fig_con' ? 'con' : chave === 'fig_exc' ? 'exc' : ''; }
    $('#figBarra').style.width = Math.round(u * 100) + '%';
  };
  Fig.raf = requestAnimationFrame(passo);
}
function pausarFigura() {
  if (!Fig.fig) return;
  if (Fig.estatico) { Fig.k = Fig.k ? 0 : 1; desenharFigura(Fig.k); $('#figFase').textContent = t(Fig.k ? 'fig_end' : 'fig_start'); return; }
  if (Fig.pausado) { Fig.t0 += performance.now() - Fig.pausaEm; Fig.pausado = false; }
  else { Fig.pausado = true; Fig.pausaEm = performance.now(); $('#figFase').textContent = t('fig_paused'); }
}
