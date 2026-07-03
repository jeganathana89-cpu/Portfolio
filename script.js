/* ==========================================================
   INIT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initYear();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initTypedRole();
  initCounters();
  initReveal();
  initParticles();
  initCursorGlow();
  initMagnetic();
  initTiltCards();
  initBackToTop();
  initContactForm();
  initWhatsAppButton();
  initResumeButton();
});

/* ==========================================================
   LOADER
   ========================================================== */
function initLoader(){
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderProgress');
  if(!loader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if(progress >= 100){
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.style.overflow = '';
      }, 250);
    }
    bar.style.width = progress + '%';
  }, 120);

  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(() => { document.body.style.overflow = ''; }, 900);
  });
}

/* ==========================================================
   FOOTER YEAR
   ========================================================== */
function initYear(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
}

/* ==========================================================
   NAVBAR SHRINK ON SCROLL
   ========================================================== */
function initNavbar(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const onScroll = () => {
    if(window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

/* ==========================================================
   MOBILE MENU
   ========================================================== */
function initMobileMenu(){
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if(!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
    });
  });
}

/* ==========================================================
   SMOOTH SCROLL FOR NAV ANCHORS
   ========================================================== */
function initSmoothScroll(){
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if(!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      const navHeight = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior:'smooth' });
    });
  });
}

/* ==========================================================
   ACTIVE NAV LINK ON SCROLL
   ========================================================== */
function initActiveNav(){
  const sections = ['home','about','stack','work','services','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll('.nav-link[data-nav]');
  if(!sections.length || !links.length) return;

  const setActive = (id) => {
    links.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ==========================================================
   TYPED ROLE ANIMATION
   ========================================================== */
function initTypedRole(){
  const el = document.getElementById('typedRole');
  if(!el) return;

  const roles = ['Digital Marketer', 'SEO Specialist', 'AI Growth Enthusiast', 'Lead Generation Expert'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if(!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  };

  tick();
}

/* ==========================================================
   ANIMATED COUNTERS
   ========================================================== */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================
   SCROLL REVEAL
   ========================================================== */
function initReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if(!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ==========================================================
   HERO PARTICLES (canvas)
   ========================================================== */
function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  let width, height;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(60, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = width; if(p.x > width) p.x = 0;
      if(p.y < 0) p.y = height; if(p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
      ctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ==========================================================
   CURSOR GLOW (desktop only)
   ========================================================== */
function initCursorGlow(){
  const glow = document.getElementById('cursorGlow');
  if(!glow || window.matchMedia('(max-width: 900px)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  const loop = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ==========================================================
   MAGNETIC BUTTONS
   ========================================================== */
function initMagnetic(){
  if(window.matchMedia('(max-width: 900px)').matches) return;
  const items = document.querySelectorAll('.magnetic');

  items.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* ==========================================================
   3D TILT ON WORK CARDS
   ========================================================== */
function initTiltCards(){
  if(window.matchMedia('(max-width: 900px)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', (x / rect.width) * 100 + '%');
      card.style.setProperty('--my', (y / rect.height) * 100 + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ==========================================================
   BACK TO TOP
   ========================================================== */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 700);
  }, { passive:true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior:'smooth' });
  });
}

/* ==========================================================
   CONTACT FORM — sends straight to Gmail via EmailJS
   ========================================================== */

/*
  ── SETUP (one-time, ~3 minutes) ──
  1. Create a free account at https://www.emailjs.com
  2. Add an Email Service connected to your Gmail (jeganathana89@gmail.com)
  3. Create an Email Template with variables: {{from_name}}, {{from_email}},
     {{phone}}, {{message}}  — these map to the form fields below.
  4. Copy your Public Key, Service ID and Template ID and paste them
     into the three constants below.
  Until these are filled in, the form automatically falls back to the
  mailto: link so it never breaks for visitors.
*/
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'a1B2c3D4e5F6g7H8'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_gmail'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_contact'

function isEmailJSConfigured(){
  return typeof emailjs !== 'undefined'
    && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID'
    && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
}

function sendViaMailto(form){
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(
    `${message}\n\n— ${name}\n${email}${form.phone.value ? '\n' + form.phone.value : ''}`
  );
  window.location.href = `mailto:jeganathana89@gmail.com?subject=${subject}&body=${body}`;
}

function initContactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if(!form || !note) return;

  if(isEmailJSConfigured()){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if(!name || !email || !message){
      note.style.color = '#f87171';
      note.textContent = 'Please fill in your name, email and message.';
      return;
    }

    const submitBtn = form.querySelector('.form-submit');

    if(isEmailJSConfigured()){
      if(submitBtn) submitBtn.disabled = true;
      note.style.color = 'var(--green)';
      note.textContent = 'Sending…';

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        phone: form.phone.value.trim() || 'Not provided',
        message: message
      }).then(() => {
        note.style.color = 'var(--green)';
        note.textContent = 'Message sent — I\'ll get back to you soon!';
        form.reset();
      }).catch(() => {
        note.style.color = '#f87171';
        note.textContent = 'Something went wrong. Opening your email app instead…';
        sendViaMailto(form);
      }).finally(() => {
        if(submitBtn) submitBtn.disabled = false;
      });
    } else {
      // EmailJS not configured yet — fall back to mailto so the form still works
      sendViaMailto(form);
      note.style.color = 'var(--green)';
      note.textContent = 'Opening your email client to send this message…';
      form.reset();
    }
  });
}

/* ==========================================================
   WHATSAPP BUTTON — opens a chat with the form details pre-filled
   ========================================================== */
function initWhatsAppButton(){
  const btn = document.getElementById('whatsappBtn');
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if(!btn || !form) return;

  const WHATSAPP_NUMBER = '919025063242'; // country code + number, no + or spaces

  btn.addEventListener('click', () => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if(!name || !message){
      if(note){
        note.style.color = '#f87171';
        note.textContent = 'Please fill in your name and message first.';
      }
      return;
    }

    const text = `Hi Jeganathan, I'm ${name}.\n\n${message}${email ? `\n\nMy email: ${email}` : ''}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* ==========================================================
   RESUME BUTTON (placeholder — no file attached)
   ========================================================== */
function initResumeButton(){
  const btn = document.getElementById('resumeBtn');
  if(!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:jeganathana89@gmail.com?subject=' +
      encodeURIComponent('Resume Request') +
      '&body=' + encodeURIComponent('Hi Jeganathan, could you send over your resume?');
  });
}
