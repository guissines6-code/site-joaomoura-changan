(function () {
  "use strict";

  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  var prefersReducedMotion = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ CONFIG ============ */
  var WHATSAPP_NUMBER = "5521990876897";

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
    var tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.from(".hero-photo", { opacity: 0, duration: 1, ease: "power2.out" })
      .from(".header", { y: -30, opacity: 0, duration: 0.6 }, "-=1.1")
      .from(".hero .eyebrow", { y: 14, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-title", { y: 24, opacity: 0, duration: 0.7 }, "+=0.3");
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
  var revealEls = document.querySelectorAll(".reveal, .reveal-x, .reveal-scale");

  if (prefersReducedMotion) {
    // CSS already forces the final state via the prefers-reduced-motion media query;
    // just make sure nothing is left waiting on a class that never gets added.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if (hasGsap && window.ScrollTrigger) {
    // Genérico: tudo que tem .reveal, exceto os títulos de seção, os cards de
    // modelos e a foto do João, que ganham um tratamento próprio abaixo.
    var genericReveal = document.querySelectorAll(".reveal:not(.section-head):not(.model-card)");
    genericReveal.forEach(function (el) {
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
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // Títulos de seção: fade-in + subida de 30px.
    document.querySelectorAll(".section-head").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // Cards de modelos: entrada escalonada.
    var modelCards = document.querySelectorAll(".model-card");
    if (modelCards.length) {
      gsap.fromTo(
        modelCards,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".models-grid", start: "top 85%", toggleActions: "play none none none" }
        }
      );
    }

    // Foto do João: fade-in lateral.
    document.querySelectorAll(".reveal-x").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // CTA final: título entra com scale + fade.
    document.querySelectorAll(".reveal-scale").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
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

    if (prefersReducedMotion) {
      el.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
      return;
    }

    function animateCount() {
      if (hasGsap) {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power3.out",
          onUpdate: function () {
            el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          }
        });
      } else {
        var duration = 1500, start = null;
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
          if (hasGsap) gsap.to(openAnswer, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
          else { openAnswer.style.height = "0px"; openAnswer.style.opacity = "0"; }
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        if (hasGsap) gsap.to(answer, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        else { answer.style.height = "0px"; answer.style.opacity = "0"; }
      } else {
        item.classList.add("open");
        var target = answer.scrollHeight;
        if (hasGsap) gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: target, opacity: 1, duration: 0.3, ease: "power2.inOut" });
        else { answer.style.height = target + "px"; answer.style.opacity = "1"; }
      }
    });
  });

  /* ============ OCULTAR WHATSAPP FLUTUANTE NA CTA FINAL ============ */
  var ctaFinalSection = document.querySelector(".cta-final");
  var whatsappFloatBtn = document.querySelector(".whatsapp-float");
  if (ctaFinalSection && whatsappFloatBtn && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          whatsappFloatBtn.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.4 }
    );
    ctaObserver.observe(ctaFinalSection);
  }

  /* ============ COMO CHEGAR (DROPDOWN) ============ */
  var dirToggle = document.getElementById("dirToggle");
  var dirMenu = document.getElementById("dirMenu");
  if (dirToggle && dirMenu) {
    dirToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dirMenu.classList.toggle("open");
      dirToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!dirMenu.classList.contains("open")) return;
      if (dirMenu.contains(e.target) || dirToggle.contains(e.target)) return;
      dirMenu.classList.remove("open");
      dirToggle.setAttribute("aria-expanded", "false");
    });
  }

  /* ============ LAZY LOAD DE VÍDEOS ABAIXO DA DOBRA ============ */
  // Uso: <video class="js-lazy-video" preload="none" autoplay muted loop playsinline>
  //        <source data-src="assets/video/arquivo.mp4" type="video/mp4">
  //      </video>
  // O <source> só recebe o src (e o vídeo só baixa) quando chega perto da viewport.
  var lazyVideos = document.querySelectorAll(".js-lazy-video");
  if (lazyVideos.length) {
    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var video = entry.target;
            video.querySelectorAll("source[data-src]").forEach(function (source) {
              source.src = source.dataset.src;
              source.removeAttribute("data-src");
            });
            video.load();
            lazyVideoObserver.unobserve(video);
          });
        },
        { rootMargin: "200px 0px" }
      );
      lazyVideos.forEach(function (video) { lazyVideoObserver.observe(video); });
    } else {
      // Sem suporte a IntersectionObserver: carrega direto, sem lazy.
      lazyVideos.forEach(function (video) {
        video.querySelectorAll("source[data-src]").forEach(function (source) {
          source.src = source.dataset.src;
        });
        video.load();
      });
    }
  }

  /* ============ CARROSSEL DE PROVA SOCIAL (vídeo + fotos) ============ */
  var proofTrack = document.getElementById("proofTrack");
  var proofPrevBtn = document.getElementById("proofPrev");
  var proofNextBtn = document.getElementById("proofNext");
  var proofDotsWrap = document.getElementById("proofDots");
  var proofVideo = document.getElementById("proofVideo");
  var proofPlayBtn = document.getElementById("proofPlayBtn");
  var proofSlides = proofTrack ? Array.from(proofTrack.children) : [];
  var PROOF_VIDEO_INDEX = 0;

  if (proofTrack && proofSlides.length) {
    proofSlides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "proof-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Ir para o slide " + (i + 1));
      dot.addEventListener("click", function () { scrollToProofSlide(i); });
      proofDotsWrap.appendChild(dot);
    });

    var proofDots = Array.from(proofDotsWrap.children);
    var proofVisible = true;
    var proofUserPaused = false;

    function proofStep() {
      return proofSlides[0].getBoundingClientRect().width;
    }

    function proofCurrentIndex() {
      return Math.round(proofTrack.scrollLeft / proofStep());
    }

    function scrollToProofSlide(i) {
      var looped = (i + proofSlides.length) % proofSlides.length;
      proofTrack.scrollTo({ left: looped * proofStep(), behavior: "smooth" });
    }

    function updateProofState() {
      var idx = proofCurrentIndex();
      proofDots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });

      if (!proofVideo) return;
      var isVideoSlideActive = idx === PROOF_VIDEO_INDEX;
      if (isVideoSlideActive && proofVisible && !proofUserPaused) {
        proofVideo.play().catch(function () {});
        if (proofPlayBtn) proofPlayBtn.classList.remove("is-paused");
      } else {
        proofVideo.pause();
      }
    }

    proofPrevBtn.addEventListener("click", function () { scrollToProofSlide(proofCurrentIndex() - 1); });
    proofNextBtn.addEventListener("click", function () { scrollToProofSlide(proofCurrentIndex() + 1); });
    proofTrack.addEventListener("scroll", debounce(updateProofState, 100), { passive: true });

    if (proofPlayBtn && proofVideo) {
      proofPlayBtn.addEventListener("click", function () {
        if (proofVideo.paused) {
          proofUserPaused = false;
          proofVideo.play().catch(function () {});
          proofPlayBtn.classList.remove("is-paused");
          proofPlayBtn.setAttribute("aria-label", "Pausar vídeo");
        } else {
          proofUserPaused = true;
          proofVideo.pause();
          proofPlayBtn.classList.add("is-paused");
          proofPlayBtn.setAttribute("aria-label", "Reproduzir vídeo");
        }
      });
    }

    // Pausa o vídeo quando o carrossel sai da viewport (economia de recursos)
    // e retoma se voltar pro slide do vídeo com a seção visível.
    var proofBand = document.querySelector(".proof-carousel-band");
    if (proofBand && "IntersectionObserver" in window) {
      var proofBandObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          proofVisible = entry.isIntersecting;
          updateProofState();
        });
      }, { threshold: 0.25 });
      proofBandObserver.observe(proofBand);
    }

    updateProofState();
  }

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
