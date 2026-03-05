const topbar = document.querySelector('.topbar');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 10;
      topbar.style.background = scrolled ? 'rgba(215,216,218,.97)' : 'rgba(215,216,218,.88)';
      topbar.style.borderBottomColor = scrolled ? 'rgba(23,25,29,.38)' : 'rgba(23,25,29,.22)';
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
