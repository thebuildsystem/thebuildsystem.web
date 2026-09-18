// Carousel for the client-case studies in the Results section. Cases slide
// in from the right one at a time (dots + arrows, plus a slow auto-advance)
// instead of stacking underneath each other, which would break the
// one-screen wheel-scroll budget for this section.
(function () {
  var root = document.getElementById("results-slider");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".results-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".results-dot"));
  var arrows = Array.prototype.slice.call(document.querySelectorAll(".results-arrow"));
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
