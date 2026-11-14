/* ---------- physical assessment: "the hero's trial" ----------
   A guided session (gym or home) to know where the person starts, with established tests, in the
   order ACSM recommends (resting measures, body, cardio, muscular fitness, flexibility):
   - health screening with the PAR-Q+ questions (any "yes" → only the light tests unless a doctor cleared it);
   - pains (and how strong), what the person enjoys, body measurements (tape-measure composition);
   - resting heart rate; cardio: YMCA 3-minute step test or Rockport 1-mile walk (VO2max, Cooper
     Institute bands); push-ups to exhaustion (CSEP norms, as in ACSM's guidelines), 1-minute squats,
     plank; at the gym, submaximal strength sets (estimated 1RM, never a max);
   - mobility: sit-and-reach, hands behind the back, a watched overhead squat.
   Results become four hero attributes, a report, starting loads (a session the load calculator
   reads, and a personal factor for every exercise never done) and context for the AI coach.
   Nothing here is a medical diagnosis. */
Object.assign(STR, {
  av_btn: ['Physical assessment', 'Avaliação física', 'Evaluación física'],
  av_btn_first: ['Take the assessment', 'Fazer a avaliação', 'Hacer la evaluación'],
  av_first_note: ['Recommended: about 30 minutes of simple tests so the plan starts with your real weights, cardio and care points.', 'Recomendado: uns 30 minutos de testes simples para o plano já começar com seus pesos, fôlego e cuidados reais.', 'Recomendado: unos 30 minutos de pruebas sencillas para que el plan empiece con tus pesos, resistencia y cuidados reales.'],
  av_e: ['Hero\'s trial', 'Prova do herói', 'Prueba del héroe'],
  av_step: ['Step {a} of {b}', 'Passo {a} de {b}', 'Paso {a} de {b}'],
  av_intro_h: ['Your physical assessment', 'Sua avaliação física', 'Tu evaluación física'],
  av_intro: ['Simple, established tests to know where you start. Your plan then begins with the right weights and the right care, and you can repeat it every chapter to see how far you came. Any test can be skipped.', 'Testes simples e consagrados para saber de onde você parte. Depois o plano já começa com os pesos e os cuidados certos, e você pode refazer a cada capítulo para ver o quanto evoluiu. Dá para pular qualquer teste.', 'Pruebas sencillas y reconocidas para saber de dónde partes. Luego tu plan empieza con los pesos y cuidados correctos, y puedes repetirla cada capítulo para ver cuánto avanzaste. Puedes saltar cualquier prueba.'],
  av_map: ['Health · Pains · Likes · Body · Heart · Cardio · Strength · Mobility', 'Saúde · Dores · Gostos · Corpo · Coração · Fôlego · Força · Mobilidade', 'Salud · Dolores · Gustos · Cuerpo · Corazón · Resistencia · Fuerza · Movilidad'],
  av_need: ['Have at hand: a sewing tape measure, a watch or phone clock, and a sturdy step about 30 cm high (or a treadmill at the gym).', 'Tenha por perto: uma fita métrica de costura, um relógio e um degrau firme de uns 30 cm (ou uma esteira, na academia).', 'Ten a mano: una cinta métrica de costura, un reloj y un escalón firme de unos 30 cm (o una cinta, en el gimnasio).'],
  av_where: ['Where will you do it?', 'Onde você vai fazer?', '¿Dónde la harás?'],
  av_need_where: ['Choose where you will do it.', 'Escolha onde você vai fazer.', 'Elige dónde la harás.'],
  av_health_h: ['Health first', 'Saúde em primeiro lugar', 'Primero la salud'],
  av_health_note: ['The questions of the PAR-Q+, the international check used before starting exercise.', 'As perguntas do PAR-Q+, a triagem internacional usada antes de começar a se exercitar.', 'Las preguntas del PAR-Q+, el cuestionario internacional usado antes de empezar a ejercitarse.'],
  av_yes: ['Yes', 'Sim', 'Sí'], av_no: ['No', 'Não', 'No'],
  av_health_flag: ['One or more "yes": talk to a doctor before the effort tests and before training hard. Until then, do only the light tests (body, resting heart rate and mobility).', 'Um ou mais "sim": converse com um médico antes dos testes de esforço e antes de treinar pesado. Até lá, faça só os testes leves (corpo, batimento em repouso e mobilidade).', 'Uno o más "sí": habla con un médico antes de las pruebas de esfuerzo y antes de entrenar fuerte. Hasta entonces, haz solo las pruebas suaves (cuerpo, pulso en reposo y movilidad).'],
  av_light_only: ['Only the light tests', 'Só os testes leves', 'Solo las pruebas suaves'], av_light_only_d: ['Effort tests stay for later', 'Os testes de esforço ficam para depois', 'Las pruebas de esfuerzo quedan para después'],
  av_cleared: ['A doctor already cleared me', 'Já fui liberado pelo médico', 'Un médico ya me autorizó'], av_cleared_d: ['For exercise, knowing these answers', 'Para exercícios, sabendo dessas respostas', 'Para hacer ejercicio, sabiendo estas respuestas'],
  av_need_health: ['Answer all the health questions.', 'Responda todas as perguntas de saúde.', 'Responde todas las preguntas de salud.'], av_need_choice: ['Choose how to continue.', 'Escolha como continuar.', 'Elige cómo continuar.'],
  av_pain_h: ['Does anything hurt?', 'Alguma coisa dói?', '¿Te duele algo?'], av_pain_note: ['Mark where it hurts now or when you train, and how much. The plan avoids what tends to make it worse.', 'Marque onde dói agora ou quando treina, e quanto. O plano evita o que costuma piorar.', 'Marca dónde duele ahora o al entrenar, y cuánto. El plan evita lo que suele empeorarlo.'],
  av_pain_none: ['Nothing hurts', 'Nada dói', 'No me duele nada'], av_pain_more: ['Anything else? (optional)', 'Mais alguma coisa? (opcional)', '¿Algo más? (opcional)'],
  av_pain_ph: ['E.g.: knee hurts going down stairs', 'Ex.: o joelho dói ao descer escada', 'Ej.: la rodilla duele al bajar escaleras'],
  av_pain_strong: ['Strong pain is a reason to see a doctor or physiotherapist before training hard.', 'Dor forte é motivo para ver um médico ou fisioterapeuta antes de treinar pesado.', 'Un dolor fuerte es motivo para ver a un médico o fisioterapeuta antes de entrenar fuerte.'],
  av_likes_h: ['What do you enjoy?', 'Do que você gosta?', '¿Qué disfrutas?'], av_likes_note: ['People keep doing what they enjoy. Mark everything you like.', 'A gente mantém o que gosta de fazer. Marque tudo de que você gosta.', 'Uno mantiene lo que disfruta. Marca todo lo que te guste.'],
  av_dislikes: ['What you don\'t like or want to avoid (optional)', 'O que você não gosta ou quer evitar (opcional)', 'Lo que no te gusta o quieres evitar (opcional)'], av_dislikes_ph: ['E.g.: running, burpees', 'Ex.: corrida, burpee', 'Ej.: correr, burpees'],
  av_body_h: ['Your body today', 'Seu corpo hoje', 'Tu cuerpo hoy'],
  av_body_note: ['Sex and age pick the right reference table for each test.', 'Sexo e idade escolhem a tabela de referência certa para cada teste.', 'El sexo y la edad eligen la tabla de referencia correcta para cada prueba.'],
  av_rest_h: ['Heart rate at rest', 'Batimentos em repouso', 'Pulso en reposo'],
  av_rest_note: ['Sit still for 2 minutes. Then read the heart rate on your watch, or count your pulse (wrist or neck) for 30 seconds and double it.', 'Fique sentado e parado por 2 minutos. Depois veja os batimentos no relógio, ou conte o pulso (punho ou pescoço) por 30 segundos e multiplique por 2.', 'Quédate sentado y quieto 2 minutos. Luego mira el pulso en tu reloj, o cuenta el pulso (muñeca o cuello) 30 segundos y multiplícalo por 2.'],
  av_count30: ['Count 30 seconds', 'Contar 30 segundos', 'Contar 30 segundos'], av_bpm: ['Beats per minute', 'Batimentos por minuto', 'Pulsaciones por minuto'],
  av_done_x2: ['Done! Type what you counted × 2.', 'Pronto! Digite o que contou × 2.', '¡Listo! Escribe lo que contaste × 2.'],
  av_cardio_h: ['Cardio', 'Fôlego', 'Resistencia'], av_test_step: ['Step, 3 min', 'Degrau, 3 min', 'Escalón, 3 min'], av_test_walk: ['Walk, 1.6 km', 'Caminhada, 1,6 km', 'Caminata, 1,6 km'],
  av_step_test: ['YMCA 3-minute step test', 'Teste do degrau de 3 minutos (YMCA)', 'Prueba del escalón de 3 minutos (YMCA)'],
  av_step_note: ['A sturdy step about 30 cm high (another height changes the result). Follow the beat: up, up, down, down, for 3 minutes. When it ends, sit down at once and count your pulse for a whole minute: the app times it.', 'Um degrau firme de uns 30 cm (outra altura muda o resultado). Siga o ritmo: sobe, sobe, desce, desce, por 3 minutos. Quando acabar, sente na hora e conte o pulso por 1 minuto inteiro: o app marca o tempo.', 'Un escalón firme de unos 30 cm (otra altura cambia el resultado). Sigue el ritmo: sube, sube, baja, baja, durante 3 minutos. Al terminar, siéntate enseguida y cuenta tu pulso un minuto entero: la app marca el tiempo.'],
  av_step_watch: ['Can\'t count it? Use the number your watch shows when the app beeps in the middle of that minute.', 'Não consegue contar? Use o número que o relógio mostrar quando o app apitar no meio desse minuto.', '¿No logras contarlo? Usa el número que muestre tu reloj cuando la app pite a mitad de ese minuto.'],
  av_step_go: ['Start the step test', 'Começar o teste do degrau', 'Empezar la prueba del escalón'], av_beats_min: ['Beats in that minute', 'Batimentos nesse minuto', 'Pulsaciones en ese minuto'],
  av_up: ['UP', 'SOBE', 'SUBE'], av_down: ['DOWN', 'DESCE', 'BAJA'], av_count_now: ['Sit down and count your pulse', 'Sente e conte o pulso', 'Siéntate y cuenta el pulso'], av_look_watch: ['Watch users: read it now', 'Quem usa relógio: veja agora', 'Si usas reloj: míralo ahora'],
  av_stop: ['Stop', 'Parar', 'Parar'], av_get_ready: ['Get ready', 'Prepare-se', 'Prepárate'], av_done_type: ['Done! Type the result.', 'Pronto! Digite o resultado.', '¡Listo! Escribe el resultado.'],
  av_rockport: ['Rockport walk test (1.6 km)', 'Teste de caminhada de Rockport (1,6 km)', 'Prueba de caminata de Rockport (1,6 km)'],
  av_rockport_note: ['On a treadmill with no incline (or a known 1.6 km route): walk as fast as you can without running. At the end, note the time and the heart rate on the watch or the treadmill.', 'Na esteira sem inclinação (ou num percurso conhecido de 1,6 km): caminhe o mais rápido que conseguir, sem correr. No fim, anote o tempo e os batimentos do relógio ou da esteira.', 'En la cinta sin inclinación (o en un recorrido conocido de 1,6 km): camina lo más rápido que puedas, sin correr. Al final, anota el tiempo y el pulso del reloj o de la cinta.'],
  av_min: ['Minutes', 'Minutos', 'Minutos'], av_sec: ['Seconds', 'Segundos', 'Segundos'], av_hr_end: ['Heart rate at the end', 'Batimentos no fim', 'Pulso al final'],
  av_skip_hint: ['Can\'t do it today? Just continue: the test stays out.', 'Não dá hoje? É só continuar: o teste fica de fora.', '¿Hoy no puedes? Solo continúa: la prueba queda fuera.'],
  av_safety: ['Stop at once if you feel chest pain, dizziness or unusual shortness of breath.', 'Pare na hora se sentir dor no peito, tontura ou falta de ar fora do normal.', 'Detente enseguida si sientes dolor en el pecho, mareo o falta de aire fuera de lo normal.'],
  av_strength_h: ['Strength and endurance', 'Força e resistência', 'Fuerza y resistencia'],
  av_pushups: ['Push-ups to exhaustion', 'Flexões até não conseguir mais', 'Flexiones hasta no poder más'], av_pushups_s: ['Push-ups', 'Flexões', 'Flexiones'],
  av_pushups_m: ['Standard push-ups, body straight, chest down to a fist\'s height from the floor, no rest. Stop when the form breaks.', 'Flexão normal, corpo reto, peito descendo até um punho do chão, sem descansar. Pare quando a postura quebrar.', 'Flexión normal, cuerpo recto, pecho hasta un puño del suelo, sin descansar. Para cuando la postura se rompa.'],
  av_pushups_f: ['Push-ups from the knees (the women\'s standard in this test), body straight from knees to head, no rest. Stop when the form breaks.', 'Flexão com os joelhos no chão (o padrão feminino deste teste), corpo reto dos joelhos à cabeça, sem descansar. Pare quando a postura quebrar.', 'Flexiones con las rodillas en el suelo (el estándar femenino de esta prueba), cuerpo recto de rodillas a cabeza, sin descansar. Para cuando la postura se rompa.'],
  av_count: ['How many?', 'Quantas?', '¿Cuántas?'],
  av_squats: ['Squats in 1 minute', 'Agachamentos em 1 minuto', 'Sentadillas en 1 minuto'], av_squats_note: ['Body weight, thighs down to parallel, arms forward.', 'Peso do corpo, coxas até ficarem paralelas ao chão, braços à frente.', 'Peso corporal, muslos hasta quedar paralelos al suelo, brazos al frente.'],
  av_start_min: ['Start the minute', 'Começar o minuto', 'Empezar el minuto'],
  av_plank: ['Plank', 'Prancha', 'Plancha'], av_plank_note: ['Forearms on the floor, body straight. Stop when the hips drop or the back hurts.', 'Antebraços no chão, corpo reto. Pare quando o quadril cair ou as costas doerem.', 'Antebrazos en el suelo, cuerpo recto. Para cuando la cadera caiga o la espalda duela.'],
  av_start_watch: ['Start the stopwatch', 'Começar o cronômetro', 'Empezar el cronómetro'], av_seconds: ['Seconds', 'Segundos', 'Segundos'],
  av_pullups: ['Pull-ups', 'Barra fixa', 'Dominadas'], av_pullups_note: ['Only if you have a bar: full pull-ups, from arms straight to chin over the bar.', 'Só se você tiver a barra: subidas completas, de braços esticados até o queixo passar a barra.', 'Solo si tienes barra: dominadas completas, de brazos estirados hasta que el mentón pase la barra.'],
  av_lifts: ['Your starting weights', 'Seus pesos de partida', 'Tus pesos de partida'],
  av_lifts_note: ['For each one: warm up with a light set of 10. Then pick a weight you can lift about 6 to 10 times with good form, and stop when only 1 to 3 more reps would be left. Never go to a maximum.', 'Em cada um: aqueça com uma série leve de 10. Depois escolha um peso que você levante umas 6 a 10 vezes com boa técnica e pare quando sobrariam só 1 a 3 repetições. Nunca vá até o máximo.', 'En cada uno: calienta con una serie suave de 10. Luego elige un peso que puedas levantar unas 6 a 10 veces con buena técnica y para cuando solo quedarían 1 a 3 repeticiones. Nunca vayas al máximo.'],
  av_left: ['Reps left', 'Sobraram', 'Quedaban'], av_e1rm: ['estimated max: {n} kg', 'máximo estimado: {n} kg', 'máximo estimado: {n} kg'], av_change_ex: ['Other exercise', 'Outro exercício', 'Otro ejercicio'],
  av_kg_db: ['kg per dumbbell', 'kg de cada halter', 'kg de cada mancuerna'], av_kg_db1: ['kg of the dumbbell', 'kg do halter', 'kg de la mancuerna'], av_kg_bar: ['kg total, with the bar', 'kg total, com a barra', 'kg total, con la barra'],
  av_mob_h: ['Mobility', 'Mobilidade', 'Movilidad'],
  av_reach: ['Sit and reach', 'Sentar e alcançar', 'Sentarse y alcanzar'],
  av_reach_note: ['Sit with legs straight, feet against a wall or step. Reach forward slowly with both hands, without bouncing, and hold for 2 seconds.', 'Sente com as pernas esticadas, pés encostados numa parede ou degrau. Vá à frente devagar com as duas mãos, sem dar trancos, e segure 2 segundos.', 'Siéntate con las piernas estiradas, pies contra una pared o escalón. Ve hacia delante despacio con las dos manos, sin rebotes, y sostén 2 segundos.'],
  av_reach_before: ['Didn\'t reach the toes', 'Não alcancei os pés', 'No llegué a los pies'], av_reach_touch: ['Touched the toes', 'Encostei nos pés', 'Toqué los pies'], av_reach_past: ['Went past the toes', 'Passei dos pés', 'Pasé los pies'],
  av_reach_cm: ['How many cm?', 'Quantos cm?', '¿Cuántos cm?'],
  av_shoulder: ['Hands behind the back', 'Mãos nas costas', 'Manos en la espalda'],
  av_shoulder_note: ['One hand over the shoulder, the other from below: try to touch your fingers behind your back. Do both sides.', 'Uma mão por cima do ombro e a outra por baixo: tente encostar os dedos nas costas. Faça dos dois lados.', 'Una mano por encima del hombro y la otra por abajo: intenta tocar tus dedos en la espalda. Haz los dos lados.'],
  av_right_up: ['Right hand on top', 'Mão direita em cima', 'Mano derecha arriba'], av_left_up: ['Left hand on top', 'Mão esquerda em cima', 'Mano izquierda arriba'],
  av_squatcheck: ['Watched squat', 'Agachamento observado', 'Sentadilla observada'],
  av_squatcheck_note: ['Arms straight up, feet shoulder-width: squat slowly 5 times in front of a mirror (or film it from the front and the side). Mark what happens.', 'Braços esticados para cima, pés na largura dos ombros: agache devagar 5 vezes na frente de um espelho (ou filme de frente e de lado). Marque o que acontece.', 'Brazos estirados hacia arriba, pies al ancho de hombros: agáchate despacio 5 veces frente a un espejo (o grábate de frente y de lado). Marca lo que pasa.'],
  av_none_happens: ['None of these', 'Nada disso', 'Nada de esto'],
  av_result_h: ['Your hero sheet', 'Sua ficha de herói', 'Tu ficha de héroe'],
  av_attr: ['Attributes', 'Atributos', 'Atributos'], av_strength: ['Strength', 'Força', 'Fuerza'], av_stamina: ['Stamina', 'Fôlego', 'Aliento'],
  av_endurance: ['Endurance', 'Resistência', 'Resistencia'], av_mobility: ['Mobility', 'Mobilidade', 'Movilidad'],
  av_not_tested: ['not tested', 'não testado', 'no evaluado'],
  av_details: ['The tests', 'Os testes', 'Las pruebas'], av_vo2: ['VO2max {n}', 'VO2máx {n}', 'VO2máx {n}'], av_walk_time: ['{n} min', '{n} min', '{n} min'],
  av_health_ok: ['Health screening: no flags.', 'Triagem de saúde: sem alertas.', 'Cuestionario de salud: sin alertas.'],
  av_health_warn: ['Health screening: talk to a doctor before training hard.', 'Triagem de saúde: converse com um médico antes de treinar pesado.', 'Cuestionario de salud: habla con un médico antes de entrenar fuerte.'],
  av_health_cleared: ['Health screening: cleared by a doctor.', 'Triagem de saúde: liberado pelo médico.', 'Cuestionario de salud: autorizado por un médico.'],
  av_no_norm: ['Without sex and age, the tests show only the number.', 'Sem sexo e idade, os testes mostram só o número.', 'Sin sexo y edad, las pruebas muestran solo el número.'],
  av_sources: ['References: PAR-Q+ (health screening), ACSM test order, CSEP push-up norms, YMCA step test, Rockport walk with the Cooper Institute bands. Plank, reach and resting heart rate use general references. This is not a medical diagnosis.', 'Referências: PAR-Q+ (triagem de saúde), ordem dos testes do ACSM, tabelas de flexões da CSEP, teste do degrau da YMCA, caminhada de Rockport com as faixas do Cooper Institute. Prancha, alcance e batimento em repouso usam referências gerais. Não é diagnóstico médico.', 'Referencias: PAR-Q+ (cuestionario de salud), orden de pruebas del ACSM, tablas de flexiones de la CSEP, prueba del escalón de la YMCA, caminata de Rockport con las franjas del Cooper Institute. Plancha, alcance y pulso en reposo usan referencias generales. No es un diagnóstico médico.'],
  av_ai_h: ['Your trainer\'s reading', 'A leitura do seu treinador', 'La lectura de tu entrenador'],
  av_ai_writing: ['Your trainer is reading your results…', 'O treinador está lendo seus resultados…', 'Tu entrenador está leyendo tus resultados…'],
  av_ai_off: ['With your AI key, your trainer writes a full reading of these results: strengths, what to improve first and care points.', 'Com a sua chave de IA, o treinador escreve uma leitura completa destes resultados: pontos fortes, o que melhorar primeiro e cuidados.', 'Con tu clave de IA, tu entrenador escribe una lectura completa de estos resultados: fortalezas, qué mejorar primero y cuidados.'],
  av_build: ['Build my plan with this', 'Montar meu plano com isso', 'Armar mi plan con esto'], av_finish: ['Done', 'Concluir', 'Terminar'],
  av_plan_uses: ['Your plan already uses these results for the starting weights.', 'Seu plano já usa estes resultados nos pesos de partida.', 'Tu plan ya usa estos resultados en los pesos de partida.'],
  av_saved: ['Assessment saved', 'Avaliação salva', 'Evaluación guardada'], av_session_name: ['Physical assessment', 'Avaliação física', 'Evaluación física'],
  av_last: ['Last one: {d}', 'Última: {d}', 'Última: {d}'], av_redo: ['Redo the assessment', 'Refazer a avaliação', 'Repetir la evaluación'],
  av_redo_chapter: ['Redo the physical assessment and see how far you came', 'Refazer a avaliação física e ver o quanto evoluiu', 'Repetir la evaluación física y ver cuánto avanzaste'],
  av_since: ['Since your first assessment:', 'Desde a sua primeira avaliação:', 'Desde tu primera evaluación:'], av_step_s: ['Step test', 'Degrau', 'Escalón'], av_rest_s: ['Resting HR', 'Repouso', 'Reposo'],
  av_exit_q: ['Leave the assessment?', 'Sair da avaliação?', '¿Salir de la evaluación?'], av_exit_text: ['What you filled in so far is not saved.', 'O que você preencheu até aqui não é salvo.', 'Lo que llenaste hasta aquí no se guarda.'], av_exit: ['Leave', 'Sair', 'Salir'],
  av_light_mode: ['Light tests only, as the health screening asked.', 'Só testes leves, como pediu a triagem de saúde.', 'Solo pruebas suaves, como pidió el cuestionario de salud.'],
  sug_from_test: ['From your assessment: weight set for today\'s reps.', 'Pela sua avaliação: peso calculado para as repetições de hoje.', 'Por tu evaluación: peso calculado para las repeticiones de hoy.'],
  sug_from_test_bw: ['From your assessment: goal set for today.', 'Pela sua avaliação: meta ajustada para hoje.', 'Por tu evaluación: meta ajustada para hoy.'],
});
Object.assign(I, {
  crono: SV('<circle cx="12" cy="14" r="7"/><path d="M12 10v4l2.5 2M10 3h4M12 3v4"/>'),
  pulso: SV('<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>'),
});
/* PAR-Q+ general health questions (2023), in plain words */
const PARQ = [
  ['Has a doctor ever said you have a heart condition or high blood pressure?', 'Algum médico já disse que você tem problema no coração ou pressão alta?', '¿Algún médico te dijo alguna vez que tienes un problema de corazón o presión alta?'],
  ['Do you feel pain in your chest at rest, in daily activities or when you exercise?', 'Você sente dor no peito em repouso, no dia a dia ou quando faz exercício?', '¿Sientes dolor en el pecho en reposo, en el día a día o al hacer ejercicio?'],
  ['In the last 12 months, have you lost your balance from dizziness or lost consciousness? (Dizziness from breathing hard in intense exercise doesn\'t count.)', 'Nos últimos 12 meses você perdeu o equilíbrio por tontura ou desmaiou? (Tontura por respirar forte em exercício intenso não conta.)', 'En los últimos 12 meses, ¿perdiste el equilibrio por mareo o te desmayaste? (El mareo por respirar fuerte en ejercicio intenso no cuenta.)'],
  ['Have you been diagnosed with another chronic condition (besides heart disease or high blood pressure)?', 'Você tem diagnóstico de outra doença crônica (além de coração ou pressão alta)?', '¿Tienes diagnóstico de otra enfermedad crónica (además del corazón o la presión alta)?'],
  ['Do you take prescription medicine for a chronic condition?', 'Você toma remédio receitado para uma doença crônica?', '¿Tomas medicamentos recetados para una enfermedad crónica?'],
  ['Do you have (or had in the last 12 months) a bone, joint or muscle problem that more activity could make worse? (An old problem that no longer limits you doesn\'t count.)', 'Você tem (ou teve nos últimos 12 meses) problema em osso, articulação ou músculo que pode piorar com mais atividade? (Problema antigo que não te limita mais não conta.)', '¿Tienes (o tuviste en los últimos 12 meses) un problema de hueso, articulación o músculo que más actividad podría empeorar? (Un problema antiguo que ya no te limita no cuenta.)'],
  ['Has a doctor ever said you should only do medically supervised physical activity?', 'Algum médico já disse que você só deve fazer atividade física com supervisão médica?', '¿Algún médico te dijo que solo debes hacer actividad física con supervisión médica?'],
];
const GOSTOS = [['musculacao', 'Weight training', 'Musculação', 'Musculación'], ['peso_corpo', 'Body-weight training', 'Treino com peso do corpo', 'Entrenamiento con peso corporal'], ['funcional', 'Functional / circuits', 'Funcional / circuito', 'Funcional / circuitos'],
  ['caminhada', 'Walking', 'Caminhada', 'Caminar'], ['corrida', 'Running', 'Corrida', 'Correr'], ['bike', 'Cycling', 'Bike', 'Bici'], ['natacao', 'Swimming', 'Natação', 'Natación'], ['luta', 'Martial arts', 'Lutas', 'Artes marciales'],
  ['danca', 'Dancing', 'Dança', 'Baile'], ['esportes', 'Team sports', 'Esportes coletivos', 'Deportes de equipo'], ['alongamento', 'Stretching / yoga', 'Alongamento / ioga', 'Estiramientos / yoga'], ['hiit', 'Intervals (HIIT)', 'Intervalado (HIIT)', 'Intervalos (HIIT)']];
const NIVEIS_DOR = [['leve', 'Mild', 'Leve', 'Leve'], ['moderada', 'Moderate', 'Moderada', 'Moderada'], ['forte', 'Strong', 'Forte', 'Fuerte']];
const COSTAS_OPC = [[0, 'Fingers overlap', 'Os dedos passam um do outro', 'Los dedos se cruzan'], [1, 'Fingers touch', 'Os dedos encostam', 'Los dedos se tocan'], [2, 'Up to 5 cm apart', 'Falta até 5 cm', 'Faltan hasta 5 cm'], [3, 'More than 5 cm apart', 'Falta mais de 5 cm', 'Faltan más de 5 cm']];
const AGACH_OBS = [['calcanhar', 'Heels come off the floor', 'Os calcanhares saem do chão', 'Los talones se levantan'], ['joelho', 'Knees cave in', 'Os joelhos vão para dentro', 'Las rodillas van hacia dentro'],
  ['tronco', 'Torso leans far forward', 'O tronco inclina muito para a frente', 'El tronco se inclina mucho hacia delante'], ['bracos', 'Arms fall forward', 'Os braços caem para a frente', 'Los brazos caen hacia delante'],
  ['assimetria', 'Body shifts to one side', 'O corpo pende para um lado', 'El cuerpo se va hacia un lado'], ['dor', 'Something hurts', 'Sente dor', 'Sientes dolor']];
/* norms: CSEP push-ups (as in ACSM's guidelines), YMCA step test, Cooper Institute VO2max; rows end at the age shown */
const CSEP_FLEX = { m: [[29, 36, 29, 22, 17], [39, 30, 22, 17, 12], [49, 25, 17, 13, 10], [59, 21, 13, 10, 7], [999, 18, 11, 8, 5]],
  f: [[29, 30, 21, 15, 10], [39, 27, 20, 13, 8], [49, 24, 15, 11, 5], [59, 21, 11, 7, 2], [999, 17, 12, 5, 2]] };
const YMCA_DEGRAU = { m: [[25, 76, 84, 93, 100, 107, 119], [35, 76, 85, 94, 102, 110, 121], [45, 76, 88, 98, 105, 113, 124], [55, 82, 93, 101, 111, 119, 126], [65, 77, 94, 100, 109, 117, 128], [999, 81, 92, 102, 110, 118, 126]],
  f: [[25, 81, 93, 102, 110, 120, 131], [35, 80, 92, 101, 110, 119, 129], [45, 84, 96, 104, 112, 120, 132], [55, 91, 101, 110, 118, 124, 132], [65, 92, 103, 111, 118, 127, 135], [999, 92, 101, 111, 121, 126, 133]] };
const COOPER_VO2 = { m: [[29, 55.4, 51.1, 45.4, 41.7], [39, 54, 48.3, 44, 40.5], [49, 52.5, 46.4, 42.4, 38.5], [59, 48.9, 43.4, 39.2, 35.6], [69, 45.7, 39.5, 35.5, 32.3], [999, 42.1, 36.7, 32.3, 29.4]],
  f: [[29, 49.6, 43.9, 39.5, 36.1], [39, 47.4, 42.4, 37.8, 34.4], [49, 45.3, 39.7, 36.3, 33], [59, 41.1, 36.7, 33, 30.1], [69, 37.8, 33, 30, 27.5], [999, 36.7, 30.9, 28.1, 25.9]] };
const linhaNorma = (tab, sexo, idade) => { const l = tab[sexo]; return l.find(r => idade <= r[0]) || l[l.length - 1]; };
/* the higher the better: the first threshold reached */
const catAcima = (v, row) => { for (let i = 1; i < row.length; i++) if (v >= row[i]) return i - 1; return row.length - 1; };
/* the lower the better (recovery heart rate): the first upper bound not passed */
const catAbaixo = (v, row) => { for (let i = 1; i < row.length; i++) if (v <= row[i]) return i - 1; return row.length - 1; };
/* [names, last "good" index, first "attention" index] */
const CAT_FLEX = [[['Excellent', 'Excelente', 'Excelente'], ['Very good', 'Muito bom', 'Muy bueno'], ['Good', 'Bom', 'Bueno'], ['Fair', 'Regular', 'Regular'], ['Needs improvement', 'Precisa melhorar', 'Necesita mejorar']], 1, 3];
const CAT_DEGRAU = [[['Excellent', 'Excelente', 'Excelente'], ['Good', 'Bom', 'Bueno'], ['Above average', 'Acima da média', 'Por encima de la media'], ['Average', 'Na média', 'En la media'], ['Below average', 'Abaixo da média', 'Por debajo de la media'], ['Poor', 'Fraco', 'Bajo'], ['Very poor', 'Muito fraco', 'Muy bajo']], 2, 4];
const CAT_VO2 = [[['Superior', 'Superior', 'Superior'], ['Excellent', 'Excelente', 'Excelente'], ['Good', 'Bom', 'Bueno'], ['Fair', 'Regular', 'Regular'], ['Poor', 'Fraco', 'Bajo']], 2, 4];
const CAT_REP = [[['Athletic', 'De atleta', 'De atleta'], ['Good', 'Bom', 'Bueno'], ['Average', 'Na média', 'En la media'], ['Above ideal', 'Acima do ideal', 'Por encima de lo ideal']], 1, 3];
const CAT_PRANCHA = [[['Great', 'Ótimo', 'Excelente'], ['Very good', 'Muito bom', 'Muy bueno'], ['Good', 'Bom', 'Bueno'], ['Fair', 'Regular', 'Regular'], ['Weak', 'Fraco', 'Débil']], 1, 4];
const CAT_ALCANCE = [[['Good', 'Boa', 'Buena'], ['Adequate', 'Adequada', 'Adecuada'], ['Below ideal', 'Abaixo do ideal', 'Por debajo de lo ideal']], 0, 2];
const nomeCat = (C, i) => L3(C[0][i]), tomCat = (C, i) => (i <= C[1] ? 'ok' : i >= C[2] ? 'warn' : '');
/* Kline et al. 1987: weight in pounds, time in minutes, heart rate at the end */
const vo2Rockport = (kg, idade, sexo, min, fc) => 132.853 - 0.0769 * (kg * 2.20462) - 0.3877 * idade + 6.315 * (sexo === 'm' ? 1 : 0) - 3.2649 * min - 0.1565 * fc;
/* starting-weight lifts at the gym: the first one this gym has, in each movement */
const AV_FORCA = [['agachar', ['leg_press', 'hack', 'agachamento_smith', 'agachamento', 'goblet']], ['empurrar', ['supino_maquina', 'supino_reto_halteres', 'supino_reto_barra', 'supino_reto_smith']],
  ['puxar', ['puxada_frente', 'remada_baixa', 'remada_maquina', 'serrote']], ['quadril', ['hip_thrust_maq', 'hip_thrust', 'stiff', 'stiff_unilateral', 'cadeira_flexora']]];
const nAv = v => { const x = parseNum(v); return x != null && x >= 0 ? x : null; };
const temValor = v => v != null && String(v).trim() !== '';
const ultimaAval = p => { const l = (p && p.avaliacoes) || []; return l[l.length - 1] || null; };

/* ---------- results ---------- */
function resultadoAval(a, p) {
  const d = { ...p, ...a.medidas }, idade = nAv(d.idade), sx = d.sexo === 'f' || d.sexo === 'm' ? d.sexo : null, peso = nAv(d.peso), r = {};
  const norma = (tab, v, fn) => (sx && idade ? fn(v, linhaNorma(tab, sx, idade)) : null);
  const fcr = nAv(a.fcRepouso);
  if (fcr >= 30 && fcr <= 150) r.repouso = { bpm: Math.round(fcr), cat: fcr < 60 ? 0 : fcr < 70 ? 1 : fcr < 80 ? 2 : 3 };
  if (!a.leve) {
    if (a.cardioTeste === 'degrau') {
      const fd = nAv(a.degrauFc);
      if (fd >= 40 && fd <= 220) r.degrau = { bpm: Math.round(fd), cat: norma(YMCA_DEGRAU, fd, catAbaixo) };
    } else {
      const rm = nAv(a.rpMin), rs = nAv(a.rpSeg) || 0, rf = nAv(a.rpFc), min = rm ? rm + Math.min(rs, 59) / 60 : null;
      if (min && rf && peso && idade && sx) {
        const vo2 = vo2Rockport(peso, idade, sx, min, rf);
        if (vo2 > 10 && vo2 < 90) r.vo2 = { v: vo2, min, fc: Math.round(rf), cat: catAcima(vo2, linhaNorma(COOPER_VO2, sx, idade)) };
      } else if (min) r.caminhada = { min, fc: rf ? Math.round(rf) : null };
    }
    if (temValor(a.flexoes) && nAv(a.flexoes) != null) { const n = Math.round(nAv(a.flexoes)); r.flexoes = { n, cat: norma(CSEP_FLEX, n, catAcima), joelhos: sx === 'f' }; }
    if (nAv(a.agach) > 0) r.agach = { n: Math.round(nAv(a.agach)) };
    const pr = nAv(a.prancha);
    if (pr > 0) r.prancha = { s: Math.round(pr), cat: pr >= 120 ? 0 : pr >= 90 ? 1 : pr >= 60 ? 2 : pr >= 30 ? 3 : 4 };
    if (temValor(a.barra) && nAv(a.barra) != null) r.barra = { n: Math.round(nAv(a.barra)) };
    r.forca = (a.forca || []).filter(f => nAv(f.kg) > 0 && nAv(f.reps) > 0).map(f => ({ id: f.id, kg: nAv(f.kg), reps: Math.round(nAv(f.reps)), rir: f.rir, e1: e1rmRIR(nAv(f.kg), Math.round(nAv(f.reps)), f.rir) }));
  }
  if (a.alcanceLado) {
    const cm = nAv(a.alcanceCm), al = a.alcanceLado === 'toca' ? 0 : a.alcanceLado === 'passa' ? (cm || 1) : -(cm || 1);
    r.alcance = { cm: al, cat: al >= 10 ? 0 : al >= 0 ? 1 : 2 };
  }
  if (a.costasD != null || a.costasE != null) r.costas = { d: a.costasD, e: a.costasE };
  if (a.agachObs) r.agachObs = a.agachObs.slice();
  /* hero attributes, 1 to 5 */
  const at = {};
  if (r.flexoes && r.flexoes.cat != null) at.forca = [5, 4, 3, 2, 1][r.flexoes.cat];
  if (r.vo2) at.folego = [5, 4, 3, 2, 1][r.vo2.cat];
  else if (r.degrau && r.degrau.cat != null) at.folego = [5, 4, 4, 3, 2, 2, 1][r.degrau.cat];
  if (r.prancha) at.resist = [5, 4, 3, 2, 1][r.prancha.cat];
  if (r.alcance || r.costas || r.agachObs) {
    let pts = 5;
    if (r.alcance && r.alcance.cat === 2) pts--;
    if (r.costas) { if (r.costas.d >= 2) pts--; if (r.costas.e >= 2) pts--; }
    pts -= (r.agachObs || []).length;
    at.mobil = clamp(pts, 1, 5);
  }
  r.atributos = at;
  r.parqAlerta = (a.parq || []).some(Boolean);
  r.liberado = !!a.liberado;
  r.semNorma = !(sx && idade);
  return r;
}
function atributosHTML(at) {
  const linha = (k, nome) => `<div class="av-attr"><span>${t(nome)}</span>${at[k] ? `<span class="av-bar" role="img" aria-label="${at[k]}/5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= at[k] ? 'on' : ''}"></i>`).join('')}</span>` : `<em class="xs muted">${t('av_not_tested')}</em>`}</div>`;
  return `<div class="av-attrs">${linha('forca', 'av_strength')}${linha('folego', 'av_stamina')}${linha('resist', 'av_endurance')}${linha('mobil', 'av_mobility')}</div>`;
}
function detalhesHTML(r) {
  const linha = (nome, valor, C, i, sub) => {
    const cat = C && i != null ? `<span class="pill ${tomCat(C, i)}">${esc(nomeCat(C, i))}</span>` : '';
    return `<div class="av-row"><span class="av-n">${esc(nome)}</span>${valor ? `<b class="num">${esc(valor)}</b>` : ''}${cat || sub ? `<span class="av-c">${cat}${sub ? `<span class="small muted">${esc(sub)}</span>` : ''}</span>` : ''}</div>`;
  };
  const out = [];
  if (r.repouso) out.push(linha(t('av_rest_h'), r.repouso.bpm + ' bpm', CAT_REP, r.repouso.cat));
  if (r.degrau) out.push(linha(t('av_step_test'), r.degrau.bpm + ' bpm', CAT_DEGRAU, r.degrau.cat));
  if (r.vo2) out.push(linha(t('av_rockport'), t('av_vo2', { n: fmtKg(Math.round(r.vo2.v * 10) / 10) }), CAT_VO2, r.vo2.cat, `${fmtKg(Math.round(r.vo2.min * 10) / 10)} min · ${r.vo2.fc} bpm`));
  else if (r.caminhada) out.push(linha(t('av_rockport'), t('av_walk_time', { n: fmtKg(Math.round(r.caminhada.min * 10) / 10) })));
  if (r.flexoes) out.push(linha(t('av_pushups'), String(r.flexoes.n), CAT_FLEX, r.flexoes.cat));
  if (r.agach) out.push(linha(t('av_squats'), String(r.agach.n)));
  if (r.prancha) out.push(linha(t('av_plank'), r.prancha.s + ' s', CAT_PRANCHA, r.prancha.cat));
  if (r.barra) out.push(linha(t('av_pullups'), String(r.barra.n)));
  for (const f of r.forca || []) out.push(linha(exInfo(f.id).nome, `${fmtKg(f.kg)} kg × ${f.reps}`, null, null, t('av_e1rm', { n: fmtKg(Math.round(f.e1)) })));
  if (r.alcance) out.push(linha(t('av_reach'), (r.alcance.cm > 0 ? '+' : '') + fmtKg(r.alcance.cm) + ' cm', CAT_ALCANCE, r.alcance.cat));
  const costas = v => (v == null ? '—' : L3(COSTAS_OPC[v].slice(1)).toLowerCase());
  if (r.costas) out.push(linha(t('av_shoulder'), '', null, null, `${t('av_right_up')}: ${costas(r.costas.d)} · ${t('av_left_up')}: ${costas(r.costas.e)}`));
  if (r.agachObs) out.push(linha(t('av_squatcheck'), '', null, null, r.agachObs.length ? r.agachObs.map(id => L3(AGACH_OBS.find(o => o[0] === id).slice(1))).join(' · ') : t('av_none_happens')));
  return out.length ? `<div class="stack" style="gap:0">${out.join('')}</div>` : '';
}
/* for the AI coach and the plan */
function resumoAvalEn(av) {
  if (!av || !av.r) return '';
  const r = av.r, partes = [];
  partes.push(r.parqAlerta ? (r.liberado ? 'PAR-Q+ had a "yes" but a doctor cleared exercise' : 'PAR-Q+ flags: should see a doctor before hard training; did light tests only') : 'PAR-Q+: no flags');
  if (r.repouso) partes.push(`resting HR ${r.repouso.bpm} bpm`);
  if (r.degrau) partes.push(`YMCA step test recovery HR ${r.degrau.bpm}${r.degrau.cat != null ? ' (' + CAT_DEGRAU[0][r.degrau.cat][0] + ')' : ''}`);
  if (r.vo2) partes.push(`Rockport walk ${Math.round(r.vo2.min * 10) / 10} min, end HR ${r.vo2.fc}, VO2max ${Math.round(r.vo2.v * 10) / 10} (${CAT_VO2[0][r.vo2.cat][0]})`);
  else if (r.caminhada) partes.push(`1.6 km walk in ${Math.round(r.caminhada.min * 10) / 10} min`);
  if (r.flexoes) partes.push(`push-ups${r.flexoes.joelhos ? ' (from the knees)' : ''} ${r.flexoes.n}${r.flexoes.cat != null ? ' (' + CAT_FLEX[0][r.flexoes.cat][0] + ' for age)' : ''}`);
  if (r.agach) partes.push(`body-weight squats in 1 min ${r.agach.n}`);
  if (r.prancha) partes.push(`plank ${r.prancha.s} s`);
  if (r.barra) partes.push(`pull-ups ${r.barra.n}`);
  if ((r.forca || []).length) partes.push('submaximal lifts: ' + r.forca.map(f => `${exInfo(f.id).nomeEn} ${f.kg} kg x ${f.reps} (RIR ${f.rir}, est. 1RM ${Math.round(f.e1)} kg)`).join(', '));
  if (r.alcance) partes.push(`sit-and-reach ${r.alcance.cm > 0 ? '+' : ''}${r.alcance.cm} cm from the toes`);
  if (r.costas) partes.push(`hands behind the back: right on top ${r.costas.d == null ? '-' : COSTAS_OPC[r.costas.d][1].toLowerCase()}, left on top ${r.costas.e == null ? '-' : COSTAS_OPC[r.costas.e][1].toLowerCase()}`);
  if (r.agachObs) partes.push('overhead squat: ' + (r.agachObs.length ? r.agachObs.map(id => AGACH_OBS.find(o => o[0] === id)[1].toLowerCase()).join(', ') : 'no compensations'));
  return `Physical assessment (${dayKey(av.data)}, at ${av.onde === 'casa' ? 'home' : 'the gym'}): ` + partes.join('; ');
}
const gostosEn = p => (p.gostaTipos || []).map(id => (GOSTOS.find(g => g[0] === id) || [id, id])[1]).join(', ');
/* first time on an exercise: scale the population guess by how this person did in the assessment lifts */
const REGIAO = { peito: 'empurrar', ombros: 'empurrar', triceps: 'empurrar', costas: 'puxar', biceps: 'puxar', quadriceps: 'agachar', adutores: 'agachar', panturrilhas: 'agachar', posteriores: 'quadril', gluteos: 'quadril' };
function fatorAval(ex, p) {
  const av = ultimaAval(p), lista = av && av.r && av.r.forca;
  if (!lista || !lista.length) return 1;
  const fs = {};
  for (const f of lista) {
    const exf = EX[f.id], pop = exf ? e1Pop(exf, p) : null;
    if (pop && f.e1 > 0) fs[REGIAO[exf.grupo] || 'outro'] = clamp(f.e1 / pop, 0.4, 2.2);
  }
  const vals = Object.values(fs);
  if (!vals.length) return 1;
  const reg = REGIAO[ex.grupo];
  return reg && fs[reg] != null ? fs[reg] : vals.reduce((x, y) => x + y, 0) / vals.length;
}

/* ---------- the flow ---------- */
const AV_PASSOS = ['inicio', 'saude', 'dores', 'gostos', 'medidas', 'repouso', 'cardio', 'forca', 'mobilidade', 'resultado'];
const avPassos = a => AV_PASSOS.filter(x => !(a.leve && (x === 'cardio' || x === 'forca')));
function abrirAval() {
  const p = perfil();
  if (!p) return;
  const temGym = S.gym && (S.gym.itens || []).length, set = equipSet(S.gym);
  S.aval = {
    i: 0, onde: null, cardioTeste: null, parq: PARQ.map(() => null), leve: false, liberado: false,
    dores: (p.limites || []).map(id => ({ id, nivel: ((p.dores || []).find(d => d.id === id) || {}).nivel || 'leve' })), doresTxt: p.limitesTxt || '',
    gostos: (p.gostaTipos || []).slice(), evita: p.evita || '',
    medidas: { sexo: p.sexo || '', idade: p.idade || '', altura: p.altura || '', peso: p.peso || '', cintura: p.cintura || '', pescoco: p.pescoco || '', quadril: p.quadril || '' },
    fcRepouso: '', degrauFc: '', rpMin: '', rpSeg: '', rpFc: '', flexoes: '', agach: '', prancha: '', barra: '', alcanceLado: null, alcanceCm: '', costasD: null, costasE: null, agachObs: null,
    forca: AV_FORCA.map(([padrao, ids]) => { const lista = ids.filter(id => EX[id] && (!temGym || disponivel(EX[id], set))); return { padrao, ids: lista, id: lista[0] || ids[0], kg: '', reps: '', rir: 2 }; }),
    salvo: false,
  };
  closeSheet(); S.sub = 'aval'; render(); window.scrollTo(0, 0);
}
const comoBtn = id => `<button class="btn quiet small" data-a="guia" data-id="${id}">${I.info}${t('how_to')}</button>`;
function viewAval() {
  const a = S.aval, passos = avPassos(a), passo = passos[Math.min(a.i, passos.length - 1)], n = passos.indexOf(passo) + 1, p = perfil() || {};
  const q = (titulo, corpo) => `<p class="eyebrow">${t('av_e')}</p><h1 class="h-display h2">${esc(titulo)}</h1>${corpo}`;
  const seg2 = (k, opcoes, valor) => `<div class="seg">${opcoes.map(([v, nome]) => `<button data-a="avSet" data-k="${k}" data-v="${v}" aria-pressed="${String(valor) === String(v)}">${esc(nome)}</button>`).join('')}</div>`;
  const campo = (k, rot, ph, modo = 'decimal') => `<label class="f" for="av-${k}">${esc(rot)}<input class="inp num" id="av-${k}" data-in="av" data-k="${k}" inputmode="${modo}" maxlength="6" value="${esc(a[k] == null ? '' : a[k])}" placeholder="${esc(ph || '')}"></label>`;
  const bloco = (titulo, corpo, guia) => `<div class="av-q"><div class="av-qh"><h2 class="h3">${esc(titulo)}</h2>${guia ? comoBtn(guia) : ''}</div>${corpo}</div>`;
  const seguranca = `<p class="note warn">${t('av_safety')}</p>`;
  let html = '';
  switch (passo) {
    case 'inicio': {
      let mentor = ''; try { mentor = mentorAnimHTML(''); } catch { mentor = ''; }
      html = `<div class="hero"><div class="row" style="gap:14px;align-items:center;flex-wrap:nowrap">${mentor}<div class="stack" style="gap:4px;min-width:0"><p class="eyebrow">${t('av_e')}</p><h1 class="h-display h2">${t('av_intro_h')}</h1></div></div>
        <p class="muted">${t('av_intro')}</p><p class="small"><b>${t('av_map')}</b></p><p class="tip">${t('av_need')}</p></div>
        <p class="eyebrow">${t('av_where')}</p>${seg2('onde', [['academia', t('dif_gym')], ['casa', t('dif_home')]], a.onde)}`;
      break;
    }
    case 'saude': {
      const alerta = a.parq.some(Boolean);
      html = q(t('av_health_h'), `<p class="small muted">${t('av_health_note')}</p>
        <div class="stack" style="gap:10px">${PARQ.map((pq, k) => `<div class="av-q"><p class="small">${k + 1}. ${esc(L3(pq))}</p><div class="seg"><button data-a="avParq" data-k="${k}" data-v="1" aria-pressed="${a.parq[k] === true}">${t('av_yes')}</button><button data-a="avParq" data-k="${k}" data-v="0" aria-pressed="${a.parq[k] === false}">${t('av_no')}</button></div></div>`).join('')}</div>
        ${alerta ? `<p class="note warn">${t('av_health_flag')}</p><div class="stack" style="gap:8px"><button class="opt" data-a="avSet" data-k="leve" data-v="1" aria-pressed="${a.leve}"><b>${t('av_light_only')}</b><span>${t('av_light_only_d')}</span></button><button class="opt" data-a="avSet" data-k="liberado" data-v="1" aria-pressed="${a.liberado}"><b>${t('av_cleared')}</b><span>${t('av_cleared_d')}</span></button></div>` : ''}`);
      break;
    }
    case 'dores': {
      const nomeLim = id => L3((LIMITES.find(l => l[0] === id) || [id, id, id, id]).slice(1));
      html = q(t('av_pain_h'), `<p class="small muted">${t('av_pain_note')}</p>
        <div class="chips"><button class="chip" data-a="avDorNada" aria-pressed="${!a.dores.length}">${t('av_pain_none')}</button>${LIMITES.map(l => `<button class="chip" data-a="avDor" data-v="${l[0]}" aria-pressed="${a.dores.some(d => d.id === l[0])}">${esc(L3(l.slice(1)))}</button>`).join('')}</div>
        ${a.dores.map(d => `<div class="av-q"><p class="small"><b>${esc(nomeLim(d.id))}</b></p><div class="seg">${NIVEIS_DOR.map(nv => `<button data-a="avDorNivel" data-k="${d.id}" data-v="${nv[0]}" aria-pressed="${d.nivel === nv[0]}">${esc(L3(nv.slice(1)))}</button>`).join('')}</div></div>`).join('')}
        ${a.dores.some(d => d.nivel === 'forte') ? `<p class="note warn">${t('av_pain_strong')}</p>` : ''}
        <label class="f" for="av-doresTxt">${t('av_pain_more')}<textarea class="inp" id="av-doresTxt" data-in="av" data-k="doresTxt" maxlength="300" placeholder="${esc(t('av_pain_ph'))}">${esc(a.doresTxt)}</textarea></label>`);
      break;
    }
    case 'gostos': html = q(t('av_likes_h'), `<p class="small muted">${t('av_likes_note')}</p>
        <div class="chips">${GOSTOS.map(g => `<button class="chip" data-a="avGosto" data-v="${g[0]}" aria-pressed="${a.gostos.includes(g[0])}">${esc(L3(g.slice(1)))}</button>`).join('')}</div>
        <label class="f" for="av-evita">${t('av_dislikes')}<textarea class="inp" id="av-evita" data-in="av" data-k="evita" maxlength="200" placeholder="${esc(t('av_dislikes_ph'))}">${esc(a.evita)}</textarea></label>`); break;
    case 'medidas': {
      const d = { ...p, ...a.medidas };
      const num = (k, rot, ph, max) => `<label class="f" for="av-${k}">${t(rot)}<input class="inp num" id="av-${k}" data-in="avMedida" data-k="${k}" inputmode="decimal" maxlength="${max}" value="${esc(d[k] == null ? '' : d[k])}" placeholder="${esc(ph)}"></label>`;
      html = q(t('av_body_h'), `<p class="small muted">${t('av_body_note')}</p>
        <div class="chips">${SEXOS.map(r => `<button class="chip" data-a="avSexo" data-v="${r[0]}" aria-pressed="${(d.sexo || '') === r[0]}">${esc(L3(r.slice(1)))}</button>`).join('')}</div>
        <div class="grid2">${num('idade', 'wz_age', t('ph_years'), 3)}${num('altura', 'wz_height', 'cm', 3)}</div>
        <label class="f" for="bc-peso">${t('bc_weight')}<input class="inp num" id="bc-peso" data-in="avMedida" data-k="peso" inputmode="decimal" maxlength="5" value="${esc(d.peso == null ? '' : d.peso)}" placeholder="kg"></label>
        ${medidasCamposHTML(d, 'avMedida')}<div class="card pad" id="av-comp">${composicaoHTML(d)}</div>`);
      break;
    }
    case 'repouso': html = q(t('av_rest_h'), `<p class="small muted">${t('av_rest_note')}</p>${cronoHTML('repouso', t('av_count30'))}${campo('fcRepouso', t('av_bpm'), 'bpm', 'numeric')}`); break;
    case 'cardio': {
      const teste = a.cardioTeste || (a.onde === 'casa' ? 'degrau' : 'rockport');
      html = q(t('av_cardio_h'), `${seg2('cardioTeste', [['degrau', t('av_test_step')], ['rockport', t('av_test_walk')]], teste)}${seguranca}${teste === 'degrau'
        ? bloco(t('av_step_test'), `<p class="small muted">${t('av_step_note')}</p>${cronoHTML('degrau', t('av_step_go'))}${campo('degrauFc', t('av_beats_min'), 'bpm', 'numeric')}<p class="xs muted">${t('av_step_watch')}</p>`)
        : bloco(t('av_rockport'), `<p class="small muted">${t('av_rockport_note')}</p><div class="grid2">${campo('rpMin', t('av_min'), 'min', 'numeric')}${campo('rpSeg', t('av_sec'), 's', 'numeric')}</div>${campo('rpFc', t('av_hr_end'), 'bpm', 'numeric')}`)}
        <p class="xs muted">${t('av_skip_hint')}</p>`);
      break;
    }
    case 'forca': html = q(t('av_strength_h'), `${seguranca}
      ${bloco(t('av_pushups'), `<p class="small muted">${t(a.medidas.sexo === 'f' ? 'av_pushups_f' : 'av_pushups_m')}</p>${campo('flexoes', t('av_count'), '0', 'numeric')}`, 'flexao')}
      ${bloco(t('av_squats'), `<p class="small muted">${t('av_squats_note')}</p>${cronoHTML('agach', t('av_start_min'))}${campo('agach', t('av_count'), '0', 'numeric')}`, 'agach_livre')}
      ${bloco(t('av_plank'), `<p class="small muted">${t('av_plank_note')}</p>${cronoHTML('prancha', t('av_start_watch'))}${campo('prancha', t('av_seconds'), 's', 'numeric')}`, 'prancha')}
      ${a.onde === 'casa' ? bloco(t('av_pullups'), `<p class="small muted">${t('av_pullups_note')}</p>${campo('barra', t('av_count'), '', 'numeric')}`, 'barra_fixa')
        : `<div class="av-q"><h2 class="h3">${t('av_lifts')}</h2><p class="small muted">${t('av_lifts_note')}</p>${a.forca.map((f, k) => liftHTML(f, k)).join('')}</div>`}
      <p class="xs muted">${t('av_skip_hint')}</p>`); break;
    case 'mobilidade': html = q(t('av_mob_h'), `
      ${bloco(t('av_reach'), `<p class="small muted">${t('av_reach_note')}</p>
        <div class="chips">${[['antes', 'av_reach_before'], ['toca', 'av_reach_touch'], ['passa', 'av_reach_past']].map(([v, s]) => `<button class="chip" data-a="avSet" data-k="alcanceLado" data-v="${v}" aria-pressed="${a.alcanceLado === v}">${t(s)}</button>`).join('')}</div>
        ${a.alcanceLado && a.alcanceLado !== 'toca' ? campo('alcanceCm', t('av_reach_cm'), 'cm') : ''}`)}
      ${bloco(t('av_shoulder'), `<p class="small muted">${t('av_shoulder_note')}</p>
        <p class="eyebrow">${t('av_right_up')}</p><div class="chips">${COSTAS_OPC.map(o => `<button class="chip" data-a="avCostas" data-k="costasD" data-v="${o[0]}" aria-pressed="${a.costasD === o[0]}">${esc(L3(o.slice(1)))}</button>`).join('')}</div>
        <p class="eyebrow">${t('av_left_up')}</p><div class="chips">${COSTAS_OPC.map(o => `<button class="chip" data-a="avCostas" data-k="costasE" data-v="${o[0]}" aria-pressed="${a.costasE === o[0]}">${esc(L3(o.slice(1)))}</button>`).join('')}</div>`)}
      ${bloco(t('av_squatcheck'), `<p class="small muted">${t('av_squatcheck_note')}</p>
        <div class="chips"><button class="chip" data-a="avObsNada" aria-pressed="${Array.isArray(a.agachObs) && !a.agachObs.length}">${t('av_none_happens')}</button>${AGACH_OBS.map(o => `<button class="chip" data-a="avObs" data-v="${o[0]}" aria-pressed="${(a.agachObs || []).includes(o[0])}">${esc(L3(o.slice(1)))}</button>`).join('')}</div>`)}`); break;
    case 'resultado': html = resultadoHTML(); break;
  }
  const ult = passo === 'resultado';
  return `<section class="screen">
    <div class="row between"><span class="small muted num">${t('av_step', { a: n, b: passos.length })}</span>${ult ? '' : `<button class="btn quiet small" data-a="avSair">${t('cancel')}</button>`}</div>
    <div class="xp-track" aria-hidden="true"><div class="xp-fill" style="width:${(n / passos.length) * 100}%"></div></div>
    <div class="stack">${html}</div>
    ${ult ? '' : `<div class="row" style="flex-wrap:nowrap">${a.i > 0 ? `<button class="btn ghost" data-a="avVoltar">${t('back')}</button>` : ''}<button class="btn block" data-a="avAvancar">${t('continue')}</button></div>`}
  </section>`;
}
function liftHTML(f, k) {
  const ex = exInfo(f.id), tipo = tipoCarga(ex), e1 = nAv(f.kg) > 0 && nAv(f.reps) > 0 ? e1rmRIR(nAv(f.kg), Math.round(nAv(f.reps)), f.rir) : null;
  const rotKg = tipo === 'halter' ? t('av_kg_db') : tipo === 'halter1' ? t('av_kg_db1') : tipo === 'barra' ? t('av_kg_bar') : 'kg';
  return `<div class="av-lift">
    <div class="av-qh"><b>${esc(ex.nome)}</b>${comoBtn(f.id)}</div>${f.ids.length > 1 ? `<button class="btn quiet small" data-a="avLiftTroca" data-k="${k}" style="align-self:flex-start">${I.troca}${t('av_change_ex')}</button>` : ''}
    <div class="grid2"><label class="f">${esc(rotKg)}<input class="inp num" data-in="avLift" data-k="${k}" data-c="kg" inputmode="decimal" maxlength="6" value="${esc(f.kg)}" placeholder="kg"></label><label class="f">${t('u_reps')}<input class="inp num" data-in="avLift" data-k="${k}" data-c="reps" inputmode="numeric" maxlength="2" value="${esc(f.reps)}" placeholder="6–10"></label></div>
    <div class="row" style="gap:10px;align-items:center;flex-wrap:nowrap"><span class="xs muted">${t('av_left')}</span><div class="seg" style="flex:1">${[1, 2, 3].map(v => `<button data-a="avLiftRir" data-k="${k}" data-v="${v}" aria-pressed="${f.rir === v}">${v}</button>`).join('')}</div></div>
    <p class="xs muted num" id="av-e1-${k}">${e1 ? esc(t('av_e1rm', { n: fmtKg(Math.round(e1)) })) : ''}</p>
  </div>`;
}
function resultadoHTML() {
  const a = S.aval, p = perfil() || {}, r = a.registro ? a.registro.r : resultadoAval(a, p), d = { ...p, ...a.medidas };
  let heroi = ''; try { heroi = heroiAnimHTML(heroiDe(S.me), 'parado'); } catch { heroi = ''; }
  const pr = progresso(S.me), detalhes = detalhesHTML(r);
  return `<div class="hero"><p class="eyebrow">${t('av_e')}</p><h1 class="h-display h2">${t('av_result_h')}</h1>
      <div class="av-ficha">${heroi}${atributosHTML(r.atributos)}</div>
      <p class="small">${t(r.parqAlerta ? (r.liberado ? 'av_health_cleared' : 'av_health_warn') : 'av_health_ok')}</p>
      ${a.leve ? `<p class="note warn">${t('av_light_mode')}</p>` : ''}</div>
    ${detalhes ? `<div class="card pad stack"><h2 class="h3">${t('av_details')}</h2>${detalhes}${r.semNorma ? `<p class="xs muted">${t('av_no_norm')}</p>` : ''}</div>` : ''}
    ${composicao(d).imc ? `<div class="card pad stack"><h2 class="h3">${t('bc_title')}</h2>${composicaoHTML(d)}</div>` : ''}
    <div class="card pad stack"><h2 class="h3">${t('av_ai_h')}</h2><div id="avIA">${a.analise ? `<div class="md">${md(a.analise)}</div>` : AI.on ? `<p class="msg think">${t('av_ai_writing')}</p>` : `<p class="note">${t('av_ai_off')}</p>`}</div></div>
    <p class="xs muted">${t('av_sources')}</p>
    ${pr && !pr.completo ? `<p class="small muted">${t('av_plan_uses')}</p>` : `<button class="btn big block" data-a="avPlano">${pr && pr.completo ? t('next_chapter') : t('av_build')}</button>`}
    <button class="btn ${pr && !pr.completo ? '' : 'quiet '}block" data-a="avConcluir">${t('av_finish')}</button>`;
}

/* ---------- timers: the step-test beat, a minute of squats, the plank, 30 s of pulse ---------- */
const AVT = { id: null, tipo: '', ini: 0, fim: 0, beat: -1, fase: '', meio: false };
function avTimerFim() { clearInterval(AVT.id); AVT.id = null; AVT.tipo = ''; if (!S.live) stopWakeLock(); }
function cronoHTML(tipo, rotulo) {
  return `<div class="av-timer" id="avt-${tipo}">${AVT.id && AVT.tipo === tipo ? '' : `<button class="btn ghost block" data-a="avCrono" data-v="${tipo}">${tipo === 'repouso' ? I.pulso : I.crono}${esc(rotulo)}</button>`}</div>`;
}
function avCrono(tipo) {
  unlockAudio(); startWakeLock();
  clearInterval(AVT.id);
  const agora = Date.now();
  Object.assign(AVT, { tipo, beat: 0, fase: 'pronto', ini: agora + 3000, fim: 0, meio: false });
  if (tipo === 'degrau') AVT.fim = AVT.ini + 180000;
  if (tipo === 'agach') AVT.fim = AVT.ini + 60000;
  if (tipo === 'repouso') { Object.assign(AVT, { fase: 'vai', ini: agora, fim: agora + 30000 }); tom(880, 0.15); }
  AVT.id = setInterval(avTick, 40);
  avTick();
}
function avParar(salvar) {
  if (salvar && AVT.tipo === 'prancha' && S.aval) S.aval.prancha = String(Math.max(0, Math.round((Date.now() - AVT.ini) / 1000)));
  avTimerFim(); render();
}
function avTick() {
  const el = $('#avt-' + AVT.tipo);
  if (!el) { avTimerFim(); return; }
  const agora = Date.now(), mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + pad2(s % 60); };
  const parar = `<button class="btn quiet small" data-a="avPararCrono">${t('av_stop')}</button>`;
  if (AVT.fase === 'pronto') {
    if (agora < AVT.ini) {
      const s = Math.ceil((AVT.ini - agora) / 1000);
      if (AVT.beat !== -s) { AVT.beat = -s; tom(660, 0.08); }
      el.innerHTML = `<div class="av-big num">${s}</div><p class="small">${t('av_get_ready')}</p>${parar}`;
      return;
    }
    AVT.fase = 'vai'; AVT.beat = -1; tom(1100, 0.25); vibrar([150]);
  }
  if (AVT.tipo === 'prancha') { el.innerHTML = `<div class="av-big num">${mmss(agora - AVT.ini)}</div><button class="btn ok block" data-a="avPararPrancha">${t('av_stop')}</button>`; return; }
  if (AVT.fase === 'vai' && AVT.tipo === 'degrau') {
    /* 96 beats a minute: up, up, down, down */
    const b = Math.floor((agora - AVT.ini) / 625);
    if (b !== AVT.beat) { AVT.beat = b; tom(b % 4 === 0 ? 1320 : 880, 0.05, 0, 0.35); }
    if (agora < AVT.fim) {
      const sobe = b % 4 < 2;
      el.innerHTML = `<div class="av-big${sobe ? ' sobe' : ''}">${sobe ? t('av_up') : t('av_down')}</div><div class="av-dots" aria-hidden="true">${[0, 1, 2, 3].map(k => `<i class="${k === b % 4 ? 'on' : ''}${k < 2 ? ' up' : ''}"></i>`).join('')}</div><p class="small num">${mmss(AVT.fim - agora)}</p>${parar}`;
      return;
    }
    /* the 3 minutes are over: sit down and count for a whole minute */
    Object.assign(AVT, { fase: 'pulso', ini: agora, fim: agora + 60000, meio: false }); tom(660, 0.6); vibrar([400]);
  }
  if (AVT.fase === 'pulso' && !AVT.meio && AVT.fim - agora <= 30000) { AVT.meio = true; tom(990, 0.12); vibrar([80]); }
  if (agora < AVT.fim) {
    const dica = AVT.fase === 'pulso' ? (AVT.meio && AVT.fim - agora > 26000 ? t('av_look_watch') : t('av_count_now')) : '';
    el.innerHTML = `<div class="av-big num">${mmss(AVT.fim - agora)}</div>${dica ? `<p class="small"><b>${dica}</b></p>` : ''}${parar}`;
    return;
  }
  const tipo = AVT.tipo;
  tom(660, 0.25); tom(660, 0.25, 0.32); vibrar([220, 120, 220]);
  avTimerFim();
  el.innerHTML = `<p class="small"><b>${t(tipo === 'repouso' ? 'av_done_x2' : 'av_done_type')}</b></p>`;
  const campo = $({ repouso: '#av-fcRepouso', degrau: '#av-degrauFc', agach: '#av-agach' }[tipo] || '#nada');
  if (campo) campo.focus();
}

/* ---------- saving ---------- */
async function salvarAval() {
  const a = S.aval, pid = S.me, p = perfil(pid);
  if (!a || !p || a.salvo) return;
  a.salvo = true;
  const r = resultadoAval(a, p), data = Date.now();
  const av = { data, onde: a.onde, leve: a.leve, liberado: a.liberado, parq: a.parq, r };
  const body = { ...p, atualizadoEm: data, gostaTipos: a.gostos.slice(), evita: (a.evita || '').slice(0, 200) };
  /* pains become the plan's care points (what the assessment shows is the current state) */
  body.limites = a.dores.map(d => d.id);
  body.dores = a.dores.map(d => ({ id: d.id, nivel: d.nivel }));
  body.limitesTxt = (a.doresTxt || '').slice(0, 300);
  body.sexo = a.medidas.sexo || '';
  for (const k of ['idade', 'altura', 'peso', 'cintura', 'pescoco', 'quadril']) if (temValor(a.medidas[k])) body[k] = String(a.medidas[k]).trim();
  body.medidas = novaMedida(p, body);
  body.avaliacoes = [...(p.avaliacoes || []), av].slice(-12);
  try { await save('perfis/' + pid, body, t('av_saved')); } catch { a.salvo = false; return; }
  S.perfis[pid] = body;
  a.registro = av;
  /* the numbers become history the load calculator reads: starting weights and body-weight targets */
  const exs = [];
  const item = (id, sets, alvo, rir = 0) => { const ex = exInfo(id); exs.push({ id, nome: ex.nome, grupo: ex.grupo, alvo: { series: 1, rmin: alvo, rmax: alvo, rir, desc: 90 }, pulado: false, trocadoDe: '', sets }); };
  for (const f of r.forca || []) item(f.id, [{ kg: f.kg, reps: f.reps, ok: true, rir: f.rir }], f.reps, f.rir);
  if (r.flexoes && r.flexoes.n > 0 && !r.flexoes.joelhos) item('flexao', [{ kg: null, reps: r.flexoes.n, ok: true }], r.flexoes.n);
  if (r.agach) item('agach_livre', [{ kg: null, reps: r.agach.n, ok: true }], r.agach.n);
  if (r.prancha) item('prancha', [{ kg: null, reps: r.prancha.s, ok: true }], r.prancha.s);
  if (r.barra && r.barra.n > 0) item('barra_fixa', [{ kg: null, reps: r.barra.n, ok: true }], r.barra.n);
  if (exs.length) {
    const sess = { pid, planoId: null, ciclo: null, dia: null, diaNome: t('av_session_name'), foco: '', semana: null, fase: null, deload: false, inicio: data - 1000, fim: data, sensacao: '', nota: '', rir: 2, avaliacao: true, exs };
    const sid = pid + '-av' + data.toString(36);
    try { await save('sessoes/' + sid, sess); if (!S.sessoes.some(s => s._id === sid)) S.sessoes.unshift({ ...sess, _id: sid }); } catch { /* the toast already explained */ }
  }
  if (S.sub === 'aval') render();
  if (AI.on) lerAvaliacao();
}
/* the trainer's reading, streamed, then kept with the assessment */
function lerAvaliacao() {
  const a = S.aval, p = perfil();
  if (!a || !a.registro || !p) return;
  const el0 = $('#avIA'); if (el0) el0.innerHTML = `<p class="msg think">${t('av_ai_writing')}</p>`;
  const prompt = `You are ${p.nome}'s personal trainer. ${p.nome} just did a physical assessment. Read the results like a good trainer would and explain them simply.

PERSON
${ctxPerfil({ ...p, avaliacoes: [] })}

RESULTS
${resumoAvalEn(a.registro)}

Write short sections with markdown headings: "Strengths", "What to improve first", "Care points" (pains, the health screening, mobility limits; say when to see a doctor or physiotherapist) and "How your plan will use this" (starting weights, volume, cardio type and intensity, mobility work). Use the numbers above, be encouraging and honest, and make no diagnosis. About 200 to 280 words.
${idioma()}`;
  aiText(prompt, { modelTier: 'default', onText: ({ text }) => { const el = $('#avIA'); if (el) el.innerHTML = `<div class="md">${md(text)}</div>`; } })
    .then(async res => {
      const texto = typeof res === 'string' ? res : (res && res.text) || '';
      if (!texto || !S.aval) return;
      S.aval.analise = texto;
      const p2 = perfil(), lista = ((p2 && p2.avaliacoes) || []).slice();
      if (!lista.length) return;
      lista[lista.length - 1] = { ...lista[lista.length - 1], analise: texto.slice(0, 4000) };
      const body = { ...p2, avaliacoes: lista };
      try { await save('perfis/' + S.me, body); S.perfis[S.me] = body; } catch { /* still on screen */ }
    })
    .catch(e => { const el = $('#avIA'); if (el && !(e && e.code === 'cancelled')) el.innerHTML = `<div class="note err">${esc(aiErrorText(e))}</div><button class="btn ghost small" data-a="avIA">${t('try_again')}</button>`; });
}
function avAvancar() {
  const a = S.aval, passo = avPassos(a)[a.i];
  if (passo === 'inicio' && !a.onde) { toast(t('av_need_where')); return; }
  if (passo === 'saude') {
    if (a.parq.some(v => v == null)) { toast(t('av_need_health')); return; }
    if (a.parq.some(Boolean) && !a.leve && !a.liberado) { toast(t('av_need_choice')); return; }
    if (!a.parq.some(Boolean)) { a.leve = false; a.liberado = false; }
  }
  if (passo === 'inicio' && !a.cardioTeste) a.cardioTeste = a.onde === 'casa' ? 'degrau' : 'rockport';
  avTimerFim();
  a.i = Math.min(a.i + 1, avPassos(a).length - 1);
  render(); window.scrollTo(0, 0);
  if (avPassos(a)[a.i] === 'resultado') salvarAval();
}
/* the Plan and Journey card: last attributes, progress since the first one, redo */
function avalCardHTML(p) {
  const lista = (p && p.avaliacoes) || [], av = lista[lista.length - 1];
  if (!av) return '';
  const r0 = (lista[0] && lista[0].r) || {}, r1 = av.r || {}, itens = [];
  const dif = (nome, va, vb, un, menorMelhor) => {
    if (va == null || vb == null || lista.length < 2) return;
    const dl = Math.round((vb - va) * 10) / 10;
    if (!dl) return;
    itens.push(`<span class="pill ${(menorMelhor ? dl < 0 : dl > 0) ? 'ok' : 'warn'}">${esc(nome)} ${dl > 0 ? '+' : ''}${fmtKg(dl)}${un}</span>`);
  };
  const v = (r, k, c) => (r[k] ? r[k][c] : null);
  dif(t('av_pushups_s'), v(r0, 'flexoes', 'n'), v(r1, 'flexoes', 'n'), '', false);
  dif(t('av_plank'), v(r0, 'prancha', 's'), v(r1, 'prancha', 's'), ' s', false);
  dif('VO2', v(r0, 'vo2', 'v'), v(r1, 'vo2', 'v'), '', false);
  dif(t('av_step_s'), v(r0, 'degrau', 'bpm'), v(r1, 'degrau', 'bpm'), ' bpm', true);
  dif(t('av_rest_s'), v(r0, 'repouso', 'bpm'), v(r1, 'repouso', 'bpm'), ' bpm', true);
  return `<div class="card pad stack" id="aval"><div class="row between"><h2 class="h3">${t('av_btn')}</h2><span class="xs muted">${esc(t('av_last', { d: fmtDia(new Date(av.data)) }))}</span></div>
    ${atributosHTML(r1.atributos || {})}
    ${itens.length ? `<p class="xs muted">${t('av_since')}</p><div class="casa-tags">${itens.join('')}</div>` : ''}
    <button class="btn ghost block" data-a="avAbrir">${t('av_redo')}</button></div>`;
}
