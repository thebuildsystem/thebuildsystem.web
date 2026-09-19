// Carousel for the "extra" pricing options (Running, Personal Training,
// Hyrox Race Prep) that sits below the three main plan cards. The three
// main plans stay fixed; this rotates through the rest — dots, arrows, and
// a slow auto-advance so it reads like a small roulette of options.
(function () {
  var root = document.getElementById("run-plan");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".extra-plan-slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".extra-plans-dot"));
  var arrows = Array.prototype.slice.call(root.querySelectorAll(".extra-plans-arrow"));
  if (!slides.length) return;

  var current = 0;

  function show(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle("active", i === current);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  dots.forEach(function (d) {
    d.addEventListener("click", function () {
      show(parseInt(d.getAttribute("data-index"), 10));
      resetTimer();
    });
  });

  arrows.forEach(function (a) {
    a.addEventListener("click", function () {
      show(current + parseInt(a.getAttribute("data-dir"), 10));
      resetTimer();
    });
  });

  var timer = null;
  function startTimer() {
    timer = setInterval(function () {
      show(current + 1);
    }, 6000);
  }
  function resetTimer() {
    if (timer) clearInterval(timer);
    startTimer();
  }
  startTimer();

  root.addEventListener("mouseenter", function () {
    if (timer) clearInterval(timer);
  });
  root.addEventListener("mouseleave", function () {
    resetTimer();
  });
})();
