// Subtle reveal as sections enter view
const targets = document.querySelectorAll('.pillar, .hero-meta, .closing-title, .closing-body');
if (targets.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}
