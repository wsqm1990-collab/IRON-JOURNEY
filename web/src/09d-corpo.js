/* ---------- body composition from a tape measure (no photos) ----------
   Body fat is the mean of two validated circumference formulas: the U.S. Navy method (Hodgdon &
   Beckett; waist and neck, plus hip for women) and Relative Fat Mass (Woolcott & Bergman 2018;
   height and waist, checked against DXA). Without a tape measure it falls back to the BMI-based
   Deurenberg formula, which is clearly less precise. Also BMI (WHO bands) and waist-to-height. */
Object.assign(STR, {
  bc_title: ['Body composition', 'Composição corporal', 'Composición corporal'],
  bc_waist: ['Waist (cm)', 'Cintura (cm)', 'Cintura (cm)'], bc_neck: ['Neck (cm)', 'Pescoço (cm)', 'Cuello (cm)'], bc_hip: ['Hips (cm)', 'Quadril (cm)', 'Cadera (cm)'],
  bc_hip_note: ['hips: women only', 'quadril: só para mulheres', 'cadera: solo mujeres'],
  bc_tape: ['With a sewing tape measure the app estimates your body fat. Without it, it only uses weight and height (less precise).', 'Com uma fita métrica de costura o app estima o seu percentual de gordura. Sem fita, ele usa só peso e altura (menos preciso).', 'Con una cinta métrica de costura la app estima tu grasa corporal. Sin cinta, usa solo peso y altura (menos preciso).'],
  bc_how: ['How to measure', 'Como medir', 'Cómo medir'],
  bc_how_text: ['Standing, relaxed, in the morning before eating. Tape flat and snug, without squeezing the skin. Waist: at the belly button, after breathing out normally. Neck: just below the Adam\'s apple, the tape sloping slightly down at the front. Hips (women): around the widest part of the glutes. Measure twice and use the average.', 'Em pé, relaxado, de manhã, antes de comer. Fita reta e justa, sem apertar a pele. Cintura: na altura do umbigo, depois de soltar o ar normalmente. Pescoço: logo abaixo do pomo de adão, com a fita um pouco inclinada para baixo na frente. Quadril (mulheres): na parte mais larga dos glúteos. Meça duas vezes e use a média.', 'De pie, relajado, por la mañana antes de comer. Cinta recta y ajustada, sin apretar la piel. Cintura: a la altura del ombligo, después de soltar el aire normalmente. Cuello: justo debajo de la nuez, con la cinta un poco inclinada hacia abajo por delante. Cadera (mujeres): en la parte más ancha de los glúteos. Mide dos veces y usa el promedio.'],
  bc_fat: ['Body fat (estimate)', 'Gordura corporal (estimativa)', 'Grasa corporal (estimación)'],
  bc_lean: ['Lean mass {a} kg · fat {b} kg', 'Massa magra {a} kg · gordura {b} kg', 'Masa magra {a} kg · grasa {b} kg'],
  bc_bmi: ['BMI', 'IMC', 'IMC'], bc_whtr: ['Waist / height', 'Cintura / altura', 'Cintura / altura'],
  bc_method: ['Mean of two formulas (U.S. Navy and Relative Fat Mass). Margin of error: about 3 to 4 points.', 'Média de duas fórmulas (Marinha dos EUA e Massa Gorda Relativa). Margem de erro: uns 3 a 4 pontos.', 'Promedio de dos fórmulas (Marina de EE. UU. y Masa Grasa Relativa). Margen de error: unos 3 a 4 puntos.'],
  bc_method_one: ['From waist and height (Relative Fat Mass). Add the neck for a second formula.', 'Pela cintura e altura (Massa Gorda Relativa). Coloque o pescoço para ter uma segunda fórmula.', 'Por cintura y altura (Masa Grasa Relativa). Añade el cuello para una segunda fórmula.'],
  bc_method_bmi: ['From BMI only, so less precise: muscular people come out fatter than they are. Measure your waist and neck to improve it.', 'Só pelo IMC, então menos preciso: quem tem muito músculo aparece com mais gordura do que tem. Meça cintura e pescoço para melhorar.', 'Solo por el IMC, así que menos preciso: quien tiene mucho músculo sale con más grasa de la que tiene. Mide cintura y cuello para mejorarlo.'],
  bc_need: ['Add your sex, weight and height to see your composition.', 'Coloque sexo, peso e altura para ver a sua composição.', 'Pon sexo, peso y altura para ver tu composición.'],
  bc_bmi_cat: [['Underweight', 'Healthy weight', 'Overweight', 'Obesity class I', 'Obesity class II', 'Obesity class III'], ['Abaixo do peso', 'Peso saudável', 'Sobrepeso', 'Obesidade grau I', 'Obesidade grau II', 'Obesidade grau III'], ['Bajo peso', 'Peso saludable', 'Sobrepeso', 'Obesidad grado I', 'Obesidad grado II', 'Obesidad grado III']],
  bc_fat_cat: [['Very low', 'Athletic', 'Fit', 'Average', 'High'], ['Muito baixa', 'Atlética', 'Em forma', 'Média', 'Alta'], ['Muy baja', 'Atlética', 'En forma', 'Media', 'Alta']],
  bc_whtr_cat: [['Low', 'Healthy', 'Increased risk', 'High risk'], ['Baixa', 'Saudável', 'Risco aumentado', 'Risco alto'], ['Baja', 'Saludable', 'Riesgo aumentado', 'Riesgo alto']],
  bc_log: ['Log today\'s measurements', 'Registrar medidas de hoje', 'Registrar medidas de hoy'], bc_save: ['Save measurements', 'Salvar medidas', 'Guardar medidas'],
  bc_saved: ['Measurements saved', 'Medidas salvas', 'Medidas guardadas'], bc_weight: ['Weight (kg)', 'Peso (kg)', 'Peso (kg)'],
  bc_since: ['Since {d}: fat {f} · lean mass {m}', 'Desde {d}: gordura {f} · massa magra {m}', 'Desde {d}: grasa {f} · masa magra {m}'],
  bc_points: ['{n} points', '{n} pontos', '{n} puntos'], bc_empty: ['Measure once a month to see your body change, not only your weight.', 'Meça uma vez por mês para ver o corpo mudar, não só o peso.', 'Mide una vez al mes para ver tu cuerpo cambiar, no solo tu peso.'],
  bc_fat_chart: ['body fat %', '% de gordura', '% de grasa'], bc_weight_chart: ['weight', 'peso', 'peso'],
  bc_need_weight: ['Enter your weight.', 'Coloque o seu peso.', 'Pon tu peso.'],
});
const nCorpo = v => { const x = parseNum(v); return x != null && x > 0 ? x : null; };
const r1 = v => Math.round(v * 10) / 10;
function composicao(d) {
  const peso = nCorpo(d.peso), alt = nCorpo(d.altura), idade = nCorpo(d.idade), cint = nCorpo(d.cintura), pesc = nCorpo(d.pescoco), quad = nCorpo(d.quadril), sx = d.sexo;
  const out = {};
  if (peso && alt) out.imc = peso / ((alt / 100) ** 2);
  if (cint && alt) out.rcest = cint / alt;
  if (cint && alt && (sx === 'm' || sx === 'f')) out.rfm = (sx === 'f' ? 76 : 64) - 20 * (alt / cint);
  if (sx === 'm' && cint && pesc && alt && cint > pesc) out.navy = 495 / (1.0324 - 0.19077 * Math.log10(cint - pesc) + 0.15456 * Math.log10(alt)) - 450;
  if (sx === 'f' && cint && quad && pesc && alt && cint + quad > pesc) out.navy = 495 / (1.29579 - 0.35004 * Math.log10(cint + quad - pesc) + 0.22100 * Math.log10(alt)) - 450;
  const ests = [out.navy, out.rfm].filter(v => Number.isFinite(v) && v > 0 && v < 70);
  if (ests.length) { out.gordura = clamp(ests.reduce((a, b) => a + b, 0) / ests.length, 3, 60); out.metodo = ests.length > 1 ? 'dois' : 'um'; }
  else if (out.imc && idade && (sx === 'm' || sx === 'f')) { out.gordura = clamp(1.2 * out.imc + 0.23 * idade - 10.8 * (sx === 'm' ? 1 : 0) - 5.4, 3, 60); out.metodo = 'imc'; }
  if (out.gordura != null && peso) { out.gordaKg = peso * out.gordura / 100; out.magraKg = peso - out.gordaKg; }
  return out;
}
const catImc = v => (v < 18.5 ? 0 : v < 25 ? 1 : v < 30 ? 2 : v < 35 ? 3 : v < 40 ? 4 : 5);
/* ACE bands */
const catGordura = (v, sx) => { const b = sx === 'f' ? [14, 21, 25, 32] : [6, 14, 18, 25]; return v < b[0] ? 0 : v < b[1] ? 1 : v < b[2] ? 2 : v < b[3] ? 3 : 4; };
const catRcest = v => (v < 0.4 ? 0 : v < 0.5 ? 1 : v < 0.6 ? 2 : 3);
const corCat = (k, n) => ({ imc: ['warn', 'ok', 'warn', 'bad', 'bad', 'bad'], gord: ['warn', 'ok', 'ok', '', 'bad'], rc: ['warn', 'ok', 'warn', 'bad'] })[k][n] || '';
function composicaoHTML(d) {
  const c = composicao(d), sx = d.sexo;
  if (!c.imc) return `<p class="small muted">${t('bc_need')}</p>`;
  const cat = (k, lista, n) => `<span class="pill ${corCat(k, n)}">${esc(L3(STR[lista])[n])}</span>`;
  const linhas = [];
  if (c.gordura != null) linhas.push(`<div class="bc-big"><span class="small muted">${t('bc_fat')}</span><b class="num">${fmtKg(r1(c.gordura))}%</b>${(sx === 'm' || sx === 'f') ? cat('gord', 'bc_fat_cat', catGordura(c.gordura, sx)) : ''}</div>
    ${c.magraKg ? `<p class="small num">${esc(t('bc_lean', { a: fmtKg(r1(c.magraKg)), b: fmtKg(r1(c.gordaKg)) }))}</p>` : ''}`);
  linhas.push(`<div class="bc-row"><span>${t('bc_bmi')}</span><b class="num">${fmtKg(r1(c.imc))}</b>${cat('imc', 'bc_bmi_cat', catImc(c.imc))}</div>`);
  if (c.rcest) linhas.push(`<div class="bc-row"><span>${t('bc_whtr')}</span><b class="num">${(Math.round(c.rcest * 100) / 100).toLocaleString(LOC())}</b>${cat('rc', 'bc_whtr_cat', catRcest(c.rcest))}</div>`);
  if (c.metodo) linhas.push(`<p class="xs muted">${t(c.metodo === 'dois' ? 'bc_method' : c.metodo === 'um' ? 'bc_method_one' : 'bc_method_bmi')}</p>`);
  return `<div class="bc stack">${linhas.join('')}</div>`;
}
const comoMedirHTML = () => `<details class="bc-how"><summary>${t('bc_how')}</summary><p class="small">${esc(t('bc_how_text'))}</p></details>`;
/* the tape-measure fields (wizard and the measurements sheet share them) */
function medidasCamposHTML(d, dataIn) {
  const campo = (k, rot, ph) => `<label class="f" for="bc-${k}">${t(rot)}<input class="inp num" id="bc-${k}" data-in="${dataIn}" data-k="${k}" inputmode="decimal" maxlength="5" value="${esc(d[k] == null ? '' : d[k])}" placeholder="${ph}"></label>`;
  return `<p class="small muted">${t('bc_tape')}</p>${comoMedirHTML()}
    <div class="grid2">${campo('cintura', 'bc_waist', 'cm')}${campo('pescoco', 'bc_neck', 'cm')}${d.sexo === 'f' ? campo('quadril', 'bc_hip', 'cm') : ''}</div>`;
}

/* ---------- measurements over time ---------- */
const MEDIDAS_MAX = 120;
function novaMedida(p, d) {
  const m = { data: Date.now(), peso: nCorpo(d.peso), cintura: nCorpo(d.cintura), pescoco: nCorpo(d.pescoco), quadril: nCorpo(d.quadril) };
  if (!m.peso && !m.cintura) return p.medidas || [];
  const lista = (p.medidas || []).slice();
  const ult = lista[lista.length - 1];
  if (ult && dayKey(ult.data) === dayKey(m.data)) lista[lista.length - 1] = m; else lista.push(m);
  return lista.slice(-MEDIDAS_MAX);
}
function corpoCard(pid) {
  const p = perfil(pid) || {}, c = composicao(p), hist = (p.medidas || []).map(m => ({ ...m, comp: composicao({ ...p, ...m }) }));
  const comFat = hist.filter(m => m.comp.gordura != null);
  let desde = '';
  if (comFat.length > 1) {
    const a = comFat[0], b = comFat[comFat.length - 1], df = r1(b.comp.gordura - a.comp.gordura), dm = b.comp.magraKg != null && a.comp.magraKg != null ? r1(b.comp.magraKg - a.comp.magraKg) : null;
    const s = v => (v > 0 ? '+' : '') + fmtKg(v);
    desde = `<p class="small num">${esc(t('bc_since', { d: fmtDia(new Date(a.data)), f: t('bc_points', { n: s(df) }), m: dm == null ? '—' : s(dm) + ' kg' }))}</p>`;
  }
  const graficos = comFat.length > 1 ? `<div class="prog"><span class="small muted">${t('bc_fat_chart')}</span>${spark(comFat.map(m => m.comp.gordura))}<span class="small num">${fmtKg(r1(comFat[comFat.length - 1].comp.gordura))}%</span></div>` : '';
  const pesos = hist.filter(m => m.peso);
  const grafPeso = pesos.length > 1 ? `<div class="prog"><span class="small muted">${t('bc_weight_chart')}</span>${spark(pesos.map(m => m.peso))}<span class="small num">${fmtKg(pesos[pesos.length - 1].peso)} kg</span></div>` : '';
  return `<div class="card pad stack" id="corpo">
    <h2 class="h3">${t('bc_title')}</h2>
    ${c.imc ? composicaoHTML(p) : `<p class="small muted">${t('bc_need')}</p>`}
    ${desde}${graficos}${grafPeso}
    ${hist.length < 2 ? `<p class="xs muted">${t('bc_empty')}</p>` : ''}
    <button class="btn ghost block" data-a="medidasAbrir">${t('bc_log')}</button>
  </div>`;
}
function abrirMedidas() {
  const p = perfil() || {};
  S.medidas = { peso: p.peso || '', cintura: p.cintura || '', pescoco: p.pescoco || '', quadril: p.quadril || '' };
  openSheet(t('bc_title'), medidasHTML(), () => { S.medidas = null; });
}
function medidasHTML() {
  const p = perfil() || {}, d = { ...p, ...S.medidas };
  return `<div class="stack">
    <label class="f" for="bc-peso">${t('bc_weight')}<input class="inp num" id="bc-peso" data-in="medida" data-k="peso" inputmode="decimal" maxlength="5" value="${esc(d.peso)}" placeholder="kg"></label>
    ${medidasCamposHTML(d, 'medida')}
    <div id="bc-res">${composicaoHTML(d)}</div>
    <button class="btn big block" data-a="medidasSalvar">${t('bc_save')}</button>
  </div>`;
}
async function salvarMedidas() {
  const p = perfil(), pid = S.me, m = S.medidas;
  if (!p || !m) return;
  if (!nCorpo(m.peso)) { toast(t('bc_need_weight')); return; }
  const body = { ...p, peso: String(m.peso).trim(), cintura: String(m.cintura || '').trim(), pescoco: String(m.pescoco || '').trim(), quadril: String(m.quadril || '').trim(), atualizadoEm: Date.now() };
  body.medidas = novaMedida(p, body);
  try { await save('perfis/' + pid, body, t('bc_saved')); } catch { return; }
  S.perfis[pid] = body;
  closeSheet(); render();
}
/* while typing: refresh only the result, so the keyboard stays where it is */
function atualizaComposicao(alvo, d) { const el = $(alvo); if (el) el.innerHTML = composicaoHTML(d); }
/* for the AI coach */
function ctxCorpo(p) {
  const c = composicao(p);
  if (!c.imc) return '';
  const partes = [`BMI ${r1(c.imc)}`];
  if (c.gordura != null) partes.push(`estimated body fat ${r1(c.gordura)}% (${c.metodo === 'imc' ? 'from BMI, rough' : 'tape-measure formulas'})${c.magraKg ? `, lean mass ${r1(c.magraKg)} kg` : ''}`);
  if (c.rcest) partes.push(`waist ${nCorpo(p.cintura)} cm, waist-to-height ${Math.round(c.rcest * 100) / 100}`);
  return 'Body composition: ' + partes.join('; ');
}
