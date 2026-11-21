/* ==========================================================================
   Mohammad Rida Mahdi — portfolio behaviour
   1. Cursor spotlight      2. Active section in the menu
   3. Footer year           4. Build-in intro (pointer click, code typing, reveal on scroll)
   ========================================================================== */

{
  const spot = document.getElementById('spot');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', e => {
      spot.style.setProperty('--x', e.clientX + 'px');
      spot.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });
  }

  const links = [...document.querySelectorAll('nav a')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const navObserver = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.remove('on'));
        byId[en.target.id]?.classList.add('on');
      }
    }
  }, { rootMargin: '-35% 0px -60% 0px' });
  document.querySelectorAll('main section').forEach(s => navObserver.observe(s));

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ---------- build-in animation ---------- */
  const root = document.documentElement;
  const sel = 'header h1,.role,.pitch,.figs li,nav,.social,.ed,#about p,.sh,.card,.skills li,.sub,.certs li,.contact h3,.contact p,.btn,.mail-text,footer,.more';
  const all = [...document.querySelectorAll(sel)];
  const show = el => el.classList.add('in');

  if (!root.classList.contains('anim')) {
    all.forEach(show);
  } else {
    const aboutSh = document.querySelector('#about .sh');
    const editor = document.querySelector('.ed');
    const leftSide = [...document.querySelectorAll('header h1,.role,.pitch,.figs li,nav,.social')];
    const aboutText = [...document.querySelectorAll('#about p')];
    const firstScreen = new Set([aboutSh, editor, ...leftSide, ...aboutText]);
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    /* everything below the first screen slides in as it scrolls into view */
    const revealObserver = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target;
        const sibs = [...el.parentElement.children];
        el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) % 4) * 70 + 'ms';
        show(el);
        revealObserver.unobserve(el);
        setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    all.filter(el => !firstScreen.has(el)).forEach(el => revealObserver.observe(el));

    if (!root.classList.contains('intro')) {
      /* returning visit in this session: quick fade, no typing */
      [aboutSh, editor, ...leftSide, ...aboutText].forEach((el, i) => later(() => show(el), 40 + i * 50));
    } else {
      /* first visit: a pointer clicks into the editor, the code types itself, the page assembles */
      const pre = editor.querySelector('pre');
      const lines = [...pre.querySelectorAll('.l')];
      const caret = pre.querySelector('.cur');
      const status = editor.querySelector('.ed-bot span:last-child');
      const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
      const parts = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        parts.push({ n, full: n.data, line: n.parentElement.closest('.l') });
      }
      parts.forEach(p => { p.n.data = ''; });
      lines.forEach(l => l.classList.add('hide'));
      const total = parts.reduce((a, p) => a + p.full.length, 0);

      let done = false, raf = 0, ptr = null, note = null;
      const finish = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        parts.forEach(p => { p.n.data = p.full; });
        lines.forEach(l => l.classList.remove('hide'));
        lines[lines.length - 1].appendChild(caret);
        status.textContent = 'TypeScript · UTF-8 · Ln ' + lines.length;
        [aboutSh, editor, ...leftSide].forEach(show);
        aboutText.forEach((el, i) => setTimeout(() => show(el), 120 + i * 110));
        if (ptr) ptr.remove();
        if (note) { note.style.opacity = '0'; setTimeout(() => note.remove(), 500); }
        root.classList.remove('intro');
        try { sessionStorage.setItem('mrm-intro', '1'); } catch (e) {}
        ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => removeEventListener(t, finish));
      };
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => addEventListener(t, finish, { passive: true }));

      const typeCode = () => {
        const dur = 1700, t0 = performance.now();
        let typed = 0, k = 0, j = 0;
        const step = now => {
          if (done) return;
          const want = Math.min(total, Math.round(((now - t0) / dur) * total));
          while (typed < want && k < parts.length) {
            const p = parts[k];
            if (j === 0 && p.line.classList.contains('hide')) {
              p.line.classList.remove('hide');
              p.line.appendChild(caret);
              status.textContent = 'TypeScript · UTF-8 · Ln ' + (lines.indexOf(p.line) + 1);
            }
            if (j < p.full.length) { j++; p.n.data = p.full.slice(0, j); typed++; }
            if (j >= p.full.length) { k++; j = 0; }
          }
          if (typed < total) raf = requestAnimationFrame(step);
          else finish();
        };
        raf = requestAnimationFrame(step);
      };

      later(() => show(aboutSh), 60);
      later(() => show(editor), 140);
      leftSide.forEach((el, i) => later(() => show(el), 350 + i * 110));

      note = document.createElement('div');
      note.className = 'skipnote';
      note.textContent = 'click anywhere to skip';
      document.body.appendChild(note);

      if (matchMedia('(pointer: fine)').matches && innerWidth > 700) {
        ptr = document.createElement('div');
        ptr.className = 'ptr';
        ptr.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2.5v16.4l4.3-4.2 2.9 6.5 2.7-1.2-2.9-6.4h6.3z" fill="#fdfeff" stroke="#030d22" stroke-width="1.3" stroke-linejoin="round"/></svg>';
        document.body.appendChild(ptr);
        later(() => {
          const r = pre.getBoundingClientRect();
          const tx = r.left + 64, ty = r.top + 6;
          const sx = innerWidth * 0.9, sy = innerHeight * 0.92;
          const glide = ptr.animate(
            [{ transform: `translate(${sx}px,${sy}px)`, opacity: 0 },
             { transform: `translate(${(sx + tx) / 2}px,${sy - 40}px)`, opacity: 1, offset: 0.35 },
             { transform: `translate(${tx}px,${ty}px)`, opacity: 1 }],
            { duration: 850, easing: 'cubic-bezier(.3,.6,.2,1)', fill: 'forwards' });
          glide.onfinish = () => {
            if (done) return;
            ptr.animate([{ transform: `translate(${tx}px,${ty}px) scale(1)` }, { transform: `translate(${tx}px,${ty}px) scale(.82)` }, { transform: `translate(${tx}px,${ty}px) scale(1)` }], { duration: 220, fill: 'forwards' });
            const rip = document.createElement('div');
            rip.className = 'rip';
            rip.style.left = tx + 4 + 'px'; rip.style.top = ty + 4 + 'px';
            document.body.appendChild(rip);
            rip.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1.8)', opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => rip.remove();
            typeCode();
            later(() => { if (ptr) ptr.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }); }, 450);
          };
        }, 450);
      } else {
        later(typeCode, 500);
      }
    }
  }
}
