import { useEffect, useMemo, useRef } from 'react';

function SweepTitle({ id, className, children, ...rest }) {
  const titleRef = useRef(null);
  const letters = useMemo(
    () => (typeof children === 'string' ? Array.from(children) : []),
    [children],
  );

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;

    const prefersReduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('sweep-title--static');
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const tallerThanViewport = entry.boundingClientRect.height > window.innerHeight;
      const mostlyVisible = entry.isIntersecting
        && (entry.intersectionRatio >= 0.35 || tallerThanViewport);

      if (mostlyVisible) {
        el.classList.add('sweep-title--open');
        el.classList.remove('sweep-title--closed');
      } else if (!entry.isIntersecting) {
        el.classList.add('sweep-title--closed');
        el.classList.remove('sweep-title--open');
      }
    }, { threshold: [0, 0.35] });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    if (!el || letters.length === 0) return undefined;

    const prefersReduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const fill = el.querySelector('.sweep-title__fill');
    const spans = Array.from(el.querySelectorAll('.sweep-title__letter'));
    if (!fill || spans.length === 0) return undefined;

    let frame = 0;
    let running = false;
    let startedAt = 0;

    const applyEdge = (topX, bottomX) => {
      const fillRect = fill.getBoundingClientRect();
      const fillHeight = fillRect.height || 1;
      for (let i = 0; i < spans.length; i += 1) {
        const r = spans[i].getBoundingClientRect();
        let yFraction = (r.top + (r.height / 2) - fillRect.top) / fillHeight;
        yFraction = yFraction < 0 ? 0 : yFraction > 1 ? 1 : yFraction;
        const edgeX = topX + ((bottomX - topX) * yFraction);
        const midX = r.left + (r.width / 2);
        spans[i].classList.toggle('sweep-title__letter--hollow', midX <= edgeX);
      }
    };

    const edgeFromProgress = (progress) => {
      const fillRect = fill.getBoundingClientRect();
      const fontSize = parseFloat(window.getComputedStyle(fill).fontSize) || 16;
      const topStart = 1.5 * fontSize;
      const bottomStart = 3 * fontSize;
      const topEnd = 0.8 * fontSize;
      const bottomEnd = 2.3 * fontSize;
      const width = fillRect.width;
      const topX = fillRect.left - topStart + (progress * (width + topStart - topEnd));
      const bottomX = fillRect.left - bottomStart + (progress * (width + bottomStart - bottomEnd));
      return { topX, bottomX };
    };

    const tick = () => {
      frame = 0;
      const anims = typeof fill.getAnimations === 'function' ? fill.getAnimations() : [];
      let progress;
      if (anims.length > 0) {
        const timing = anims[0].effect && anims[0].effect.getComputedTiming
          ? anims[0].effect.getComputedTiming()
          : null;
        progress = timing && typeof timing.progress === 'number' ? timing.progress : 1;
      } else {
        progress = Math.min(1, (performance.now() - startedAt) / 1200);
        if (progress >= 1) running = false;
      }
      const { topX, bottomX } = edgeFromProgress(progress);
      applyEdge(topX, bottomX);
      if (running) frame = window.requestAnimationFrame(tick);
    };

    const onAnimStart = () => {
      running = true;
      startedAt = performance.now();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onAnimEnd = () => {
      running = false;
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      const isOpen = el.classList.contains('sweep-title--open');
      for (let i = 0; i < spans.length; i += 1) {
        spans[i].classList.toggle('sweep-title__letter--hollow', isOpen);
      }
    };

    fill.addEventListener('animationstart', onAnimStart);
    fill.addEventListener('animationend', onAnimEnd);

    const initialAnims = typeof fill.getAnimations === 'function' ? fill.getAnimations() : [];
    if (initialAnims.length > 0) onAnimStart();

    return () => {
      fill.removeEventListener('animationstart', onAnimStart);
      fill.removeEventListener('animationend', onAnimEnd);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [letters]);

  const classes = className
    ? `section-title sweep-title ${className}`
    : 'section-title sweep-title';

  return (
    <h2
      ref={titleRef}
      id={id}
      className={classes}
      {...rest}
    >
      {letters.length > 0
        ? letters.map((ch, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`sweep-letter-${index}`}
            className="sweep-title__letter"
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))
        : children}
      <span className="sweep-title__fill-shadow" aria-hidden="true" />
      <span className="sweep-title__fill" aria-hidden="true" />
    </h2>
  );
}

export default SweepTitle;
