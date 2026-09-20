// Full-section wheel navigation + left-side section dots for the landing page.
// One wheel movement jumps straight to the next/previous section.
// Only active on desktop-sized screens (touch/mobile scroll stays native).

(function () {
  var SECTION_SELECTOR = ".hero, #method, #story, #running, #programs, #apply, #results, #shop, #camp, .final";
  var DOT_SECTIONS = [
    { id: "method", label: "Method" },
    { id: "story", label: "Story" },
    { id: "running", label: "Running" },
    { id: "programs", label: "Programs" },
    { id: "results", label: "Results" },
    { id: "shop", label: "Shop" },
    { id: "camp", label: "Camp" },
    { id: "contact", label: "Contact" },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll(SECTION_SELECTOR));
    if (!sections.length) return;

    // ---------- Build the dots ----------
    var dotsWrap = document.createElement("nav");
    dotsWrap.className = "section-dots";
    dotsWrap.setAttribute("aria-label", "Section navigation");
    DOT_SECTIONS.forEach(function (s) {
      var a = document.createElement("a");
      a.href = "#" + s.id;
      a.setAttribute("aria-label", s.label);
      dotsWrap.appendChild(a);
    });
    document.body.appendChild(dotsWrap);
    var dotEls = Array.prototype.slice.call(dotsWrap.querySelectorAll("a"));

    function sectionId(el) {
      if (el.id) return el.id;
      if (el.classList.contains("hero")) return "hero";
      if (el.classList.contains("final")) return "contact";
      return "";
    }
    function isDarkSection(el) {
      return el.classList.contains("hero") || el.classList.contains("final");
    }

    function setActiveDot(sectionEl) {
      var id = sectionId(sectionEl);
      var idx = DOT_SECTIONS.findIndex(function (s) { return s.id === id; });
      if (idx === -1) {
        // Hero / Application aren't dotted — light up the nearest section before them.
        var secIdx = sections.indexOf(sectionEl);
        for (var i = secIdx; i >= 0; i--) {
          var sid = sectionId(sections[i]);
          idx = DOT_SECTIONS.findIndex(function (s) { return s.id === sid; });
          if (idx !== -1) break;
        }
      }
      dotEls.forEach(function (el, i) { el.classList.toggle("active", i === idx); });
      dotsWrap.classList.toggle("on-dark", isDarkSection(sectionEl));
    }

    dotEls.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(DOT_SECTIONS[i].id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    // ---------- Track which section is current ----------
    var currentIndex = 0;
    function sectionTop(el) {
      return el.getBoundingClientRect().top + window.scrollY;
    }
    function updateCurrentByScroll() {
      var y = window.scrollY + window.innerHeight * 0.35;
      var idx = 0;
      for (var i = 0; i < sections.length; i++) {
        if (sectionTop(sections[i]) <= y) idx = i;
      }
      currentIndex = idx;
      setActiveDot(sections[currentIndex]);
    }
    updateCurrentByScroll();
    window.addEventListener("scroll", updateCurrentByScroll, { passive: true });

    // ---------- Wheel: jump one full section per gesture ----------
    var locked = false;
    var LOCK_MS = 950; // long enough that a full-height (hero) jump always finishes before the next wheel tick can retrigger it

    function isFormField(el) {
      return el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    }

    window.addEventListener(
      "wheel",
      function (e) {
        if (window.innerWidth < 700) return; // native scroll on small/touch screens
        if (isFormField(document.activeElement)) return; // don't fight typing in a field
        if (locked) {
          e.preventDefault();
          return;
        }
        if (Math.abs(e.deltaY) < 4) return;

        var dir = e.deltaY > 0 ? 1 : -1;
        var nextIndex = currentIndex + dir;
        if (nextIndex < 0 || nextIndex >= sections.length) return; // let it bounce at the ends

        e.preventDefault();
        locked = true;
        currentIndex = nextIndex;
        sections[currentIndex].scrollIntoView({ behavior: "smooth" });
        setActiveDot(sections[currentIndex]);
        setTimeout(function () {
          locked = false;
        }, LOCK_MS);
      },
      { passive: false }
    );

    // ---------- Mobile hamburger menu ----------
    var menuToggle = document.getElementById("menu-toggle");
    var mobileMenu = document.getElementById("mobile-menu");
    if (menuToggle && mobileMenu) {
      function closeMobileMenu() {
        mobileMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
      function openMobileMenu() {
        mobileMenu.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
      }
      menuToggle.addEventListener("click", function () {
        if (mobileMenu.classList.contains("open")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
      Array.prototype.slice.call(mobileMenu.querySelectorAll("a")).forEach(function (a) {
        a.addEventListener("click", closeMobileMenu);
      });
      window.addEventListener("resize", function () {
        if (window.innerWidth > 820) closeMobileMenu();
      });
    }
  });
})();
