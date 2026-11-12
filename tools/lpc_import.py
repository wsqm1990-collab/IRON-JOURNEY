#!/usr/bin/env python3
"""Copies the pixel-art layers the app uses from the Universal LPC Spritesheet Character Generator
(https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator) into web/art/lpc,
and writes web/src/11a-lpc-dados.js (what each layer is, its colours and the artists' credits).

Usage: python3 tools/lpc_import.py /path/to/universal-lpc-spritesheet-character-generator

Only the animations the app plays are copied (walk, slash, thrust, shoot, hurt), and the
north-facing row is dropped (the app never shows a character from behind), so every sheet has the
rows west, south, east (hurt has its single row). Big attack swings keep their 128/192 px frames.
"""
import glob, json, os, shutil, sys
from PIL import Image

LPC = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '../universal-lpc-spritesheet-character-generator')
SS = os.path.join(LPC, 'spritesheets')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'web', 'art', 'lpc')
JS = os.path.join(ROOT, 'web', 'src', '11a-lpc-dados.js')
ANIMS = ['walk', 'slash', 'thrust', 'shoot', 'hurt']
FRAMES = {'walk': 9, 'slash': 6, 'thrust': 8, 'shoot': 13, 'hurt': 6}

PARTS = []  # (key, definition name, {anim: (source file, z, frame size)}, recolour channels)


def std(key, defn, base, z, mat=(), variant=None, anims=ANIMS):
    a = {}
    for an in anims:
        f = f'{base}{an}/{variant}.png' if variant else f'{base}{an}.png'
        a[an] = (f, z, 64)
    PARTS.append((key, defn, a, [list(m) for m in mat]))


def custom(key, defn, entries, mat=()):
    PARTS.append((key, defn, {an: v for an, v in entries.items()}, [list(m) for m in mat]))


SKIN = [('body', 'light')]
# ---- bodies and heads
std('corpo/m', 'body', 'body/bodies/male/', 10, SKIN)
std('corpo/f', 'body', 'body/bodies/female/', 10, SKIN)
std('corpo/mus', 'body', 'body/bodies/muscular/', 10, SKIN)
std('corpo/esq', 'body_skeleton', 'body/bodies/skeleton/', 10)
std('corpo/zum', 'body_zombie', 'body/bodies/zombie/', 10, variant='zombie')
std('cab/m', 'heads_human_male', 'head/heads/human/male/', 100, SKIN + [('eye', 'blue')])
std('cab/f', 'heads_human_female', 'head/heads/human/female/', 100, SKIN + [('eye', 'blue')])
std('cab/velho', 'heads_human_male_elderly', 'head/heads/human/male_elderly/', 100, SKIN + [('eye', 'blue')])
for k, d, p, b in [('goblin', 'heads_goblin', 'goblin/adult', 'green'), ('orc', 'heads_orc_male', 'orc/male', 'green'),
                   ('troll', 'heads_troll', 'troll/adult', 'green'), ('minotauro', 'heads_minotaur', 'minotaur/male', 'fur_tan'),
                   ('lobo', 'heads_wolf_male', 'wolf/male', 'fur_brown'), ('lagarto', 'heads_lizard_male', 'lizard/male', 'green'),
                   ('javali', 'heads_boarman', 'boarman/adult', 'fur_brown')]:
    std('cab/' + k, d, f'head/heads/{p}/', 100, [('body', b)])
std('cab/esq', 'heads_skeleton', 'head/heads/skeleton/adult/', 100)
std('cab/zumbi', 'heads_zombie', 'head/heads/zombie/adult/', 100)
std('rosto/m', 'face_happy', 'head/faces/male/happy/', 101, SKIN, anims=['walk'])
std('rosto/f', 'face_happy', 'head/faces/female/happy/', 101, SKIN, anims=['walk'])
# ---- hair (fg/bg where the style has a part behind the head) and beards
HAIR = ['plain', 'messy1', 'spiked', 'buzzcut', 'shorthawk', 'curly_short', 'afro', 'dreadlocks_short', 'pixie', 'bob',
        'long', 'ponytail', 'bangs_bun', 'braid']
for h in HAIR:
    base = f'hair/{h}/adult/'
    if os.path.isdir(os.path.join(SS, base, 'fg')):
        std(f'cabelo/{h}', 'hair_' + h, base + 'fg/', 120, [('hair', 'orange')])
        std(f'cabelo/{h}-tras', 'hair_' + h, base + 'bg/', 9, [('hair', 'orange')])
    else:
        std(f'cabelo/{h}', 'hair_' + h, base, 120, [('hair', 'orange')])
for k, d, p, z in [('porfazer', 'beards_5oclock_shadow', 'beards/beard/5oclock_shadow/', 111), ('bigode', 'beards_mustache', 'beards/mustache/basic/', 111),
                   ('aparada', 'beards_trimmed', 'beards/beard/trimmed/', 110), ('media', 'beards_medium', 'beards/beard/medium/', 110),
                   ('cheia', 'beards_beard', 'beards/beard/basic/', 110), ('lenhador', 'beards_winter', 'beards/beard/winter/male/', 110)]:
    std('barba/' + k, d, p, z, [('hair', 'orange')])
# ---- clothes and armour (m = male body, f = female body)
CLOTH = [('cloth', 'white')]
for s, mf, th in [('m', 'male', 'male'), ('f', 'female', 'thin')]:
    std(f'camisa/{s}', 'torso_clothes_longsleeve', f'torso/clothes/longsleeve/longsleeve/{mf}/', 35, CLOTH)
    std(f'calca/{s}', 'legs_pants', f'legs/pants/{th}/', 20, CLOTH)
    std(f'sapato/{s}', 'feet_shoes_basic', f'feet/shoes/basic/{th}/', 15, CLOTH)
    std(f'bota/{s}', 'feet_boots_basic', f'feet/boots/basic/{th}/', 25, CLOTH)
    std(f'couro/{s}', 'torso_armour_leather', f'torso/armour/leather/{mf}/', 60)
    std(f'malha/{s}', 'torso_chainmail', f'torso/chainmail/{mf}/', 50, [('metal', 'steel')])
    std(f'placas/{s}', 'torso_armour_plate', f'torso/armour/plate/{mf}/', 60, [('metal', 'steel')])
    std(f'bracadeira/{s}', 'arms_bracers', f'arms/bracers/{th}/', 70, [('metal', 'steel')])
    std(f'ombreira/{s}', 'shoulders_pauldrons', f'shoulders/pauldrons/{th}/', 60, CLOTH)
    std(f'manto/{s}', 'shoulders_mantal', f'shoulders/mantal/{th}/', 75, CLOTH)
    std(f'cinto/{s}', 'belt_leather', f'torso/waist/belt_leather/{mf}/', 70, variant='leather')
std('capa', 'cape_solid', 'cape/solid/fg/', 85, CLOTH)
std('capa-tras', 'cape_solid', 'cape/solid/bg/', 5, CLOTH)
std('aljava', 'quiver', 'quiver/', 8, variant='quiver')
std('coroa', 'hat_formal_crown', 'hat/formal/crown/adult/', 130, variant='crown_gold')
std('chapeu-mago', 'hat_magic_wizard', 'hat/magic/wizard/base/adult/', 130, variant='purple')
# ---- weapons: the part in front (fg) and the part behind the body (bg); big swings use 192 px frames
W = 'weapon/'


def melee(key, defn, base, v, behind, fz=140, bz=9, swing_bz=-1):
    custom(key, defn, {'walk': (f'{base}walk/{v}.png', fz, 64), 'hurt': (f'{base}hurt/{v}.png', fz, 64),
                       'slash': (f'{base}attack_slash/{v}.png', 150, 192)})
    custom(key + '-tras', defn, {'walk': (f'{base}{behind}walk/{v}.png', bz, 64), 'hurt': (f'{base}{behind}hurt/{v}.png', bz, 64),
                                 'slash': (f'{base}attack_slash/behind/{v}.png', swing_bz, 192)})


melee('arma/espada', 'weapon_sword_longsword', W + 'sword/longsword/', 'longsword', 'universal_behind/')
melee('arma/espada-luz', 'weapon_sword_glowsword', W + 'sword/glowsword/', 'blue', 'universal_behind/', swing_bz=8)
melee('arma/espada-fogo', 'weapon_sword_glowsword', W + 'sword/glowsword/', 'red', 'universal_behind/', swing_bz=8)
melee('arma/maca', 'weapon_blunt_mace', W + 'blunt/mace/', 'mace', 'universal_behind/', swing_bz=9)
melee('arma/machado', 'weapon_blunt_waraxe', W + 'blunt/waraxe/', 'waraxe', 'behind/', swing_bz=8)
std('arma/adaga', 'weapon_sword_dagger', W + 'sword/dagger/', 140, variant='dagger', anims=['walk', 'slash', 'thrust', 'hurt'])
std('arma/adaga-tras', 'weapon_sword_dagger', W + 'sword/dagger/behind/', 9, variant='dagger', anims=['walk', 'slash', 'thrust', 'hurt'])
std('arma/lanca', 'weapon_polearm_spear', W + 'polearm/spear/foreground/', 140, variant='medium', anims=['walk', 'thrust', 'hurt'])
std('arma/lanca-tras', 'weapon_polearm_spear', W + 'polearm/spear/background/', 9, variant='medium', anims=['walk', 'thrust', 'hurt'])
std('arma/cajado', 'weapon_magic_simple', W + 'magic/simple/foreground/', 140, variant='simple', anims=['walk', 'thrust', 'hurt'])
std('arma/cajado-tras', 'weapon_magic_simple', W + 'magic/simple/background/', 9, variant='simple', anims=['walk', 'thrust', 'hurt'])
C = W + 'magic/crystal/'
custom('arma/cristal', 'weapon_magic_crystal', {'walk': (C + 'universal/foreground/walk/purple.png', 140, 64), 'hurt': (C + 'universal/foreground/hurt/purple.png', 140, 64),
                                                'thrust': (C + 'thrust/foreground/purple.png', 150, 192)})
custom('arma/cristal-tras', 'weapon_magic_crystal', {'walk': (C + 'universal/background/walk/purple.png', 9, 64), 'hurt': (C + 'universal/background/hurt/purple.png', 9, 64),
                                                     'thrust': (C + 'thrust/background/purple.png', -1, 192)})
for key, defn, kind, v in [('arma/arco', 'weapon_ranged_bow_normal', 'normal', 'light'), ('arma/arco-ouro', 'weapon_ranged_bow_normal', 'normal', 'gold'),
                           ('arma/arco-grande', 'weapon_ranged_bow_great', 'great', 'gold')]:
    B = f'{W}ranged/bow/{kind}/'
    custom(key, defn, {'walk': (f'{B}walk/foreground/{v}.png', 141, 128), 'shoot': (f'{B}universal/foreground/shoot/{v}.png', 140, 64),
                       'hurt': (f'{B}universal/foreground/hurt/{v}.png', 140, 64)})
    custom(key + '-tras', defn, {'walk': (f'{B}walk/background/{v}.png', -1, 128), 'shoot': (f'{B}universal/background/shoot/{v}.png', -1, 64),
                                 'hurt': (f'{B}universal/background/hurt/{v}.png', -1, 64)})
custom('arma/flecha', 'weapon_ranged_bow_arrow', {'shoot': (W + 'ranged/bow/arrow/shoot/arrow.png', 150, 64)})
std('escudo/redondo', 'shield_round', 'shield/round/', 110, variant='brown', anims=['walk', 'slash', 'thrust'])
std('escudo/cruzado-tras', 'shield_crusader', 'shield/crusader/bg/', 2, variant='crusader')
std('escudo/cruzado/m', 'shield_crusader', 'shield/crusader/fg/male/', 110, variant='crusader')
std('escudo/cruzado/f', 'shield_crusader', 'shield/crusader/fg/female/', 110, variant='crusader')
std('escudo/espartano-tras', 'shield_spartan', 'shield/spartan/bg/', 2, variant='spartan')
std('escudo/espartano', 'shield_spartan', 'shield/spartan/fg/', 110, variant='spartan')


def definition(name):
    m = glob.glob(os.path.join(LPC, 'sheet_definitions', '**', name + '.json'), recursive=True)
    if not m:
        raise SystemExit('no sheet definition ' + name)
    return json.load(open(m[0]))


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    manifest, used_defs, total = {}, {}, 0
    for key, defn, anims, mat in PARTS:
        entry = {}
        for an, (src, z, size) in anims.items():
            p = os.path.join(SS, src)
            if not os.path.exists(p):
                continue
            im = Image.open(p).convert('RGBA')
            w, h = im.size
            if h == 4 * size:
                im = im.crop((0, size, w, h))  # drop the north row: rows are now west, south, east
            elif h != size:
                raise SystemExit(f'{src}: unexpected height {h}')
            n = w // size
            if n != FRAMES[an]:
                print(f'  note: {key} {an} has {n} frames (expected {FRAMES[an]})')
            dst = os.path.join(OUT, key, an + '.png')
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            im.save(dst, optimize=True)
            total += os.path.getsize(dst)
            entry[an] = [key + '/' + an + '.png', z, size, n]
            used_defs.setdefault(defn, set()).add(os.path.dirname(src))
        if not entry:
            raise SystemExit('nothing copied for ' + key)
        manifest[key] = {'m': mat, 'a': entry}
    # palettes the app recolours with
    pal = {}
    for mat, f in [('body', 'body/body_ulpc'), ('hair', 'hair/hair_ulpc'), ('cloth', 'cloth/cloth_ulpc'), ('metal', 'metal/metal_ulpc'), ('eye', 'eye/eye_ulpc')]:
        pal[mat] = json.load(open(os.path.join(LPC, 'palette_definitions', f + '.json')))
    # credits: only the entries for the files this app uses
    credits, lines = [], []
    for defn in sorted(used_defs):
        d = definition(defn)
        for c in d.get('credits', []):
            f = c.get('file', '')
            if not any(u.startswith(f.rstrip('/')) or f.startswith(u) for u in used_defs[defn]):
                continue
            credits.append({'f': f, 'a': c.get('authors', []), 'l': c.get('licenses', []), 'u': c.get('urls', []), 'n': c.get('notes', '')})
    seen = set()
    for c in credits:
        k = json.dumps(c, sort_keys=True)
        if k in seen:
            continue
        seen.add(k)
        lines.append(f"- {c['f']}\n  by: {', '.join(c['a'])}\n  licence: {', '.join(c['l'])}\n" + ''.join(f'  {u}\n' for u in c['u']) + (f"  note: {c['n']}\n" if c['n'] else ''))
    authors = sorted({a for c in credits for a in c['a']}, key=str.lower)
    licences = sorted({l for c in credits for l in c['l']})
    with open(os.path.join(OUT, 'CREDITS.txt'), 'w', encoding='utf-8') as fh:
        fh.write('Character art: Liberated Pixel Cup (LPC) sprites, from the Universal LPC Spritesheet Character Generator\n'
                 'https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator\n\n'
                 'These images are used under the licences their authors chose (CC-BY-SA 3.0, GPL 3.0, OGA-BY 3.0, CC-BY 4.0, CC0;\n'
                 'see each entry). The copies here were only cropped (the north-facing row removed); any changes are shared under\n'
                 'the same licences. The app recolours them while it runs.\n\n' + '\n'.join(lines))
    js = ('/* Pixel-art layers (generated by tools/lpc_import.py; do not edit by hand).\n'
          '   Art: Liberated Pixel Cup contributors, see web/art/lpc/CREDITS.txt and the credits in Settings. */\n'
          f'const LPC_PARTES = {json.dumps(manifest, separators=(",", ":"))};\n'
          f'const LPC_PALETAS = {json.dumps(pal, separators=(",", ":"))};\n'
          f'const LPC_AUTORES = {json.dumps(authors, ensure_ascii=False)};\n'
          f'const LPC_LICENCAS = {json.dumps(licences)};\n')
    open(JS, 'w', encoding='utf-8').write(js)
    print(f'{len(manifest)} parts, {total // 1024} KB of images, {len(authors)} artists')


main()
