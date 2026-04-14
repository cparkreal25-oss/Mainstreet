/* ============================================================
   Main Street Research — script.js v2.0
   Interactions: Star field, mobile menu, reveal animations,
   stats counter, chart animation, hero parallax, drag scroll
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // STAR FIELD CANVAS
  // ============================
  const canvas = document.getElementById('starfield');
  const ctx    = canvas ? canvas.getContext('2d') : null;
  let stars    = [];
  let rafId;

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 7000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        size:    Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.45 + 0.08,
        speed:   Math.random() * 0.8 + 0.2,
        phase:   Math.random() * Math.PI * 2,
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function drawStars(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ts = t * 0.001;
    stars.forEach(s => {
      const alpha = s.opacity * (0.65 + 0.35 * Math.sin(ts * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawStars);
  }

  if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    rafId = requestAnimationFrame(drawStars);
  }


  // ============================
  // MOBILE MENU
  // ============================
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  // ============================
  // STICKY HEADER SHRINK
  // ============================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  // ============================
  // SCROLL REVEAL
  // ============================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // ============================
  // STATS COUNTER
  // ============================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '+';
      const duration = 1800;
      const step     = 16;
      const inc      = target / (duration / step);
      let current    = 0;

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current) + (current >= target ? suffix : '');
        if (current >= target) clearInterval(timer);
      }, step);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));


  // ============================
  // CHART BAR ANIMATION
  // ============================
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelector('.chart-bars');
        if (bars) bars.classList.add('animated');
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const mainCard = document.getElementById('mainExpertiseCard');
  if (mainCard) chartObserver.observe(mainCard);


  // ============================
  // HERO PARALLAX (MOUSE)
  // ============================
  const heroSection = document.querySelector('.hero');
  const heroContent = document.getElementById('heroContent');

  if (heroSection && heroContent) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5);
      const y = ((e.clientY - rect.top)  / rect.height - 0.5);
      heroContent.style.transform = `translate(${x * 14}px, ${y * 9}px)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = '';
    });
  }


  // ============================
  // TESTIMONIALS DRAG SCROLL
  // ============================
  const track = document.getElementById('testimonialsTrack');
  if (track) {
    let isDown = false, startX = 0, scrollLeft = 0;

    track.addEventListener('mousedown', e => {
      isDown     = true;
      startX     = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave',  () => { isDown = false; });
    track.addEventListener('mouseup',     () => { isDown = false; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.8;
      track.scrollLeft = scrollLeft - walk;
    });
  }


  // ============================
  // CARD MOUSE SPOTLIGHT
  // ============================
  document.querySelectorAll('.expertise-card, .pillar-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });


  // ============================
  // CTA ANALYTICS HOOK
  // ============================
  document.querySelectorAll('.btn-primary, .consultation, .mobile-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('CTA Triggered: Email communication initiated.');
    });
  });

});
