// Shared EN/ES text toggle for the whole site (any page with data-i18n /
// data-i18n-html attributes and a #lang-toggle button). Single source of
// truth for the Spanish dictionary — used by index.html and apply.html.
// Remembers the choice in localStorage ("tbs-lang") so it carries over
// between pages.
(function(){
  var ES = {
    'nav.method':'Método','nav.story':'Historia','nav.programs':'Programas','nav.results':'Resultados',
    'nav.contact':'Contacto','nav.login':'Acceso Clientes','nav.application':'Aplicación','nav.running':'Running','nav.camp':'Camp','nav.shop':'Shop',
    'camp.eyebrow':'Camp',
    'camp.h2':'Parte del entrenamiento pasa en otro lugar',
    'camp.p':'Un par de veces al año llevo esto a la ruta — elijo un lugar, aparto tiempo real, y hago sesiones presenciales intensivas ahí. El mismo sistema, armado en un bloque fijo, en otro lugar por un tiempo.',
    'camp.map1':'Buenos Aires','camp.map2':'Bali','camp.map3':'Sydney',
    'camp.contact.tag':'Contactame',
    'camp.contact.h3':'¿Dónde querés entrenar?',
    'camp.contact.p':'Contame el lugar y más o menos cuándo — te respondo para ver si tiene sentido armar un camp ahí.',
    'camp.contact.name':'Nombre',
    'camp.contact.email':'Email',
    'camp.contact.message':'¿Dónde (y cuándo)?',
    'camp.contact.placeholder':'ej. Bali, 2 semanas, en marzo',
    'camp.contact.btn':'Contactame',
    'camp.contact.successh3':'Listo',
    'camp.contact.successp':'Te respondo pronto para hablarlo.',
    'hero.eyebrow':'Coaching para quienes ya no quieren ir a la deriva',
    'hero.lede':'thebuildsystem es un sistema de coaching físico y mental creado por alguien que primero se reconstruyó a sí mismo — desde un momento bajo en 2020 hasta un valle remoto en Australia y Hyrox. Entrenamiento, alimentación y cabeza, como un solo sistema, para cualquiera que ronde los 25 y esté cansado de ir en piloto automático.',
    'hero.cta1':'Aplicá al coaching 1:1',
    'hero.cta2':'Conseguí el Programa Solo',
    'hero.cta3':'Empezá',
    'hero.trust1':'80K en TikTok e Instagram',
    'hero.trust2':'3 años entrenando en Australia',
    'hero.trust3':'Finisher de Hyrox',
    'method.eyebrow':'El método',
    'method.h2':'Tres sistemas. Un solo engranaje.',
    'method.p':'La mayoría de los programas te dan un PDF y desaparecen. thebuildsystem une entrenamiento, alimentación y mentalidad en un solo ciclo — porque una rutina que ignora tu cabeza y tu plato no aguanta más de tres semanas.',
    'pillar.training.h3':'Entrenamiento',
    'pillar.training.p':'Bloques de fuerza y acondicionamiento progresivos, armados según tu equipo y tu agenda — no una plantilla genérica de 12 semanas.',
    'pillar.nutrition.h3':'Alimentación',
    'pillar.nutrition.p':'Objetivos calóricos comida por comida en tres niveles de intensidad, estilo nutrición deportiva — con una comida libre cada fin de semana.',
    'pillar.mind.h3':'Mente',
    'pillar.mind.p':'La parte que la mayoría de los coaches se salta. Estructura diaria, journaling y check-ins para los días de miedo al fracaso y cero motivación — los que realmente definen el resultado.',
    'story.eyebrow':'El fundador',
    'story.caption':'Tomi — Fundador y coach',
    'story.h2':'De un momento bajo a la largada de Hyrox',
    'story.p':'Empecé a entrenar en 2020 para salir de un pozo mental — no para armar una marca. Desde entonces es el mismo sistema, aplicado primero en mí.',
    'stat.1.l':'Empezó a entrenar',
    'stat.2.l':'Viviendo y trabajando en Australia',
    'stat.3.l':'Primer training camp presencial',
    'stat.4.l':'Seguidores construidos en el proceso',
    't1.h3':'Entrenar como salida',
    't1.p':'Empecé a entrenar para salir de un pozo mental — sin plan, sin coach, solo constancia y prestar atención a lo que realmente funcionaba.',
    't2.h3':'Me mudé a Australia',
    't2.p':'Tres años de trabajo físico — bar, mudanzas, jardinería, framing, mantenimiento de hotel, eventos — mientras el entrenamiento seguía corriendo por debajo de todo, viviendo en Manly.',
    't3.h3':'La transformación más fuerte',
    't3.p':'Un tiempo en un valle aislado, trabajando con caballos, escribiendo todos los días y entrenando casi a diario produjo el cambio físico y mental más grande de todo el proceso — y se convirtió en el modelo del sistema.',
    't4.h3':'Hyrox, y de vuelta a casa',
    't4.p':'Cerré el capítulo de Australia corriendo Hyrox, y volví a Argentina a construir thebuildsystem a tiempo completo — convirtiendo el proceso en un sistema que otros pudieran seguir.',
    'running.eyebrow':'Running Club',
    'running.h2':'Correr despeja la cabeza. Después construye el motor.',
    'running.p':'Cada sesión arranca igual — piernas en movimiento, cabeza en silencio. Es la prueba de disciplina más barata que conozco, y la base aeróbica sobre la que se apoya todo lo demás en el entrenamiento.',
    'running.mental.h3':'Despeja la cabeza',
    'running.mental.p':'Sin atajos, sin nadie para quien actuar — solo el ritmo y si lo sostenés.',
    'running.perf.h3':'Construye el motor',
    'running.perf.p':'Una base aeróbica más fuerte significa recuperación más rápida y más capacidad en cada otra sesión.',
    'running.calc.tag':'Herramienta gratis',
    'running.calc.h3':'Calculá tu VAM',
    'running.calc.p':'Hacé una entrada en calor y después corré 5 minutos al ritmo más duro que puedas sostener — firme, no un sprint. Cargá cuánto recorriste y obtené tu número al instante.',
    'running.calc.label':'Distancia en 5 minutos (metros)',
    'running.calc.btn':'Calcular mi VAM',
    'running.calc.disclaimer':'Test a máximo esfuerzo — si sos nuevo en el running o tenés alguna condición de salud, consultá antes con un médico.',
    'running.calc.resultlabel':'Tu VAM',
    'running.calc.cta':'Ver el Programa de Running',
    'runplan.badge':'Running Club',
    'runplan.name':'Programa de Running · 6 meses','runplan.sup':'/mes',
    'runplan.desc':'Para quienes arrancan de cero o corredores que buscan mejorar su VAM — un programa 1:1 completo, 100% online, armado alrededor de tu número.',
    'runplan.btn':'Pagar el primer mes',
    'ptplan.badge':'Presencial · Local',
    'ptplan.name':'Personal Training diario',
    'ptplan.desc':'Todas las sesiones, todos los días, presencial en tu gimnasio — el nivel de acompañamiento más alto que existe.',
    'ptplan.sup':'/mes',
    'ptplan.btn':'Pagar el primer mes',
    'hyroxplan.badge':'Hyrox',
    'hyroxplan.name':'Hyrox Race Prep',
    'hyroxplan.desc':'Un bloque periodizado armado para tu fecha de carrera exacta — de alguien que corrió Hyrox de verdad, no que solo lo programó en papel.',
    'hyroxplan.sup':'/ pago único',
    'hyroxplan.btn':'Pagar con PayPal',
    'programs.eyebrow':'Programas',
    'programs.h2':'Elegí tu plan',
    'programs.p':'Tres formas de empezar — desde una rutina personalizada hasta un sistema 1:1 completo con seguimiento semanal. Precios en USD. Los planes de coaching se cobran mensualmente por PayPal; el botón paga el primer mes, y el cobro recurrente lo coordinamos directo.',
    'plan1.name':'Programa Solo','plan1.sup':'/ pago único',
    'plan1.desc':'Una rutina de entrenamiento totalmente personalizada — para quienes solo necesitan el plan y pueden seguirlo por su cuenta.',
    'plan1.f1':'Una rutina personalizada, armada según tu objetivo',
    'plan1.f2':'Progresión escrita, sin adivinar',
    'plan1.f3':'De ahí en más, por tu cuenta',
    'plan1.btn':'Pagar con PayPal',
    'plan2.badge':'El más elegido','plan2.name':'Coaching 1:1 · 12 meses','plan2.sup':'/mes',
    'plan2.desc':'El sistema completo, por un año. Entrenamiento, alimentación y mentalidad juntos, con acceso directo a mí.',
    'plan2.f1':'Entrenamiento + alimentación + mentalidad, en un solo plan',
    'plan2.f2':'Check-ins semanales y ajustes',
    'plan2.f3':'Acceso directo entre sesiones',
    'plan2.f4':'La cuota mensual más baja de los tres planes',
    'plan2.btn':'Pagar el primer mes',
    'plan.note':'Los meses siguientes se coordinan directo después de tu primer pago.',
    'plan3.name':'Coaching 1:1 · 6 meses','plan3.sup':'/mes',
    'plan3.desc':'El sistema completo con un compromiso más corto — mismo coaching de entrenamiento, alimentación y mentalidad.',
    'plan3.f1':'Entrenamiento + alimentación + mentalidad, en un solo plan',
    'plan3.f2':'Check-ins semanales y ajustes',
    'plan3.f3':'Acceso directo entre sesiones',
    'plan3.btn':'Pagar el primer mes',
    'results.eyebrow':'Casos de clientes',
    'results.h2':'Acompañamiento real, no solo un plan',
    'results1.tag':'Yesenia · clienta 1:1',
    'results1.h3':'Un camp presencial de 18 días en Bali, dentro de un programa de 6 semanas',
    'results1.p':'La idea fue de Yesenia: en vez de un plan a distancia, contratar un entrenador personal para un bloque dedicado. Así armamos un camp presencial de 18 días en Bali — tres fases de fuerza, cardio y recuperación, planificadas día por día — como el tramo inicial de un programa de 6 semanas armado según su objetivo.',
    'results1.stat1':'Días en Bali','results1.stat2':'Fases de entrenamiento','results1.stat3':'Objetivo del programa','results1.stat4':'Perdidos en las primeras 3 semanas',
    'results1.note':'Caso en progreso — testimonio y fotos del después se suman cuando termine el programa.',
    'results2.before':'Antes','results2.after':'Después',
    'results2.tag':'Estanislao · cliente 1:1',
    'results2.h3':'6 meses de fuerza y running',
    'results2.p':'Estanislao juega al rugby y llegó con el objetivo de sumar masa sin perder motor. Tres meses de fuerza combinados con running lo llevaron de 63kg a 66kg — el tramo inicial de un programa de 6 meses armado para seguir sumando masa mientras sigue jugando.',
    'results2.stat1':'Ganados en 3 meses','results2.stat2':'Meses de fuerza y running','results2.stat3':'Objetivo: sumar masa','results2.stat4':'Deporte para el que entrena',
    'results2.note':'Caso en progreso — sigue el programa para seguir sumando masa en los próximos 6 meses.',
    'shop.eyebrow':'Shop',
    'shop.h2':'Una construcción nueva, fuera del gimnasio',
    'shop.p':'El primer producto físico de thebuildsystem — gorras, hechas con el mismo criterio que el coaching: sin atajos, sin apuro. Actualmente en desarrollo.',
    'shop.badge':'Pronto',
    'shop.hero.h3':'Gorras thebuildsystem',
    'shop.hero.p':'El primer producto físico — gorras, hechas con el mismo criterio sin atajos que el coaching.',
    'shop.tag':'Pronto',
    'shop.navy':'Azul marino',
    'shop.red':'Roja',
    'shop.white':'Blanca',
    'shop.maroon':'Bordó',
    'shop.notify.tag':'Avisame',
    'shop.notify.h3':'¿Querés ser de los primeros?',
    'shop.notify.p':'Dejá tu mail y te aviso apenas las gorras estén listas para pedir.',
    'shop.notify.label':'Email',
    'shop.notify.btn':'Notificame',
    'shop.notify.successh3':'Listo',
    'shop.notify.successp':'Te escribo apenas estén disponibles.',
    'shop.hero.title':'La cápsula de gorras',
    'shop.hero.season':'Muy pronto',
    'shop.hero.btn':'Notificame',
    'shop.intro.h2':'Presentamos un nuevo concepto',
    'shop.intro.p':'Pronto estará disponible el primer drop de gorras.',
    'shop.intro.btn':'Notificame cuando estén listas',
    'final.h2':'¿Empezamos a construir?',
    'final.p':'Contame de dónde partís y para qué estás entrenando. Te respondo yo mismo — sin equipo, sin bots.',
    // Application form — shared between the embedded #apply section on
    // index.html and the standalone apply.html page.
    'apply.eyebrow':'Programa piloto — cupos limitados',
    'apply.h1':'Coaching 1:1',
    'apply.h2':'Aplicación a coaching 1:1',
    'apply.p':'Completá esto y te contacto para ver si encajás en el próximo grupo.',
    'apply.details':'Tus datos',
    'apply.firstname':'Nombre',
    'apply.email':'Email',
    'apply.phone':'Teléfono',
    'apply.birthday':'Fecha de nacimiento',
    'apply.timeline.label':'¿Qué tan pronto estás list@ para empezar?',
    'apply.timeline.asap':'Lo antes posible',
    'apply.timeline.weeks':'1-2 semanas',
    'apply.timeline.looking':'Solo mirando',
    'apply.goal.label':'¿Cuál es tu objetivo principal ahora?',
    'apply.goal.athletic':'Rendimiento deportivo',
    'apply.goal.recomp':'Recomposición corporal (bajar grasa)',
    'apply.goal.endurance':'Resistencia',
    'apply.goal.hypertrophy':'Hipertrofia (ganar músculo)',
    'apply.goal.elite':'Deporte de alto rendimiento',
    'apply.submit':'Enviar aplicación',
    'apply.success.h3':'Listo',
    'apply.success.p':'Te contacto pronto para coordinar una llamada y ver si encajás en el próximo grupo.'
  };
  var ES_HTML = { 'hero.h1': "El cuerpo no se logra<br>a la deriva. <em>Se construye.</em>" };

  var current = 'en';

  var textEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var htmlEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-html]'));
  var origText = textEls.map(function(el){ return el.textContent; });
  var origHtml = htmlEls.map(function(el){ return el.innerHTML; });

  function apply(lang){
    textEls.forEach(function(el, i){
      var k = el.getAttribute('data-i18n');
      el.textContent = (lang === 'en') ? origText[i] : (ES[k] || origText[i]);
    });
    htmlEls.forEach(function(el, i){
      var k = el.getAttribute('data-i18n-html');
      el.innerHTML = (lang === 'en') ? origHtml[i] : (ES_HTML[k] || origHtml[i]);
    });
    current = lang;
    var btn = document.getElementById('lang-toggle');
    if(btn) btn.textContent = (lang === 'en') ? 'ES' : 'EN';
    try{ document.documentElement.lang = lang; }catch(e){}
    try{ localStorage.setItem('tbs-lang', lang); }catch(e){}
  }

  var startLang = 'en';
  try{ var saved = localStorage.getItem('tbs-lang'); if(saved === 'es') startLang = 'es'; }catch(e){}
  if(startLang !== 'en') apply(startLang);

  var toggleBtn = document.getElementById('lang-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', function(){
      apply(current === 'en' ? 'es' : 'en');
    });
  }
})();
