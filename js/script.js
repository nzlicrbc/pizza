gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);


const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initLoader() {
  const loader   = document.getElementById('loader');
  const blobs    = document.querySelectorAll('.loader__blob');
  const bar      = document.querySelector('.loader__bar');
  const barTrack = document.querySelector('.loader__bar-track');

  if (!loader) return;

  document.body.classList.add('is-loading');

  if (reducedMotion) {
    gsap.to(loader, {
      autoAlpha: 0,
      duration: 0.4,
      delay: 0.5,
      onComplete: cleanup,
    });
    return;
  }

  const morphTargets = [
    '40% 60% 70% 30% / 40% 70% 30% 60%',
    '70% 30% 50% 50% / 50% 60% 40% 70%',
    '30% 70% 45% 55% / 60% 40% 70% 30%',
  ];

  blobs.forEach((blob, i) => {
    gsap.to(blob, {
      borderRadius: morphTargets[i],
      duration: 1.4 + i * 0.18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });

  gsap.fromTo(
    bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 2.3,
      ease: 'power1.inOut',
      onUpdate() {
        barTrack?.setAttribute('aria-valuenow', Math.round(this.progress() * 100));
      },
      onComplete: exitLoader,
    }
  );

  function exitLoader() {
    gsap.killTweensOf(blobs);

    gsap.to(blobs, {
      yPercent: -125,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.inOut',
      onComplete: cleanup,
    });
  }

  function cleanup() {
    loader.remove();
    document.body.classList.remove('is-loading');
    document.dispatchEvent(new CustomEvent('fuoco:loader-done'));
  }
})();

(function initNav() {
  const nav      = document.getElementById('nav');
  const overlay  = document.getElementById('navOverlay');
  const burger   = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('navClose');
  const links    = [...document.querySelectorAll('[data-menu-link]')];
  const bLines   = [...document.querySelectorAll('.nav__burger-line')];

  if (!nav || !overlay) return;

  let isOpen = false;

  gsap.set(overlay, { y: '-100%', autoAlpha: 0 });

  const slideTl = gsap.timeline({ paused: true })
    .to(overlay, { y: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
    .fromTo(links,
      { y: 52, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.45, ease: 'power3.out' },
      '-=0.25'
    );

  const xTl = gsap.timeline({ paused: true })
    .to(bLines[0], { y: 8,  rotate:  45, duration: 0.3, ease: 'power2.out' }, 0)
    .to(bLines[1], { scaleX: 0.4, autoAlpha: 0, duration: 0.2 }, 0)
    .to(bLines[2], { y: -8, rotate: -45, duration: 0.3, ease: 'power2.out' }, 0);

  function open() {
    isOpen = true;
    nav.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close navigation menu');

    if (reducedMotion) {
      gsap.set(overlay, { y: 0 });
      gsap.set(links, { autoAlpha: 1, y: 0 });
    } else {
      slideTl.play();
      xTl.play();
    }
  }

  function close() {
    isOpen = false;
    nav.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open navigation menu');

    if (reducedMotion) {
      gsap.set(overlay, { y: '-100%', autoAlpha: 0 });
    } else {
      slideTl.reverse();
      xTl.reverse();
    }
  }

  function quickClose() {
    isOpen = false;
    nav.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open navigation menu');
    if (reducedMotion) {
      gsap.set(overlay, { y: '-100%', autoAlpha: 0 });
    } else {
      slideTl.pause();
      gsap.set(links, { autoAlpha: 0 });
      gsap.to(overlay, {
        y: '-100%',
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete() { slideTl.progress(0).pause(); },
      });
      xTl.reverse();
    }
  }

  burger.addEventListener('click', () => (isOpen ? close() : open()));
  closeBtn?.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', quickClose));
  document.addEventListener('keydown', e => e.key === 'Escape' && isOpen && close());

  ScrollTrigger.create({
    start: 'top -60',
    onEnter:     () => nav.classList.add('is-scrolled'),
    onLeaveBack: () => nav.classList.remove('is-scrolled'),
  });
})();

(function initHero() {
  const section  = document.getElementById('hero');
  const bgWords  = [...document.querySelectorAll('.hero__bg-text .js-word')];
  const pizzaWrap = document.querySelector('.hero__pizza-wrap');
  const wordmark  = document.querySelector('.hero__wordmark');
  const labelTL   = document.querySelector('.hero__label--tl');
  const labelBR   = document.querySelector('.hero__label--br');
  const copyItems = [...document.querySelectorAll('.hero__copy-col')];

  if (!section || !pizzaWrap) return;

  if (reducedMotion) return;

  gsap.set(bgWords,    { autoAlpha: 0, y: 32 });
  gsap.set(pizzaWrap,  { autoAlpha: 0, scale: 0.88 });
  gsap.set(wordmark,   { autoAlpha: 0, y: 44 });
  gsap.set(labelTL,    { autoAlpha: 0, scale: 0.72, rotate: -18 });
  gsap.set(labelBR,    { autoAlpha: 0, scale: 0.72, rotate:  16 });
  gsap.set(copyItems,  { autoAlpha: 0, y: 20 });

  document.addEventListener('fuoco:loader-done', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(bgWords, { y: 0, autoAlpha: 1, stagger: 0.14, duration: 0.85 })
      .to(pizzaWrap, { scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(1.3)' }, '-=0.55')
      .to(wordmark,  { y: 0, autoAlpha: 1, duration: 0.72 }, '-=0.6')
      .to(labelTL,   { scale: 1, autoAlpha: 1, rotate: -12, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.45')
      .to(labelBR,   { scale: 1, autoAlpha: 1, rotate:   9, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.4')
      .to(copyItems, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5 }, '-=0.3');
  }, { once: true });
})();

(function initSticker() {
  const el = document.querySelector('.about-sticker');
  if (!el || reducedMotion) return;
  el.style.rotate = '0deg';
  Sticker.init(el);
  el.style.rotate = '';
})();

(function initAbout() {
  const section = document.getElementById('about');
  if (!section || reducedMotion) return;

  const label   = section.querySelector('.about__label');
  const lines   = [...section.querySelectorAll('.about__line')];
  const body    = section.querySelector('.about__body');
  const cta     = section.querySelector('.about__cta');
  const photos  = [...section.querySelectorAll('.about__photo')];
  const sticker = section.querySelector('.about__sticker');

  gsap.set(label,         { autoAlpha: 0, y: 20 });
  gsap.set(lines,         { autoAlpha: 0, y: 58 });
  gsap.set([body, cta],   { autoAlpha: 0, y: 24 });
  gsap.set(photos,        { autoAlpha: 0, x: 60 });
  gsap.set(sticker,       { autoAlpha: 0, scale: 0.55 });

  const base = { trigger: section, start: 'top 72%' };

  gsap.to(label, {
    autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 82%' },
  });

  gsap.to(lines, {
    autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out',
    scrollTrigger: base,
  });

  gsap.to([body, cta], {
    autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 58%' },
  });

  gsap.to(photos, {
    autoAlpha: 1, x: 0, stagger: 0.13, duration: 0.72, ease: 'power3.out',
    scrollTrigger: base,
  });

  gsap.to(sticker, {
    autoAlpha: 1, scale: 1, duration: 0.62, ease: 'back.out(1.8)',
    scrollTrigger: { trigger: section, start: 'top 60%' },
  });
})();

(function initExperience() {
  const section   = document.getElementById('experience');
  if (!section || reducedMotion) return;

  const label     = section.querySelector('.exp__label');
  const lines     = [...section.querySelectorAll('.exp__line')];
  const imgCircle = section.querySelector('.exp__img-circle');
  const steam     = [...section.querySelectorAll('.steam-line')];
  const boldLabel = section.querySelector('.exp__bold-label');
  const statItems = [...section.querySelectorAll('.exp__stat')];

  gsap.set(label,     { autoAlpha: 0, y: 18 });
  gsap.set(lines,     { autoAlpha: 0, y: 58 });
  gsap.set(imgCircle, { autoAlpha: 0, scale: 0.88 });
  gsap.set(boldLabel, { autoAlpha: 0, scale: 0.7 });
  gsap.set(statItems, { autoAlpha: 0, y: 28 });

  const trig = (start) => ({ trigger: section, start });

  gsap.to(label, {
    autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
    scrollTrigger: trig('top 85%'),
  });

  gsap.to(lines, {
    autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
    scrollTrigger: trig('top 78%'),
  });

  gsap.to(imgCircle, {
    autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.2)',
    scrollTrigger: trig('top 68%'),
  });

  gsap.to(boldLabel, {
    autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)',
    scrollTrigger: trig('top 62%'),
  });

  gsap.to(statItems, {
    autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out',
    scrollTrigger: trig('top 60%'),
  });

  const steps = [...section.querySelectorAll('.exp__step')];
  if (steps.length) {
    gsap.set(steps, { autoAlpha: 0, y: 40 });
    gsap.to(steps, {
      autoAlpha: 1, y: 0,
      stagger: 0.12, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'bottom 85%' },
    });
  }

  steam.forEach((path, i) => {
    gsap.to(path, {
      y: -14,
      duration: 1.9 + i * 0.28,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.22,
    });
  });
})();

(function initFullbleed() {
  const section = document.getElementById('fullbleed');
  if (!section || reducedMotion) return;

  const img = section.querySelector('.fullbleed__img');
  if (!img) return;

  gsap.to(img, {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end:   'bottom top',
      scrub: true,
    },
  });
})();

(function initIngredients() {
  const section = document.getElementById('ingredients');
  if (!section || reducedMotion) return;

  const label = section.querySelector('.ing__label');
  const lines = [...section.querySelectorAll('.ing__line')];
  const icons = [...section.querySelectorAll('.ing__icon')];

  gsap.set(label, { autoAlpha: 0, y: 18 });
  gsap.set(lines, { autoAlpha: 0, y: 58 });
  gsap.set(icons, { autoAlpha: 0, scale: 0.7 });

  const trig = (start) => ({ trigger: section, start });

  gsap.to(label, {
    autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
    scrollTrigger: trig('top 82%'),
  });

  gsap.to(lines, {
    autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    scrollTrigger: trig('top 75%'),
  });

  gsap.to(icons, {
    autoAlpha: 1, scale: 1, stagger: 0.12, duration: 0.72, ease: 'back.out(1.6)',
    scrollTrigger: trig('top 68%'),
  });

  const parallaxY = [-55, 45, -35, 60];
  icons.forEach((icon, i) => {
    gsap.to(icon, {
      y: parallaxY[i],
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end:   'bottom top',
        scrub: true,
      },
    });
  });
})();

(function initTakeaway() {
  const section = document.getElementById('takeaway');
  if (!section || reducedMotion) return;

  const label      = section.querySelector('.ta__label');
  const lines      = [...section.querySelectorAll('.ta__line')];
  const body       = section.querySelector('.ta__body');
  const mapPath    = section.querySelector('.ta__map-path');
  const cities     = [...section.querySelectorAll('.ta__city')];
  const pizzaIcon  = document.getElementById('ta__pizza-icon');
  const routePath  = document.getElementById('ta__route-path');

  gsap.set(label,  { autoAlpha: 0, y: 18 });
  gsap.set(lines,  { autoAlpha: 0, y: 58 });
  gsap.set(body,   { autoAlpha: 0, y: 20 });
  gsap.set(cities, { autoAlpha: 0, y: 32 });
  if (mapPath) gsap.set(mapPath, { opacity: 0 });

  const trig = (start) => ({ trigger: section, start });

  gsap.to(label, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', scrollTrigger: trig('top 85%') });
  gsap.to(lines, { autoAlpha: 1, y: 0, stagger: 0.1,  duration: 0.7,  ease: 'power3.out', scrollTrigger: trig('top 78%') });
  gsap.to(body,  { autoAlpha: 1, y: 0, duration: 0.6,  ease: 'power3.out', scrollTrigger: trig('top 70%') });

  if (mapPath) {
    gsap.to(mapPath, { opacity: 0.4, duration: 1.4, ease: 'power2.out', scrollTrigger: trig('top 62%') });
  }

  gsap.to(cities, {
    autoAlpha: 1, y: 0,
    stagger: 0.13, duration: 0.65, ease: 'back.out(1.4)',
    scrollTrigger: trig('top 58%'),
  });

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (pizzaIcon && routePath && !isMobile) {
    gsap.to(pizzaIcon, {
      rotation: 360,
      duration: 7,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    });

    gsap.to(pizzaIcon, {
      motionPath: {
        path: routePath,
        align: routePath,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      ease: 'none',
      immediateRender: true,
      scrollTrigger: {
        trigger: section,
        start: 'top 55%',
        end:   'bottom 45%',
        scrub: 2,
      },
    });
  }
})();

(function initCtaSticker() {
  const el = document.querySelector('.cta-sticker');
  if (!el || reducedMotion) return;
  el.style.rotate = '0deg';
  Sticker.init(el);
  el.style.rotate = '';
})();

(function initCta() {
  const section = document.getElementById('cta');
  if (!section || reducedMotion) return;

  const label   = section.querySelector('.cta__label');
  const lines   = [...section.querySelectorAll('.cta__line')];
  const body    = section.querySelector('.cta__body');
  const btn     = section.querySelector('.cta__btn');
  const sticker = section.querySelector('.cta__sticker');
  const board   = section.querySelector('.cta__board');

  gsap.set(label,   { autoAlpha: 0, y: 18 });
  gsap.set(lines,   { autoAlpha: 0, y: 58 });
  gsap.set(body,    { autoAlpha: 0, y: 20 });
  gsap.set(btn,     { autoAlpha: 0, y: 16 });
  gsap.set(sticker, { autoAlpha: 0, scale: 0.55 });
  gsap.set(board,   { autoAlpha: 0, x: 60 });

  const trig = (start) => ({ trigger: section, start });

  gsap.to(label,   { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', scrollTrigger: trig('top 85%') });
  gsap.to(board,   { autoAlpha: 1, x: 0, duration: 0.8,  ease: 'power3.out', scrollTrigger: trig('top 78%') });
  gsap.to(lines,   { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: trig('top 75%') });
  gsap.to(body,    { autoAlpha: 1, y: 0, duration: 0.6,  ease: 'power3.out', scrollTrigger: trig('top 68%') });
  gsap.to(btn,     { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', scrollTrigger: trig('top 62%') });
  gsap.to(sticker, { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.8)', scrollTrigger: trig('top 56%') });
})();

(function initFooter() {
  const section = document.getElementById('footer');
  if (!section || reducedMotion) return;

  const navLinks = [...section.querySelectorAll('.footer__nav a')];
  const copy     = section.querySelector('.footer__copy');
  const mark     = section.querySelector('.footer__wordmark');
  const tagline  = section.querySelector('.footer__tagline');
  const icons    = [...section.querySelectorAll('.footer__icon')];

  gsap.set(navLinks, { autoAlpha: 0, y: 14 });
  gsap.set(copy,     { autoAlpha: 0, y: 14 });
  gsap.set(mark,     { opacity: 0,   y: 40 });
  gsap.set(tagline,  { autoAlpha: 0, y: 12 });
  gsap.set(icons,    { autoAlpha: 0, scale: 0.55 });

  const trig = (start) => ({ trigger: section, start });

  gsap.to(navLinks, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.5,  ease: 'power3.out', scrollTrigger: trig('top 92%') });
  gsap.to(copy,     { autoAlpha: 1, y: 0, duration: 0.5,  ease: 'power3.out', scrollTrigger: trig('top 92%'), delay: 0.2 });
  gsap.to(mark,     { opacity: 0.1, y: 0, duration: 0.9,  ease: 'power3.out', scrollTrigger: trig('top 85%') });
  gsap.to(icons,    { autoAlpha: 1, scale: 1, stagger: 0.09, duration: 0.6, ease: 'back.out(1.7)', scrollTrigger: trig('top 80%') });
  gsap.to(tagline,  { autoAlpha: 1, y: 0, duration: 0.5,  ease: 'power3.out', scrollTrigger: trig('top 70%') });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 85%',
    once: true,
    onEnter() {
      icons.forEach((icon, i) => {
        gsap.to(icon, {
          y: -(12 + i * 5),
          duration: 2.0 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.7 + i * 0.32,
        });
      });
    },
  });
})();
