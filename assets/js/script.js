(function () {
  "use strict";

  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ============ CONFIG ============ */
  // TODO: substituir pelo número real do João (formato: código do país + DDD + número, só dígitos)
  var WHATSAPP_NUMBER = "5521999999999";

  function buildWhatsAppLink(message) {
    var text = encodeURIComponent(message || "Olá! Vim pelo site e quero falar sobre os carros Changan.");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  document.querySelectorAll(".js-whatsapp").forEach(function (el) {
    el.setAttribute("href", buildWhatsAppLink(el.dataset.msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ============ PRELOADER (guaranteed to hide, GSAP or not) ============ */
  var preloader = document.getElementById("preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      preloader.style.transition = "opacity 0.5s ease";
      preloader.style.opacity = "0";
      setTimeout(function () {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 550);
    }
    if (hasGsap) {
      try { playHeroIntro(); } catch (e) { /* content already visible, fail silently */ }
    }
  });

  function playHeroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero-photo", { opacity: 0, duration: 1, ease: "power2.out" })
      .from(".header", { y: -30, opacity: 0, duration: 0.6 }, "-=1.1")
      .from(".hero-title", { y: 26, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7 }, "-=0.55")
      .from(".hero-actions", { y: 20, opacity: 0, duration: 0.7 }, "-=0.55")
      .from(".hero-stats", { y: 20, opacity: 0, duration: 0.7 }, "-=0.55");
  }

  /* ============ LENIS SMOOTH SCROLL ============ */
  var lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", function () {
      if (hasGsap && window.ScrollTrigger) ScrollTrigger.update();
      updateScrollProgress();
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ============ SMOOTH ANCHOR SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ============ HEADER SCROLL STATE + PROGRESS BAR ============ */
  var header = document.getElementById("header");
  var progressBar = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ============ MOBILE MENU ============ */
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    nav.classList.toggle("mobile-open");
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("open");
      nav.classList.remove("mobile-open");
    });
  });

  /* ============ CUSTOM CURSOR ============ */
  var fineCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fineCursor) {
    document.documentElement.classList.add("cursor-enabled");
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    var ringX = gsap && hasGsap ? gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" }) : null;
    var ringY = gsap && hasGsap ? gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" }) : null;

    window.addEventListener("mousemove", function (e) {
      dot.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
      if (ringX && ringY) {
        ringX(e.clientX);
        ringY(e.clientY);
      } else {
        ring.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
      }
    });

    document.querySelectorAll("a, button, .tilt-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("cursor-hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("cursor-hover"); });
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  if (hasGsap) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ============ 3D TILT CARDS ============ */
  if (hasGsap) {
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: px * 10,
          rotateX: -py * 10,
          y: -6,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 700,
          transformOrigin: "center"
        });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.7, ease: "power3.out" });
      });
    });
  }

  /* ============ HERO PHOTO PARALLAX (mouse) ============ */
  if (hasGsap && fineCursor) {
    var heroSection = document.getElementById("hero");
    var heroPhoto = document.querySelector(".hero-photo");
    if (heroSection && heroPhoto) {
      heroSection.addEventListener("mousemove", function (e) {
        var rect = heroSection.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(heroPhoto, { x: px * -14, duration: 0.8, ease: "power2.out" });
      });
      heroSection.addEventListener("mouseleave", function () {
        gsap.to(heroPhoto, { x: 0, duration: 1, ease: "power3.out" });
      });
    }
  }

  /* ============ SCROLL REVEAL ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if (hasGsap && window.ScrollTrigger) {
    revealEls.forEach(function (el) {
      var delay = Number(el.dataset.revealDelay || 0) / 1000;
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.dataset.revealDelay || 0;
            setTimeout(function () { el.classList.add("is-visible"); }, Number(delay));
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ============ ANIMATED STAT COUNTERS ============ */
  document.querySelectorAll(".stat-number").forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var isDecimal = String(el.dataset.count).indexOf(".") !== -1;

    function animateCount() {
      if (hasGsap) {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: function () {
            el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          }
        });
      } else {
        var duration = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target * eased;
          el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    }

    if (hasGsap && window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: animateCount });
    } else {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(); statsObserver.unobserve(el); }
        });
      }, { threshold: 0.5 });
      statsObserver.observe(el);
    }
  });

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    answer.style.height = "0px";
    answer.style.overflow = "hidden";

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          var openAnswer = openItem.querySelector(".faq-answer");
          if (hasGsap) gsap.to(openAnswer, { height: 0, duration: 0.35, ease: "power2.inOut" });
          else openAnswer.style.height = "0px";
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        if (hasGsap) gsap.to(answer, { height: 0, duration: 0.35, ease: "power2.inOut" });
        else answer.style.height = "0px";
      } else {
        item.classList.add("open");
        var target = answer.scrollHeight;
        if (hasGsap) gsap.fromTo(answer, { height: 0 }, { height: target, duration: 0.4, ease: "power2.inOut" });
        else answer.style.height = target + "px";
      }
    });
  });

  /* ============ TESTIMONIAL CAROUSEL ============ */
  var track = document.getElementById("testiTrack");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  var dotsWrap = document.getElementById("testiDots");
  var cards = track ? Array.from(track.children) : [];

  if (track && cards.length) {
    cards.forEach(function (_, i) {
      var dot = document.createElement("div");
      dot.className = "testi-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", function () { scrollToCard(i); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.from(dotsWrap.children);

    function cardStep() {
      return cards[0].getBoundingClientRect().width + 24;
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / cardStep());
    }

    function scrollToCard(i) {
      var clamped = Math.max(0, Math.min(i, cards.length - 1));
      track.scrollTo({ left: clamped * cardStep(), behavior: "smooth" });
    }

    function updateDots() {
      var idx = currentIndex();
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }

    prevBtn.addEventListener("click", function () { scrollToCard(currentIndex() - 1); });
    nextBtn.addEventListener("click", function () { scrollToCard(currentIndex() + 1); });
    track.addEventListener("scroll", debounce(updateDots, 100), { passive: true });

    var autoplay = setInterval(function () {
      var next = currentIndex() + 1;
      scrollToCard(next >= cards.length ? 0 : next);
    }, 5000);

    track.addEventListener("mouseenter", function () { clearInterval(autoplay); });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  /* ============ FOOTER YEAR ============ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
