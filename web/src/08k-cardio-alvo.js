/* ---------- Cardio targets: what to set on the machine in each part, like the weight in strength training ---------- */
/* intensity zones: heart rate as a share of the estimated max, and the bar height in the workout's profile */
const ZONAS = {
  aquec: { fc: [0.5, 0.65], alt: 0.34 },
  leve: { fc: [0.6, 0.7], alt: 0.46 },
  subida: { fc: [0.65, 0.8], alt: 0.6 },
  ritmo: { fc: [0.75, 0.85], alt: 0.66 },
  forte: { fc: [0.85, 0.92], alt: 0.8 },
  tiro: { fc: [0.85, 0.92], alt: 0.88 },
  maximo: { fc: null, alt: 1 },
  recupera: { fc: null, alt: 0.22 },
  desaq: { fc: null, alt: 0.28 },
};
const ZONA_DO_SEG = { warm: 'aquec', easy: 'leve', rest: 'recupera', tempo: 'ritmo', max: 'maximo', surge: 'tiro', climb: 'subida', cool: 'desaq' };
/* a long hard part (the 4×4) sits a notch below a short one (30/30, pyramid, surges) */
const zonaSeg = sg => (sg.k === 'work' ? (sg.s >= 120 ? 'forte' : 'tiro') : ZONA_DO_SEG[sg.k] || 'leve');
const ZONA_TXT = {
  aquec: ['Effort 3–4 of 10 · build up slowly', 'Esforço 3–4 de 10 · vá aumentando aos poucos', 'Esfuerzo 3–4 de 10 · sube poco a poco'],
  leve: ['Effort 4–5 · you can hold a conversation', 'Esforço 4–5 · dá para conversar', 'Esfuerzo 4–5 · puedes conversar'],
  subida: ['Effort 5–7 · brisk walk, hands off the rails', 'Esforço 5–7 · caminhada firme, sem segurar no apoio', 'Esfuerzo 5–7 · caminata firme, sin agarrarte'],
  ritmo: ['Effort 6–7 · short sentences only', 'Esforço 6–7 · só frases curtas', 'Esfuerzo 6–7 · solo frases cortas'],
  forte: ['Effort 8 · hard, but you can keep it to the end', 'Esforço 8 · forte, mas dá para manter até o fim', 'Esfuerzo 8 · fuerte, pero aguantas hasta el final'],
  tiro: ['Effort 8–9 · only a few words', 'Esforço 8–9 · só poucas palavras', 'Esfuerzo 8–9 · solo pocas palabras'],
  maximo: ['Effort 10 · as hard as you safely can', 'Esforço 10 · o máximo, com segurança', 'Esfuerzo 10 · al máximo, con seguridad'],
  recupera: ['Effort 2–3 · slow down and breathe', 'Esforço 2–3 · desacelere e respire', 'Esfuerzo 2–3 · baja el ritmo y respira'],
  desaq: ['Effort 2–3 · let your heart rate come down', 'Esforço 2–3 · deixe o coração baixar', 'Esfuerzo 2–3 · deja que baje el pulso'],
};

/* starting values by level: [beginner, intermediate, advanced] */
const ALVO_TAB = {
  corre: { aquec: [5, 6, 7], leve: [6.5, 8, 9.5], subida: [6, 7.5, 9], ritmo: [7.5, 9.5, 11.5], forte: [8, 10.5, 12.5], tiro: [8.5, 11.5, 14], maximo: [9.5, 13, 16], recupera: [5, 5.5, 6], desaq: [4.5, 5, 5.5] },
  anda: { aquec: [4.5, 5, 5], leve: [5, 5.5, 6], subida: [4.5, 5, 5.5], ritmo: [5.5, 6, 6.5], forte: [6, 6.5, 7], tiro: [6, 6.5, 7], maximo: [6.5, 7, 7.5], recupera: [4.5, 4.5, 5], desaq: [4, 4.5, 4.5] },
  inclV: { aquec: [4, 4.5, 5], leve: [4.5, 5, 5.5], subida: [4.5, 5, 5.5], ritmo: [4.5, 5, 5.5], forte: [5, 5.5, 6], tiro: [5, 5.5, 6], maximo: [5, 5.5, 6], recupera: [4, 4.5, 5], desaq: [3.5, 4, 4.5] },
  inclP: { aquec: [1, 2, 2], leve: [5, 7, 9], subida: [6, 8, 10], ritmo: [7, 9, 11], forte: [9, 11, 13], tiro: [10, 12, 14], maximo: [12, 14, 15], recupera: [2, 3, 4], desaq: [0, 1, 1] },
  /* bike, elliptical and stairs: a share of the machine's top level */
  nivel: { aquec: [0.15, 0.2, 0.25], leve: [0.25, 0.35, 0.45], subida: [0.3, 0.4, 0.5], ritmo: [0.35, 0.45, 0.55], forte: [0.45, 0.55, 0.65], tiro: [0.5, 0.6, 0.7], maximo: [0.6, 0.75, 0.85], recupera: [0.1, 0.15, 0.2], desaq: [0.1, 0.15, 0.15] },
  /* rower: seconds per 500 m */
  split: { aquec: [180, 165, 150], leve: [170, 155, 135], subida: [165, 150, 130], ritmo: [160, 142, 125], forte: [152, 135, 118], tiro: [145, 128, 112], maximo: [135, 120, 105], recupera: [190, 175, 160], desaq: [190, 175, 160] },
};
/* cadence by zone: pedal turns, strides, strokes or jumps per minute */
const ALVO_CAD = {
  bike: { aquec: [70, 80], leve: [80, 90], subida: [75, 85], ritmo: [85, 95], forte: [90, 100], tiro: [95, 105], maximo: [100, 120], recupera: [60, 70], desaq: [60, 70] },
  eliptico: { aquec: [110, 120], leve: [120, 135], subida: [115, 130], ritmo: [135, 145], forte: [140, 150], tiro: [145, 160], maximo: [160, 175], recupera: [100, 115], desaq: [100, 110] },
  remo: { aquec: [18, 20], leve: [20, 22], subida: [20, 22], ritmo: [24, 26], forte: [26, 28], tiro: [28, 32], maximo: [32, 36], recupera: [16, 18], desaq: [18, 20] },
  corda: { aquec: [70, 90], leve: [90, 110], subida: [90, 110], ritmo: [110, 120], forte: [120, 140], tiro: [130, 150] },
};
const ALVO_MAQS = ['corrida_esteira', 'esteira_inclinada', 'bike', 'eliptico', 'escada', 'remo', 'corda', 'caminhada', 'corrida'];
const MAQ_NIVEL = ['bike', 'eliptico', 'escada'];
const AJ_LIM = 8;

Object.assign(STR, {
  al_title: ['What to set on the machine', 'O que colocar no aparelho', 'Qué poner en la máquina'],
  al_speed: ['Speed', 'Velocidade', 'Velocidad'], al_incline: ['Incline', 'Inclinação', 'Pendiente'], al_level: ['Level', 'Nível', 'Nivel'],
  al_rpm: ['Cadence', 'Giro', 'Cadencia'], al_strides: ['Strides', 'Passadas', 'Zancadas'], al_split: ['Pace', 'Ritmo', 'Ritmo'],
  al_strokes: ['Strokes', 'Remadas', 'Paladas'], al_jumps: ['Jumps', 'Saltos', 'Saltos'],
  al_level_n: ['Level {n}', 'Nível {n}', 'Nivel {n}'],
  al_fast: ['As fast as you can', 'O mais rápido que conseguir', 'Lo más rápido que puedas'],
  al_rest_rope: ['Rest, march in place', 'Descanse, marche no lugar', 'Descansa, marcha en el sitio'],
  al_climbs: ['Climbs', 'Subidas', 'Subidas'],
  al_times: ['{n} × {d}', '{n} × {d}', '{n} × {d}'],
  al_times_var: ['{n} times, {a} to {b}', '{n} vezes, de {a} a {b}', '{n} veces, de {a} a {b}'],
  al_easier: ['− Easier', '− Mais leve', '− Más suave'], al_harder: ['Harder +', 'Mais forte +', 'Más fuerte +'],
  al_yours: ['Your numbers', 'Seus números', 'Tus números'], al_std: ['Standard', 'Padrão', 'Estándar'],
  al_scale: ['This machine\'s levels go up to', 'Os níveis deste aparelho vão até', 'Los niveles de esta máquina llegan hasta'],
  al_note: ['These numbers are a starting point. If a part feels too easy or too hard, change it on the machine right away and tell the app at the end: it adjusts the next one.', 'Os números são um ponto de partida. Se alguma parte ficar fácil ou difícil demais, ajuste na hora no aparelho e conte para o app no final: ele ajusta o próximo.', 'Los números son un punto de partida. Si una parte se siente muy fácil o muy difícil, ajústala en la máquina y cuéntaselo a la app al final: ajusta el siguiente.'],
  al_how: ['How does it work?', 'Como funciona?', '¿Cómo funciona?'],
  al_tip_corrida_esteira: ['Keep the incline at 1%: it feels like running outdoors. Use the quick speed buttons; on short parts the belt takes a few seconds to change, and that\'s fine.', 'Deixe a inclinação em 1%: fica parecido com correr na rua. Use os botões rápidos de velocidade; nas partes curtas a esteira leva alguns segundos para mudar, e tudo bem.', 'Deja la pendiente en 1%: se parece a correr en la calle. Usa los botones rápidos de velocidad; en las partes cortas la cinta tarda unos segundos en cambiar, y está bien.'],
  al_tip_esteira_inclinada: ['Walk without holding the rails: holding on takes the work away. If the incline is already at the top, add a little speed instead.', 'Caminhe sem segurar no apoio: segurar tira o esforço. Se a inclinação já estiver no máximo, aumente um pouco a velocidade.', 'Camina sin agarrarte: sujetarte quita el esfuerzo. Si la pendiente ya está al máximo, sube un poco la velocidad.'],
  al_tip_bike: ['Level is how heavy the pedals feel. Cadence (RPM) is pedal turns per minute, shown on the panel. Seat at hip height, knee almost straight at the bottom.', 'Nível é o peso do pedal. Giro (RPM) é quantas pedaladas por minuto, aparece no painel. Banco na altura do quadril, joelho quase esticado lá embaixo.', 'El nivel es lo pesado que va el pedal. La cadencia (RPM) son las pedaladas por minuto, en el panel. Sillín a la altura de la cadera, rodilla casi estirada abajo.'],
  al_tip_eliptico: ['Level is how heavy each stride feels. The panel shows strides per minute; if it shows RPM instead, aim for half the number. Stand tall and use your arms.', 'Nível é o peso de cada passada. O painel mostra as passadas por minuto; se mostrar RPM, use a metade do número. Fique com o tronco reto e use os braços.', 'El nivel es lo pesada que va cada zancada. El panel muestra zancadas por minuto; si muestra RPM, usa la mitad. Espalda recta y usa los brazos.'],
  al_tip_escada: ['Level is how fast the steps come. Rest just your fingertips on the rails, without hanging your weight on them.', 'Nível é a velocidade dos degraus. Apoie só as pontas dos dedos no corrimão, sem pendurar o peso.', 'El nivel es la velocidad de los escalones. Apoya solo la punta de los dedos, sin colgar tu peso.'],
  al_tip_remo: ['Set the air lever on the side of the wheel between 3 and 5; more isn\'t better. The panel shows the time per 500 m: lower is faster. Push with your legs first, then pull with your arms.', 'Coloque a alavanca do ar (na lateral da roda) entre 3 e 5; mais não é melhor. O painel mostra o tempo para 500 m: quanto menor, mais rápido. Empurre com as pernas primeiro, depois puxe com os braços.', 'Pon la palanca del aire (al lado de la rueda) entre 3 y 5; más no es mejor. El panel muestra el tiempo por 500 m: cuanto menor, más rápido. Empuja con las piernas primero y luego tira con los brazos.'],
  al_tip_corda: ['Small jumps on the balls of your feet, turning the rope with your wrists. If you trip, just start again: the timer keeps going.', 'Pulos baixos, na ponta dos pés, girando a corda com os punhos. Se errar, é só recomeçar: o cronômetro continua.', 'Saltos bajos, en la punta de los pies, girando la cuerda con las muñecas. Si fallas, vuelve a empezar: el cronómetro sigue.'],
  al_tip_caminhada: ['Pace is how long you take to walk 1 km; a running app or a watch shows it. Without one, follow the effort and the talk test.', 'Ritmo é quanto tempo você leva para andar 1 km; aparece no app de corrida ou no relógio. Sem eles, siga o esforço e o teste da conversa.', 'El ritmo es cuánto tardas en caminar 1 km; lo muestra una app de correr o el reloj. Sin ellos, sigue el esfuerzo y la prueba de la conversación.'],
  al_tip_corrida: ['Pace is how long you take to run 1 km; a running app or a watch shows it. Without one, follow the effort and the talk test.', 'Ritmo é quanto tempo você leva para correr 1 km; aparece no app de corrida ou no relógio. Sem eles, siga o esforço e o teste da conversa.', 'El ritmo es cuánto tardas en correr 1 km; lo muestra una app de correr o el reloj. Sin ellos, sigue el esfuerzo y la prueba de la conversación.'],
  vz_speed: ['Speed {v}.', 'Velocidade {v}.', 'Velocidad {v}.'],
  vz_incl: ['Incline {i}, speed {v}.', 'Inclinação {i}, velocidade {v}.', 'Pendiente {i}, velocidad {v}.'],
  vz_level: ['Level {n}.', 'Nível {n}.', 'Nivel {n}.'],
  vz_level_rpm: ['Level {n}, cadence {a} to {b}.', 'Nível {n}, giro {a} a {b}.', 'Nivel {n}, cadencia {a} a {b}.'],
  vz_strokes: ['{a} to {b} strokes a minute.', '{a} a {b} remadas por minuto.', '{a} a {b} paladas por minuto.'],
  vz_pace: ['Pace {m} minutes {s} per kilometer.', 'Ritmo de {m} minutos e {s} por quilômetro.', 'Ritmo de {m} minutos y {s} por kilómetro.'],
  vz_pace_m: ['Pace {m} minutes per kilometer.', 'Ritmo de {m} minutos por quilômetro.', 'Ritmo de {m} minutos por kilómetro.'],
  al_fb_q: ['How did the machine numbers feel?', 'Os números do aparelho ficaram:', '¿Cómo fueron los números de la máquina?'],
  al_fb_facil: ['Too easy', 'Fáceis demais', 'Muy fáciles'], al_fb_ok_b: ['Just right', 'No ponto', 'Justos'], al_fb_dificil: ['Too hard', 'Difíceis demais', 'Muy difíciles'],
  al_fb_up: ['{m}: next time the numbers go up a little.', '{m}: na próxima, os números sobem um pouco.', '{m}: la próxima vez, los números suben un poco.'],
  al_fb_down: ['{m}: next time the numbers come down a little.', '{m}: na próxima, os números descem um pouco.', '{m}: la próxima vez, los números bajan un poco.'],
  al_fb_same: ['{m}: the numbers stay as they are.', '{m}: os números continuam assim.', '{m}: los números se quedan así.'],
});

/* ---------- the numbers ---------- */
const nivelIdx = p => ({ intermediario: 1, avancado: 2 }[(p || {}).nivel] || 0);
const fmtDec = x => (Math.round(x * 10) / 10).toLocaleString(LOC(), { maximumFractionDigits: 1 });
const minSeg = s => { s = Math.round(s); return Math.floor(s / 60) + ':' + pad2(s % 60); };
const durCurta = s => (s < 120 ? s + ' s' : s % 60 ? minSeg(s) + ' min' : s / 60 + ' min');
/* person and machine: level, the steps they asked for (−8 to +8) and the machine's top level */
function alvoCtx(maq, pid) {
  pid = pid || S.me;
  const p = perfil(pid) || {}, pend = (S.alvoPend || {})[pid + ':' + maq] || {};
  const aj = pend.aj != null ? pend.aj : (p.cardioAjuste || {})[maq] || 0;
  const esc = pend.esc != null ? pend.esc : (p.cardioEscala || {})[maq] || 20;
  return { maq, pid, ni: nivelIdx(p), aj: clamp(aj, -AJ_LIM, AJ_LIM), esc: clamp(esc, 5, 40) };
}
function valorZona(tab, z, sg, ni) {
  const row = tab[z] || tab.leve;
  if (z !== 'subida' || !sg || sg.v0 == null || !tab.forte) return row[ni];
  /* a climb on a machine without an incline: between easy and hard, following the incline the workout asks for */
  return tab.leve[ni] + (tab.forte[ni] - tab.leve[ni]) * clamp(sg.v0 / 12, 0, 1);
}
const campo = (r, n, u, txt) => ({ r, n: String(n), u: u || '', txt: !!txt });
function falaPace(s) { const m = Math.floor(s / 60), r = s % 60; return r ? t('vz_pace', { m, s: r }) : t('vz_pace_m', { m }); }
/* one part of the session on one machine: { campos: the panel numbers, curto: one short line, fala: what the voice adds } */
function alvoSeg(sg, c) {
  if (!c || !ALVO_MAQS.includes(c.maq)) return null;
  const z = zonaSeg(sg), ni = c.ni, aj = c.aj;
  switch (c.maq) {
    case 'corrida_esteira': {
      const v = clamp(valorZona(ALVO_TAB.corre, z, sg, ni) + aj * 0.5, 3, 22);
      return { campos: [campo(t('al_speed'), fmtDec(v), 'km/h'), campo(t('al_incline'), 1, '%')], curto: fmtDec(v) + ' km/h', fala: t('vz_speed', { v: fmtDec(v) }) };
    }
    case 'esteira_inclinada': {
      /* the steps go into the incline; past the top (or below zero) they go into the speed */
      const raw = (z === 'subida' && sg.v0 != null ? sg.v0 : (ALVO_TAB.inclP[z] || ALVO_TAB.inclP.leve)[ni]) + aj;
      const i = clamp(raw, 0, 15);
      const v = clamp((ALVO_TAB.inclV[z] || ALVO_TAB.inclV.leve)[ni] + (raw > 15 ? (raw - 15) * 0.5 : raw < 0 ? raw * 0.5 : 0), 3, 7.5);
      /* a climb's name already says its incline ("Incline 6%"): the short line and the voice add only the speed */
      const sub = z === 'subida';
      return { campos: [campo(t('al_incline'), i, '%'), campo(t('al_speed'), fmtDec(v), 'km/h')], curto: (sub ? '' : i + '% · ') + fmtDec(v) + ' km/h', fala: sub ? t('vz_speed', { v: fmtDec(v) }) : t('vz_incl', { i, v: fmtDec(v) }) };
    }
    case 'bike': case 'eliptico': case 'escada': {
      const passo = Math.max(1, Math.round(c.esc / 20));
      const n = clamp(Math.round(valorZona(ALVO_TAB.nivel, z, sg, ni) * c.esc) + aj * passo, 1, c.esc);
      const cad = (ALVO_CAD[c.maq] || {})[z], bike = c.maq === 'bike';
      const campos = [campo(t('al_level'), n)];
      if (cad) campos.push(campo(bike ? t('al_rpm') : t('al_strides'), cad[0] + '–' + cad[1], bike ? 'RPM' : '/min'));
      return { campos, curto: t('al_level_n', { n }), fala: bike && cad ? t('vz_level_rpm', { n, a: cad[0], b: cad[1] }) : t('vz_level', { n }) };
    }
    case 'remo': {
      const sp = clamp(Math.round(valorZona(ALVO_TAB.split, z, sg, ni) - aj * 5), 85, 240), cad = ALVO_CAD.remo[z] || ALVO_CAD.remo.leve;
      return { campos: [campo(t('al_split'), minSeg(sp), '/500 m'), campo(t('al_strokes'), cad[0] + '–' + cad[1], '/min')], curto: minSeg(sp) + ' /500 m', fala: t('vz_strokes', { a: cad[0], b: cad[1] }) };
    }
    case 'corda': {
      const cad = ALVO_CAD.corda[z];
      if (!cad) { const x = t(z === 'maximo' ? 'al_fast' : 'al_rest_rope'); return { campos: [campo(t('al_jumps'), x, '', true)], curto: x, fala: '' }; }
      const d = [-10, 0, 10][ni] + aj * 10, a = clamp(cad[0] + d, 50, 170), b = clamp(cad[1] + d, 60, 180);
      return { campos: [campo(t('al_jumps'), a + '–' + b, '/min')], curto: a + '–' + b + ' /min', fala: '' };
    }
    case 'caminhada': case 'corrida': {
      const run = c.maq === 'corrida', v = clamp(valorZona(run ? ALVO_TAB.corre : ALVO_TAB.anda, z, sg, ni) + aj * (run ? 0.5 : 0.3), 3, 22);
      const pace = Math.round(3600 / v / 5) * 5;
      return { campos: [campo(t('al_split'), minSeg(pace), '/km'), campo(t('al_speed'), fmtDec(v), 'km/h')], curto: minSeg(pace) + ' /km', fala: falaPace(pace) };
    }
  }
  return null;
}
/* the session with each part's numbers in it (climbs on the incline treadmill carry the person's steps in their incline) */
function prepararSegs(segs, c) {
  return segs.map(sg => {
    const s = { ...sg };
    if (s.k === 'climb' && s.v != null) { s.v0 = s.v0 != null ? s.v0 : s.v; if (c && c.maq === 'esteira_inclinada') s.v = clamp(s.v0 + c.aj, 0, 15); }
    s.a = alvoSeg(s, c);
    return s;
  });
}
function sensacaoSeg(sg) {
  const z = zonaSeg(sg), zz = ZONAS[z], fc = zonasFC((perfil() || {}).idade);
  return L3(ZONA_TXT[z] || ZONA_TXT.leve) + (fc && zz.fc ? ' · ' + t('hr_range', { a: Math.round(fc.max * zz.fc[0]), b: Math.round(fc.max * zz.fc[1]) }) : '');
}

/* ---------- the person's steps: changed before a session, kept when it starts ---------- */
function mudarAlvo(maq, campoK, d) {
  const c = alvoCtx(maq), k = S.me + ':' + maq;
  S.alvoPend = S.alvoPend || {};
  const p = { aj: c.aj, esc: c.esc, ...(S.alvoPend[k] || {}) };
  if (campoK === 'aj') p.aj = clamp(c.aj + d, -AJ_LIM, AJ_LIM);
  else p.esc = clamp(c.esc + d, 5, 40);
  S.alvoPend[k] = p;
}
async function guardarAlvo(maq, pid, delta) {
  pid = pid || S.me;
  const k = pid + ':' + maq, pend = (S.alvoPend || {})[k], p = perfil(pid);
  if (S.alvoPend) delete S.alvoPend[k];
  if (!p || !S.canWrite || !ALVO_MAQS.includes(maq) || (!pend && !delta)) return;
  const aj = clamp((pend && pend.aj != null ? pend.aj : (p.cardioAjuste || {})[maq] || 0) + (delta || 0), -AJ_LIM, AJ_LIM);
  const esc = pend && pend.esc != null ? pend.esc : (p.cardioEscala || {})[maq];
  if (aj === ((p.cardioAjuste || {})[maq] || 0) && esc === (p.cardioEscala || {})[maq]) return;
  const body = { ...p, cardioAjuste: { ...(p.cardioAjuste || {}), [maq]: aj }, atualizadoEm: Date.now() };
  if (esc != null) body.cardioEscala = { ...(p.cardioEscala || {}), [maq]: esc };
  try { await save('perfis/' + pid, body); S.perfis[pid] = body; } catch { /* the numbers stay as they were */ }
}

/* ---------- the workout's shape: bar height = how hard, width = how long ---------- */
function perfilRects(segs) {
  const tot = totalSeg(segs) || 1;
  let x = 0;
  return segs.map(sg => {
    const w = (sg.s / tot) * 1000, z = ZONAS[zonaSeg(sg)] || ZONAS.leve;
    const h = Math.round((sg.k === 'climb' ? 0.42 + clamp((sg.v || 0) / 15, 0, 1) * 0.42 : z.alt) * 100);
    const r = `<rect class="k-${sg.k}" x="${x.toFixed(1)}" y="${100 - h}" width="${Math.max(w - 2, 0.8).toFixed(1)}" height="${h}" rx="2"/>`;
    x += w;
    return r;
  }).join('');
}
const perfilSVG = segs => `<svg class="pf" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">${perfilRects(segs)}</svg>`;
function painelHTML(campos) {
  return campos.map(f => `<span class="lcd${f.txt ? ' txt' : ''}"><small>${esc(f.r)}</small><b class="num">${esc(f.n)}${f.u ? `<em>${esc(f.u)}</em>` : ''}</b></span>`).join('');
}
/* the same values in a group of parts shown once; values that change (the climbs) as a range */
function camposGrupo(segs) {
  const base = segs[0].a.campos;
  return base.map((f, i) => {
    const vals = [...new Set(segs.map(s => (s.a && s.a.campos[i] ? s.a.campos[i].n : f.n)))];
    if (vals.length < 2) return f;
    const nums = vals.map(v => parseFloat(String(v).replace(',', '.')));
    if (nums.some(n => !isFinite(n))) return f;
    const lo = vals[nums.indexOf(Math.min(...nums))], hi = vals[nums.indexOf(Math.max(...nums))];
    return { ...f, n: lo + '–' + hi };
  });
}
function quantoGrupo(segs) {
  const ds = segs.map(s => s.s), lo = Math.min(...ds), hi = Math.max(...ds);
  if (segs.length === 1) return durCurta(ds[0]);
  return lo === hi ? t('al_times', { n: segs.length, d: durCurta(lo) }) : t('al_times_var', { n: segs.length, a: durCurta(lo), b: durCurta(hi) });
}
/* the shape, then each kind of part once: how long, what to set and how it should feel */
function alvosHTML(segs, maq, volta) {
  const c = alvoCtx(maq), ps = prepararSegs(segs, c);
  const grupos = [];
  for (const s of ps) {
    const key = s.k === 'climb' ? 'climb' : s.k + ':' + zonaSeg(s);
    let g = grupos.find(x => x.key === key);
    if (!g) grupos.push((g = { key, segs: [] }));
    g.segs.push(s);
  }
  const tem = ps.some(s => s.a);
  const linhas = grupos.map(g => {
    const s = g.segs[0], nome = s.k === 'climb' ? t('al_climbs') : rotuloSeg(s);
    return `<div class="alv-row"><i class="alv-dot k-${s.k}"></i><div class="alv-main"><p class="alv-tit"><b>${esc(nome)}</b> <span class="num">${esc(quantoGrupo(g.segs))}</span></p>
      ${s.a ? `<div class="alv-set">${painelHTML(camposGrupo(g.segs))}</div>` : ''}<p class="alv-sens num">${esc(sensacaoSeg(s))}</p></div></div>`;
  }).join('');
  const aj = c.aj;
  return `<div class="alv">
    <div class="row between"><p class="eyebrow">${t(tem ? 'al_title' : 'al_shape')}</p><button class="btn quiet small" data-a="cardioGuia"${volta ? ` data-volta="${volta}"` : ''}>${t('al_how')}</button></div>
    ${perfilSVG(ps)}
    <div class="alv-lista">${linhas}</div>
    ${tem ? `<div class="alv-aj"><button class="btn ghost small" data-a="alvoAj" data-m="${maq}" data-d="-1">${t('al_easier')}</button><span class="alv-aj-v"><small>${t('al_yours')}</small><b class="num">${aj === 0 ? t('al_std') : (aj > 0 ? '+' : '−') + Math.abs(aj)}</b></span><button class="btn ghost small" data-a="alvoAj" data-m="${maq}" data-d="1">${t('al_harder')}</button></div>
    ${MAQ_NIVEL.includes(maq) ? `<div class="alv-esc"><span class="small">${t('al_scale')}</span><span class="mini-step"><button data-a="alvoEsc" data-m="${maq}" data-d="-1" aria-label="−">−</button><b class="num">${c.esc}</b><button data-a="alvoEsc" data-m="${maq}" data-d="1" aria-label="+">+</button></span></div>` : ''}
    <p class="small muted">${t('al_tip_' + maq)}</p>
    <p class="xs muted">${t('al_note')}</p>` : ''}
  </div>`;
}
Object.assign(STR, { al_shape: ['The shape of the workout', 'Como é o treino', 'Cómo es el entrenamiento'] });

/* ---------- "How cardio works" ---------- */
Object.assign(STR, {
  cg_btn: ['How cardio works', 'Como funciona o cardio', 'Cómo funciona el cardio'],
  cg_intro: ['Cardio here works like your strength workouts: each session is split into parts, and for each part the app tells you exactly what to set on the machine and how it should feel.', 'O cardio aqui funciona como a musculação: cada treino é dividido em partes, e para cada parte o app diz exatamente o que colocar no aparelho e como você deve se sentir.', 'El cardio aquí funciona como las pesas: cada sesión se divide en partes, y para cada parte la app te dice exactamente qué poner en la máquina y cómo te debes sentir.'],
  cg_parts: ['The parts of a session', 'As partes do treino', 'Las partes del entrenamiento'],
  cg_example: ['Example: HIIT 30/30. The taller the bar, the harder the part.', 'Exemplo: HIIT 30/30. Quanto mais alta a barra, mais forte a parte.', 'Ejemplo: HIIT 30/30. Cuanto más alta la barra, más fuerte la parte.'],
  cg_p_warm: ['Warm-up and cool-down: start and finish easy, so your body warms up and then settles.', 'Aquecimento e desaceleração: começa e termina leve, para o corpo esquentar e depois baixar.', 'Calentamiento y vuelta a la calma: empieza y termina suave, para que el cuerpo entre en calor y luego se calme.'],
  cg_p_easy: ['Easy and recovery: a calm pace. Between hard parts, this is where you catch your breath.', 'Leve e recuperação: ritmo tranquilo. Entre as partes fortes, é onde você recupera o fôlego.', 'Suave y recuperación: ritmo tranquilo. Entre las partes fuertes, aquí recuperas el aliento.'],
  cg_p_work: ['Tempo, hard and climbs: the part that brings results.', 'Ritmo, forte e subidas: a parte que dá resultado.', 'Ritmo, fuerte y subidas: la parte que da resultados.'],
  cg_p_max: ['All out and surges: your maximum, for a few seconds.', 'Tudo e arrancadas: o seu máximo, por poucos segundos.', 'A tope y aceleraciones: tu máximo, por pocos segundos.'],
  cg_numbers: ['What to set on each machine', 'O que colocar em cada aparelho', 'Qué poner en cada máquina'],
  cg_numbers_t: ['Like the weight in strength training, each part shows the machine\'s numbers. What they mean:', 'Como o peso na musculação, cada parte mostra os números do aparelho. O que cada um quer dizer:', 'Como el peso en las pesas, cada parte muestra los números de la máquina. Qué significa cada uno:'],
  cg_g_esteira: ['Treadmill: speed (km/h) and incline (%). On an incline walk the incline does the work; when running, keep it at 1%.', 'Esteira: velocidade (km/h) e inclinação (%). Na caminhada inclinada, é a inclinação que pesa; correndo, deixe em 1%.', 'Cinta: velocidad (km/h) y pendiente (%). Caminando en pendiente, la pendiente es lo que cuesta; corriendo, déjala en 1%.'],
  cg_g_bike: ['Bike: level is how heavy the pedals feel; cadence (RPM) is pedal turns per minute.', 'Bike: nível é o peso do pedal; giro (RPM) é quantas pedaladas por minuto.', 'Bici: el nivel es lo pesado que va el pedal; la cadencia (RPM) son las pedaladas por minuto.'],
  cg_g_eliptico: ['Elliptical: level is how heavy each stride feels, plus strides per minute.', 'Elíptico: nível é o peso da passada, mais as passadas por minuto.', 'Elíptica: el nivel es lo pesada que va cada zancada, más las zancadas por minuto.'],
  cg_g_escada: ['Stair climber: level is how fast the steps come.', 'Escada: nível é a velocidade dos degraus.', 'Escaladora: el nivel es la velocidad de los escalones.'],
  cg_g_remo: ['Rower: time per 500 m (lower is faster) and strokes per minute.', 'Remo: tempo para 500 m (quanto menor, mais rápido) e remadas por minuto.', 'Remo: tiempo por 500 m (cuanto menor, más rápido) y paladas por minuto.'],
  cg_g_corda: ['Jump rope: jumps per minute.', 'Corda: saltos por minuto.', 'Cuerda: saltos por minuto.'],
  cg_g_rua: ['Outdoors: pace is minutes per kilometer, shown by a running app or a watch.', 'Na rua: ritmo é quantos minutos para fazer 1 km; aparece no app de corrida ou no relógio.', 'Al aire libre: el ritmo son los minutos por kilómetro; lo muestra una app de correr o el reloj.'],
  cg_right: ['How to know it\'s right', 'Como saber se está certo', 'Cómo saber si va bien'],
  cg_right_t: ['Effort goes from 1 to 10. The easiest check is talking:', 'O esforço vai de 1 a 10. O jeito mais fácil de conferir é falando:', 'El esfuerzo va de 1 a 10. Lo más fácil para comprobarlo es hablar:'],
  cg_hr: ['Your heart rate: easy {a}–{b} bpm · hard {c}–{d} bpm (estimated max {m}).', 'Seus batimentos: leve {a}–{b} bpm · forte {c}–{d} bpm (máximo estimado {m}).', 'Tu pulso: suave {a}–{b} lpm · fuerte {c}–{d} lpm (máximo estimado {m}).'],
  cg_hr_note: ['On short parts your heart rate takes a while to climb: follow the effort and the machine numbers.', 'Nas partes curtas os batimentos demoram para subir: siga o esforço e os números do aparelho.', 'En las partes cortas el pulso tarda en subir: sigue el esfuerzo y los números de la máquina.'],
  cg_hr_none: ['Add your age to your profile to see your heart rate zones.', 'Coloque sua idade no perfil para ver as suas faixas de batimentos.', 'Añade tu edad al perfil para ver tus zonas de pulso.'],
  cg_yours: ['Numbers that fit you', 'Números do seu jeito', 'Números a tu medida'],
  cg_yours_t: ['The numbers start from your level ({n}). Before you start, tap “Easier” or “Harder” to tune them. At the end, tell the app how they felt: it adjusts the next session, just like the weight in strength training.', 'Os números começam pelo seu nível ({n}). Antes de começar, toque em “Mais leve” ou “Mais forte” para ajustar. No final, conte como foi: o app ajusta o próximo, igual à carga na musculação.', 'Los números empiezan por tu nivel ({n}). Antes de empezar, toca “Más suave” o “Más fuerte” para ajustarlos. Al final, cuenta cómo fue: la app ajusta el siguiente, igual que el peso en las pesas.'],
  cg_safety: ['Stop if you feel chest pain, unusual shortness of breath or dizziness.', 'Pare se sentir dor no peito, falta de ar fora do normal ou tontura.', 'Para si sientes dolor en el pecho, falta de aire fuera de lo normal o mareo.'],
  cg_ok: ['Got it', 'Entendi', 'Entendido'],
  cg_back: ['Back to the workout', 'Voltar ao treino', 'Volver al entrenamiento'],
});
const CG_ESFORCO = { 4: '4–5', 6: '6–7', 8: '8–9', 9: '10' };
function cardioGuiaHTML(volta) {
  const p = perfil() || {}, z = zonasFC(p.idade);
  const exemplo = PROTO.h3030.build(6);
  const partes = [['warm', 'cg_p_warm'], ['easy', 'cg_p_easy'], ['work', 'cg_p_work'], ['max', 'cg_p_max']];
  const glos = ['esteira', 'bike', 'eliptico', 'escada', 'remo', 'corda', 'rua'];
  return `<div class="stack cg">
    <p>${t('cg_intro')}</p>
    <h3 class="h3">${t('cg_parts')}</h3>
    <div class="cg-ex">${perfilSVG(exemplo)}<p class="xs muted">${t('cg_example')}</p></div>
    <div class="cg-lista">${partes.map(([k, s]) => `<p class="cg-it"><i class="alv-dot k-${k}"></i><span>${t(s)}</span></p>`).join('')}</div>
    <h3 class="h3">${t('cg_numbers')}</h3>
    <p class="small">${t('cg_numbers_t')}</p>
    <div class="cg-lista">${glos.map(g => { const [a, ...b] = t('cg_g_' + g).split(':'); return `<p class="cg-it small"><span><b>${esc(a)}:</b>${esc(b.join(':'))}</span></p>`; }).join('')}</div>
    <h3 class="h3">${t('cg_right')}</h3>
    <p class="small">${t('cg_right_t')}</p>
    <div class="cg-esf">${ESFORCOS.map(([v, n, d]) => `<div><b class="num">${CG_ESFORCO[v]}</b><span><b>${esc(L3(n))}</b> · ${esc(L3(d))}</span></div>`).join('')}</div>
    <p class="small num">${z ? t('cg_hr', { a: z.leve[0], b: z.leve[1], c: z.forte[0], d: z.forte[1], m: z.max }) : t('cg_hr_none')}</p>
    <p class="xs muted">${t('cg_hr_note')}</p>
    <h3 class="h3">${t('cg_yours')}</h3>
    <p class="small">${t('cg_yours_t', { n: nomeNivel(p.nivel || 'iniciante') })}</p>
    <p class="xs muted">${t('cg_safety')}</p>
    <button class="btn block" data-a="${volta ? 'cgVoltar' : 'fecharSheet'}">${t(volta ? 'cg_back' : 'cg_ok')}</button>
  </div>`;
}
function abrirCardioGuia(volta) { openSheet(t('cg_btn'), cardioGuiaHTML(volta === 'setup' && S.setup ? 'setup' : '')); }
