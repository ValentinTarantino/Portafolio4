import { memo, useEffect, useRef, useState } from 'react';
import Tartarus from './Tartarus';
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
    const rows = Math.max(1, Math.floor(height / 100));
    const windowWidth = columns === 2 ? 15 : 21;
    const windowHeight = 5.5;
    const horizontalStart = columns === 1
      ? (100 - windowWidth) / 2
      : 12;
    const horizontalRange = columns === 1
      ? 0
      : 100 - horizontalStart * 2 - windowWidth;
    const verticalStart = rows === 1 ? 44 : 10;
    const verticalRange = rows === 1 ? 0 : 90 - windowHeight - verticalStart;
    const windows = [];

    if (!lightweight) for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const hash = buildingIndex * 17 + row * 7 + column * 11 + layerIndex * 13;
        const randomValue = Math.abs(Math.sin(
          (buildingIndex + 1) * 127.1 + (row + 1) * 311.7 + (column + 1) * 74.7 + layerIndex * 57.3,
        ) * 43758.5453) % 1;
        const jitter = Math.sin(hash * 1.73) * 1.1;
        const leftInFacade = horizontalStart
          + (columns > 1 ? (horizontalRange * column) / (columns - 1) : 0);
        const topInFacade = Math.min(
          90 - windowHeight,
          Math.max(8, verticalStart + (verticalRange * row) / Math.max(rows - 1, 1) + jitter),
        );
        const illuminated = randomValue < 0.31;
        const toneIndex = hash % 10;
        const lightTone = toneIndex < 2 ? 'cool' : toneIndex < 5 ? 'copper' : 'amber';

        windows.push(
          <span
            className={`dark-hour-scene__window${illuminated ? ` is-lit is-${lightTone}` : ''}`}
            key={`${row}-${column}`}
            style={{
              left: `${leftInFacade}%`,
              top: `${topInFacade}%`,
              width: `${windowWidth}%`,
              height: `${windowHeight}%`,
              '--window-alpha': illuminated ? 0.25 + (hash % 3) * 0.045 : 0.025,
              '--window-peak-alpha': illuminated ? 0.29 + (hash % 3) * 0.045 : 0.025,
              '--window-delay': `${(hash % 17) * -0.8}s`,
              '--window-shutdown-delay': `${((buildingIndex * 3 + row * 5 + column * 2 + layerIndex * 7) % 9) * 0.075}s`,
            }}
          />,
        );
      }
    }

    return (
      <foreignObject
        key={`${depth}-${buildingIndex}`}
        x={left}
        y={420 - height}
        width={width}
        height={height}
        overflow="hidden"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="dark-hour-scene__building"
          data-tone={buildingIndex % 4}
          style={{ '--facade-reflection': buildingIndex % 5 === 2 ? 0.1 : 0.025 }}
        >
          {windows}
        </div>
      </foreignObject>
    );
  });

  return (
    <svg
      className={`dark-hour-scene__city dark-hour-scene__city--${depth}`}
      viewBox="0 0 1600 420"
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
      aria-hidden="true"
    >
      {facades}
    </svg>
  );
});

const AnimatedBackground = ({ isDarkHour = false }) => {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const drawRef = useRef(null);
  const heroActiveRef = useRef(false);
  const [lightweightScene, setLightweightScene] = useState(() => window.matchMedia(MOBILE_SCENE_QUERY).matches);
  const modeRef = useRef(isDarkHour);
  modeRef.current = isDarkHour;

  useEffect(() => {
    const query = window.matchMedia(MOBILE_SCENE_QUERY);
    const updateSceneMode = () => setLightweightScene(query.matches);
    if (query.addEventListener) query.addEventListener('change', updateSceneMode);
    else query.addListener?.(updateSceneMode);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', updateSceneMode);
      else query.removeListener?.(updateSceneMode);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const hero = document.getElementById('home');
    if (!scene || !hero || !('IntersectionObserver' in window)) return undefined;

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroActiveRef.current = entry.isIntersecting;
      scene.classList.toggle('is-hero-active', entry.isIntersecting);
      if (entry.isIntersecting && scene.classList.contains('is-dark-hour')) {
        scene.classList.add('has-revealed-tartarus');
      }
    }, { threshold: 0 });

    heroObserver.observe(hero);
    return () => heroObserver.disconnect();
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (!isDarkHour) {
      scene.classList.remove('has-revealed-tartarus');
      return;
    }

    if (heroActiveRef.current) {
      scene.classList.add('has-revealed-tartarus');
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

    const lowPowerDevice = (navigator.deviceMemory || 8) <= 4
      || (navigator.hardwareConcurrency || 8) <= 4;

    const createParticles = () => {
      const desktopCount = Math.min(
        lowPowerDevice ? 30 : 44,
        Math.max(lowPowerDevice ? 14 : 18, Math.round(width / (lowPowerDevice ? 42 : 32))),
      );
      const mobileCount = Math.min(
        lowPowerDevice ? 8 : 12,
        Math.max(lowPowerDevice ? 6 : 8, Math.round(width / (lowPowerDevice ? 52 : 38))),
      );
      const count = finePointer.matches ? desktopCount : mobileCount;
      particles = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        radius: random(0.55, 1.65),
        speed: random(3.5, 10),
        drift: random(1.5, 7.5),
        secondaryDrift: random(0.45, 2.2),
        phase: random(0, Math.PI * 2),
        frequency: random(0.12, 0.42),
        secondaryPhase: random(0, Math.PI * 2),
        alpha: random(0.12, 0.37),
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        finePointer.matches ? (lowPowerDevice ? 1.25 : 1.5) : (lowPowerDevice ? 1 : 1.25),
      );
      frameInterval = finePointer.matches
        ? (lowPowerDevice ? 1000 / 30 : 1000 / 40)
        : (lowPowerDevice ? 1000 / 24 : 1000 / 30);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      draw(0, 0);
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
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${particle.alpha * shimmer * (1 - modeMix * 0.55)})`;
        context.arc(x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
    };
    drawRef.current = draw;

    const animate = (time) => {
      if (!visible || motionPreference.matches) return;
      if (lastFrameTime && time - lastFrameTime < frameInterval) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0;
      previousTime = time;
      lastFrameTime = time;
      elapsed = time;
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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionPreference.removeEventListener?.('change', onMotionPreferenceChange);
    };
  }, [lightweightScene]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawRef.current?.(0, performance.now());
    }
  }, [isDarkHour]);

  return (
    <div className={`dark-hour-scene is-hero-active${isDarkHour ? ' is-dark-hour' : ''}`} ref={sceneRef} aria-hidden="true">
      <div className="dark-hour-scene__sky" />
      <div className="dark-hour-scene__halo dark-hour-scene__halo--horizon" />
      <div className="dark-hour-scene__moon-field">
        <div className="dark-hour-scene__moon" />
      </div>
      <div className="dark-hour-scene__mist dark-hour-scene__mist--far" />
      <div className="dark-hour-scene__mist dark-hour-scene__mist--near" />
      <div className="dark-hour-scene__distant-lights" />
      <Tartarus />
      <CityLayer buildings={CITY_FAR} depth="far" lightweight={lightweightScene} />
      <CityLayer buildings={CITY_MID} depth="mid" lightweight={lightweightScene} />
      <div className="dark-hour-scene__city-haze" />
      <CityLayer buildings={CITY_NEAR} depth="near" lightweight={lightweightScene} />
      <canvas className="dark-hour-scene__particles" ref={canvasRef} />
      <div className="dark-hour-scene__vignette" />
    </div>
  );
};

export default AnimatedBackground;
