/* ---------- muscle map ----------
   A schematic body, front and back, with the muscles each exercise trains:
   the main ones in strong colour, the helpers in light colour. Drawn by the app itself. */
const MUSC_NOMES = {
  peito: ['Chest', 'Peito', 'Pecho'], delt_f: ['Front shoulders', 'Ombro (frente)', 'Hombro frontal'], delt_l: ['Side shoulders', 'Ombro (lateral)', 'Hombro lateral'],
  delt_r: ['Rear shoulders', 'Ombro (posterior)', 'Hombro posterior'], biceps: ['Biceps', 'Bíceps', 'Bíceps'], triceps: ['Triceps', 'Tríceps', 'Tríceps'],
  antebraco: ['Forearms', 'Antebraço', 'Antebrazo'], abs: ['Abs', 'Abdômen', 'Abdomen'], obliquos: ['Obliques', 'Oblíquos', 'Oblicuos'], trapezio: ['Traps', 'Trapézio', 'Trapecio'],
  dorsal: ['Lats', 'Dorsal (latíssimo)', 'Dorsal ancho'], costas_meio: ['Mid back', 'Meio das costas', 'Espalda media'], lombar: ['Lower back', 'Lombar', 'Zona lumbar'],
  gluteo: ['Glutes', 'Glúteos', 'Glúteos'], gluteo_med: ['Side glutes', 'Glúteo médio', 'Glúteo medio'], quadriceps: ['Quads', 'Quadríceps', 'Cuádriceps'],
  posteriores: ['Hamstrings', 'Posteriores de coxa', 'Isquiotibiales'], adutores: ['Adductors', 'Adutores', 'Aductores'], panturrilha: ['Calves', 'Panturrilhas', 'Gemelos'],
};
const PEITO_A = [['peito'], ['delt_f', 'triceps']], PEITO_I = [['peito', 'delt_f'], ['triceps']], VOO = [['peito'], ['delt_f']];
const PUXA = [['dorsal'], ['biceps', 'costas_meio', 'antebraco']], REMA = [['costas_meio', 'dorsal'], ['delt_r', 'biceps']];
const DESENV = [['delt_f', 'delt_l'], ['triceps', 'trapezio']], ROSCA = [['biceps'], ['antebraco']], TRI = [['triceps'], []];
const AGACHA = [['quadriceps', 'gluteo'], ['adutores', 'posteriores']], UNI = [['quadriceps', 'gluteo'], ['adutores', 'gluteo_med']];
const PONTE = [['gluteo'], ['posteriores', 'quadriceps']], COICE = [['gluteo'], ['posteriores']], PANT = [['panturrilha'], []];
const MUSC_EX = {
  supino_reto_barra: PEITO_A, supino_reto_halteres: PEITO_A, supino_reto_smith: PEITO_A, supino_maquina: PEITO_A,
  supino_inclinado_barra: PEITO_I, supino_inclinado_halteres: PEITO_I, supino_inclinado_smith: PEITO_I,
  crucifixo_halteres: VOO, crossover: VOO, voador: VOO, flexao: [['peito'], ['delt_f', 'triceps', 'abs']], mergulho: [['peito', 'triceps'], ['delt_f']],
  puxada_frente: [['dorsal'], ['biceps', 'costas_meio', 'delt_r', 'antebraco']], puxada_neutra: PUXA, puxada_unilateral: PUXA, barra_graviton: PUXA,
  barra_fixa: [['dorsal'], ['biceps', 'costas_meio', 'antebraco', 'abs']], remada_curvada: [['costas_meio', 'dorsal'], ['delt_r', 'biceps', 'lombar', 'trapezio']],
  serrote: [['dorsal', 'costas_meio'], ['delt_r', 'biceps']], remada_apoiada: [['costas_meio', 'dorsal'], ['delt_r', 'biceps', 'trapezio']],
  remada_baixa: REMA, remada_maquina: REMA, remada_cavalinho: [['costas_meio', 'dorsal'], ['biceps', 'lombar', 'delt_r']], pulldown_bracos: [['dorsal'], ['triceps', 'abs']],
  desenv_halteres: DESENV, desenv_barra: [['delt_f', 'delt_l'], ['triceps', 'trapezio', 'abs']], desenv_smith: DESENV, desenv_maquina: DESENV,
  elev_lateral: [['delt_l'], ['trapezio']], elev_lateral_polia: [['delt_l'], ['trapezio']], elev_lateral_maquina: [['delt_l'], []],
  crucifixo_inverso: [['delt_r'], ['costas_meio', 'trapezio']], crucifixo_inverso_h: [['delt_r'], ['costas_meio', 'trapezio']], face_pull: [['delt_r'], ['costas_meio', 'trapezio']],
  rosca_barra: ROSCA, rosca_alternada: ROSCA, rosca_martelo: [['biceps', 'antebraco'], []], rosca_inclinada: ROSCA, rosca_scott: ROSCA, rosca_polia: ROSCA, rosca_bayesian: ROSCA,
  triceps_corda: TRI, triceps_barra_polia: TRI, triceps_overhead: TRI, triceps_frances: TRI, triceps_testa: TRI, supino_fechado: [['triceps', 'peito'], ['delt_f']],
  agachamento: [['quadriceps', 'gluteo'], ['adutores', 'posteriores', 'lombar', 'abs']], agachamento_smith: AGACHA, hack: [['quadriceps'], ['gluteo', 'adutores']], pendulo: [['quadriceps'], ['gluteo', 'adutores']],
  leg_press: AGACHA, leg_horizontal: AGACHA, bulgaro: UNI, afundo: UNI, goblet: [['quadriceps', 'gluteo'], ['adutores', 'abs']], extensora: [['quadriceps'], []],
  step_up: [['quadriceps', 'gluteo'], ['gluteo_med', 'panturrilha']],
  stiff: [['posteriores', 'gluteo'], ['lombar', 'adutores', 'antebraco']], stiff_unilateral: [['posteriores', 'gluteo'], ['gluteo_med', 'lombar']],
  terra: [['gluteo', 'posteriores', 'lombar'], ['quadriceps', 'trapezio', 'antebraco', 'dorsal']], mesa_flexora: [['posteriores'], ['panturrilha']], cadeira_flexora: [['posteriores'], ['panturrilha']],
  hiperextensao: [['lombar', 'gluteo'], ['posteriores']],
  hip_thrust: PONTE, hip_thrust_smith: PONTE, hip_thrust_maq: PONTE, ponte_gluteo: PONTE, coice_polia: COICE, gluteo_maquina: COICE, coice_caneleira: COICE,
  abdutora: [['gluteo_med'], ['gluteo']], abducao_elastico: [['gluteo_med'], ['gluteo']], adutora: [['adutores'], []], agach_sumo: [['gluteo', 'adutores', 'quadriceps'], ['posteriores']],
  pant_pe: PANT, pant_sentado: PANT, pant_leg: PANT, pant_smith: PANT, pant_unilateral: PANT,
  prancha: [['abs'], ['obliquos', 'delt_f']], prancha_lateral: [['obliquos'], ['abs', 'gluteo_med']], abd_polia: [['abs'], ['obliquos']], elev_pernas: [['abs'], ['obliquos', 'antebraco']],
  abd_supra: [['abs'], []], elev_pernas_solo: [['abs'], []], pallof: [['obliquos', 'abs'], []],
};
/* home versions */
Object.assign(MUSC_EX, {
  flexao_inclinada: [['peito'], ['delt_f', 'triceps']], flexao_declinada: [['peito', 'delt_f'], ['triceps', 'abs']], flexao_diamante: [['triceps', 'peito'], ['delt_f']],
  flexao_pike: [['delt_f', 'delt_l'], ['triceps', 'trapezio']], supino_chao: [['peito'], ['triceps', 'delt_f']], mergulho_cadeira: [['triceps'], ['peito', 'delt_f']],
  remada_invertida: [['costas_meio', 'dorsal'], ['biceps', 'delt_r', 'abs']], remada_mochila: REMA, remada_halteres: REMA, remada_elastico: REMA, puxada_elastico: PUXA,
  barra_supinada: [['dorsal', 'biceps'], ['costas_meio', 'antebraco']], ytw: [['delt_r', 'trapezio'], ['costas_meio', 'delt_l']], superman: [['lombar'], ['gluteo', 'posteriores', 'delt_r']],
  rosca_mochila: ROSCA, rosca_elastico: ROSCA, rosca_toalha: ROSCA, face_pull_elastico: [['delt_r'], ['costas_meio', 'trapezio']], elev_lateral_elastico: [['delt_l'], ['trapezio']],
  agach_livre: AGACHA, agach_salto: [['quadriceps', 'gluteo'], ['panturrilha', 'posteriores']], agach_mochila: AGACHA, afundo_reverso: UNI,
  afundo_lateral: [['adutores', 'quadriceps', 'gluteo'], ['gluteo_med']], bulgaro_cadeira: UNI, agach_parede: [['quadriceps'], ['gluteo']], sissy: [['quadriceps'], ['abs']],
  ponte_unilateral: [['gluteo'], ['posteriores', 'gluteo_med']], stiff_corpo: [['posteriores', 'gluteo'], ['gluteo_med', 'lombar']], flexora_toalha: [['posteriores'], ['gluteo', 'panturrilha']],
  kb_swing: [['gluteo', 'posteriores'], ['lombar', 'quadriceps', 'abs', 'antebraco']], hollow: [['abs'], ['obliquos']], escalador: [['abs'], ['delt_f', 'quadriceps', 'obliquos']],
  abd_bicicleta: [['abs', 'obliquos'], []], perdigueiro: [['lombar', 'abs'], ['gluteo', 'delt_f']],
});
const MUSC_GRUPO = { peito: ['peito'], costas: ['dorsal', 'costas_meio'], ombros: ['delt_f', 'delt_l'], biceps: ['biceps'], triceps: ['triceps'], quadriceps: ['quadriceps'], posteriores: ['posteriores'], gluteos: ['gluteo'], adutores: ['adutores'], panturrilhas: ['panturrilha'], abdomen: ['abs'] };
function musculosDe(id) {
  if (MUSC_EX[id]) return MUSC_EX[id];
  const ex = exInfo(id);
  return [MUSC_GRUPO[ex.grupo] || [], []];
}
/* shapes: [muscle, view (f front / c back), svg element] around the centre line x of each figure */
function formasMusculos(f, c) {
  const el = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  const L = (dx, g) => g(f - dx) + g(f + dx), R = (dx, g) => g(c - dx) + g(c + dx);
  return [
    ['trapezio', `<path d="M${f - 6} 28 L${f - 16} 34 L${f - 6} 35 Z M${f + 6} 28 L${f + 16} 34 L${f + 6} 35 Z M${c} 25 L${c + 19} 36 L${c} 68 L${c - 19} 36 Z"/>`],
    ['peito', `<path d="M${f - 1} 38 Q${f - 12} 35 ${f - 20} 41 Q${f - 21} 52 ${f - 11} 54 Q${f - 3} 54 ${f - 1} 49 Z M${f + 1} 38 Q${f + 12} 35 ${f + 20} 41 Q${f + 21} 52 ${f + 11} 54 Q${f + 3} 54 ${f + 1} 49 Z"/>`],
    ['delt_f', L(22, x => el(x, 41, 5.5, 7))], ['delt_l', L(26.5, x => el(x, 42, 3.4, 6.5)) + R(26.5, x => el(x, 42, 3.4, 6.5))], ['delt_r', R(22, x => el(x, 41, 5.5, 7))],
    ['biceps', L(26, x => el(x, 59, 4.3, 10))], ['triceps', R(26, x => el(x, 59, 4.6, 11))], ['antebraco', L(29.5, x => el(x, 88, 3.8, 11)) + R(29.5, x => el(x, 88, 3.8, 11))],
    ['abs', `<rect x="${f - 6.5}" y="57" width="13" height="38" rx="4"/>`], ['obliquos', L(14.5, x => el(x, 76, 4, 12))],
    ['dorsal', `<path d="M${c - 6} 52 Q${c - 21} 50 ${c - 21} 62 Q${c - 17} 80 ${c - 6} 88 Z M${c + 6} 52 Q${c + 21} 50 ${c + 21} 62 Q${c + 17} 80 ${c + 6} 88 Z"/>`],
    ['costas_meio', el(c, 49, 8, 7)], ['lombar', `<rect x="${c - 5.5}" y="72" width="11" height="24" rx="4"/>`],
    ['gluteo_med', R(16.5, x => el(x, 100, 4.6, 6))], ['gluteo', R(8.5, x => el(x, 109, 8.6, 9))],
    ['quadriceps', L(10.5, x => el(x, 130, 7.5, 20))], ['adutores', L(3.8, x => el(x, 121, 2.8, 11))], ['posteriores', R(10.5, x => el(x, 135, 7, 19))],
    ['panturrilha', L(12.5, x => el(x, 171, 3.6, 11)) + R(12, x => el(x, 169, 5.6, 13))],
  ];
}
function silhueta(x) {
  const lim = (a, b, w) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke-width="${w}"/>`;
  const lados = s => lim([x + s * 24, 40], [x + s * 28, 74], 11) + lim([x + s * 28.5, 77], [x + s * 30.5, 103], 9) + `<circle cx="${x + s * 31}" cy="109" r="4.5"/>` + lim([x + s * 10, 112], [x + s * 12, 150], 16) + lim([x + s * 12, 156], [x + s * 12.5, 193], 10) + `<ellipse cx="${x + s * 13.5}" cy="199" rx="5.5" ry="3"/>`;
  return `<g class="sil"><circle cx="${x}" cy="15" r="10.5"/><rect x="${x - 5}" y="23" width="10" height="9" rx="3"/><path d="M${x - 23} 34 Q${x} 29 ${x + 23} 34 L${x + 21} 70 Q${x + 19} 92 ${x + 18} 112 L${x - 18} 112 Q${x - 19} 92 ${x - 21} 70 Z"/>${lados(-1)}${lados(1)}</g>`;
}
function musculosHTML(id) {
  const [p1, p2] = musculosDe(id);
  if (!p1.length) return '';
  const f = 55, c = 165, formas = formasMusculos(f, c);
  const cls = m => (p1.includes(m) ? 'm1' : p2.includes(m) ? 'm2' : 'm0');
  const nomes = l => l.map(m => L3(MUSC_NOMES[m])).join(', ');
  return `<div class="mapa"><svg viewBox="0 0 220 214" role="img" aria-label="${esc(t('muscles_main', { x: nomes(p1) }))}">
    ${silhueta(f)}${silhueta(c)}${formas.map(([m, s]) => `<g class="${cls(m)}">${s}</g>`).join('')}
    <text x="${f}" y="212" text-anchor="middle">${esc(t('view_front'))}</text><text x="${c}" y="212" text-anchor="middle">${esc(t('view_back'))}</text></svg>
    <p class="small"><i class="dot1"></i>${esc(t('muscles_main', { x: nomes(p1) }))}${p2.length ? `<br><i class="dot2"></i>${esc(t('muscles_help', { x: nomes(p2) }))}` : ''}</p></div>`;
}
Object.assign(STR, {
  muscles_main: ['Main: {x}', 'Principal: {x}', 'Principal: {x}'], muscles_help: ['Also working: {x}', 'Também trabalham: {x}', 'También trabajan: {x}'],
  view_front: ['Front', 'Frente', 'Frente'], view_back: ['Back', 'Costas', 'Espalda'],
});
