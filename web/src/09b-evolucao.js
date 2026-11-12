Object.assign(STR, {
  stats_e: ['Progress', 'Evolução', 'Progreso'], stats_h: ['Stronger every week', 'Mais forte a cada semana', 'Más fuerte cada semana'],
  stats_empty_h: ['Your numbers show up here', 'Seus números aparecem aqui', 'Tus números aparecen aquí'],
  stats_empty: ['After your first workout you\'ll see each exercise\'s progress, your records, your cardio minutes and your full history.', 'Depois do primeiro treino você vê a evolução de cada exercício, seus recordes, os minutos de cardio e o histórico completo.', 'Después de tu primer entrenamiento verás el progreso de cada ejercicio, tus récords, tus minutos de cardio y todo tu historial.'],
  sessions_this_week: ['sessions this week', 'sessões nesta semana', 'sesiones esta semana'], exercises: ['Exercises', 'Exercícios', 'Ejercicios'], est_strength: ['estimated strength per workout', 'força estimada por treino', 'fuerza estimada por entrenamiento'],
  last_x: ['last: {x}', 'última: {x}', 'última: {x}'], latest_records: ['Latest records', 'Últimos recordes', 'Últimos récords'], min_per_week: ['minutes per week', 'minutos por semana', 'minutos por semana'],
  sessions: ['sessions', 'sessões', 'sesiones'], minutes_l: ['minutes', 'minutos', 'minutos'], no_cardio_yet: ['No cardio logged yet.', 'Nenhum cardio registrado ainda.', 'Aún no hay cardio registrado.'],
  history: ['History', 'Histórico', 'Historial'], strength: ['Strength', 'Musculação', 'Fuerza'], effort_x: ['effort {n}/10', 'esforço {n}/10', 'esfuerzo {n}/10'], light_week: ['light week', 'semana leve', 'semana ligera'],
  delete_q_cardio: ['Delete this cardio?', 'Apagar este cardio?', '¿Borrar este cardio?'], delete_q_workout: ['Delete this workout?', 'Apagar este treino?', '¿Borrar este entrenamiento?'], delete_text: ['It leaves your history, your progress and your XP.', 'Ele sai do histórico, da evolução e do XP.', 'Sale de tu historial, tu progreso y tu XP.'],
  chart_aria: ['Cardio minutes per week over the last 8 weeks', 'Minutos de cardio por semana nas últimas 8 semanas', 'Minutos de cardio por semana en las últimas 8 semanas'],
});
function barrasCardio(pid) {
  const base = new Date(); base.setHours(12, 0, 0, 0); base.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  const wks = [];
  for (let i = 7; i >= 0; i--) { const d = new Date(base); d.setDate(base.getDate() - i * 7); wks.push(d); }
  const cs = cardioDe(pid);
  const mins = wks.map(d => { const k = weekKey(d.getTime()); return cs.filter(c => weekKey(c.inicio) === k).reduce((n, c) => n + (c.minutos || 0), 0); });
  const max = Math.max(60, ...mins), W = 320, H = 132, top = 18, bottom = 22, bw = 24, step = W / wks.length;
  const alt = v => Math.round((v / max) * (H - top - bottom));
  let g = `<line x1="0" y1="${H - bottom}" x2="${W}" y2="${H - bottom}" stroke="var(--line)" stroke-width="1"/>`;
  wks.forEach((d, i) => {
    const x = Math.round(i * step + (step - bw) / 2), v = mins[i], h = Math.max(alt(v), 3), atual = i === wks.length - 1;
    if (v) g += `<rect x="${x}" y="${H - bottom - h}" width="${bw}" height="${h}" rx="4" fill="${atual ? 'var(--accent)' : 'var(--plate-blue)'}" fill-opacity="${atual ? 1 : 0.5}"/><text x="${x + bw / 2}" y="${H - bottom - h - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">${v}</text>`;
    g += `<text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle" font-size="10.5" fill="${atual ? 'var(--accent)' : 'var(--muted)'}">${esc(fmtDia(d))}</text>`;
  });
  return `<svg class="bar-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('chart_aria')}">${g}</svg>`;
}
function viewStats(sub) {
  const pid = S.me, ss = sessoesDe(pid), cs = cardioDe(pid);
  if (!ss.length && !cs.length) return `<section class="screen">${sub}<p class="eyebrow">${t('stats_e')}</p><h1 class="h-display h2">${t('stats_empty_h')}</h1><p class="muted">${t('stats_empty')}</p></section>`;
  const sem = weekKey(Date.now()), porEx = {};
  ss.slice().reverse().forEach(s => (s.exs || []).forEach(x => {
    const m = melhorDe(x); if (!m.top) return;
    const v = porEx[x.id] || (porEx[x.id] = { id: x.id, nomeX: x.nome, carga: usaCarga(m.ex), un: unidade(m.ex), pts: [] });
    v.pts.push(m.top); v.ult = m.set;
  }));
  const lista = Object.values(porEx).sort((a, b) => b.pts.length - a.pts.length);
  const { prs } = recordes(pid);
  const linhaEx = v => {
    const ganho = v.pts.length > 1 ? Math.round((v.pts[v.pts.length - 1] / v.pts[0] - 1) * 100) : 0;
    const ult = (v.carga && v.ult.kg ? fmtKg(v.ult.kg) + ' kg × ' : '') + v.ult.reps + (v.carga ? '' : ' ' + v.un);
    return `<div class="prog"><span style="font-weight:600;min-width:0">${esc(exInfo(v.id, v.nomeX).nome)}</span>${spark(v.pts)}<span class="small muted num">${esc(t('last_x', { x: ult }))}${ganho ? ` <span class="pill ${ganho > 0 ? 'ok' : 'warn'}">${ganho > 0 ? '+' : ''}${ganho}%</span>` : ''}</span></div>`;
  };
  const totMin = cs.reduce((n, c) => n + (c.minutos || 0), 0), totKm = cs.reduce((n, c) => n + (c.km || 0), 0);
  const naSemana = ss.filter(s => weekKey(s.inicio) === sem).length + cs.filter(c => weekKey(c.inicio) === sem).length;
  const hist = [...ss.map(s => ({ col: 'sessoes', s })), ...cs.map(c => ({ col: 'cardio', s: c }))].sort((a, b) => b.s.inicio - a.s.inicio).slice(0, 25);
  const linhaHist = ({ col, s }) => {
    const apagar = `<button class="btn quiet small" data-a="apagarSessao" data-col="${col}" data-id="${esc(s._id)}" style="align-self:flex-start;padding:0">${t('delete')}</button>`;
    if (col === 'cardio') return `<div class="sess"><div class="row between"><span class="row" style="gap:8px"><span class="pill acc">${t('cardio')}</span><b>${esc(exInfo(s.modo, s.nome).nome)}</b></span><span class="small muted num">${esc(fmtPeriodo(s.inicio, s.fim))}</span></div>
      <span class="small muted num">${s.minutos} min${s.protocolo && PROTO[s.protocolo] ? ' · ' + esc(L3(PROTO[s.protocolo].nome)) : ''}${s.km ? ' · ' + fmtKg(s.km) + ' km' : ''}${s.esforco ? ' · ' + t('effort_x', { n: s.esforco }) : ''}${s.fc ? ' · ' + s.fc + ' bpm' : ''}</span>${s.nota ? `<span class="small">${esc(s.nota)}</span>` : ''}${apagar}</div>`;
    const n = (s.exs || []).reduce((k, x) => k + (x.sets || []).length, 0);
    return `<div class="sess"><div class="row between"><span class="row" style="gap:8px"><span class="pill">${t('strength')}</span><b>${esc(s.diaNome)}</b></span><span class="small muted num">${esc(fmtPeriodo(s.inicio, s.fim))}</span></div>
      <span class="small muted num">${tn(n, 'n_set', 'n_sets')}${s.fim ? ' · ' + fmtDur(s.fim - s.inicio) : ''}${s.sensacao ? ' · ' + esc(nomeSens(s.sensacao)) : ''}${s.deload ? ' · ' + t('light_week') : ''}</span>${s.nota ? `<span class="small">${esc(s.nota)}</span>` : ''}${apagar}</div>`;
  };
  return `<section class="screen">
    ${sub}
    <p class="eyebrow">${t('stats_e')}</p><h1 class="h-display h2">${t('stats_h')}</h1>
    <div class="stats"><div class="stat"><b class="num">${ss.length}</b><span>${t('st_workouts')}</span></div><div class="stat"><b class="num">${naSemana}</b><span>${t('sessions_this_week')}</span></div><div class="stat"><b class="num">${prs.length}</b><span>${t('st_records')}</span></div></div>
    ${lista.length ? `<div class="card pad"><div class="row between"><h2 class="h3">${t('exercises')}</h2><span class="xs muted">${t('est_strength')}</span></div>${lista.map(linhaEx).join('')}</div>` : ''}
    ${prs.length ? `<div class="card pad stack"><h2 class="h3">${t('latest_records')}</h2>${prs.slice(-6).reverse().map(r => `<div class="row"><span class="pill pr">${t('record')}</span><span class="small">${esc(exInfo(r.exId, r.nomeX).nome)}: ${r.carga && r.kg ? fmtKg(r.kg) + ' kg × ' : ''}${r.reps} <span class="muted">· ${esc(fmtDate(r.inicio))}</span></span></div>`).join('')}</div>` : ''}
    <div class="card pad stack"><div class="row between"><h2 class="h3">${t('cardio')}</h2><span class="xs muted">${t('min_per_week')}</span></div>
      ${cs.length ? `${barrasCardio(pid)}<div class="stats"><div class="stat"><b class="num">${cs.length}</b><span>${t('sessions')}</span></div><div class="stat"><b class="num">${totMin}</b><span>${t('minutes_l')}</span></div><div class="stat"><b class="num">${fmtKg(totKm)}</b><span>km</span></div></div>` : `<p class="small muted">${t('no_cardio_yet')}</p>`}
      <button class="btn ghost block" data-a="tab" data-tab="cardio">${t('open_studio')}</button></div>
    <div class="card pad"><h2 class="h3">${t('history')}</h2>${hist.map(linhaHist).join('')}</div>
  </section>`;
}
