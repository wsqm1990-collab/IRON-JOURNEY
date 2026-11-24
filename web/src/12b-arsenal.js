/* ---------- the Arsenal: gear the hero earns by training ----------
   Every workout opens a chest; a personal record adds a rare find; a chapter's boss drops an epic piece
   and the end of a campaign a legendary one; cardio sessions open chests of capes and boots.
   Nothing is bought: what the hero owns is worked out again from the real training history, with
   each chest's luck fixed by the session it came from, so it is the same on every phone and in every
   backup. Finding a piece already owned makes it stronger (+1, up to +4). The person only chooses
   what to wear (profile.equip); a slot left empty shows the class's own gear for the level. */
Object.assign(STR, {
  sub_arsenal: ['Arsenal', 'Arsenal', 'Arsenal'],
  ars_count: ['{a} of {b} items', '{a} de {b} itens', '{a} de {b} objetos'],
  ars_worn: ['Wearing now', 'Usando agora', 'Usando ahora'],
  ars_collection: ['Collection', 'Coleção', 'Colección'],
  ars_all: ['All', 'Tudo', 'Todo'],
  ars_equip: ['Equip', 'Equipar', 'Equipar'],
  ars_equipped: ['Equipped', 'Equipado', 'Equipado'],
  ars_unequip: ['Back to the class gear', 'Voltar ao equipamento da classe', 'Volver al equipo de la clase'],
  ars_class_gear: ['Class gear', 'Da classe', 'De la clase'],
  ars_new: ['New!', 'Novo!', '¡Nuevo!'],
  ars_up: ['Stronger: +{n}', 'Mais forte: +{n}', 'Más fuerte: +{n}'],
  ars_chest: ['Chest opened', 'Baú aberto', 'Cofre abierto'],
  ars_open: ['Open the Arsenal', 'Abrir o Arsenal', 'Abrir el Arsenal'],
  ars_locked: ['Not found yet', 'Ainda não encontrado', 'Aún no encontrado'],
  ars_how: ['How to earn items', 'Como ganhar itens', 'Cómo ganar objetos'],
  ars_how_1: ['Every workout you finish opens a chest.', 'Cada treino concluído abre um baú.', 'Cada entreno terminado abre un cofre.'],
  ars_how_2: ['A personal record adds a rare or epic item.', 'Um recorde pessoal dá mais um item raro ou épico.', 'Un récord personal da otro objeto raro o épico.'],
  ars_how_3: ['Cardio of 10 minutes or more opens a chest of capes and boots.', 'Cardio de 10 minutos ou mais abre um baú de capas e botas.', 'El cardio de 10 minutos o más abre un cofre de capas y botas.'],
  ars_how_4: ['Beating a chapter\'s boss gives an epic item; winning a campaign, a legendary one.', 'Vencer o chefão do capítulo dá um item épico; vencer a campanha, um lendário.', 'Vencer al jefe del capítulo da un objeto épico; ganar la campaña, uno legendario.'],
  ars_how_5: ['Found something you already have? It gets stronger, up to +4.', 'Achou um item que já tem? Ele fica mais forte, até +4.', '¿Encontraste algo que ya tienes? Se vuelve más fuerte, hasta +4.'],
  ars_how_6: ['Items only come from training, never from paying.', 'Itens só vêm do treino, nunca de pagamento.', 'Los objetos solo vienen del entreno, nunca de pagar.'],
  ars_src_inicial: ['Starting gear of the {c}', 'Equipamento inicial do {c}', 'Equipo inicial del {c}'],
  ars_src_treino: ['Workout chest · {d}', 'Baú de treino · {d}', 'Cofre de entreno · {d}'],
  ars_src_recorde: ['Personal record · {d}', 'Recorde pessoal · {d}', 'Récord personal · {d}'],
  ars_src_cardio: ['Cardio chest · {d}', 'Baú de cardio · {d}', 'Cofre de cardio · {d}'],
  ars_src_chefe: ['Chapter boss · {d}', 'Chefão do capítulo · {d}', 'Jefe del capítulo · {d}'],
  ars_src_campanha: ['Campaign won · {d}', 'Campanha vencida · {d}', 'Campaña ganada · {d}'],
  ars_hint_treino: ['Workout chest', 'Baú de treino', 'Cofre de entreno'],
  ars_hint_cardio: ['Cardio chest', 'Baú de cardio', 'Cofre de cardio'],
  ars_hint_raro: ['Chest or record', 'Baú ou recorde', 'Cofre o récord'],
  ars_hint_epico: ['Chapter boss', 'Chefão', 'Jefe'],
  ars_hint_lendario: ['Campaign', 'Campanha', 'Campaña'],
  ars_powers: ['Powers', 'Poderes', 'Poderes'],
  ars_power_lv: ['Level {n}', 'Nível {n}', 'Nivel {n}'],
  ars_power_next: ['{a} of {b} to the next level', '{a} de {b} para o próximo nível', '{a} de {b} para el próximo nivel'],
  ars_power_max: ['Highest level', 'Nível máximo', 'Nivel máximo'],
  ars_power_how: ['Each workout uses the power of the muscles it trained most, in the battle at the end. Using a power levels it up.', 'Cada treino usa, na batalha do fim, o poder dos músculos que mais trabalhou. Usar um poder faz ele subir de nível.', 'Cada entreno usa, en la batalla del final, el poder de los músculos que más trabajó. Usar un poder lo sube de nivel.'],
  ars_power_locked: ['Train it once to unlock', 'Treine uma vez para liberar', 'Entrénalo una vez para desbloquearlo'],
});

const RARIDADES = {
  comum: { n: 0, cor: '#A4ADBA', nome: ['Common', 'Comum', 'Común'] },
  incomum: { n: 1, cor: '#4FC283', nome: ['Uncommon', 'Incomum', 'Poco común'] },
  raro: { n: 2, cor: '#5B8FF9', nome: ['Rare', 'Raro', 'Raro'] },
  epico: { n: 3, cor: '#B57BFF', nome: ['Epic', 'Épico', 'Épico'] },
  lendario: { n: 4, cor: '#FF7A1A', nome: ['Legendary', 'Lendário', 'Legendario'] },
};
const RAR_ORDEM = ['comum', 'incomum', 'raro', 'epico', 'lendario'];
const ARS_SLOTS = [
  ['arma', ['Weapons', 'Armas', 'Armas']], ['escudo', ['Shields', 'Escudos', 'Escudos']], ['armadura', ['Armour', 'Armaduras', 'Armaduras']],
  ['bracos', ['Bracers', 'Braçadeiras', 'Brazaletes']], ['capa', ['Capes', 'Capas', 'Capas']], ['botas', ['Boots', 'Botas', 'Botas']], ['cabeca', ['Head', 'Cabeça', 'Cabeza']],
];
const ARS_SLOT_NOME = Object.fromEntries(ARS_SLOTS);
const ARS_MAX = 5; /* found up to 5 times: new, then +1 … +4 */

/* the catalogue: what each piece looks like on the hero (LPC layers for body s = 'm' | 'f') and as an icon */
const itMetal = (id, slot, rar, nome, m, icone) => ({ id, slot, rar, nome, icone,
  camadas: s => slot === 'bracos' ? [lp('bracadeira/' + s, { metal: m })] : [lp('placas/' + s, { metal: m }), lp('ombreira/' + s, { cloth: 'metal.' + m })] });
const itManto = (id, rar, nome, cor, icone) => ({ id, slot: 'armadura', rar, nome, icone: ['manto', icone], camadas: s => [lp('manto/' + s, { cloth: cor }), lp('cinto/' + s)] });
const itCapa = (id, rar, nome, cor, icone) => ({ id, slot: 'capa', rar, cardio: true, nome, icone: ['capa', icone], camadas: () => [lp('capa', { cloth: cor }), lp('capa-tras', { cloth: cor })] });
const itBotas = (id, rar, nome, cor, icone) => ({ id, slot: 'botas', rar, cardio: true, nome, icone: ['bota', icone], camadas: s => [lp('bota/' + s, { cloth: cor })] });
const itArma = (id, rar, nome, ataque, partes, icone) => ({ id, slot: 'arma', rar, nome, ataque, icone, camadas: () => partes.map(p => lp(p)) });
const ITENS = [
  /* weapons follow the class's way of fighting (the battle plays its attack) */
  itArma('adaga', 'comum', ['Rogue\'s Dagger', 'Adaga do Ladino', 'Daga del Pícaro'], ['slash', 'thrust'], ['arma/adaga', 'arma/adaga-tras'], ['adaga', '#C9D2DE']),
  itArma('espada', 'comum', ['Iron Sword', 'Espada de Ferro', 'Espada de Hierro'], ['slash'], ['arma/espada', 'arma/espada-tras'], ['espada', '#C9D2DE']),
  itArma('maca', 'incomum', ['War Mace', 'Maça de Guerra', 'Maza de Guerra'], ['slash'], ['arma/maca', 'arma/maca-tras'], ['maca', '#B9C3D0']),
  itArma('machado', 'raro', ['Battle Axe', 'Machado de Batalha', 'Hacha de Batalla'], ['slash'], ['arma/machado', 'arma/machado-tras'], ['machado', '#D7DEE8']),
  itArma('espada-fogo', 'epico', ['Flame Blade', 'Lâmina Flamejante', 'Hoja Llameante'], ['slash'], ['arma/espada-fogo', 'arma/espada-fogo-tras'], ['espada', '#FF8A3D']),
  itArma('espada-luz', 'lendario', ['Titan\'s Blade', 'Lâmina do Titã', 'Hoja del Titán'], ['slash'], ['arma/espada-luz', 'arma/espada-luz-tras'], ['espada', '#7FD8FF']),
  itArma('cajado', 'comum', ['Oak Staff', 'Cajado de Carvalho', 'Bastón de Roble'], ['thrust'], ['arma/cajado', 'arma/cajado-tras'], ['cajado', '#7EE0C2']),
  itArma('lanca', 'raro', ['Pilgrim\'s Spear', 'Lança do Peregrino', 'Lanza del Peregrino'], ['thrust'], ['arma/lanca', 'arma/lanca-tras'], ['lanca', '#D7DEE8']),
  itArma('cristal', 'lendario', ['Staff of the Eternal Heart', 'Cajado do Coração Eterno', 'Bastón del Corazón Eterno'], ['thrust'], ['arma/cristal', 'arma/cristal-tras'], ['cajado', '#9FE3FF']),
  itArma('arco', 'comum', ['Hunting Bow', 'Arco de Caça', 'Arco de Caza'], ['shoot'], ['arma/arco', 'arma/arco-tras', 'arma/flecha'], ['arco', '#B07A45']),
  itArma('arco-ouro', 'epico', ['Golden Bow', 'Arco Dourado', 'Arco Dorado'], ['shoot'], ['arma/arco-ouro', 'arma/arco-ouro-tras', 'arma/flecha'], ['arco', '#E2B33C']),
  itArma('arco-grande', 'lendario', ['Wind Bow', 'Arco do Vento', 'Arco del Viento'], ['shoot'], ['arma/arco-grande', 'arma/arco-grande-tras', 'arma/flecha'], ['arco', '#8FE3FF']),
  /* shields: only for one-handed fighters */
  { id: 'broquel', slot: 'escudo', rar: 'comum', nome: ['Round Buckler', 'Broquel Redondo', 'Rodela'], icone: ['escudo-redondo', '#A9773F'], camadas: () => [lp('escudo/redondo')] },
  { id: 'cruzado', slot: 'escudo', rar: 'raro', nome: ['Crusader Shield', 'Escudo do Cruzado', 'Escudo del Cruzado'], icone: ['escudo', '#E8ECF0'], camadas: s => [lp('escudo/cruzado-tras'), lp('escudo/cruzado/' + s)] },
  { id: 'espartano', slot: 'escudo', rar: 'epico', nome: ['Spartan Shield', 'Escudo Espartano', 'Escudo Espartano'], icone: ['escudo-redondo', '#E2B33C'], camadas: () => [lp('escudo/espartano-tras'), lp('escudo/espartano')] },
  /* armour */
  { id: 'couro', slot: 'armadura', rar: 'comum', nome: ['Leather Jerkin', 'Gibão de Couro', 'Jubón de Cuero'], icone: ['armadura', '#8A5A34'], camadas: s => [lp('couro/' + s)] },
  { id: 'malha', slot: 'armadura', rar: 'comum', nome: ['Iron Chainmail', 'Cota de Malha', 'Cota de Malla'], icone: ['malha', '#9AA4B1'], camadas: s => [lp('malha/' + s, { metal: 'iron' })] },
  itManto('manto', 'comum', ['Pilgrim\'s Robe', 'Manto do Peregrino', 'Manto del Peregrino'], 'white', '#E8ECF0'),
  { id: 'malha-bronze', slot: 'armadura', rar: 'incomum', nome: ['Bronze Chainmail', 'Cota de Bronze', 'Cota de Bronce'], icone: ['malha', '#B87333'], camadas: s => [lp('malha/' + s, { metal: 'bronze' })] },
  itMetal('placas-ferro', 'armadura', 'incomum', ['Iron Plate', 'Armadura de Ferro', 'Armadura de Hierro'], 'iron', ['armadura', '#9AA4B1']),
  itManto('manto-sabio', 'incomum', ['Sage\'s Robe', 'Manto do Sábio', 'Manto del Sabio'], 'navy', '#3B5BA0'),
  itMetal('placas-aco', 'armadura', 'raro', ['Steel Plate', 'Armadura de Aço', 'Armadura de Acero'], 'steel', ['armadura', '#C9D2DE']),
  itMetal('placas-cobre', 'armadura', 'raro', ['Copper Plate', 'Armadura de Cobre', 'Armadura de Cobre'], 'copper', ['armadura', '#C8794A']),
  itManto('manto-real', 'raro', ['Royal Robe', 'Manto Real', 'Manto Real'], 'purple', '#8E4FD0'),
  itMetal('placas-prata', 'armadura', 'epico', ['Silver Plate', 'Armadura de Prata', 'Armadura de Plata'], 'silver', ['armadura', '#E4E9F0']),
  itManto('manto-sol', 'epico', ['Sunlit Robe', 'Manto do Sol', 'Manto del Sol'], 'yellow', '#F2C230'),
  itMetal('placas-ouro', 'armadura', 'lendario', ['Colossus Armour', 'Armadura do Colosso', 'Armadura del Coloso'], 'gold', ['armadura', '#E2B33C']),
  /* bracers */
  itMetal('brac-bronze', 'bracos', 'comum', ['Bronze Bracers', 'Braçadeiras de Bronze', 'Brazaletes de Bronce'], 'bronze', ['bracadeira', '#B87333']),
  itMetal('brac-ferro', 'bracos', 'incomum', ['Iron Bracers', 'Braçadeiras de Ferro', 'Brazaletes de Hierro'], 'iron', ['bracadeira', '#9AA4B1']),
  itMetal('brac-prata', 'bracos', 'raro', ['Silver Bracers', 'Braçadeiras de Prata', 'Brazaletes de Plata'], 'silver', ['bracadeira', '#E4E9F0']),
  itMetal('brac-ouro', 'bracos', 'epico', ['Golden Bracers', 'Braçadeiras de Ouro', 'Brazaletes de Oro'], 'gold', ['bracadeira', '#E2B33C']),
  /* capes and boots come from cardio */
  itCapa('capa-vermelha', 'comum', ['Crimson Cape', 'Capa Carmesim', 'Capa Carmesí'], 'red', '#D9473B'),
  itCapa('capa-floresta', 'comum', ['Forest Cape', 'Capa da Floresta', 'Capa del Bosque'], 'forest', '#2F7A35'),
  itCapa('capa-mar', 'incomum', ['Sea Cape', 'Capa do Mar', 'Capa del Mar'], 'teal', '#2A9D9A'),
  itCapa('capa-real', 'raro', ['Royal Cape', 'Capa Real', 'Capa Real'], 'purple', '#8E4FD0'),
  itCapa('capa-noite', 'epico', ['Night Cape', 'Capa da Noite', 'Capa de la Noche'], 'black', '#2B2F3A'),
  itCapa('capa-sol', 'lendario', ['Sun Cape', 'Capa do Sol', 'Capa del Sol'], 'metal.gold', '#E2B33C'),
  itBotas('botas-couro', 'comum', ['Leather Boots', 'Botas de Couro', 'Botas de Cuero'], 'leather', '#8A5A34'),
  itBotas('botas-corredor', 'incomum', ['Runner\'s Boots', 'Botas do Corredor', 'Botas del Corredor'], 'red', '#D9473B'),
  itBotas('botas-ferro', 'raro', ['Iron Greaves', 'Grevas de Ferro', 'Grebas de Hierro'], 'metal.iron', '#9AA4B1'),
  itBotas('botas-ouro', 'epico', ['Golden Greaves', 'Grevas de Ouro', 'Grebas de Oro'], 'metal.gold', '#E2B33C'),
  /* head */
  { id: 'chapeu', slot: 'cabeca', rar: 'raro', nome: ['Wizard Hat', 'Chapéu de Mago', 'Sombrero de Mago'], icone: ['chapeu', '#5B4BA0'], camadas: () => [lp('chapeu-mago')] },
  { id: 'coroa', slot: 'cabeca', rar: 'lendario', nome: ['King\'s Crown', 'Coroa do Rei', 'Corona del Rey'], icone: ['coroa', '#E2B33C'], camadas: () => [lp('coroa')] },
];
const ITEM = Object.fromEntries(ITENS.map(i => [i.id, i]));
/* what each class starts with, and its legendary weapon (the first legendary a campaign gives) */
const INICIAIS = { guerreiro: ['espada'], paladino: ['maca', 'broquel'], cacador: ['arco'], monge: ['cajado'] };
const LENDA_CLASSE = { guerreiro: 'espada-luz', paladino: 'placas-ouro', cacador: 'arco-grande', monge: 'cristal' };
/* the pieces a class can find and wear */
function itensDaClasse(cl) {
  const atk = ATAQUE[cl] || 'slash';
  return ITENS.filter(i => (i.slot !== 'arma' || i.ataque.includes(atk)) && (i.slot !== 'escudo' || atk === 'slash'));
}

/* ---------- powers: the muscles a workout trained most decide the power its battle uses ---------- */
const PODERES = [
  { id: 'furia', grupos: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas', 'adutores'], cor: '#FF7A1A', nome: ['Earth Fury', 'Fúria da Terra', 'Furia de la Tierra'], desc: ['Leg day', 'Dia de perna', 'Día de pierna'] },
  { id: 'trovao', grupos: ['peito', 'ombros', 'triceps'], cor: '#F2C230', nome: ['Thunder Strike', 'Golpe Trovão', 'Golpe Trueno'], desc: ['Push: chest, shoulders, triceps', 'Empurrar: peito, ombros, tríceps', 'Empuje: pecho, hombros, tríceps'] },
  { id: 'vendaval', grupos: ['costas', 'biceps'], cor: '#5B8FF9', nome: ['Gale Pull', 'Puxão do Vendaval', 'Tirón del Vendaval'], desc: ['Pull: back, biceps', 'Puxar: costas, bíceps', 'Tirón: espalda, bíceps'] },
  { id: 'muralha', grupos: ['abdomen'], cor: '#4FC283', nome: ['Iron Wall', 'Muralha de Ferro', 'Muralla de Hierro'], desc: ['Core', 'Abdômen', 'Abdomen'] },
  { id: 'folego', grupos: ['cardio'], cor: '#7FE3FF', nome: ['Endless Breath', 'Fôlego Infinito', 'Aliento Infinito'], desc: ['Cardio', 'Cardio', 'Cardio'] },
];
const PODER_NIVEIS = [1, 5, 12, 25, 50];
const poderNivel = usos => PODER_NIVEIS.filter(n => usos >= n).length;
/* the power a workout used: the group of muscles with the most finished sets */
function poderDoTreino(sess) {
  const conta = {};
  for (const x of (sess && sess.exs) || []) {
    const g = x.grupo || (exInfo(x.id) || {}).grupo, n = (x.sets || []).filter(z => z.ok !== false).length;
    const P = PODERES.find(p => p.grupos.includes(g));
    if (P && n) conta[P.id] = (conta[P.id] || 0) + n;
  }
  const melhor = PODERES.filter(p => conta[p.id]).sort((a, b) => conta[b.id] - conta[a.id])[0];
  return melhor || null;
}
function poderesDe(pid) {
  const usos = Object.fromEntries(PODERES.map(p => [p.id, 0]));
  for (const s of sessoesDe(pid)) { const P = poderDoTreino(s); if (P) usos[P.id]++; }
  usos.folego += cardioDe(pid).filter(c => (c.minutos || 0) >= 10).length;
  return PODERES.map(p => ({ ...p, usos: usos[p.id], nivel: poderNivel(usos[p.id]) }));
}

/* ---------- what the hero owns: replayed from the training history ---------- */
const ARS_CACHE = new Map();
function arsenalDe(pid) {
  const p = perfil(pid) || {}, cl = classeDe(p.objetivo).id, ss = sessoesDe(pid), cs = cardioDe(pid);
  const chave = [pid, cl, ss.length, ss[0] && ss[0]._id, cs.length, cs[0] && cs[0]._id].join('|');
  if (ARS_CACHE.has(chave)) return ARS_CACHE.get(chave);
  const pode = itensDaClasse(cl), tem = {}, ganhos = [];
  const ganha = (id, fonte, quando, ev) => {
    const n = Math.min(ARS_MAX, (tem[id] ? tem[id].n : 0) + 1);
    tem[id] = { n, fonte: tem[id] ? tem[id].fonte : fonte, quando: tem[id] ? tem[id].quando : quando };
    ganhos.push({ id, n, novo: n === 1, fonte, quando, ev });
  };
  for (const id of INICIAIS[cl] || []) tem[id] = { n: 1, fonte: 'inicial', quando: 0 };
  /* one piece of the rarity rolled: any of them, owned or not (a piece already owned gets stronger);
     when all of that rarity are at their best, the nearest rarity below, then above */
  const sorteia = (r, cardio, rar) => {
    const ordem = [rar, ...RAR_ORDEM.slice(0, RAR_ORDEM.indexOf(rar)).reverse(), ...RAR_ORDEM.slice(RAR_ORDEM.indexOf(rar) + 1)].filter(x => x !== 'lendario' || rar === 'lendario');
    for (const k of ordem) {
      const lista = pode.filter(i => i.rar === k && (cardio == null || !!i.cardio === cardio) && (!tem[i.id] || tem[i.id].n < ARS_MAX));
      if (lista.length) return lista[Math.floor(r() * lista.length)].id;
    }
    return null;
  };
  const rola = (r, tabela) => { let x = r(); for (const [k, pr] of tabela) { if (x < pr) return k; x -= pr; } return tabela[0][0]; };
  const BAU = [['comum', 0.58], ['incomum', 0.28], ['raro', 0.11], ['epico', 0.03]];
  const BAU_CARDIO = [['comum', 0.55], ['incomum', 0.30], ['raro', 0.12], ['epico', 0.03]];
  const prsPorSess = {};
  recordes(pid).prs.forEach(x => { prsPorSess[x.sess] = (prsPorSess[x.sess] || 0) + 1; });
  const evs = [];
  for (const s of ss) {
    evs.push({ t: s.inicio, tipo: 'treino', id: s._id });
    if (prsPorSess[s._id]) evs.push({ t: s.inicio + 1, tipo: 'recorde', id: s._id });
  }
  for (const c of cs) if ((c.minutos || 0) >= 10) evs.push({ t: c.inicio || c.fim || 0, tipo: 'cardio', id: c._id });
  try {
    for (const c of campanhas(pid).caps) {
      if (!c.venceu) continue;
      const fim = Math.max(0, ...ss.filter(s => s.planoId === c.id).map(s => s.inicio || 0));
      evs.push({ t: fim + 2, tipo: c.ciclo % 3 === 0 ? 'campanha' : 'chefe', id: c.id });
    }
  } catch { /* no chapters yet */ }
  evs.sort((a, b) => a.t - b.t);
  for (const ev of evs) {
    const r = rnd('loot:' + ev.tipo + ':' + ev.id);
    let id = null;
    if (ev.tipo === 'treino') id = sorteia(r, false, rola(r, BAU));
    else if (ev.tipo === 'recorde') id = sorteia(r, null, r() < 0.75 ? 'raro' : 'epico');
    else if (ev.tipo === 'cardio') id = sorteia(r, true, rola(r, BAU_CARDIO));
    else if (ev.tipo === 'chefe') id = sorteia(r, null, 'epico');
    else if (ev.tipo === 'campanha') id = !tem[LENDA_CLASSE[cl]] && pode.some(i => i.id === LENDA_CLASSE[cl]) ? LENDA_CLASSE[cl] : sorteia(r, null, 'lendario');
    if (id) ganha(id, ev.tipo, ev.t, ev.tipo + ':' + ev.id);
  }
  const A = { cl, pode, tem, ganhos };
  if (ARS_CACHE.size > 12) ARS_CACHE.delete(ARS_CACHE.keys().next().value);
  ARS_CACHE.set(chave, A);
  return A;
}
/* what the last save added: the chests that weren't there before (a session logged with an earlier time
   lands earlier in the history, so the new finds are told apart by the chest, not by their place) */
const lootNovo = (antes, depois) => { const ja = new Set(antes.ganhos.map(g => g.ev)); return depois.ganhos.filter(g => !ja.has(g.ev)); };
/* what the hero wears: chosen pieces that are owned and fit the class (slot → item) */
function equipDe(pid) {
  const p = perfil(pid) || {}, eq = p.equip || {}, A = arsenalDe(pid), ok = new Set(A.pode.map(i => i.id)), out = {};
  for (const [slot] of ARS_SLOTS) { const id = eq[slot]; if (id && ITEM[id] && ITEM[id].slot === slot && ok.has(id) && A.tem[id]) out[slot] = ITEM[id]; }
  return out;
}

/* ---------- pictures ---------- */
const arsIcone = (it, cls = 'ars-px') => imgPx(itemSprite(it.icone[0], it.icone[1]), cls);
const arsSombra = it => imgPx(sprite('is:' + it.icone[0], () => { const g = itemGrade(it.icone[0], '#888888'); g.px = g.px.map(c => (c ? '#3E4653' : c)); return g; }), 'ars-px');
const rarNome = it => L3(RARIDADES[it.rar].nome);
function fonteTexto(info, cl) {
  if (!info) return '';
  if (info.fonte === 'inicial') return t('ars_src_inicial', { c: L3((Object.values(CLASSES).find(c => c.id === cl) || CLASSES.hipertrofia).nome) });
  return t('ars_src_' + info.fonte, { d: fmtDate(info.quando) });
}
function dicaItem(it) {
  if (it.rar === 'lendario') return t('ars_hint_lendario');
  if (it.rar === 'epico') return t('ars_hint_epico');
  if (it.cardio) return t('ars_hint_cardio');
  return it.rar === 'raro' ? t('ars_hint_raro') : t('ars_hint_treino');
}

/* ---------- the Arsenal screen (Journey › Arsenal) ---------- */
function viewArsenal(sub) {
  const pid = S.me, d = jornadaDados(pid), H = heroiDe(pid, d), A = arsenalDe(pid), eq = H.equip || {};
  const lista = A.pode, n = lista.filter(i => A.tem[i.id]).length, filtro = S.arsFiltro || 'todos';
  const slots = ARS_SLOTS.filter(([s]) => lista.some(i => i.slot === s));
  const ordem = (a, b) => ARS_SLOTS.findIndex(x => x[0] === a.slot) - ARS_SLOTS.findIndex(x => x[0] === b.slot) || RARIDADES[a.rar].n - RARIDADES[b.rar].n;
  const cartao = it => {
    const info = A.tem[it.id];
    if (!info) return `<div class="ars-it off r-${it.rar}" role="img" aria-label="${esc(t('ars_locked') + ': ' + rarNome(it) + ', ' + dicaItem(it))}"><span class="ars-ico">${arsSombra(it)}</span><b aria-hidden="true">???</b><span class="xs" aria-hidden="true">${esc(rarNome(it))}<br>${esc(dicaItem(it))}</span></div>`;
    const vestido = eq[it.slot] && eq[it.slot].id === it.id;
    return `<button class="ars-it r-${it.rar}${vestido ? ' eq' : ''}" data-a="arsVer" data-id="${it.id}"><span class="ars-ico">${arsIcone(it)}</span><b>${esc(L3(it.nome))}</b><span class="xs">${esc(rarNome(it))}${info.n > 1 ? ` · <span class="num">+${info.n - 1}</span>` : ''}</span>${vestido ? `<i class="ars-tag">${t('ars_equipped')}</i>` : ''}</button>`;
  };
  const usando = slots.map(([s, nome]) => {
    const it = eq[s];
    return `<button class="ars-slot${it ? ' r-' + it.rar : ''}" data-a="arsFiltro" data-v="${s}" aria-pressed="${filtro === s}"><span class="ars-ico">${it ? arsIcone(it) : `<span class="ars-padrao">${esc(t('ars_class_gear'))}</span>`}</span><span class="xs">${esc(L3(nome))}</span></button>`;
  }).join('');
  const pods = poderesDe(pid).map(P => {
    const lv = P.nivel, prox = PODER_NIVEIS[lv], ant = PODER_NIVEIS[lv - 1] || 0;
    const pct = lv >= PODER_NIVEIS.length ? 100 : clamp(((P.usos - ant) / (prox - ant)) * 100, 0, 100);
    return `<div class="poder${lv ? '' : ' off'}" style="--pc:${P.cor}"><span class="poder-orbe">${imgPx(itemSprite('gema', lv ? P.cor : '#56606E'), 'ars-px')}</span><div class="stack" style="gap:2px;min-width:0;flex:1">
      <div class="row between" style="gap:6px"><b>${esc(L3(P.nome))}</b><span class="xs num">${lv ? t('ars_power_lv', { n: lv }) : ''}</span></div>
      <span class="xs muted">${esc(L3(P.desc))} · ${lv ? (lv >= PODER_NIVEIS.length ? t('ars_power_max') : t('ars_power_next', { a: P.usos, b: prox })) : t('ars_power_locked')}</span>
      <div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div></div></div>`;
  }).join('');
  const chips = [['todos', ['All', 'Tudo', 'Todo']], ...slots].map(([s, nome]) => `<button class="chip" data-a="arsFiltro" data-v="${s}" aria-pressed="${filtro === s}">${esc(s === 'todos' ? t('ars_all') : L3(nome))}</button>`).join('');
  const mostra = lista.filter(i => filtro === 'todos' || i.slot === filtro).slice().sort(ordem);
  return `<section class="screen">
    ${sub}
    <div class="hero rpg-top ars-top">
      <div class="rpg-heroi">${heroiAnimHTML(H, 'anda', 'grande')}</div>
      <div class="stack" style="gap:6px;min-width:0;flex:1">
        <p class="eyebrow">${esc(L3(H.classe.nome))} · ${t('level_n', { n: d.nivel.n })}</p>
        <h1 class="h-display h2">${esc(H.nome || '')}</h1>
        <div class="xp"><div class="xp-track"><div class="xp-fill" style="width:${((n / lista.length) * 100).toFixed(1)}%"></div></div><span class="xs muted num">${t('ars_count', { a: n, b: lista.length })}</span></div>
      </div>
    </div>
    <div class="stack"><h2 class="h3">${t('ars_worn')}</h2><div class="ars-slots">${usando}</div></div>
    <div class="stack" id="arsColecao"><div class="row between"><h2 class="h3">${t('ars_collection')}</h2><span class="small muted num">${n}/${lista.length}</span></div>
      <div class="chips ars-chips">${chips}</div>
      <div class="ars-grade">${mostra.map(cartao).join('')}</div></div>
    <div class="stack"><h2 class="h3">${t('ars_powers')}</h2><p class="small muted">${t('ars_power_how')}</p><div class="poderes">${pods}</div></div>
    <details class="box"><summary>${t('ars_how')}</summary><div class="in"><ul class="small stack" style="margin:0;padding-left:18px">${[1, 2, 3, 4, 5, 6].map(i => `<li>${t('ars_how_' + i)}</li>`).join('')}</ul></div></details>
  </section>`;
}

/* ---------- one piece: the hero wearing it, where it came from, equip ---------- */
function abrirItem(id) {
  const it = ITEM[id], pid = S.me;
  if (!it) return;
  const A = arsenalDe(pid), info = A.tem[id];
  if (!info) return;
  const H = heroiDe(pid), vestido = H.equip[it.slot] && H.equip[it.slot].id === id;
  const prova = { ...H, equip: { ...H.equip, [it.slot]: it } };
  openSheet(L3(it.nome), `<div class="stack ars-det r-${it.rar}">
    <div class="cr-prev"><div class="cr-box">${previaHTML(prova)}</div></div>
    <p class="ars-rar"><span class="ars-dot"></span><b>${esc(rarNome(it))}</b> · ${esc(L3(ARS_SLOT_NOME[it.slot]))}${info.n > 1 ? ` · <span class="num">+${info.n - 1}</span>` : ''}</p>
    <p class="small muted">${esc(fonteTexto(info, A.cl))}</p>
    ${vestido ? `<button class="btn ghost block" data-a="arsTirar" data-v="${it.slot}">${t('ars_unequip')}</button>` : `<button class="btn block" data-a="arsEquipar" data-id="${id}">${t('ars_equip')}</button>`}
  </div>`);
}
async function equiparItem(id, slot, el) {
  const pid = S.me, p = perfil(pid);
  if (!p) return;
  const it = id ? ITEM[id] : null, s = it ? it.slot : slot;
  if (!s || (it && !arsenalDe(pid).tem[id])) return;
  const body = { ...p, equip: { ...(p.equip || {}), [s]: it ? id : null }, atualizadoEm: Date.now() };
  try { await save('perfis/' + pid, body, el ? '' : t(it ? 'ars_equipped' : 'hero_saved')); } catch { return; }
  S.perfis[pid] = body;
  if (el) { el.textContent = t('ars_equipped'); el.disabled = true; return; } /* inside the reward: stay there */
  closeSheet(); render();
}

/* ---------- the finds after a workout or a cardio session ---------- */
function lootHTML(loot) {
  if (!loot || !loot.length) return '';
  return `<div class="stack loot" style="width:100%"><p class="eyebrow">${t('ars_chest')}</p>
    ${loot.map(x => {
      const it = ITEM[x.id];
      return `<div class="loot-it r-${it.rar}"><span class="ars-ico">${arsIcone(it)}</span><div class="stack" style="gap:1px;min-width:0;flex:1;text-align:left"><b>${esc(L3(it.nome))}</b><span class="xs muted">${esc(rarNome(it))} · ${x.novo ? t('ars_new') : t('ars_up', { n: x.n - 1 })}</span></div>
        ${x.novo ? `<button class="btn small" data-a="arsEquipar" data-id="${it.id}" data-fica="1">${t('ars_equip')}</button>` : ''}</div>`;
    }).join('')}
    <button class="btn quiet small" data-a="arsAbrir" style="align-self:center">${t('ars_open')}</button></div>`;
}
