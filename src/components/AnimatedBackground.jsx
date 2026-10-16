import { memo, useEffect, useRef, useState } from 'react';
import Tartarus from './Tartarus';
import CityWindowLights from './CityWindowLights';
import CityStreet from './CityStreet';
import './AnimatedBackground.css';

// Width and facade height of each contiguous skyline segment in the original SVG viewBox.
// Keeping the same viewBox preserves the existing city scale and mobile crop behavior.
const CITY_FAR = [
  [82, 185], [58, 230], [41, 134], [88, 265], [52, 195], [72, 308],
  [39, 181], [98, 241], [46, 168], [68, 290], [37, 183], [86, 215],
  [85, 293], [52, 180], [93, 254], [39, 183], [74, 329], [49, 192],
  [100, 262], [42, 166], [80, 225], [73, 283], [62, 183], [94, 279],
];

const CITY_MID = [
  [70, 145], [42, 190], [84, 218], [54, 167], [92, 244], [38, 158],
  [74, 203], [99, 176], [48, 231], [63, 154], [45, 209], [86, 268],
  [76, 183], [52, 226], [96, 151], [41, 201], [72, 283], [50, 166],
  [89, 234], [44, 189], [83, 251], [62, 175], [78, 197], [58, 169],
];

const CITY_NEAR = [
  [60, 120], [94, 182], [38, 125], [72, 202], [54, 141], [94, 237],
  [39, 130], [74, 170], [81, 243], [54, 114], [97, 194], [45, 117],
  [79, 222], [56, 129], [97, 267], [40, 122], [96, 195], [53, 126],
  [75, 237], [49, 143], [88, 175], [93, 243], [48, 123], [76, 181],
  [64, 130], [89, 202],
];

const MOBILE_SCENE_QUERY = '(max-width: 700px), (hover: none) and (pointer: coarse)';
const TARTARUS_REVEAL_KEY = 'persona-tartarus-revealed';

// Deterministic PRNG so the starfield is stable between renders.
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Builds two box-shadow star layers (bright + dim) confined to the upper
// sky so stars never overlap the city, skipping the moon disc (measured
// live so it holds on every breakpoint). One string each = a single paint.
const buildStarfield = (width, height) => {
  const skyHeight = Math.round(height * 0.62);
  const moonRect = document.querySelector('.dark-hour-scene__moon')?.getBoundingClientRect();
  const moon = moonRect && moonRect.width > 0
    ? {
        x: moonRect.left + moonRect.width / 2,
        y: moonRect.top + moonRect.height / 2,
        r: moonRect.width / 2 + 10,
      }
    : null;
  const makeLayer = (count, seed, blur, color) => {
    const random = mulberry32(seed);
    const parts = [];
    let placed = 0;
    let guard = 0;
    while (placed < count && guard < count * 12) {
      guard += 1;
      const x = Math.round(random() * width);
      const y = Math.round(random() * skyHeight);
      if (moon && Math.hypot(x - moon.x, y - moon.y) < moon.r) continue;
      placed += 1;
      parts.push(`${x}px ${y}px ${blur} 0 ${color}`);
    }
    return parts.join(',');
  };
  const mobile = width < 700;
  return {
    bright: makeLayer(mobile ? 20 : 38, 11, '2px', 'rgba(207, 232, 255, 0.9)'),
    dim: makeLayer(mobile ? 44 : 86, 77, '1px', 'rgba(159, 195, 232, 0.55)'),
  };
};

const hasTartarusBeenRevealed = () => {
  try {
    return window.sessionStorage.getItem(TARTARUS_REVEAL_KEY) === 'true';
  } catch {
    return false;
  }
};

const rememberTartarusReveal = () => {
  try {
    window.sessionStorage.setItem(TARTARUS_REVEAL_KEY, 'true');
  } catch {
    // The scene still reveals for the current page if storage is unavailable.
  }
};

const lightweightCity = (buildings) => {
  // Keep individual rooflines, but render only every other building on mobile.
  // Normalize widths to fill the existing SVG viewBox without creating gaps.
  const selected = buildings.filter((_, index) => index % 2 === 0);
  const widthScale = 1600 / selected.reduce((total, [width]) => total + width, 0);
  return selected.map(([width, height]) => [Math.round(width * widthScale), height]);
};

const MOBILE_CITY = {
  far: lightweightCity(CITY_FAR),
  mid: lightweightCity(CITY_MID),
  near: lightweightCity(CITY_NEAR),
};

const CityLayer = memo(({ buildings, depth, lightweight }) => {
  const visibleBuildings = lightweight ? MOBILE_CITY[depth] : buildings;
  let x = 0;
  const layerIndex = depth === 'far' ? 0 : depth === 'mid' ? 1 : 2;

  const facades = visibleBuildings.map(([width, height], buildingIndex) => {
    const left = x;
    x += width;

    const columns = width >= 75 ? 2 : 1;
    const rows = Math.max(2, Math.floor(height / 64));
    const roofY = 420 - height;

    return (
      <g key={`${depth}-${buildingIndex}`}>
        <foreignObject
          x={left}
          y={roofY}
          width={width}
          height={height}
          overflow="hidden"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="dark-hour-scene__building"
            data-tone={buildingIndex % 4}
            data-roof={(buildingIndex + layerIndex * 2) % 5}
            data-grid-columns={columns}
            data-grid-rows={rows}
            data-grid-seed={buildingIndex + layerIndex * 31}
            data-grid-depth={depth}
            data-grid-edge={buildingIndex === 0 || buildingIndex === visibleBuildings.length - 1 ? 1 : 0}
            style={{ '--facade-reflection': buildingIndex % 5 === 2 ? 0.1 : 0.025 }}
          />
        </foreignObject>
      </g>
    );
  });

  return (
    <svg
      className={`dark-hour-scene__city dark-hour-scene__city--${depth}`}
      viewBox="0 0 1600 420"
      preserveAspectRatio={lightweight ? 'none' : 'xMidYMax slice'}
      focusable="false"
      aria-hidden="true"
    >
      {facades}
    </svg>
  );
});

const AnimatedBackground = ({ isDarkHour = false, timeOfDay = 'afternoon', quality = 'optimized' }) => {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const drawRef = useRef(null);
  const heroActiveRef = useRef(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia(MOBILE_SCENE_QUERY).matches);
  const [starfield, setStarfield] = useState(() => buildStarfield(window.innerWidth, window.innerHeight));
  const lightweightScene = isMobileViewport && quality !== 'full';
  const lightMode = quality === 'light';
  const fullQualityOnMobile = isMobileViewport && quality === 'full';
  const modeRef = useRef(isDarkHour);
  modeRef.current = isDarkHour;

  useEffect(() => {
    const query = window.matchMedia(MOBILE_SCENE_QUERY);
    const updateSceneMode = () => setIsMobileViewport(query.matches);
    if (query.addEventListener) query.addEventListener('change', updateSceneMode);
    else query.addListener?.(updateSceneMode);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', updateSceneMode);
      else query.removeListener?.(updateSceneMode);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    const rebuild = () => {
      setStarfield(buildStarfield(window.innerWidth, window.innerHeight));
    };
    const onResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(rebuild);
    };
    rebuild();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const hero = document.getElementById('home');
    if (!scene || !hero) return undefined;

    if (lightweightScene) {
      // Mobile uses a fixed backdrop; don't defer/reveal Tartarus based on scroll.
      heroActiveRef.current = true;
      scene.classList.add('is-hero-active');
      if (scene.classList.contains('is-dark-hour')) {
        scene.classList.add('has-revealed-tartarus');
        rememberTartarusReveal();
      }
      return undefined;
    }

    if (!('IntersectionObserver' in window)) return undefined;

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroActiveRef.current = entry.isIntersecting;
      scene.classList.toggle('is-hero-active', entry.isIntersecting);
      if (entry.isIntersecting && scene.classList.contains('is-dark-hour')) {
        scene.classList.add('has-revealed-tartarus');
        rememberTartarusReveal();
      }
    }, { threshold: 0 });

    heroObserver.observe(hero);
    return () => heroObserver.disconnect();
  }, [lightweightScene]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (!isDarkHour) {
      scene.classList.remove('has-revealed-tartarus');
      return;
    }

    const pageRestoredBelowHero = window.scrollY > window.innerHeight * 0.25;
    if (heroActiveRef.current || hasTartarusBeenRevealed() || pageRestoredBelowHero) {
      scene.classList.add('has-revealed-tartarus');
      rememberTartarusReveal();
    }
  }, [isDarkHour]);

  useEffect(() => {
    if (lightweightScene) {
      drawRef.current = null;
      return undefined;
    }

    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!scene || !canvas || !context) return undefined;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const random = (min, max) => min + Math.random() * (max - min);
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles = [];
    let frameId = 0;
    let previousTime = 0;
    let lastFrameTime = 0;
    let elapsed = 0;
    let visible = !document.hidden;
    let modeMix = 0;
    let pointerFrameId = 0;
    let resizeFrameId = 0;
    let frameInterval = 1000 / 30;
    let pointerX = 0;
    let pointerY = 0;
    let shootingStar = null;
    let nextShootingStarAt = random(18, 32);

    const lowPowerDevice = !fullQualityOnMobile && ((navigator.deviceMemory || 8) <= 4
      || (navigator.hardwareConcurrency || 8) <= 4);

    const createParticles = () => {
      // Ambient dust particles disabled by design; the canvas stays alive
      // for shooting stars only.
      particles = [];
    };

    let heroVisible = true;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const desktopQuality = finePointer.matches || fullQualityOnMobile;
      pixelRatio = lightMode
        ? 1
        : Math.min(
          window.devicePixelRatio || 1,
          desktopQuality ? (lowPowerDevice ? 1.25 : 1.5) : (lowPowerDevice ? 1 : 1.25),
        );
      frameInterval = lightMode
        ? 1000 / 30
        : desktopQuality
          ? (lowPowerDevice ? 1000 / 30 : 1000 / 40)
          : (lowPowerDevice ? 1000 / 24 : 1000 / 30);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      draw(0, elapsed);
    };

    const draw = (delta, time) => {
      const targetMode = modeRef.current ? 1 : 0;
      if (motionPreference.matches) {
        modeMix = targetMode;
      } else if (delta > 0) {
        const step = delta / 1.7;
        modeMix = targetMode > modeMix
          ? Math.min(targetMode, modeMix + step)
          : Math.max(targetMode, modeMix - step);
      }

      // In full dark hour the canvas is static (no meteors, frozen dust):
      // keep the last frame instead of repainting every animation tick.
      // One-shot draws (delta 0: resize, mode changes) still repaint.
      if (!motionPreference.matches && targetMode === 1 && modeMix >= 1 && delta > 0) return;

      context.clearRect(0, 0, width, height);
      const motionTime = time * 0.001;
      const red = Math.round(132 + (112 - 132) * modeMix);
      const green = Math.round(221 + (238 - 221) * modeMix);
      const blue = Math.round(255 + (164 - 255) * modeMix);
      for (const particle of particles) {
        if (delta > 0) {
          particle.y -= particle.speed * delta * (1 - modeMix * 0.62);
          if (particle.y < -4) {
            particle.y = height + random(4, 50);
            particle.x = random(0, width);
          }
        }

        const x = particle.x
          + Math.sin(particle.phase + motionTime * particle.frequency) * particle.drift * (1 - modeMix * 0.48)
          + Math.sin(particle.secondaryPhase + motionTime * particle.frequency * 0.37) * particle.secondaryDrift * (1 - modeMix * 0.48);
        const shimmer = 0.9 + Math.sin(motionTime * 0.32 + particle.phase) * 0.1;
        context.beginPath();
        const modeOpacity = 1 - modeMix * 0.55;
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${particle.alpha * shimmer * modeOpacity})`;
        context.arc(x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (motionPreference.matches) return;
      if (modeRef.current) {
        shootingStar = null;
        nextShootingStarAt = motionTime + random(20, 38);
        return;
      }
      if (!shootingStar && motionTime >= nextShootingStarAt) {
        const moonRect = scene.querySelector('.dark-hour-scene__moon')?.getBoundingClientRect();
        const moonX = moonRect ? moonRect.left + moonRect.width / 2 : -1000;
        const moonY = moonRect ? moonRect.top + moonRect.height / 2 : -1000;
        const moonRadius = moonRect ? Math.min(moonRect.width, moonRect.height) / 2 + 26 : 0;
        let safePath = null;

        for (let attempt = 0; attempt < 18 && !safePath; attempt += 1) {
          const startX = random(width * 0.03, width * 0.68);
          const startY = random(height * 0.06, height * 0.27);
          const travelX = random(width * 0.17, width * 0.28);
          const travelY = random(height * 0.1, height * 0.19);
          const trailLength = random(90, 150);
          const angle = Math.atan2(travelY, travelX);
          const tailX = startX - Math.cos(angle) * trailLength;
          const tailY = startY - Math.sin(angle) * trailLength;
          const endX = startX + travelX;
          const endY = startY + travelY;
          const dx = endX - tailX;
          const dy = endY - tailY;
          const segmentLengthSquared = dx * dx + dy * dy;
          const projection = segmentLengthSquared
            ? Math.max(0, Math.min(1, ((moonX - tailX) * dx + (moonY - tailY) * dy) / segmentLengthSquared))
            : 0;
          const nearestX = tailX + dx * projection;
          const nearestY = tailY + dy * projection;
          const clearsMoon = Math.hypot(nearestX - moonX, nearestY - moonY) > moonRadius;

          if (clearsMoon && endX < width * 0.98 && endY < height * 0.48) {
            safePath = { startX, startY, travelX, travelY, trailLength };
          }
        }

        if (safePath) {
          shootingStar = {
            ...safePath,
            startTime: motionTime,
            duration: random(0.85, 1.15),
          };
        } else {
          nextShootingStarAt = motionTime + random(5, 9);
        }
      }

      if (shootingStar) {
        const progress = (motionTime - shootingStar.startTime) / shootingStar.duration;
        if (progress >= 1) {
          shootingStar = null;
          nextShootingStarAt = motionTime + random(20, 38);
        } else {
          const fade = Math.sin(Math.PI * Math.min(progress, 1));
          const headX = shootingStar.startX + shootingStar.travelX * progress;
          const headY = shootingStar.startY + shootingStar.travelY * progress;
          const angle = Math.atan2(shootingStar.travelY, shootingStar.travelX);
          const tailX = headX - Math.cos(angle) * shootingStar.trailLength;
          const tailY = headY - Math.sin(angle) * shootingStar.trailLength;
          const trail = context.createLinearGradient(tailX, tailY, headX, headY);
          trail.addColorStop(0, 'rgba(91, 205, 255, 0)');
          trail.addColorStop(0.68, `rgba(91, 205, 255, ${0.34 * fade})`);
          trail.addColorStop(0.94, `rgba(202, 246, 255, ${0.78 * fade})`);
          trail.addColorStop(1, `rgba(255, 255, 255, ${0.96 * fade})`);
          context.beginPath();
          context.moveTo(tailX, tailY);
          context.lineTo(headX, headY);
          context.strokeStyle = trail;
          context.lineWidth = 1.4;
          context.stroke();
          context.beginPath();
          context.arc(headX, headY, 1.7, 0, Math.PI * 2);
          context.fillStyle = `rgba(231, 251, 255, ${0.9 * fade})`;
          context.fill();
        }
      }
    };
    drawRef.current = draw;

    const animate = (time) => {
      if (!visible || !heroVisible || motionPreference.matches) return;
      if (lastFrameTime && time - lastFrameTime < frameInterval) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0;
      previousTime = time;
      lastFrameTime = time;
      elapsed += delta * 1000;
      draw(delta, elapsed);
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      previousTime = 0;
      lastFrameTime = 0;
      scene.classList.toggle('is-paused', !visible || motionPreference.matches);
      if (!visible || motionPreference.matches) {
        draw(0, elapsed);
        return;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      start();
    };
    const hero = document.getElementById('home');
    let heroObserver;
    if (hero && 'IntersectionObserver' in window) {
      heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        start();
      }, { threshold: 0 });
      heroObserver.observe(hero);
    }

    const onPointerMove = (event) => {
      if (motionPreference.matches || !finePointer.matches || event.pointerType === 'touch') return;
      pointerX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      if (pointerFrameId) return;
      pointerFrameId = window.requestAnimationFrame(() => {
        pointerFrameId = 0;
        scene.style.setProperty('--scene-pointer-x', pointerX.toFixed(3));
        scene.style.setProperty('--scene-pointer-y', pointerY.toFixed(3));
      });
    };

    const onMotionPreferenceChange = () => start();
    const onResize = () => {
      if (resizeFrameId) return;
      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = 0;
        resize();
      });
    };

    resize();
    start();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    motionPreference.addEventListener?.('change', onMotionPreferenceChange);

    return () => {
      drawRef.current = null;
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(pointerFrameId);
      window.cancelAnimationFrame(resizeFrameId);
      heroObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionPreference.removeEventListener?.('change', onMotionPreferenceChange);
    };
  }, [lightweightScene, fullQualityOnMobile, lightMode]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawRef.current?.(0, performance.now());
    }
  }, [isDarkHour]);

  return (
    <div className={`dark-hour-scene is-hero-active${isDarkHour ? ' is-dark-hour' : ''}${lightweightScene ? ' is-mobile-scene' : ''}${fullQualityOnMobile ? ' is-full-quality' : ''}${lightMode ? ' is-light-mode' : ''}`} data-time-of-day={timeOfDay} ref={sceneRef} aria-hidden="true">
      <div className="dark-hour-scene__sky" />
      <div className="dark-hour-scene__stars" aria-hidden="true">
        <i className="dark-hour-scene__stars--bright" style={{ boxShadow: starfield.bright }} />
        <i className="dark-hour-scene__stars--dim" style={{ boxShadow: starfield.dim }} />
      </div>
      <div className="dark-hour-scene__energy-currents" />
      <div className="dark-hour-scene__halo dark-hour-scene__halo--horizon" />
      <div className="dark-hour-scene__clouds" />
      <div className="dark-hour-scene__moon-field">
        <div className="dark-hour-scene__moon" />
      </div>
      <div className="dark-hour-scene__lunar-shadow" />
      <div className="dark-hour-scene__mist dark-hour-scene__mist--far" />
      <div className="dark-hour-scene__mist dark-hour-scene__mist--near" />
      <div className="dark-hour-scene__reactive-fog" />
      <div className="dark-hour-scene__distant-lights" />
      <Tartarus isDarkHour={isDarkHour} lightweight={lightweightScene} lowPower={lightMode} />
      <div className="dark-hour-scene__distortion" />
      <div className="dark-hour-scene__aurora" aria-hidden="true" />
      <CityLayer buildings={CITY_FAR} depth="far" lightweight={lightweightScene} />
      <CityLayer buildings={CITY_MID} depth="mid" lightweight={lightweightScene} />
      <div className="dark-hour-scene__city-haze" />
      <CityLayer buildings={CITY_NEAR} depth="near" lightweight={lightweightScene} />
      <CityStreet />
      <CityWindowLights timeOfDay={timeOfDay} enabled={!lightweightScene && !isDarkHour} sparse={quality === 'light'} lowPower={lightMode} />
      <canvas className="dark-hour-scene__particles" ref={canvasRef} />
      <div className="dark-hour-scene__vignette" />
    </div>
  );
};

export default AnimatedBackground;
