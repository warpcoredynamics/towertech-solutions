'use strict';

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

/* ── STATUS LIST STAGGER ── */
const listObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    [...entry.target.querySelectorAll('li')].forEach((li, i) => {
      setTimeout(() => li.classList.add('show'), i * 85);
    });
    listObs.unobserve(entry.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll('.status-left ul').forEach((ul) => listObs.observe(ul));

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

/* ── MATRIX TYPEWRITER ── */
const matrix = document.querySelector('.matrix');

if (matrix) {
  const blocks = [
    'INSTALL  COMMISSION  VERIFY\nPOWER  CIVIL  STRUCTURAL\nMICROWAVE  INTEGRATION  RF\nMAINTENANCE  REPAIR  RESPONSE\nSAFETY  QUALITY  COMPLIANCE\nNATIONWIDE  FIELD  DELIVERY',
    'PRECISION  PROTOCOL  PERFORMANCE\nFIELD  CONTROL  QUALITY\nTEST  VERIFY  CLOSEOUT\nTOWER  ROOFTOP  SMALL-CELL\nCARRIER  PRIME  SUBCONTRACT\nON-TIME  ON-BUDGET  PROVEN',
  ];

  let blockIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = blocks[blockIdx % blocks.length];

    if (!isDeleting) {
      charIdx++;
      if (charIdx >= current.length) {
        isDeleting = true;
        setTimeout(tick, 2600);
        return;
      }
    } else {
      charIdx -= 2;
      if (charIdx <= 0) {
        isDeleting = false;
        blockIdx++;
        charIdx = 0;
      }
    }

    matrix.textContent = current.slice(0, Math.max(0, charIdx));
    setTimeout(tick, isDeleting ? 16 : 36);
  }

  setTimeout(tick, 2800);
}

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.menu-pill, .pill').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.22;

    el.style.transform = `translate(${x}px, ${y}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

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

/* ── HERO IMAGE PARALLAX ── */
const heroImage = document.querySelector('.hero-image');

if (heroImage) {
  window.addEventListener('scroll', () => {
    const rect = heroImage.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;

    if (visible) {
      const offset = (window.innerHeight - rect.top) * 0.08;

      heroImage.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }
  }, { passive: true });
}

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
document.querySelectorAll('.news-item').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    item.style.borderLeft = '3px solid var(--accent)';
    item.style.paddingLeft = `calc(${getComputedStyle(item).paddingLeft} - 3px)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.borderLeft = '';
    item.style.paddingLeft = '';
  });
});
