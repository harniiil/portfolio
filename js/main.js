initCanvas();
initNavbar();
initHero();
initVenom();
initAnimations();

// Photo lightbox
(function () {
  const circle = document.querySelector('.photo-circle');
  if (!circle) return;

  const img = circle.querySelector('img');
  const lb  = document.createElement('div');
  lb.className = 'photo-lightbox';
  lb.innerHTML = '<button class="photo-lightbox-close" aria-label="Close">&#x2715;</button>';

  const lbImg = document.createElement('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.appendChild(lbImg);
  document.body.appendChild(lb);

  function open() {
    lb.style.display = 'flex';
    requestAnimationFrame(() => lb.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.style.display = 'none'; }, 380);
  }

  lb.style.display = 'none';
  circle.addEventListener('click', open);
  lb.querySelector('.photo-lightbox-close').addEventListener('click', e => { e.stopPropagation(); close(); });
  lb.addEventListener('click', close);
  lbImg.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
