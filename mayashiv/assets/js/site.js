/* mayashiv — Sudeshna Chatterjee. Minimal enhancement; the site reads fine without JS. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.setAttribute("data-open", "false"); toggle.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { nav.setAttribute("data-open", "false"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (items.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var i = parseInt(el.getAttribute("data-reveal") || "0", 10);
          el.style.transitionDelay = Math.min(i * 65, 300) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
