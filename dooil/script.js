// c:\Users\ghghg\OneDrive\Desktop\dooil\script.js — V4
document.addEventListener('DOMContentLoaded', () => {

  // ── 1. 초기 로딩 뷰 애니메이션 ────────────────
  setTimeout(() => document.body.classList.add('loaded'), 100);

  // ── 2. 헤더 스크롤 토글 ───────────────────────
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 3. Hero 슬라이드쇼 ───────────────────────
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo((current + 1) % slides.length); }

  function startAuto() { timer = setInterval(next, 5000); }
  function stopAuto() { clearInterval(timer); }

  startAuto();

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(+dot.dataset.slide);
      startAuto();
    });
  });

  // ── 4. Intersection Observer (Reveal 애니메이션) ─
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // ── 5. 히어로 섹션은 즉시 표시 ────────────────
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('is-visible');
  });

  // ── 6. 부드러운 앵커 스크롤 ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
