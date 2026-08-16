(() => {
  const body = document.body;
  const hero = document.querySelector('.hero');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.global-nav');
  const stickyCta = document.querySelector('.sticky-cta');
  const access = document.querySelector('#access');
  const facility = document.querySelector('#facility');
  const facilityRail = document.querySelector('.facility-rail');
  const motionToggle = document.querySelector('.motion-toggle');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionOff = () => body.classList.contains('no-motion');

  requestAnimationFrame(() => body.classList.add('is-loaded'));

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 3) * 90, 180)}ms`;
    revealObserver.observe(element);
  });

  if (hero && stickyCta) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      stickyCta.classList.toggle('is-shown', !entry.isIntersecting);
    }, { threshold: 0.05 });
    heroObserver.observe(hero);
  }

  if (access && stickyCta) {
    const accessObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) stickyCta.classList.remove('is-shown');
    }, { threshold: 0.15 });
    accessObserver.observe(access);
  }

  let ticking = false;
  const updateMotion = () => {
    ticking = false;
    if (motionOff()) return;

    if (hero && innerWidth > 900) {
      const rect = hero.getBoundingClientRect();
      const distance = Math.max(-10, Math.min(10, -rect.top * 0.018));
      hero.style.backgroundPosition = `center calc(50% + ${distance}px)`;
    }

    if (facility) {
      const rect = facility.getBoundingClientRect();
      const total = innerHeight + rect.height;
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / total));
      facility.style.setProperty('--range-progress', `${Math.round(progress * 100)}%`);
    }
  };

  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateMotion);
    }
  }, { passive: true });
  updateMotion();

  if (facilityRail && facility) {
    facilityRail.addEventListener('scroll', () => {
      if (innerWidth <= 900) {
        const max = facilityRail.scrollWidth - facilityRail.clientWidth;
        const progress = max > 0 ? facilityRail.scrollLeft / max : 0;
        facility.style.setProperty('--range-progress', `${Math.round(progress * 100)}%`);
      }
    }, { passive: true });
  }

  if (prefersReduced && motionToggle) {
    motionToggle.classList.add('is-shown');
    motionToggle.addEventListener('click', () => {
      const off = !motionOff();
      body.classList.toggle('no-motion', off);
      motionToggle.textContent = off ? 'アニメーションを再生する' : 'アニメーションを停止する';
      if (off) document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    });
  }
})();
