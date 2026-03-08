'use strict';

/* ── FORCE TOP ON LOAD ── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo({ top: 0, behavior: 'instant' });

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');

progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? window.scrollY / total : 0;

  progressBar.style.transform = `scaleX(${Math.min(pct, 1)})`;
}, { passive: true });

/* ── TOPBAR SCROLL EFFECT ── */
const topbar = document.querySelector('.topbar');

if (topbar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 10;

    topbar.style.background = scrolled
      ? 'rgb(215 216 218 / 0.97)'
      : 'rgb(215 216 218 / 0.88)';
    topbar.style.borderBottomColor = scrolled
      ? 'rgb(23 25 29 / 0.38)'
      : 'rgb(23 25 29 / 0.22)';
  }, { passive: true });
}

/* ── SECTION REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

/* ── TERMINAL TYPEWRITER ── */
(function initTerminal() {
  const output = document.getElementById('terminal-output');

  if (!output) return;

  const services = [
    { n: '01', text: 'Antenna and Line Installation Services' },
    { n: '02', text: 'Civil and Electrical Services' },
    { n: '03', text: 'Emergency Deployment Services' },
    { n: '04', text: 'Structural Assessment and Modification' },
    { n: '05', text: 'Microwave Services' },
    { n: '06', text: 'Testing and Integration' },
    { n: '07', text: 'Maintenance and Repair Services' },
  ];

  const cursor = document.createElement('span');

  cursor.className = 'terminal-cursor';

  function typeCommand(cmd, el, speed, done) {
    let i = 0;

    el.textContent = '';
    el.appendChild(cursor);

    const t = setInterval(() => {
      el.textContent = cmd.slice(0, ++i);
      el.appendChild(cursor);
      if (i >= cmd.length) { clearInterval(t); if (done) setTimeout(done, 120); }
    }, speed);
  }

  function typeLine(text, el, speed, done) {
    let i = 0;

    el.textContent = '';

    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(t); if (done) done(); }
    }, speed);
  }

  function printService(idx) {
    if (idx >= services.length) {
      const doneLine = document.createElement('span');

      doneLine.className = 'terminal-line';
      doneLine.innerHTML = '<span class="terminal-prompt">$</span> <span class="terminal-cmd">_</span>';
      doneLine.querySelector('.terminal-cmd').appendChild(cursor);
      output.appendChild(doneLine);
      return;
    }

    // prompt + command line
    const cmdLine = document.createElement('span');

    cmdLine.className = 'terminal-line';
    const prompt = document.createElement('span');

    prompt.className = 'terminal-prompt';
    prompt.textContent = '$ ';
    const cmdSpan = document.createElement('span');

    cmdSpan.className = 'terminal-cmd';
    cmdLine.appendChild(prompt);
    cmdLine.appendChild(cmdSpan);
    output.appendChild(cmdLine);

    const cmd = `echo "${services[idx].n}. ${services[idx].text}"`;

    typeCommand(cmd, cmdSpan, 28, () => {
      cursor.remove();

      // output line
      const outLine = document.createElement('span');

      outLine.className = 'terminal-line';
      const outSpan = document.createElement('span');

      outSpan.className = 'terminal-output';
      outLine.appendChild(outSpan);
      output.appendChild(outLine);

      typeLine(`${services[idx].n}. ${services[idx].text}`, outSpan, 14, () => {
        setTimeout(() => printService(idx + 1), 180);
      });
    });
  }

  // Trigger when section scrolls into view
  const termObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => printService(0), 400);
      termObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  termObs.observe(output.closest('section'));
}());

/* ── CAP CARD STAGGER ── */
const capObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    [...entry.target.querySelectorAll('.cap-card')].forEach((card, i) => {
      setTimeout(() => card.classList.add('show'), i * 130);
    });
    capObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cap-grid').forEach((g) => capObs.observe(g));

/* ── PROOF ITEM STAGGER ── */
const proofObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    [...entry.target.querySelectorAll('.proof-item')].forEach((item, i) => {
      setTimeout(() => item.classList.add('show'), i * 90);
    });
    proofObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.proof-grid').forEach((g) => proofObs.observe(g));

/* ── NEWS ITEM STAGGER ── */
const newsObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    [...entry.target.querySelectorAll('.news-item')].forEach((item, i) => {
      setTimeout(() => item.classList.add('show'), i * 110);
    });
    newsObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.news-stack').forEach((s) => newsObs.observe(s));

/* ── MAGNETIC BUTTONS ── */
(function initMagnetic() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const RADIUS = 90;   /* attraction starts this far from button edge */
  const STRENGTH = 0.38;

  document.querySelectorAll('.menu-pill, .pill').forEach((el) => {
    el.style.transition = 'transform .35s cubic-bezier(.2,.65,.2,1), background .2s ease, color .2s ease, box-shadow .2s ease';

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = Math.max(r.width, r.height) / 2 + RADIUS;

      if (dist < threshold) {
        const pull = (1 - dist / threshold) * STRENGTH;
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else {
        el.style.transform = '';
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}());

/* ── MAGNETIC NAV CIRCLES ── */
document.querySelectorAll('.nav-circles i').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.3;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;

    el.style.transform = `translate(${x}px, ${y}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ── IMAGE PARALLAX ── */
(function initImageParallax() {
  const heroImage  = document.querySelector('.hero-image');
  const proofGrid  = document.querySelector('.proof-grid');
  const newsImage  = document.querySelector('.news-image');
  const hasMouse   = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* scroll targets & lerped current values */
  let heroScrollT = 0,  heroScrollC = 0;
  let proofScrollT = 0, proofScrollC = 0;
  let newsScrollT = 0,  newsScrollC = 0;

  /* mouse parallax targets (desktop only) */
  let mouseTX = 0, mouseTY = 0, mouseCX = 0, mouseCY = 0;

  function computeScrollTargets() {
    if (heroImage) {
      const r = heroImage.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        heroScrollT = (window.innerHeight - r.top) * 0.08;
      }
    }
    if (proofGrid) {
      const r = proofGrid.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        proofScrollT = (p - 0.5) * 70;
      }
    }
    if (newsImage) {
      const r = newsImage.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        newsScrollT = (p - 0.5) * 90;
      }
    }
  }

  window.addEventListener('scroll', computeScrollTargets, { passive: true });
  computeScrollTargets();

  if (hasMouse) {
    document.addEventListener('mousemove', (e) => {
      mouseTX = (e.clientX / window.innerWidth  - 0.5) * -24;
      mouseTY = (e.clientY / window.innerHeight - 0.5) * -14;
    }, { passive: true });
  }

  /* single rAF loop — lerp all values then apply */
  const LERP = 0.072;

  (function tick() {
    heroScrollC  += (heroScrollT  - heroScrollC)  * LERP;
    proofScrollC += (proofScrollT - proofScrollC) * LERP;
    newsScrollC  += (newsScrollT  - newsScrollC)  * LERP;
    mouseCX      += (mouseTX      - mouseCX)      * LERP;
    mouseCY      += (mouseTY      - mouseCY)      * LERP;

    if (heroImage) {
      if (hasMouse) {
        heroImage.style.backgroundPosition =
          `calc(50% + ${mouseCX.toFixed(2)}px) calc(40% + ${(heroScrollC + mouseCY).toFixed(2)}px)`;
      } else {
        heroImage.style.backgroundPositionY = `calc(40% + ${heroScrollC.toFixed(2)}px)`;
      }
    }
    if (proofGrid) {
      proofGrid.style.backgroundPositionY = `calc(30% + ${proofScrollC.toFixed(2)}px)`;
    }
    if (newsImage) {
      newsImage.style.setProperty('--img-py', `calc(50% + ${newsScrollC.toFixed(2)}px)`);
    }

    requestAnimationFrame(tick);
  }());
}());

/* ── TOPBAR BRAND LETTER SPLIT ── */
const brand = document.querySelector('.brand');

if (brand) {
  const textNode = [...brand.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());

  if (textNode) {
    const letters = textNode.textContent.trim().split('');
    const span = document.createElement('span');

    span.style.display = 'inline';
    letters.forEach((char, i) => {
      const s = document.createElement('span');

      s.textContent = char === ' ' ? '\u00a0' : char;
      s.style.cssText = `display:inline-block;opacity:0;transform:translateY(12px);transition:opacity .4s ${0.05 + i * 0.04}s ease,transform .4s ${0.05 + i * 0.04}s cubic-bezier(.2,.65,.2,1)`;
      span.appendChild(s);
    });
    textNode.replaceWith(span);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.querySelectorAll('span').forEach((s) => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        });
      });
    });
  }
}

/* ── CAP CARD TILT ── */
document.querySelectorAll('.cap-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const rotX = (-y * 5).toFixed(2);
    const rotY = (x * 5).toFixed(2);

    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── NEWS ITEM CURSOR ACCENT LINE ── */
/* handled via CSS border-left-color transition on hover */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }, { passive: true });

  (function tick() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  }());

  const selector = 'a, button, [role="button"], .pill, .menu-pill, .nav-circles i, .cap-card';
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
  });
}());

/* ── ACTIVE NAV SECTION ── */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.top-nav a[href^="#"]');
  if (!navLinks.length) return;

  const sections = [...navLinks]
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const activate = (id) => {
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activate(entry.target.id);
    });
  }, { threshold: 0, rootMargin: '-20% 0px -65% 0px' });

  sections.forEach((s) => obs.observe(s));
}());

/* ── TEXT SCRAMBLE ── */
(function initTextScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%@·_-><';
  const FRAMES = 28;

  function scramble(el, delay) {
    setTimeout(() => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push({ node, orig: node.nodeValue });

      const totalLen = nodes.reduce((n, t) => n + t.orig.replace(/\s/g, '').length, 0);
      if (!totalLen) return;

      let frame = 0;
      (function tick() {
        let gi = 0;
        nodes.forEach(({ node, orig }) => {
          let out = '';
          for (let i = 0; i < orig.length; i++) {
            const c = orig[i];
            if (/\s/.test(c)) { out += c; continue; }
            const threshold = (gi / totalLen) * FRAMES;
            out += frame >= threshold ? c : CHARS[Math.floor(Math.random() * CHARS.length)];
            gi++;
          }
          node.nodeValue = out;
        });
        frame++;
        if (frame <= FRAMES) requestAnimationFrame(tick);
        else nodes.forEach(({ node, orig }) => (node.nodeValue = orig));
      }());
    }, delay || 0);
  }

  /* Hero h1: fire on load after reveal animation */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) scramble(heroH1, 920);

  /* Section headings: fire when they enter viewport */
  const headings = document.querySelectorAll('.cap-grid h3, .intro h2');
  if (headings.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        scramble(entry.target, 180);
      });
    }, { threshold: 0.6 });
    headings.forEach((h) => obs.observe(h));
  }
}());

/* ── CTA PARTICLE NETWORK ── */
(function initCtaParticles() {
  const canvas = document.querySelector('.cta-canvas');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COUNT = 32;
  const CONNECT = 72;
  let particles = [];
  let raf;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.4 + 0.5,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgb(23 25 29 / ${0.22 * (1 - d / CONNECT)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(23 25 29 / 0.38)';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    raf = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
    cancelAnimationFrame(raf);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }, { passive: true });

  // Start when visible
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        init();
      } else {
        cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0.1 });

  obs.observe(canvas.closest('.status-cta'));
}());
