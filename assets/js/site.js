/* showrojeetchugh.com — progressive enhancement.
   Nothing here is required for the site to read correctly without JS. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll reveal ---------- */
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
          el.style.transitionDelay = Math.min(i * 70, 320) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- reading progress bar ---------- */
  var bar = document.createElement("div");
  bar.className = "progress-bar";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  var ticking = false;
  function updateProgress() {
    var winScroll = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = Math.min(Math.max(scrolled, 0), 100) + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- back to top button ---------- */
  var backBtn = document.createElement("button");
  backBtn.className = "back-to-top";
  backBtn.setAttribute("aria-label", "Scroll back to top");
  backBtn.innerHTML = "Top ↑";
  document.body.appendChild(backBtn);

  function checkBackToTop() {
    if (window.scrollY > 400) {
      backBtn.classList.add("is-visible");
    } else {
      backBtn.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", checkBackToTop, { passive: true });
  backBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- toast notifications ---------- */
  var toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  var toastTimer = null;

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-active");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-active");
    }, 2400);
  }

  /* ---------- copy to clipboard ---------- */
  function copyText(text, btn) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      // fallback
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Copied: " + text);
      } catch (err) {
        showToast("Press Ctrl+C to copy");
      }
      document.body.removeChild(ta);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      showToast("Copied: " + text);
      if (btn) {
        var orig = btn.innerHTML;
        btn.classList.add("is-copied");
        btn.innerHTML = "Copied ✓";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.innerHTML = orig;
        }, 2000);
      }
    }).catch(function () {
      showToast("Failed to copy to clipboard");
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (btn) {
      e.preventDefault();
      var val = btn.getAttribute("data-copy");
      if (val) copyText(val, btn);
    }
  });

  /* ---------- desk session & market clock ---------- */
  function getMarketSession() {
    var now = new Date();
    var utcHour = now.getUTCHours();
    var utcMin = now.getUTCMinutes();
    var utcStr = (utcHour < 10 ? "0" : "") + utcHour + ":" + (utcMin < 10 ? "0" : "") + utcMin + " UTC";

    // Standard session windows (UTC):
    // Asia/Tokyo: 00:00 - 09:00
    // London: 08:00 - 16:30
    // New York: 13:30 - 20:00
    var session = "";
    if (utcHour >= 13 && utcHour < 16) {
      session = "LON / NYC Overlap";
    } else if (utcHour >= 8 && utcHour < 17) {
      session = "London Desk";
    } else if (utcHour >= 17 && utcHour < 21) {
      session = "New York Desk";
    } else if (utcHour >= 0 && utcHour < 8) {
      session = "Asia-Pac Desk";
    } else {
      session = "Electronic 24/7";
    }
    return { time: utcStr, session: session };
  }

  var clockEl = document.getElementById("session-clock");
  var deskEl = document.getElementById("desk-session");
  if (clockEl || deskEl) {
    function refreshDeskClock() {
      var s = getMarketSession();
      if (clockEl) clockEl.textContent = s.time + " · " + s.session;
      if (deskEl) deskEl.textContent = s.session;
    }
    refreshDeskClock();
    setInterval(refreshDeskClock, 30000);
  }

  /* ---------- interactive projects filter ---------- */
  var filterPills = document.querySelectorAll(".filter-pill");
  if (filterPills.length) {
    filterPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var cat = pill.getAttribute("data-cat");
        filterPills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");

        var repos = document.querySelectorAll(".repo[data-category]");
        repos.forEach(function (repo) {
          var repoCat = repo.getAttribute("data-category") || "";
          if (cat === "all" || repoCat.indexOf(cat) !== -1) {
            repo.classList.remove("is-hidden");
          } else {
            repo.classList.add("is-hidden");
          }
        });
      });
    });
  }

  /* ---------- keyboard shortcuts modal ---------- */
  var modalHtml = [
    '<div class="modal-backdrop" id="shortcutsModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Desk Keyboard Shortcuts">',
    '  <div class="modal-box">',
    '    <div class="modal-box__head">',
    '      <span class="modal-box__title">Desk Navigation Shortcuts</span>',
    '      <button class="modal-box__close" id="closeModal" aria-label="Close shortcuts dialog">ESC ✕</button>',
    '    </div>',
    '    <div class="shortcut-grid">',
    '      <div class="shortcut-row"><span class="shortcut-desc">Index</span><span class="shortcut-key">1</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Projects</span><span class="shortcut-key">4</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Résumé</span><span class="shortcut-key">2</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Systems</span><span class="shortcut-key">5</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Markets</span><span class="shortcut-key">3</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Digital Assets</span><span class="shortcut-key">6</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Contact</span><span class="shortcut-key">7</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Top of Page</span><span class="shortcut-key">t</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Copy Email</span><span class="shortcut-key">c</span></div>',
    '      <div class="shortcut-row"><span class="shortcut-desc">Toggle Help</span><span class="shortcut-key">?</span></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  var modal = document.getElementById("shortcutsModal");
  var closeBtn = document.getElementById("closeModal");

  function openModal() {
    if (modal) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* Listen for shortcut trigger button in footer if present */
  document.addEventListener("click", function (e) {
    if (e.target.closest("#openShortcuts")) {
      e.preventDefault();
      openModal();
    }
  });

  /* Global Keyboard Navigation */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Escape") {
      closeModal();
      if (nav) nav.setAttribute("data-open", "false");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      return;
    }

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      if (modal && modal.classList.contains("is-open")) {
        closeModal();
      } else {
        openModal();
      }
      return;
    }

    if (e.key === "1") { window.location.href = "index.html"; return; }
    if (e.key === "2") { window.location.href = "resume.html"; return; }
    if (e.key === "3") { window.location.href = "markets.html"; return; }
    if (e.key === "4") { window.location.href = "projects.html"; return; }
    if (e.key === "5") { window.location.href = "systems.html"; return; }
    if (e.key === "6") { window.location.href = "digital-assets.html"; return; }
    if (e.key === "7") { window.location.href = "contact.html"; return; }

    if (e.key === "t" || e.key === "T") {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }

    if (e.key === "c" || e.key === "C") {
      copyText("showrojeet@gmail.com", null);
      return;
    }

    if ((e.key === "p" || e.key === "P") && window.location.pathname.indexOf("resume.html") !== -1) {
      window.print();
      return;
    }
  });

})();
