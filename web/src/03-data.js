/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const toInt = (v, d) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? n : d; };
const fmtKg = n => (Math.round(n * 100) / 100).toLocaleString(LOC(), { maximumFractionDigits: 2 });
const parseNum = s => { if (s == null || s === '') return null; const v = parseFloat(String(s).replace(',', '.')); return Number.isFinite(v) ? v : null; };
const pad2 = n => String(n).padStart(2, '0');
const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
const weekKey = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dayKey(d.getTime()); };
const fmtDate = ts => { try { return new Intl.DateTimeFormat(LOC(), { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(ts)); } catch { return dayKey(ts); } };
const fmtHora = ts => { try { return new Intl.DateTimeFormat(LOC(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ts)); } catch { const d = new Date(ts); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); } };
const fmtQuando = ts => { try { return new Intl.DateTimeFormat(LOC(), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ts)); } catch { return dayKey(ts) + ' ' + fmtHora(ts); } };
/* "Thu, Nov 12, 10:46–11:52": the day, and from what time to what time */
const fmtPeriodo = (ini, fim) => fmtQuando(ini) + (fim && fim - ini > 60000 && dayKey(fim) === dayKey(ini) ? '–' + fmtHora(fim) : '');
const fmtDia = d => { try { return new Intl.DateTimeFormat(LOC(), { day: 'numeric', month: 'numeric' }).format(d); } catch { return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1); } };
const fmtDur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h' + pad2(m % 60); };
const e1rm = (kg, reps) => (kg > 0 && reps > 0 ? kg * (1 + Math.min(reps, 20) / 30) : 0);

/* ---------- icons ---------- */
const SV = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  hoje: SV('<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>'),
  jornada: SV('<path d="M5 21V4M5 4h11l-2.2 3.6L16 11H5"/>'),
  plano: SV('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'),
  coach: SV('<path d="M20 14.5a3 3 0 0 1-3 3H9.5L5 20.5v-12a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3z"/><path d="M9 11h.01M12.5 11h.01M16 11h.01" stroke-width="2.6"/>'),
  evolucao: SV('<path d="M4 19.5h16M6 15l4-4.5 3.5 3L19 7"/>'),
  check: SV('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3),
  x: SV('<path d="M6 6l12 12M18 6L6 18"/>', 2.4),
  troca: SV('<path d="M5 8h13l-3.5-3.5M19 16H6l3.5 3.5"/>'),
  info: SV('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>'),
  mais: SV('<path d="M12 5v14M5 12h14"/>'),
  menos: SV('<path d="M5 12h14"/>'),
  estrela: SV('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
  som: SV('<path d="M4 9.5h4l5-4v13l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
  globo: SV('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>'),
  casa: SV('<path d="M3.5 11.5L12 4.5l8.5 7"/><path d="M6 9.8V19.5h12V9.8"/><path d="M10 19.5v-5h4v5"/>'),
};

/* ---------- vocabulary (ids are stored; labels follow the chosen language) ---------- */
const OBJETIVOS = [
  { id: 'hipertrofia', nome: ['Build muscle', 'Ganhar massa muscular', 'Ganar músculo'], desc: ['Bigger, more defined muscles', 'Músculos maiores e mais definidos', 'Músculos más grandes y definidos'] },
  { id: 'emagrecer', nome: ['Lose fat', 'Perder gordura', 'Perder grasa'], desc: ['Get leaner while keeping, or even gaining, muscle', 'Secar mantendo, ou até ganhando, músculo', 'Definir manteniendo, o incluso ganando, músculo'] },
  { id: 'forca', nome: ['Get stronger', 'Ficar mais forte', 'Ganar fuerza'], desc: ['Lift more on the main exercises', 'Levantar mais peso nos exercícios principais', 'Levantar más en los ejercicios principales'] },
  { id: 'saude', nome: ['Health and fitness', 'Saúde e condicionamento', 'Salud y condición física'], desc: ['Energy, posture and stamina every day', 'Disposição, postura e fôlego no dia a dia', 'Energía, postura y resistencia cada día'] },
];
const NIVEIS = [
  { id: 'iniciante', nome: ['Beginner', 'Iniciante', 'Principiante'], desc: ['Less than 6 months of consistent training', 'Menos de 6 meses treinando com regularidade', 'Menos de 6 meses entrenando con constancia'] },
  { id: 'intermediario', nome: ['Intermediate', 'Intermediário', 'Intermedio'], desc: ['From 6 months to about 3 years', 'De 6 meses a uns 3 anos de treino', 'De 6 meses a unos 3 años'] },
  { id: 'avancado', nome: ['Advanced', 'Avançado', 'Avanzado'], desc: ['More than 3 years of serious training', 'Mais de 3 anos treinando a sério', 'Más de 3 años entrenando en serio'] },
];
const FOCOS = [['gluteos', 'Glutes', 'Glúteos', 'Glúteos'], ['pernas', 'Legs', 'Pernas', 'Piernas'], ['costas', 'Back', 'Costas', 'Espalda'], ['peito', 'Chest', 'Peito', 'Pecho'], ['ombros', 'Shoulders', 'Ombros', 'Hombros'], ['bracos', 'Arms', 'Braços', 'Brazos'], ['abdomen', 'Abs', 'Abdômen', 'Abdomen']];
const LIMITES = [['ombro', 'Shoulder', 'Ombro', 'Hombro'], ['joelho', 'Knee', 'Joelho', 'Rodilla'], ['lombar', 'Lower back', 'Lombar', 'Zona lumbar'], ['quadril', 'Hip', 'Quadril', 'Cadera'], ['punho', 'Wrist', 'Punho', 'Muñeca'], ['cotovelo', 'Elbow', 'Cotovelo', 'Codo'], ['pescoco', 'Neck', 'Pescoço', 'Cuello']];
const SEXOS = [['f', 'Woman', 'Mulher', 'Mujer'], ['m', 'Man', 'Homem', 'Hombre'], ['', 'Prefer not to say', 'Prefiro não dizer', 'Prefiero no decirlo']];
const CARDIO_MODOS = [['esteira_inclinada', 'Treadmill walk', 'Esteira caminhando', 'Cinta caminando'], ['corrida_esteira', 'Treadmill run', 'Esteira correndo', 'Cinta corriendo'], ['bike', 'Bike', 'Bike', 'Bici'], ['eliptico', 'Elliptical', 'Elíptico', 'Elíptica'], ['escada', 'Stairs', 'Escada', 'Escaladora'], ['remo', 'Rower', 'Remo', 'Remo'], ['corda', 'Jump rope', 'Corda', 'Cuerda'], ['caminhada', 'Outdoor walk', 'Caminhada na rua', 'Caminar al aire libre'], ['corrida', 'Outdoor run', 'Corrida na rua', 'Correr al aire libre']];
const CARDIO_QUANDO = [['apos', 'After lifting', 'Depois da musculação', 'Después de las pesas'], ['separado', 'On separate days', 'Em dias separados', 'En días separados'], ['tanto', 'Either way', 'Tanto faz', 'Me da igual']];
const ESFORCOS = [[4, ['Easy', 'Leve', 'Suave'], ['Can hold a conversation', 'Dá para conversar', 'Puedes conversar']], [6, ['Moderate', 'Moderado', 'Moderado'], ['Short sentences only', 'Só frases curtas', 'Solo frases cortas']], [8, ['Hard', 'Forte', 'Fuerte'], ['Just a few words', 'Poucas palavras', 'Pocas palabras']], [9, ['Max', 'Máximo', 'Máximo'], ['No breath to talk', 'Sem fôlego para falar', 'Sin aliento para hablar']]];
const SENSACOES = [['leve', 'Easy', 'Leve', 'Suave'], ['ok', 'Just right', 'No ponto', 'Justo'], ['pesado', 'Hard', 'Pesado', 'Duro']];
const MOTIVOS = [['ocupado', 'Machine taken', 'Aparelho ocupado', 'Máquina ocupada'], ['desconforto', 'Felt discomfort', 'Senti desconforto', 'Sentí molestias'], ['naogosto', 'Don\'t like it', 'Não gosto', 'No me gusta'], ['naotem', 'Not at my gym', 'Não tem aqui', 'No está en mi gimnasio']];
const FASES = { adapt: ['Adaptation', 'Adaptação', 'Adaptación'], accum: ['Accumulation', 'Acumulação', 'Acumulación'], intens: ['Intensification', 'Intensificação', 'Intensificación'], deload: ['Deload', 'Deload', 'Descarga'] };
const label4 = (lista, id) => { const r = lista.find(x => x[0] === id); return r ? L3(r.slice(1)) : id; };
const nomeObj = id => { const o = OBJETIVOS.find(x => x.id === id); return o ? L3(o.nome) : '—'; };
const nomeNivel = id => { const o = NIVEIS.find(x => x.id === id); return o ? L3(o.nome) : '—'; };
const nomeFase = f => L3(FASES[f] || FASES.accum);
const nomeSens = s => label4(SENSACOES, s) || s;
const GRUPOS = { peito: ['Chest', 'Peito', 'Pecho'], costas: ['Back', 'Costas', 'Espalda'], ombros: ['Shoulders', 'Ombros', 'Hombros'], biceps: ['Biceps', 'Bíceps', 'Bíceps'], triceps: ['Triceps', 'Tríceps', 'Tríceps'], quadriceps: ['Quads', 'Quadríceps', 'Cuádriceps'], posteriores: ['Hamstrings', 'Posteriores de coxa', 'Isquiotibiales'], gluteos: ['Glutes', 'Glúteos', 'Glúteos'], adutores: ['Adductors', 'Adutores', 'Aductores'], panturrilhas: ['Calves', 'Panturrilhas', 'Gemelos'], abdomen: ['Abs', 'Abdômen', 'Abdomen'], cardio: ['Cardio', 'Cardio', 'Cardio'], outro: ['Other', 'Outro', 'Otro'] };
const nomeGrupo = g => L3(GRUPOS[g] || GRUPOS.outro);
const RELACIONADOS = { quadriceps: ['gluteos'], gluteos: ['quadriceps', 'posteriores'], posteriores: ['gluteos'], adutores: ['gluteos'], peito: ['triceps'], costas: ['biceps'], ombros: ['peito'], biceps: ['costas'], triceps: ['peito'], panturrilhas: [], abdomen: [], cardio: [], outro: [] };
const CORES = ['var(--plate-blue)', 'var(--plate-red)', 'var(--plate-green)', 'var(--plate-yellow)'];

/* ---------- gym equipment ---------- */
const EQUIP_GRUPOS = [
  [['Free weights', 'Pesos livres', 'Peso libre'], [['halteres', 'Dumbbells', 'Halteres', 'Mancuernas'], ['barra', 'Olympic barbell and plates', 'Barra olímpica e anilhas', 'Barra olímpica y discos'], ['barra_w', 'EZ bar', 'Barra W', 'Barra Z'], ['kettlebell', 'Kettlebell', 'Kettlebell', 'Kettlebell'], ['banco', 'Flat bench', 'Banco reto', 'Banco plano'], ['banco_inclinavel', 'Adjustable bench', 'Banco ajustável (inclina)', 'Banco ajustable'], ['banco_supino', 'Bench press stations', 'Bancos de supino com suporte', 'Bancos de press con soporte'], ['rack', 'Squat rack / power cage', 'Gaiola / suporte de agachamento', 'Rack o jaula de sentadillas'], ['smith', 'Smith machine', 'Smith', 'Máquina Smith'], ['barra_fixa', 'Pull-up bar', 'Barra fixa', 'Barra de dominadas'], ['paralelas', 'Dip bars', 'Paralelas', 'Paralelas']]],
  [['Leg machines', 'Máquinas de perna', 'Máquinas de pierna'], [['leg_press', '45° leg press', 'Leg press 45°', 'Prensa 45°'], ['leg_horizontal', 'Horizontal leg press', 'Leg press horizontal', 'Prensa horizontal'], ['hack', 'Hack squat', 'Hack', 'Hack squat'], ['pendulo', 'Pendulum squat', 'Agachamento pêndulo', 'Sentadilla péndulo'], ['extensora', 'Leg extension', 'Cadeira extensora', 'Extensión de cuádriceps'], ['flexora_deitada', 'Lying leg curl', 'Mesa flexora', 'Curl femoral tumbado'], ['flexora_sentada', 'Seated leg curl', 'Cadeira flexora (sentada)', 'Curl femoral sentado'], ['adutora', 'Hip adduction', 'Cadeira adutora', 'Aductores'], ['abdutora', 'Hip abduction', 'Cadeira abdutora', 'Abductores'], ['gluteo_maquina', 'Glute kickback machine', 'Máquina de glúteo (coice)', 'Máquina de glúteo'], ['hip_thrust_maq', 'Hip thrust machine', 'Máquina de elevação pélvica', 'Máquina de hip thrust'], ['panturrilha_pe', 'Standing calf machine', 'Panturrilha em pé (máquina)', 'Gemelos de pie (máquina)'], ['panturrilha_sentado', 'Seated calf machine', 'Panturrilha sentado (máquina)', 'Gemelos sentado (máquina)']]],
  [['Machines and cables', 'Máquinas e polias', 'Máquinas y poleas'], [['polia', 'Cable station / crossover', 'Polia / crossover', 'Poleas / cruce'], ['puxador', 'Lat pulldown', 'Puxador (pulley alto)', 'Jalón (polea alta)'], ['remada_baixa', 'Seated cable row', 'Remada baixa (cabo)', 'Remo sentado en polea'], ['remada_maquina', 'Machine row', 'Remada articulada', 'Remo en máquina'], ['remada_cavalinho', 'T-bar row', 'Remada cavalinho', 'Remo en barra T'], ['supino_maquina', 'Chest press machine', 'Supino máquina', 'Press de pecho en máquina'], ['voador', 'Pec deck', 'Voador (peck deck)', 'Contractor de pecho'], ['desenvolvimento_maquina', 'Shoulder press machine', 'Desenvolvimento máquina', 'Press de hombros en máquina'], ['elevacao_lateral_maquina', 'Lateral raise machine', 'Elevação lateral máquina', 'Elevación lateral en máquina'], ['graviton', 'Assisted pull-up / dip machine', 'Graviton', 'Máquina de dominadas asistidas'], ['scott', 'Preacher bench', 'Banco Scott', 'Banco Scott'], ['banco_romano', '45° back extension bench', 'Banco romano (hiperextensão)', 'Banco romano']]],
  [['Cardio', 'Cardio', 'Cardio'], [['esteira', 'Treadmill', 'Esteira', 'Cinta de correr'], ['bike', 'Stationary bike', 'Bicicleta', 'Bicicleta estática'], ['eliptico', 'Elliptical', 'Elíptico', 'Elíptica'], ['escada', 'Stair climber', 'Escada', 'Escaladora'], ['remo_ergometro', 'Rowing machine', 'Remo', 'Remo'], ['corda_pular', 'Jump rope', 'Corda de pular', 'Cuerda para saltar']]],
  [['Accessories', 'Acessórios', 'Accesorios'], [['elastico', 'Resistance / mini bands', 'Elásticos / mini band', 'Bandas elásticas'], ['caneleira', 'Ankle weights', 'Caneleiras', 'Tobilleras con peso']]],
];
const EQUIP_NOMES = Object.fromEntries(EQUIP_GRUPOS.flatMap(g => g[1].map(r => [r[0], r.slice(1)])));
const nomeEquip = id => (EQUIP_NOMES[id] ? L3(EQUIP_NOMES[id]) : id);
const IMPLICA = { banco_inclinavel: ['banco'] };

/* ---------- exercise library: id, [en, pt, es], group, equipment (| = or, + = and), C/I, load type, step
   load type: b barbell · h dumbbell · m machine · p cable · c bodyweight · s seconds · n minutes */
const EX_RAW = [
  ['supino_reto_barra', ['Barbell bench press', 'Supino reto com barra', 'Press de banca con barra'], 'peito', 'barra+banco_supino|barra+rack+banco', 'C', 'b'],
  ['supino_inclinado_barra', ['Incline barbell bench press', 'Supino inclinado com barra', 'Press inclinado con barra'], 'peito', 'barra+banco_supino|barra+rack+banco_inclinavel', 'C', 'b'],
  ['supino_reto_halteres', ['Dumbbell bench press', 'Supino reto com halteres', 'Press de banca con mancuernas'], 'peito', 'halteres+banco', 'C', 'h'],
  ['supino_inclinado_halteres', ['Incline dumbbell press', 'Supino inclinado com halteres', 'Press inclinado con mancuernas'], 'peito', 'halteres+banco_inclinavel', 'C', 'h'],
  ['supino_reto_smith', ['Smith machine bench press', 'Supino reto no Smith', 'Press de banca en Smith'], 'peito', 'smith+banco', 'C', 'b'],
  ['supino_inclinado_smith', ['Incline Smith machine press', 'Supino inclinado no Smith', 'Press inclinado en Smith'], 'peito', 'smith+banco_inclinavel', 'C', 'b'],
  ['supino_maquina', ['Machine chest press', 'Supino máquina', 'Press de pecho en máquina'], 'peito', 'supino_maquina', 'C', 'm'],
  ['crucifixo_halteres', ['Dumbbell fly', 'Crucifixo com halteres', 'Aperturas con mancuernas'], 'peito', 'halteres+banco', 'I', 'h'],
  ['crossover', ['Cable crossover', 'Crossover na polia', 'Cruce de poleas'], 'peito', 'polia', 'I', 'p'],
  ['voador', ['Pec deck', 'Voador (peck deck)', 'Contractor de pecho'], 'peito', 'voador', 'I', 'm'],
  ['flexao', ['Push-up', 'Flexão de braço', 'Flexiones'], 'peito', '', 'C', 'c'],
  ['mergulho', ['Dips', 'Mergulho nas paralelas', 'Fondos en paralelas'], 'peito', 'paralelas|graviton', 'C', 'c'],
  ['puxada_frente', ['Lat pulldown', 'Puxada frontal', 'Jalón al pecho'], 'costas', 'puxador|polia', 'C', 'm'],
  ['puxada_neutra', ['Close-grip pulldown (V-bar)', 'Puxada com triângulo', 'Jalón con agarre neutro'], 'costas', 'puxador|polia', 'C', 'm'],
  ['puxada_unilateral', ['Single-arm cable pulldown', 'Puxada unilateral na polia', 'Jalón unilateral en polea'], 'costas', 'polia', 'C', 'p'],
  ['barra_fixa', ['Pull-up', 'Barra fixa', 'Dominadas'], 'costas', 'barra_fixa', 'C', 'c'],
  ['barra_graviton', ['Assisted pull-up machine', 'Barra no graviton (assistida)', 'Dominadas asistidas en máquina'], 'costas', 'graviton', 'C', 'm'],
  ['remada_curvada', ['Barbell bent-over row', 'Remada curvada com barra', 'Remo con barra inclinado'], 'costas', 'barra', 'C', 'b'],
  ['serrote', ['Single-arm dumbbell row', 'Remada unilateral com halter (serrote)', 'Remo con mancuerna a una mano'], 'costas', 'halteres+banco', 'C', 'h'],
  ['remada_apoiada', ['Chest-supported dumbbell row', 'Remada com halteres apoiada no banco', 'Remo con mancuernas apoyado en banco'], 'costas', 'halteres+banco_inclinavel', 'C', 'h'],
  ['remada_baixa', ['Seated cable row', 'Remada baixa no cabo', 'Remo sentado en polea'], 'costas', 'remada_baixa|polia', 'C', 'm'],
  ['remada_maquina', ['Machine row', 'Remada articulada', 'Remo en máquina'], 'costas', 'remada_maquina', 'C', 'm'],
  ['remada_cavalinho', ['T-bar row', 'Remada cavalinho', 'Remo en barra T'], 'costas', 'remada_cavalinho|barra', 'C', 'b'],
  ['pulldown_bracos', ['Straight-arm pulldown', 'Pulldown com braços estendidos', 'Jalón con brazos rectos'], 'costas', 'polia|puxador', 'I', 'p'],
  ['desenv_halteres', ['Dumbbell shoulder press', 'Desenvolvimento com halteres', 'Press de hombros con mancuernas'], 'ombros', 'halteres', 'C', 'h'],
  ['desenv_barra', ['Standing barbell overhead press', 'Desenvolvimento com barra em pé', 'Press militar con barra de pie'], 'ombros', 'barra', 'C', 'b'],
  ['desenv_smith', ['Smith machine shoulder press', 'Desenvolvimento no Smith', 'Press de hombros en Smith'], 'ombros', 'smith+banco_inclinavel|smith+banco', 'C', 'b'],
  ['desenv_maquina', ['Machine shoulder press', 'Desenvolvimento máquina', 'Press de hombros en máquina'], 'ombros', 'desenvolvimento_maquina', 'C', 'm'],
  ['elev_lateral', ['Dumbbell lateral raise', 'Elevação lateral com halteres', 'Elevaciones laterales con mancuernas'], 'ombros', 'halteres', 'I', 'h'],
  ['elev_lateral_polia', ['Cable lateral raise', 'Elevação lateral na polia', 'Elevación lateral en polea'], 'ombros', 'polia', 'I', 'p'],
  ['elev_lateral_maquina', ['Machine lateral raise', 'Elevação lateral máquina', 'Elevación lateral en máquina'], 'ombros', 'elevacao_lateral_maquina', 'I', 'm'],
  ['crucifixo_inverso', ['Reverse pec deck', 'Crucifixo inverso no voador', 'Pájaros en máquina'], 'ombros', 'voador', 'I', 'm'],
  ['crucifixo_inverso_h', ['Dumbbell rear delt fly', 'Crucifixo inverso com halteres', 'Pájaros con mancuernas'], 'ombros', 'halteres', 'I', 'h'],
  ['face_pull', ['Cable face pull', 'Face pull na polia', 'Face pull en polea'], 'ombros', 'polia', 'I', 'p'],
  ['rosca_barra', ['Barbell curl', 'Rosca direta com barra', 'Curl con barra'], 'biceps', 'barra|barra_w', 'I', 'b'],
  ['rosca_alternada', ['Alternating dumbbell curl', 'Rosca alternada com halteres', 'Curl alterno con mancuernas'], 'biceps', 'halteres', 'I', 'h'],
  ['rosca_martelo', ['Hammer curl', 'Rosca martelo', 'Curl martillo'], 'biceps', 'halteres', 'I', 'h'],
  ['rosca_inclinada', ['Incline dumbbell curl', 'Rosca no banco inclinado', 'Curl inclinado con mancuernas'], 'biceps', 'halteres+banco_inclinavel', 'I', 'h'],
  ['rosca_scott', ['Preacher curl', 'Rosca Scott', 'Curl predicador'], 'biceps', 'scott+barra_w|scott+halteres', 'I', 'b'],
  ['rosca_polia', ['Cable curl', 'Rosca na polia', 'Curl en polea'], 'biceps', 'polia', 'I', 'p'],
  ['rosca_bayesian', ['Bayesian cable curl', 'Rosca na polia de costas (bayesian)', 'Curl bayesiano en polea'], 'biceps', 'polia', 'I', 'p'],
  ['triceps_corda', ['Rope pushdown', 'Tríceps na corda', 'Extensión de tríceps con cuerda'], 'triceps', 'polia|puxador', 'I', 'p'],
  ['triceps_barra_polia', ['Bar pushdown', 'Tríceps na polia com barra', 'Extensión de tríceps en polea con barra'], 'triceps', 'polia|puxador', 'I', 'p'],
  ['triceps_overhead', ['Overhead cable triceps extension', 'Tríceps na polia acima da cabeça', 'Extensión de tríceps sobre la cabeza en polea'], 'triceps', 'polia', 'I', 'p'],
  ['triceps_frances', ['Overhead dumbbell triceps extension', 'Tríceps francês com halter', 'Extensión francesa con mancuerna'], 'triceps', 'halteres', 'I', 'h'],
  ['triceps_testa', ['Skull crusher', 'Tríceps testa', 'Press francés'], 'triceps', 'barra_w+banco|halteres+banco', 'I', 'b'],
  ['supino_fechado', ['Close-grip bench press', 'Supino com pegada fechada', 'Press de banca agarre cerrado'], 'triceps', 'barra+banco_supino|smith+banco', 'C', 'b'],
  ['agachamento', ['Barbell back squat', 'Agachamento livre com barra', 'Sentadilla con barra'], 'quadriceps', 'barra+rack', 'C', 'b'],
  ['agachamento_smith', ['Smith machine squat', 'Agachamento no Smith', 'Sentadilla en Smith'], 'quadriceps', 'smith', 'C', 'b'],
  ['hack', ['Hack squat', 'Agachamento no hack', 'Sentadilla hack'], 'quadriceps', 'hack', 'C', 'm', 10],
  ['pendulo', ['Pendulum squat', 'Agachamento pêndulo', 'Sentadilla péndulo'], 'quadriceps', 'pendulo', 'C', 'm', 10],
  ['leg_press', ['45° leg press', 'Leg press 45°', 'Prensa de piernas 45°'], 'quadriceps', 'leg_press', 'C', 'm', 10],
  ['leg_horizontal', ['Horizontal leg press', 'Leg press horizontal', 'Prensa horizontal'], 'quadriceps', 'leg_horizontal', 'C', 'm'],
  ['bulgaro', ['Bulgarian split squat', 'Agachamento búlgaro', 'Sentadilla búlgara'], 'quadriceps', 'halteres+banco|smith+banco|banco', 'C', 'h'],
  ['afundo', ['Lunge', 'Afundo (passada)', 'Zancadas'], 'quadriceps', 'halteres|smith|', 'C', 'h'],
  ['goblet', ['Goblet squat', 'Agachamento goblet', 'Sentadilla goblet'], 'quadriceps', 'halteres|kettlebell', 'C', 'h'],
  ['extensora', ['Leg extension', 'Cadeira extensora', 'Extensión de cuádriceps'], 'quadriceps', 'extensora', 'I', 'm'],
  ['step_up', ['Step-up', 'Subida no banco (step-up)', 'Subidas al banco'], 'quadriceps', 'halteres+banco|banco', 'C', 'h'],
  ['stiff', ['Romanian deadlift', 'Stiff (terra romeno)', 'Peso muerto rumano'], 'posteriores', 'barra|halteres|smith', 'C', 'b'],
  ['stiff_unilateral', ['Single-leg Romanian deadlift', 'Stiff unilateral com halter', 'Peso muerto rumano a una pierna'], 'posteriores', 'halteres', 'C', 'h'],
  ['terra', ['Deadlift', 'Levantamento terra', 'Peso muerto'], 'posteriores', 'barra', 'C', 'b'],
  ['mesa_flexora', ['Lying leg curl', 'Mesa flexora', 'Curl femoral tumbado'], 'posteriores', 'flexora_deitada', 'I', 'm'],
  ['cadeira_flexora', ['Seated leg curl', 'Cadeira flexora', 'Curl femoral sentado'], 'posteriores', 'flexora_sentada', 'I', 'm'],
  ['hiperextensao', ['45° back extension', 'Hiperextensão no banco romano', 'Hiperextensiones en banco romano'], 'posteriores', 'banco_romano', 'C', 'c'],
  ['hip_thrust', ['Barbell hip thrust', 'Elevação pélvica com barra', 'Hip thrust con barra'], 'gluteos', 'barra+banco', 'C', 'b'],
  ['hip_thrust_smith', ['Smith machine hip thrust', 'Elevação pélvica no Smith', 'Hip thrust en Smith'], 'gluteos', 'smith+banco', 'C', 'b'],
  ['hip_thrust_maq', ['Machine hip thrust', 'Elevação pélvica na máquina', 'Hip thrust en máquina'], 'gluteos', 'hip_thrust_maq', 'C', 'm'],
  ['coice_polia', ['Cable glute kickback', 'Coice na polia', 'Patada de glúteo en polea'], 'gluteos', 'polia', 'I', 'p'],
  ['gluteo_maquina', ['Glute kickback machine', 'Glúteo na máquina (coice)', 'Patada de glúteo en máquina'], 'gluteos', 'gluteo_maquina', 'I', 'm'],
  ['abdutora', ['Hip abduction machine', 'Cadeira abdutora', 'Máquina de abductores'], 'gluteos', 'abdutora', 'I', 'm'],
  ['ponte_gluteo', ['Glute bridge', 'Ponte de glúteo', 'Puente de glúteo'], 'gluteos', '', 'I', 'c'],
  ['coice_caneleira', ['Ankle-weight kickback', 'Coice com caneleira', 'Patada con tobilleras'], 'gluteos', 'caneleira', 'I', 'h'],
  ['agach_sumo', ['Dumbbell sumo squat', 'Agachamento sumô com halter', 'Sentadilla sumo con mancuerna'], 'gluteos', 'halteres|kettlebell', 'C', 'h'],
  ['abducao_elastico', ['Mini band abduction', 'Abdução com mini band', 'Abducción con mini banda'], 'gluteos', 'elastico', 'I', 'c'],
  ['adutora', ['Hip adduction machine', 'Cadeira adutora', 'Máquina de aductores'], 'adutores', 'adutora', 'I', 'm'],
  ['pant_pe', ['Standing calf raise machine', 'Panturrilha em pé na máquina', 'Elevación de talones de pie en máquina'], 'panturrilhas', 'panturrilha_pe', 'I', 'm'],
  ['pant_sentado', ['Seated calf raise', 'Panturrilha sentado', 'Elevación de talones sentado'], 'panturrilhas', 'panturrilha_sentado', 'I', 'm'],
  ['pant_leg', ['Leg press calf raise', 'Panturrilha no leg press', 'Elevación de talones en prensa'], 'panturrilhas', 'leg_press|leg_horizontal', 'I', 'm'],
  ['pant_smith', ['Smith machine calf raise', 'Panturrilha no Smith', 'Elevación de talones en Smith'], 'panturrilhas', 'smith', 'I', 'b'],
  ['pant_unilateral', ['Single-leg calf raise on a step', 'Panturrilha unilateral no degrau', 'Elevación de talón a una pierna en escalón'], 'panturrilhas', '', 'I', 'c'],
  ['prancha', ['Plank', 'Prancha', 'Plancha'], 'abdomen', '', 'I', 's'],
  ['prancha_lateral', ['Side plank', 'Prancha lateral', 'Plancha lateral'], 'abdomen', '', 'I', 's'],
  ['abd_polia', ['Kneeling cable crunch', 'Abdominal ajoelhado na polia', 'Crunch en polea de rodillas'], 'abdomen', 'polia', 'I', 'p'],
  ['elev_pernas', ['Hanging leg raise', 'Elevação de pernas suspenso', 'Elevación de piernas colgado'], 'abdomen', 'barra_fixa|paralelas|graviton', 'I', 'c'],
  ['abd_supra', ['Crunch', 'Abdominal supra', 'Crunch abdominal'], 'abdomen', '', 'I', 'c'],
  ['elev_pernas_solo', ['Lying leg raise', 'Elevação de pernas deitado', 'Elevación de piernas tumbado'], 'abdomen', '', 'I', 'c'],
  ['pallof', ['Pallof press', 'Pallof press', 'Press Pallof'], 'abdomen', 'polia|elastico', 'I', 'p'],
  ['esteira_inclinada', ['Incline treadmill walk', 'Caminhada inclinada na esteira', 'Caminata inclinada en cinta'], 'cardio', 'esteira', 'I', 'n'],
  ['bike', ['Stationary bike', 'Bicicleta ergométrica', 'Bicicleta estática'], 'cardio', 'bike', 'I', 'n'],
  ['eliptico', ['Elliptical', 'Elíptico', 'Elíptica'], 'cardio', 'eliptico', 'I', 'n'],
  ['escada', ['Stair climber', 'Simulador de escada', 'Escaladora'], 'cardio', 'escada', 'I', 'n'],
  ['remo', ['Rowing machine', 'Remo ergômetro', 'Remo ergómetro'], 'cardio', 'remo_ergometro', 'I', 'n'],
  ['corda', ['Jump rope', 'Pular corda', 'Saltar la cuerda'], 'cardio', 'corda_pular', 'I', 'n'],
  ['corrida_esteira', ['Treadmill run', 'Corrida na esteira', 'Carrera en cinta'], 'cardio', 'esteira', 'I', 'n'],
  ['caminhada', ['Outdoor walk', 'Caminhada ao ar livre', 'Caminata al aire libre'], 'cardio', '', 'I', 'n'],
  ['corrida', ['Outdoor run', 'Corrida ao ar livre', 'Carrera al aire libre'], 'cardio', '', 'I', 'n'],
  /* home versions (body weight, a chair, a table, a backpack, bands): used only when a workout is adapted to train at home */
  ['flexao_inclinada', ['Incline push-up (hands on a chair or table)', 'Flexão inclinada (mãos na cadeira ou mesa)', 'Flexiones inclinadas (manos en una silla o mesa)'], 'peito', 'cadeira|mesa', 'C', 'c'],
  ['flexao_declinada', ['Decline push-up (feet on a chair)', 'Flexão declinada (pés na cadeira)', 'Flexiones declinadas (pies en una silla)'], 'peito', 'cadeira', 'C', 'c'],
  ['flexao_diamante', ['Diamond push-up', 'Flexão diamante', 'Flexiones diamante'], 'triceps', '', 'C', 'c'],
  ['flexao_pike', ['Pike push-up', 'Flexão pike (ombros)', 'Flexiones pike (hombros)'], 'ombros', '', 'C', 'c'],
  ['supino_chao', ['Dumbbell floor press', 'Supino no chão com halteres', 'Press en el suelo con mancuernas'], 'peito', 'halteres', 'C', 'h'],
  ['mergulho_cadeira', ['Chair dips', 'Mergulho na cadeira', 'Fondos en una silla'], 'triceps', 'cadeira', 'C', 'c'],
  ['remada_invertida', ['Inverted row under a table', 'Remada invertida embaixo da mesa', 'Remo invertido bajo una mesa'], 'costas', 'mesa', 'C', 'c'],
  ['remada_mochila', ['Bent-over backpack row', 'Remada curvada com mochila', 'Remo inclinado con mochila'], 'costas', 'mochila', 'C', 'h'],
  ['remada_halteres', ['Bent-over dumbbell row', 'Remada curvada com halteres', 'Remo inclinado con mancuernas'], 'costas', 'halteres', 'C', 'h'],
  ['remada_elastico', ['Band row', 'Remada com elástico', 'Remo con banda elástica'], 'costas', 'elastico', 'C', 'c'],
  ['puxada_elastico', ['Band lat pulldown', 'Puxada com elástico', 'Jalón con banda elástica'], 'costas', 'elastico', 'C', 'c'],
  ['barra_supinada', ['Chin-up (palms toward you)', 'Barra fixa supinada', 'Dominadas supinas'], 'costas', 'barra_fixa', 'C', 'c'],
  ['ytw', ['Prone Y-T-W raise', 'Elevação Y-T-W deitado', 'Elevaciones Y-T-W tumbado'], 'ombros', '', 'I', 'c'],
  ['superman', ['Superman back extension', 'Super-homem (extensão lombar no chão)', 'Superman (extensión lumbar en el suelo)'], 'posteriores', '', 'I', 'c'],
  ['rosca_mochila', ['Backpack curl', 'Rosca com mochila', 'Curl con mochila'], 'biceps', 'mochila', 'I', 'h'],
  ['rosca_elastico', ['Band curl', 'Rosca com elástico', 'Curl con banda elástica'], 'biceps', 'elastico', 'I', 'c'],
  ['rosca_toalha', ['Towel curl against your own foot', 'Rosca com toalha (contra o próprio pé)', 'Curl con toalla contra tu propio pie'], 'biceps', '', 'I', 'c'],
  ['face_pull_elastico', ['Band face pull', 'Face pull com elástico', 'Face pull con banda elástica'], 'ombros', 'elastico', 'I', 'c'],
  ['elev_lateral_elastico', ['Band lateral raise', 'Elevação lateral com elástico', 'Elevación lateral con banda'], 'ombros', 'elastico', 'I', 'c'],
  ['agach_livre', ['Bodyweight squat', 'Agachamento livre (sem peso)', 'Sentadilla sin peso'], 'quadriceps', '', 'C', 'c'],
  ['agach_salto', ['Jump squat', 'Agachamento com salto', 'Sentadilla con salto'], 'quadriceps', '', 'C', 'c'],
  ['agach_mochila', ['Backpack squat', 'Agachamento com mochila', 'Sentadilla con mochila'], 'quadriceps', 'mochila', 'C', 'h'],
  ['afundo_reverso', ['Reverse lunge', 'Afundo para trás', 'Zancada hacia atrás'], 'quadriceps', '', 'C', 'c'],
  ['afundo_lateral', ['Lateral lunge', 'Afundo lateral', 'Zancada lateral'], 'adutores', '', 'C', 'c'],
  ['bulgaro_cadeira', ['Bulgarian split squat (rear foot on a chair)', 'Búlgaro com o pé de trás na cadeira', 'Sentadilla búlgara (pie trasero en una silla)'], 'quadriceps', 'cadeira', 'C', 'c'],
  ['agach_parede', ['Wall sit', 'Cadeirinha na parede', 'Sentadilla isométrica en la pared'], 'quadriceps', '', 'I', 's'],
  ['sissy', ['Assisted sissy squat', 'Sissy squat com apoio', 'Sentadilla sissy asistida'], 'quadriceps', '', 'I', 'c'],
  ['ponte_unilateral', ['Single-leg glute bridge', 'Ponte de glúteo com uma perna', 'Puente de glúteo a una pierna'], 'gluteos', '', 'I', 'c'],
  ['stiff_corpo', ['Single-leg Romanian deadlift (no weight)', 'Stiff unilateral sem peso', 'Peso muerto rumano a una pierna sin peso'], 'posteriores', '', 'C', 'c'],
  ['flexora_toalha', ['Sliding leg curl on a towel', 'Flexora deslizando na toalha', 'Curl femoral deslizando sobre una toalla'], 'posteriores', '', 'I', 'c'],
  ['kb_swing', ['Kettlebell swing', 'Swing com kettlebell', 'Swing con kettlebell'], 'gluteos', 'kettlebell', 'C', 'h'],
  ['hollow', ['Hollow body hold', 'Canoa (hollow hold)', 'Hollow hold'], 'abdomen', '', 'I', 's'],
  ['escalador', ['Mountain climbers', 'Escalador', 'Escaladores'], 'abdomen', '', 'I', 's'],
  ['abd_bicicleta', ['Bicycle crunch', 'Abdominal bicicleta', 'Crunch bicicleta'], 'abdomen', '', 'I', 'c'],
  ['perdigueiro', ['Bird dog', 'Perdigueiro', 'Bird dog'], 'abdomen', '', 'I', 'c'],
];
/* the home versions above stay out of gym plans and gym swaps */
const CASA_IDS = new Set(['flexao_inclinada', 'flexao_declinada', 'flexao_diamante', 'flexao_pike', 'supino_chao', 'mergulho_cadeira', 'remada_invertida', 'remada_mochila', 'remada_halteres',
  'remada_elastico', 'puxada_elastico', 'barra_supinada', 'ytw', 'superman', 'rosca_mochila', 'rosca_elastico', 'rosca_toalha', 'face_pull_elastico', 'elev_lateral_elastico', 'agach_livre',
  'agach_salto', 'agach_mochila', 'afundo_reverso', 'afundo_lateral', 'bulgaro_cadeira', 'agach_parede', 'sissy', 'ponte_unilateral', 'stiff_corpo', 'flexora_toalha', 'kb_swing', 'hollow',
  'escalador', 'abd_bicicleta', 'perdigueiro']);
const EX = {};
for (const [id, nomes, grupo, req, tipo, carga, step] of EX_RAW) {
  EX[id] = { id, nomes, grupo, tipo, carga, step: step || 0, req: req.split('|').map(a => (a ? a.split('+') : [])), get nome() { return L3(this.nomes); }, get nomeEn() { return this.nomes[0]; } };
}
function exInfo(id, nomeFallback) {
  return EX[id] || { id, nome: nomeFallback || id, nomeEn: nomeFallback || id, grupo: 'outro', tipo: 'C', carga: 'h', step: 0, req: [[]] };
}
function equipSet(gym) {
  const s = new Set((gym && gym.itens) || []);
  for (const [k, imp] of Object.entries(IMPLICA)) if (s.has(k)) imp.forEach(x => s.add(x));
  return s;
}
const disponivel = (ex, set) => ex.req.some(alt => alt.every(e => set.has(e)));
function passo(ex, kg) {
  if (ex.step) return ex.step;
  switch (ex.carga) { case 'b': return 2; case 'h': return kg < 10 ? 1 : 2; case 'm': return 5; case 'p': return 2.5; default: return 0; }
}
const unidade = ex => (ex.carga === 's' ? t('u_sec') : ex.carga === 'n' ? 'min' : t('u_reps'));
const usaCarga = ex => !['c', 's', 'n'].includes(ex.carga);
/* estimated max heart rate (Tanaka: 208 − 0.7 × age) and the two zones the plan talks about */
function zonasFC(idade) {
  const i = parseInt(idade, 10);
  if (!(i >= 12 && i <= 90)) return null;
  const max = Math.round(208 - 0.7 * i);
  return { max, leve: [Math.round(max * 0.6), Math.round(max * 0.7)], forte: [Math.round(max * 0.85), Math.round(max * 0.92)] };
}
Object.assign(STR, { u_reps: ['reps', 'reps', 'reps'], u_sec: ['sec', 'seg', 'seg'], u_sec_long: ['seconds', 'segundos', 'segundos'] });

/* ---------- local storage (per-device conveniences only) ---------- */
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v == null ? null : JSON.parse(v); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* no local storage */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* same */ } },
  keys() { try { return Object.keys(localStorage); } catch { return []; } },
};
