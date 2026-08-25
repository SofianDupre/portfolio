/* Sofian Dupre — portfolio : interactions */
(function () {
  "use strict";

  /* ---- en-tête : ombre au défilement ---- */
  var head = document.querySelector("header");
  var top = document.getElementById("top");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (head) head.classList.toggle("scrolled", y > 12);
    if (top) top.classList.toggle("on", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (top) top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- menu mobile ---- */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("on");
      menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
    menu.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") {
        burger.classList.remove("on");
        menu.classList.remove("open");
      }
    });
  }

  /* ---- apparition au défilement ---- */
  var rv = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    rv.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
    rv.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---- compteurs ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count),
            suffix = el.dataset.suffix || "", t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min((ts - t0) / 1100, 1);
          var v = Math.floor(target * (1 - Math.pow(1 - k, 3)));
          el.textContent = v.toLocaleString("fr-FR") + (k === 1 ? suffix : "");
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- filtres de projets ---- */
  var fbtns = document.querySelectorAll(".filters button");
  if (fbtns.length) {
    fbtns.forEach(function (b) {
      b.addEventListener("click", function () {
        fbtns.forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var f = b.dataset.filter;
        document.querySelectorAll("[data-year]").forEach(function (c) {
          var show = f === "all" || c.dataset.year === f;
          c.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---- visionneuse d'images ---- */
  var lb = document.getElementById("lb");
  if (lb) {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".cap");
    document.querySelectorAll(".gal figure").forEach(function (fig) {
      fig.addEventListener("click", function () {
        var im = fig.querySelector("img"), cap = fig.querySelector("figcaption");
        lbImg.removeAttribute("hidden"); lbImg.src = im.dataset.full || im.src;
        lbCap.textContent = cap ? cap.textContent : "";
        lb.classList.add("on");
        document.body.style.overflow = "hidden";
      });
    });
    function close() { lb.classList.remove("on"); document.body.style.overflow = ""; }
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") close();
    });
  }

  /* ---- lien de menu actif selon la section visible ---- */
  var links = [].slice.call(document.querySelectorAll(".menu a[href^='#']"));
  if (links.length) {
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    window.addEventListener("scroll", function () {
      var y = window.scrollY + 140, cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle("active", i === cur); });
    }, { passive: true });
  }

  /* ---- année du pied de page ---- */
  var yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
})();
