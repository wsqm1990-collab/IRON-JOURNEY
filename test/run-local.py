# Drives the built page in Chrome with a fake Android side and a fake Claude API.
import os, sys, json, asyncio
from playwright.async_api import async_playwright
ROOT = sys.argv[1]; OUT = sys.argv[2]
page_html = open(ROOT + '/web/www/index.html', encoding='utf-8').read()
mock = open(ROOT + '/test/mock-capacitor.js').read()
html = page_html.replace('<body>\n', '<body>\n<script>' + mock + '</script>\n', 1)

def sse(text):
    ev = [{"type": "message_start", "message": {"id": "m", "type": "message", "role": "assistant", "content": []}},
          {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}]
    for i in range(0, len(text), 40): ev.append({"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": text[i:i+40]}})
    ev += [{"type": "content_block_stop", "index": 0}, {"type": "message_delta", "delta": {"stop_reason": "end_turn"}}, {"type": "message_stop"}]
    return ''.join(f"event: {e['type']}\ndata: {json.dumps(e)}\n\n" for e in ev)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        page = await ctx.new_page(); errs = []
        page.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
        page.on('console', lambda m: errs.append('CONSOLE ' + m.text) if m.type == 'error' and 'ERR_' not in m.text and 'capacitor.js' not in m.text else None)
        await page.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await page.route('**/capacitor.js', lambda r: r.fulfill(status=404, body=''))
        api = {'mode': 'bad'}
        async def anthropic(route):
            body = json.loads(route.request.post_data or '{}')
            if api['mode'] == 'bad': return await route.fulfill(status=401, content_type='application/json', body=json.dumps({"type": "error", "error": {"type": "authentication_error", "message": "invalid x-api-key"}}))
            last = body['messages'][-1]['content']
            text = 'OK' if 'single word' in last else '**Great question!** Keep the knee aligned and go slow.'
            await route.fulfill(status=200, content_type='text/event-stream', body=sse(text))
        await page.route('https://api.anthropic.com/**', anthropic)
        async def site(route):
            url = route.request.url
            if url.endswith('/index.html'): await route.fulfill(status=200, content_type='text/html', body=html)
            elif '/art/' in url and os.path.exists(os.path.join(ROOT, 'web', 'www', 'art', url.split('/art/', 1)[1])):
                await route.fulfill(status=200, content_type='image/png', body=open(os.path.join(ROOT, 'web', 'www', 'art', url.split('/art/', 1)[1]), 'rb').read())
            else: await route.fulfill(status=404, body='')
        await page.route('https://iron.test/**', site)
        await page.goto('https://iron.test/index.html')
        async def tap(sel): await page.locator(sel).first.click(timeout=5000); await page.wait_for_timeout(120)
        A = lambda a, extra='': f'[data-a="{a}"]{extra}'
        calls = lambda: page.evaluate('window.__calls')
        def find(cs, name, m, pred=lambda o: True): return [c for c in cs if c[0] == name and c[1] == m and pred(c[2])]
        await page.wait_for_selector(A('novoPerfil')); await page.screenshot(path=OUT + '/01-welcome.png')
        print('native on:', await page.evaluate('Nat.on'), '| header:', await page.locator('#langBtn').inner_text())
        await tap(A('novoPerfil')); await page.fill('#wz-nome', 'Walter'); await tap(A('wzAvancar'))
        await tap(A('wzSet', '[data-v="hipertrofia"]')); await tap(A('wzAvancar')); await tap(A('wzToggle', '[data-v="costas"]')); await tap(A('wzAvancar'))
        await tap(A('wzSet', '[data-v="intermediario"]')); await tap(A('wzAvancar')); await tap(A('wzAvancar')); await page.fill('#wz-idade', '35'); await tap(A('wzAvancar'))
        await tap(A('wzToggle', '[data-v="joelho"]')); await tap(A('wzAvancar')); await tap(A('wzToggle', '[data-v="bike"]')); await tap(A('wzAvancar')); await tap(A('wzAvancar'))
        await page.wait_for_selector('#gym-outros')
        for g in range(4): await page.locator(A('gymTodos')).nth(g).click(); await page.wait_for_timeout(60)
        await tap(A('gymSalvar')); await page.wait_for_selector(A('gerar')); await page.screenshot(path=OUT + '/02-noplan.png', full_page=True)
        await tap(A('gerar')); await page.wait_for_timeout(500)
        pg = await page.evaluate('(() => { const p = plano(S.me); return p && { nome: p.programa.nome, dias: p.programa.dias.map(d => d.nome + ": " + d.exercicios.map(x => exInfo(x.id).nomeEn + " " + x.series + "x" + x.reps.join("-")).join(", ")), semanas: p.programa.semanas.map(w => w.fase + "/" + w.rir), cardio: p.programa.cardio.sessoes.map(c => c.nome + " " + c.protocolo + " " + c.porSemana + "x " + c.minutos + "min") }; })()')
        print('LOCAL PLAN:', json.dumps(pg, indent=1, ensure_ascii=False))
        await page.screenshot(path=OUT + '/03-plan.png', full_page=True)
        await tap('.tab[data-tab="hoje"]'); await tap(A('iniciar')); await page.wait_for_selector('#ex-0')
        await page.fill('#kg-0-0', '100'); await page.fill('#rp-0-0', '10'); await page.locator('[data-a="ok"][data-i="0"][data-j="0"]').click(); await page.wait_for_timeout(300)
        cs = await calls(); r = find(cs, 'IronTimer', 'start', lambda o: o.get('kind') == 'rest')
        print('rest native start:', bool(r), r[-1][2]['segs'] if r else None, '| done text:', r[-1][2].get('done') if r else None)
        print('keepAwake on:', bool(find(cs, 'IronTimer', 'keepAwake', lambda o: o.get('on'))))
        await page.screenshot(path=OUT + '/04-rest.png')
        await tap(A('restMais')); await tap(A('restFechar'))
        cs = await calls(); print('rest stopped:', bool(find(cs, 'IronTimer', 'stop', lambda o: o.get('kind') == 'rest')), '| restarted for +15:', len(find(cs, 'IronTimer', 'start', lambda o: o.get('kind') == 'rest')))
        await tap(A('finalizar')); await tap(A('finSens', '[data-v="ok"]')); await tap(A('salvarTreino')); await page.wait_for_timeout(400); await tap('#sheet ' + A('fecharSheet'))
        await tap('.tab[data-tab="cardio"]'); await tap(A('protoAbrir', '[data-id="h3030"]')); await tap(A('suIniciar')); await page.wait_for_timeout(500)
        cs = await calls(); h = find(cs, 'IronTimer', 'start', lambda o: o.get('kind') == 'hiit')
        print('hiit native start:', bool(h), '| segs:', len(h[-1][2]['segs']) if h else 0, '| fresh:', h[-1][2].get('fresh') if h else None, '| intro:', h[-1][2].get('intro') if h else None)
        print('  seg2:', h[-1][2]['segs'][2] if h else None)
        print('  labels:', h[-1][2]['labels'] if h else None)
        print('js spoke itself:', bool(find(cs, 'IronTimer', 'speak')), '| asked notifications:', bool(find(cs, 'IronTimer', 'askNotif')))
        await tap(A('plPausa')); cs = await calls(); print('pause synced:', bool(find(cs, 'IronTimer', 'update', lambda o: o.get('pausadoEm', 0) > 0)))
        await tap(A('plPausa')); await tap(A('plPular')); await page.wait_for_timeout(300)
        cs = await calls(); print('updates sent:', len(find(cs, 'IronTimer', 'update')))
        st = await page.evaluate('window.__native()')
        await page.evaluate('(st) => __emit("IronTimer", "timer", { type: "state", kind: "hiit", id: st.id, ini: st.ini, pausa: st.pausa, pausadoEm: Date.now() })', st); await page.wait_for_timeout(300)
        print('paused from notification shows:', await page.locator('#plClock').inner_text())
        await page.screenshot(path=OUT + '/05-player-paused.png')
        await page.evaluate('(st) => __emit("IronTimer", "timer", { type: "stopped", by: "notification", kind: "hiit", id: st.id, ini: st.ini - 180000, pausa: 0, endedAt: Date.now() })', st); await page.wait_for_timeout(400)
        print('player closed:', await page.evaluate('!P.on'), '| cardio log open:', await page.locator(A('cfSalvar')).count() > 0)
        await page.screenshot(path=OUT + '/06-log.png'); await tap(A('cfSalvar')); await page.wait_for_timeout(300); await tap('#sheet ' + A('fecharSheet'))
        await tap(A('stModo', '[data-v="assistir"]')); await tap(A('svcSel', '[data-v="Netflix"]')); await page.screenshot(path=OUT + '/07-watch.png', full_page=True)
        await tap(A('stIniciarW')); await page.wait_for_timeout(1500)
        cs = await calls(); print('opened Netflix:', find(cs, 'IronTimer', 'openApp')[-1][2] if find(cs, 'IronTimer', 'openApp') else None)
        await tap(A('plFim')); await page.wait_for_timeout(200)
        if await page.locator('#sheet:not([hidden])').count(): await tap('#sheet ' + A('fecharSheet'))
        await tap(A('stModo', '[data-v="ouvir"]')); await page.locator('a.svc').first.click(); await page.wait_for_timeout(200)
        cs = await calls(); print('music link via app:', find(cs, 'IronTimer', 'openApp')[-1][2])
        await page.evaluate('__emit("App", "backButton", {})'); await page.wait_for_timeout(200); print('back button -> tab:', await page.evaluate('S.tab'))
        await tap('.tab[data-tab="coach"]'); await page.screenshot(path=OUT + '/08-coach-nokey.png')
        await tap('#langBtn'); await page.wait_for_timeout(300); await page.screenshot(path=OUT + '/09-settings.png', full_page=True)
        print('background status:', await page.locator('#bgStatus').inner_text())
        await page.fill('#key-in', 'test-key-rejected'); await tap(A('chaveSalvar')); await page.wait_for_timeout(500)
        print('bad key message:', await page.locator('#keyMsg').inner_text())
        api['mode'] = 'ok'; await page.fill('#key-in', 'test-key-accepted'); await tap(A('chaveSalvar')); await page.wait_for_timeout(600)
        print('AI on after key:', await page.evaluate('AI.on')); await page.screenshot(path=OUT + '/10-settings-key.png', full_page=True)
        await tap(A('setTema', '[data-v="dark"]')); print('theme attr:', await page.evaluate('document.documentElement.dataset.theme'))
        await page.screenshot(path=OUT + '/11-settings-dark.png', full_page=True)
        await tap(A('backupSalvar')); cs = await calls(); sh = find(cs, 'IronTimer', 'shareFile')
        print('backup shared:', bool(sh), sh[-1][2]['name'] if sh else None, len(sh[-1][2]['text']) if sh else 0, 'bytes')
        await tap('#sheet ' + A('fecharSheet'))
        await tap(A('chatChip')); await page.wait_for_timeout(800); await page.screenshot(path=OUT + '/12-coach-chat.png')
        print('chat answer:', (await page.locator('.msg.a').last.inner_text())[:80])
        await page.evaluate('checarAtualizacao(true)'); await page.wait_for_timeout(500)
        print('update switched to:', await page.evaluate('window.__switched'), '| trying:', await page.evaluate("LS.get('ij_trying')"))
        await tap('.tab[data-tab="hoje"]'); await page.screenshot(path=OUT + '/13-today-dark.png', full_page=True)
        print('scrollWidth', await page.evaluate('document.documentElement.scrollWidth'))
        print('ERRORS:', errs if errs else 'none')
        await b.close()
asyncio.run(main())
