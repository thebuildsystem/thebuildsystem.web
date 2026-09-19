// Free VAM (Velocidad Aeróbica Máxima / Maximum Aerobic Speed) calculator
// for the Running Club section. Test: after a warm-up, run 5 minutes at the
// hardest sustainable pace, then enter the distance covered (in meters).
// VAM (km/h) = (meters / 300 seconds) * 3.6
// This only ever surfaces the VAM number and a short qualitative read —
// never paces, intervals or a plan. That's reserved for the paid program.
(function () {
  var form = document.getElementById("form-vam");
  if (!form) return;

  var distanceInput = document.getElementById("vam-distance");
  var resultBox = document.getElementById("vam-result");
  var valueEl = document.getElementById("vam-value");
  var tagEl = document.getElementById("vam-tag");

  var TAGS = {
    en: [
      { max: 10, text: "Beginner — you're right at the start of building your aerobic base." },
      { max: 14, text: "Building — your base is forming. Consistency is the next step." },
      { max: 18, text: "Solid — you've got a real aerobic engine to build on." },
      { max: Infinity, text: "Strong — you're running at a genuinely competitive aerobic level." }
    ],
    es: [
      { max: 10, text: "Principiante — estás recién arrancando a construir tu base aeróbica." },
      { max: 14, text: "En construcción — tu base se está formando. El siguiente paso es la constancia." },
      { max: 18, text: "Sólido — ya tenés un motor aeróbico real para construir encima." },
      { max: Infinity, text: "Fuerte — estás corriendo en un nivel aeróbico genuinamente competitivo." }
    ]
  };

  function currentLang() {
    return document.documentElement.lang === "es" ? "es" : "en";
  }

  function tagFor(kmh) {
    var list = TAGS[currentLang()];
    for (var i = 0; i < list.length; i++) {
      if (kmh < list[i].max) return list[i].text;
    }
    return list[list.length - 1].text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var meters = parseFloat(distanceInput.value);
    if (!meters || meters <= 0) {
      distanceInput.focus();
      return;
    }
    var kmh = (meters / 300) * 3.6;
    valueEl.textContent = kmh.toFixed(1);
    tagEl.textContent = tagFor(kmh);
    // Reveal with a fade instead of an abrupt display swap, and don't
    // auto-scroll — the card is already on screen, so jumping the page
    // around when the number appears just reads as a layout glitch.
    resultBox.style.display = "block";
    resultBox.classList.remove("show");
    void resultBox.offsetWidth; // force reflow so the transition re-triggers
    resultBox.classList.add("show");
  });
})();
