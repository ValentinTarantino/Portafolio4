import { useEffect, useRef, useState } from 'react';

// Canvas2D replacement for the former three.js window lights: identical
// layout, seeds and on/off-cycle math, a fraction of the bytes and GPU cost.
// Windows are pre-rendered glow sprites + tinted core rects.

const hash01 = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

// GLSL-compatible helpers (same formulas the shader used).
const fract = (v) => v - Math.floor(v);
const randomState = (value) => fract(Math.sin(value * 127.1 + 311.7) * 43758.5453);
const mix = (a, b, t) => a + (b - a) * t;

// Base tints per tone (warm / magenta / cyan), day and night.
const TINTS = {
  day: [
    [255, 176, 110],
    [242, 138, 107],
    [112, 209, 255],
  ],
  night: [
    [255, 184, 117],
    [224, 107, 184],
    [92, 184, 250],
  ],
};
const PULSE_TINT = [158, 230, 255];
const CORE_LIGHT = [255, 247, 212];

const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const css = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

// Pre-rendered soft glow sprite per tone, day and night variants.
const makeGlowSprite = (tint) => {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const [r, g, b] = tint;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
  gradient.addColorStop(0.35, `rgba(${r},${g},${b},0.18)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
};

const CityWindowLights = ({ timeOfDay = 'afternoon', enabled = true, sparse = false, lowPower = false }) => {
  const canvasRef = useRef(null);
  const bootedRef = useRef(false);
  const materialRef = useRef(null);
  const renderRef = useRef(null);
  const periodTweenRef = useRef(null);
  const [ready, setReady] = useState(false);
  const periodRef = useRef(timeOfDay);
  periodRef.current = timeOfDay;

  useEffect(() => {
    const canvas = canvasRef.current;
    const sceneRoot = canvas?.parentElement;
    if (!canvas || !sceneRoot || !enabled) return undefined;

    // No three.js: plain 2D context. Windows are tiny rects, so a sprite
    // + fillRect per window is visually identical at a fraction of the cost.
    let cancelled = false;
    let cleanup = () => {};
    let idleId;
    const boot = () => {
      const context = canvas.getContext('2d', { alpha: true });
      if (!context || cancelled) return;

      // Plain-object shim so the period-tween effect below keeps working
      // unchanged (it writes material.uniforms.uNight/uDarkHour).
      const uniforms = {
        uNight: { value: periodRef.current === 'night' ? 1 : 0 },
        uDarkHour: { value: periodRef.current === 'darkHour' ? 1 : 0 },
      };
      const material = { uniforms };
      materialRef.current = material;

      const glowSprites = {
        day: TINTS.day.map(makeGlowSprite),
        night: TINTS.night.map(makeGlowSprite),
      };

      const facades = Array.from(sceneRoot.querySelectorAll('.dark-hour-scene__building'));
      const facadeDescriptors = facades.map((facade) => ({
        facade,
        depth: facade.dataset.gridDepth === 'near' ? 2 : facade.dataset.gridDepth === 'mid' ? 1 : 0,
      }));
      const streetRoad = sceneRoot.querySelector('.dark-hour-scene__street-road');
      const pulseFacadeEligibility = new Map(facadeDescriptors.map((item, index) => {
        // Keep background windows stable: a moving pulse makes small distant
        // lights look as if they appear briefly and then vanish.
        const chance = item.depth === 2 ? 0.3 : 0;
        return [item.facade, hash01(index * 149 + item.depth * 31 + 5) < chance ? 1 : 0];
      }));
      const descriptors = [];
      facades.forEach((facade) => {
        const columns = Number(facade.dataset.gridColumns) || 1;
        const rows = Number(facade.dataset.gridRows) || 2;
        const seed = Number(facade.dataset.gridSeed) || 0;
        const depth = facade.dataset.gridDepth === 'near' ? 2 : facade.dataset.gridDepth === 'mid' ? 1 : 0;
        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const random = hash01(seed * 97 + row * 17 + column * 31);
            descriptors.push({
              facade,
              columns,
              rows,
              row,
              column,
              random,
              seed,
              depth,
              edge: facade.dataset.gridEdge === '1',
            });
          }
        }
      });

      let windows = [];
      let width = 0;
      let height = 0;
      let frameId = 0;
      let resizeFrameId = 0;
      let lastFrame = 0;
      let elapsed = 0;
      const cityPulse = {
        active: false,
        startedAt: 0,
        duration: 5,
        nextAt: 0.9,
        direction: 1,
      };
      let pulseX = -0.1;
      let pulseStrength = 0;
      let nightMix = uniforms.uNight.value;
      let previousFrameTime = 0;
      let visible = !document.hidden;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const computeWindows = (viewportWidth, viewportHeight, roadTop) => {
        // Read pass: collect every rect first so layout is computed once,
        // then derive all windows without interleaved reads (no forced reflow).
        const facadeRects = facadeDescriptors.map((item) => item.facade.getBoundingClientRect());
        const descriptorRects = descriptors.map((item) => item.facade.getBoundingClientRect());
        const built = [];
        descriptors.forEach((item, index) => {
          const rect = descriptorRects[index];
          const insetX = rect.width * 0.15;
          const usableWidth = rect.width - insetX * 2;
          const x = rect.left + insetX + usableWidth * (item.column + 0.5) / item.columns;
          const insetTop = rect.height * 0.1;
          const usableHeight = rect.height - insetTop * 1.55;
          const rowScreenY = rect.bottom - insetTop - usableHeight * (item.row + 0.5) / item.rows;
          const cellWidth = usableWidth / item.columns;
          const cellHeight = usableHeight / item.rows;
          const windowWidth = item.depth === 2
            ? Math.min(cellWidth * 0.27, 7)
            : item.depth === 1
              ? Math.min(cellWidth * 0.2, 3.8)
              : Math.min(cellWidth * 0.14, 2.4);
          const windowHeight = item.depth === 2
            ? Math.min(cellHeight * 0.3, 8.5)
            : item.depth === 1
              ? Math.min(cellHeight * 0.24, 4.8)
              : Math.min(cellHeight * 0.18, 3);
          // Keep the lowest rows above the foreground road, including on short viewports.
          const screenY = Math.min(rowScreenY, roadTop - windowHeight * 0.75 - 5);
          // Occlusion: skip windows hidden behind a nearer facade, replacing
          // the old depth-tested facade masks (same visual result).
          const occluded = facadeRects.some((facadeRect, facadeIndex) => {
            if (facadeDescriptors[facadeIndex].depth <= item.depth) return false;
            return x >= facadeRect.left && x <= facadeRect.right
              && screenY >= facadeRect.top && screenY <= facadeRect.bottom;
          });
          if (occluded) return;
          const toneRandom = hash01(item.seed * 191 + item.row * 37 + item.column * 59);
          const lightChance = item.depth === 2 ? 0.48 : item.depth === 1 ? 0.32 : 0.22;
          // Subconjunto del modo light (~1/3, mismas semillas): las que quedan
          // encendidas también lo están en modo completo. Se aplica durante
          // todo el ciclo, no solo al estado inicial.
          const animationChance = item.depth === 2 ? (item.edge ? 1 : 0.42) : 0;
          const rowChance = hash01(item.seed * 317 + item.row * 43 + item.column * 71) < 0.78;
          built.push({
            x,
            y: screenY,
            w: windowWidth,
            h: windowHeight,
            tone: toneRandom > 0.72 ? 2 : toneRandom > 0.42 ? 1 : 0,
            phase: item.random * Math.PI * 2,
            lit: item.random < lightChance ? 1 : 0,
            sparseLit: item.random < lightChance * 0.15 ? 1 : 0,
            animated: hash01(item.seed * 233 + item.row * 61 + item.column * 89) < animationChance ? 1 : 0,
            depthN: item.depth / 2,
            screenX: x / Math.max(viewportWidth, 1),
            pulseEligible: pulseFacadeEligibility.get(item.facade) * (rowChance ? 1 : 0),
          });
        });
        // Far to near so nearer lights paint on top.
        built.sort((a, b) => a.depthN - b.depthN);
        return built;
      };

      const liveStateOf = (win, time) => {
        const cycleDuration = mix(5.5, 11.5, fract(win.phase * 0.371));
        const stateSeed = Math.floor(win.phase * 173.0);
        const firstChange = 5.0 + randomState(stateSeed + 31.0) * 9.0;
        const cycle = Math.max(time - firstChange, 0.0) / cycleDuration;
        const cycleIndex = Math.floor(cycle);
        const firstState = 1.0 - win.lit;
        const firstTurnOnDelay = mix(0.45, 1.2, randomState(stateSeed + 40.0));
        const nextState = randomState(cycleIndex + stateSeed + 1.0) >= 0.69 ? 1 : 0;
        const nextTurnOnDelay = mix(0.45, 1.2, randomState(cycleIndex + stateSeed + 10.0));
        const activeState = cycleIndex < 1.0
          ? firstState * ((time - firstChange) >= firstTurnOnDelay ? 1 : 0)
          : nextState * ((fract(cycle) * cycleDuration) >= nextTurnOnDelay ? 1 : 0);
        const settled = mix(win.lit, activeState, time >= firstChange ? 1 : 0);
        const diff = win.screenX - pulseX;
        const pulseWave = Math.exp(-Math.pow(diff * 14.0, 2.0)) * pulseStrength * win.pulseEligible;
        // En modo light las ventanas fuera del subconjunto quedan apagadas
        // siempre (ciclos y pulso incluidos), no solo al inicio.
        if (sparse && !win.sparseLit) return { settled: 0, pulseWave: 0 };
        return { settled: mix(win.lit, settled, win.animated), pulseWave };
      };

      const drawWindows = (time, nightMix, frozen) => {
        context.clearRect(0, 0, width, height);
        windows.forEach((win) => {
          const flicker = frozen
            ? 1
            : 0.97 + 0.018 * Math.sin(time * 1.15 + win.phase) + 0.01 * Math.sin(time * 2.1 + win.phase * 1.7);
          const { settled, pulseWave } = frozen
            ? { settled: sparse && !win.sparseLit ? 0 : win.lit, pulseWave: 0 }
            : liveStateOf(win, time);
          const liveState = Math.max(settled, pulseWave * 0.78);
          const lit = mix(0.008, mix(0.68, 0.94, win.depthN), liveState);
          const coreAlpha = lit * flicker;
          const glowAlpha = 0.035 * lit * (1.0 + pulseWave * 3.2);
          const tint = mix3(TINTS.day[win.tone], TINTS.night[win.tone], nightMix);
          let core = mix3([tint[0] * 0.74, tint[1] * 0.74, tint[2] * 0.74], CORE_LIGHT, 0.22);
          core = mix3(core, PULSE_TINT, pulseWave * 0.48);
          if (coreAlpha > 0.004) {
            context.globalAlpha = Math.min(1, coreAlpha);
            context.fillStyle = css(core);
            context.fillRect(win.x - win.w / 2, win.y - win.h / 2, win.w, win.h);
          }
          if (glowAlpha > 0.004) {
            const glowSize = Math.max(win.w, win.h) * 5;
            const daySprite = glowSprites.day[win.tone];
            const nightSprite = glowSprites.night[win.tone];
            context.globalAlpha = Math.min(1, glowAlpha) * (1 - nightMix);
            context.drawImage(daySprite, win.x - glowSize / 2, win.y - glowSize / 2, glowSize, glowSize);
            context.globalAlpha = Math.min(1, glowAlpha) * nightMix;
            context.drawImage(nightSprite, win.x - glowSize / 2, win.y - glowSize / 2, glowSize, glowSize);
          }
        });
        context.globalAlpha = 1;
      };

      let heroVisible = true;
      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const pixelRatio = lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const roadRect = streetRoad?.getBoundingClientRect();
        const roadTop = roadRect?.height > 0 ? roadRect.top : height + 100;
        windows = computeWindows(width, height, roadTop);
        drawWindows(elapsed, nightMix, reducedMotion.matches);
      };
      renderRef.current = () => {
        drawWindows(elapsed, nightMix, reducedMotion.matches);
      };

      const animate = (time) => {
        if (!visible || !heroVisible || reducedMotion.matches) return;
        if (lastFrame && time - lastFrame < 1000 / 24) {
          frameId = window.requestAnimationFrame(animate);
          return;
        }
        const delta = previousFrameTime ? Math.min((time - previousFrameTime) / 1000, 0.1) : 0;
        previousFrameTime = time;
        elapsed += delta;
        const periodTween = periodTweenRef.current;
        if (periodTween) {
          if (periodTween.start < 0) periodTween.start = elapsed;
          const progress = Math.min((elapsed - periodTween.start) / 1.4, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          nightMix = periodTween.fromNight + (periodTween.toNight - periodTween.fromNight) * eased;
          uniforms.uNight.value = nightMix;
          if (progress >= 1) periodTweenRef.current = null;
        }
        if (!reducedMotion.matches) {
          if (!cityPulse.active && elapsed >= cityPulse.nextAt) {
            cityPulse.active = true;
            cityPulse.startedAt = elapsed;
            cityPulse.duration = 4.8 + Math.random() * 0.8;
            cityPulse.direction = Math.random() < 0.5 ? 1 : -1;
          }
          if (cityPulse.active) {
            const progress = Math.min((elapsed - cityPulse.startedAt) / cityPulse.duration, 1);
            pulseX = cityPulse.direction > 0 ? -0.08 + progress * 1.16 : 1.08 - progress * 1.16;
            pulseStrength = Math.sin(progress * Math.PI) * 0.96;
            if (progress >= 1) {
              cityPulse.active = false;
              pulseStrength = 0;
              cityPulse.nextAt = elapsed + 18 + Math.random() * 16;
            }
          }
        }
        lastFrame = time;
        drawWindows(elapsed, nightMix, false);
        frameId = window.requestAnimationFrame(animate);
      };

      const start = () => {
        window.cancelAnimationFrame(frameId);
        previousFrameTime = 0;
        if (!visible || !heroVisible || reducedMotion.matches) {
          drawWindows(elapsed, nightMix, true);
          return;
        }
        frameId = window.requestAnimationFrame(animate);
      };

      const onVisibilityChange = () => {
        visible = !document.hidden;
        start();
      };
      const onResize = () => {
        if (resizeFrameId) return;
        resizeFrameId = window.requestAnimationFrame(() => {
          resizeFrameId = 0;
          resize();
        });
      };
      const onMotionChange = () => {
        start();
      };

      resize();
      start();
      setReady(true);
      // En modo light el loop también descansa fuera del hero.
      const hero = lowPower ? document.getElementById('home') : null;
      let heroObserver;
      if (hero && 'IntersectionObserver' in window) {
        heroObserver = new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          start();
        }, { threshold: 0 });
        heroObserver.observe(hero);
      }
      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.addEventListener?.('change', onMotionChange);

      cleanup = () => {
        window.cancelAnimationFrame(frameId);
        window.cancelAnimationFrame(resizeFrameId);
        heroObserver?.disconnect();
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        reducedMotion.removeEventListener?.('change', onMotionChange);
        periodTweenRef.current = null;
        materialRef.current = null;
        renderRef.current = null;
      };
    };
    // La primera vez espera un hueco libre (fuera de la carga inicial);
    // al togglear el modo se reconstruye de inmediato.
    if (bootedRef.current) {
      boot();
    } else if ('requestIdleCallback' in window) {
      bootedRef.current = true;
      idleId = window.requestIdleCallback(boot, { timeout: 6000 });
    } else {
      bootedRef.current = true;
      boot();
    }
    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      cleanup();
    };
  }, [enabled, sparse, lowPower]);

  // Manual 1.4s power2.out tween (1 - (1 - t)^3), driven by the animation
  // loop clock (the loop reads periodTweenRef each frame).
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    const toNight = timeOfDay === 'night' ? 1 : 0;
    const toDarkHour = timeOfDay === 'darkHour' ? 1 : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      material.uniforms.uNight.value = toNight;
      material.uniforms.uDarkHour.value = toDarkHour;
      periodTweenRef.current = null;
      renderRef.current?.();
      return;
    }
    periodTweenRef.current = {
      fromNight: material.uniforms.uNight.value,
      toNight,
      fromDarkHour: material.uniforms.uDarkHour.value,
      toDarkHour,
      start: -1,
    };
  }, [timeOfDay]);

  return <canvas className={`dark-hour-scene__window-lights${ready ? ' is-ready' : ''}`} ref={canvasRef} aria-hidden="true" />;
};

export default CityWindowLights;
