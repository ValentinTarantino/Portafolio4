import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const vertexShader = /* glsl */`
  attribute float instancePhase;
  attribute float instanceTone;
  attribute float instanceLit;
  attribute float instanceAnimated;
  attribute float instanceDepth;
  attribute float instanceScreenX;
  attribute float instancePulseEligible;
  varying vec2 vUv;
  varying float vPhase;
  varying float vTone;
  varying float vLit;
  varying float vAnimated;
  varying float vDepth;
  varying float vScreenX;
  varying float vPulseEligible;

  void main() {
    vUv = uv;
    vPhase = instancePhase;
    vTone = instanceTone;
    vLit = instanceLit;
    vAnimated = instanceAnimated;
    vDepth = instanceDepth;
    vScreenX = instanceScreenX;
    vPulseEligible = instancePulseEligible;
    vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uNight;
  uniform float uDarkHour;
  uniform float uPulseX;
  uniform float uPulseStrength;
  varying vec2 vUv;
  varying float vPhase;
  varying float vTone;
  varying float vLit;
  varying float vAnimated;
  varying float vDepth;
  varying float vScreenX;
  varying float vPulseEligible;

  float randomState(float value) {
    return fract(sin(value * 127.1 + 311.7) * 43758.5453);
  }

  void main() {
    vec2 p = abs(vUv - 0.5);
    float rect = (1.0 - smoothstep(0.45, 0.49, p.x)) * (1.0 - smoothstep(0.43, 0.48, p.y));
    float radius = length(p);
    float halo = (1.0 - smoothstep(0.34, 0.7, radius)) * 0.035;
    float flicker = 0.97 + 0.018 * sin(uTime * 1.15 + vPhase) + 0.01 * sin(uTime * 2.1 + vPhase * 1.7);
    float cycleDuration = mix(5.5, 11.5, fract(vPhase * 0.371));
    float stateSeed = floor(vPhase * 173.0);
    float firstChange = 5.0 + randomState(stateSeed + 31.0) * 9.0;
    float cycle = max(uTime - firstChange, 0.0) / cycleDuration;
    float cycleIndex = floor(cycle);
    float firstState = 1.0 - vLit;
    float firstTurnOnDelay = mix(0.45, 1.2, randomState(stateSeed + 40.0));
    float nextState = step(0.69, randomState(cycleIndex + stateSeed + 1.0));
    float nextTurnOnDelay = mix(0.45, 1.2, randomState(cycleIndex + stateSeed + 10.0));
    float activeState = cycleIndex < 1.0
      ? firstState * step(firstTurnOnDelay, uTime - firstChange)
      : nextState * step(nextTurnOnDelay, fract(cycle) * cycleDuration);
    activeState = mix(vLit, activeState, step(firstChange, uTime));
    float pulseWave = exp(-pow((vScreenX - uPulseX) * 14.0, 2.0)) * uPulseStrength * vPulseEligible;
    float liveState = max(mix(vLit, activeState, vAnimated), pulseWave * 0.78);

    vec3 warm = mix(vec3(1.0, 0.69, 0.43), vec3(1.0, 0.72, 0.46), uNight);
    vec3 magenta = mix(vec3(0.95, 0.54, 0.42), vec3(0.88, 0.42, 0.72), uNight);
    vec3 cyan = mix(vec3(0.44, 0.82, 1.0), vec3(0.36, 0.72, 0.98), uNight);
    warm = mix(warm, vec3(0.88, 0.84, 0.54), uDarkHour);
    magenta = mix(magenta, vec3(0.77, 0.84, 0.46), uDarkHour);
    cyan = mix(cyan, vec3(0.4, 0.95, 0.72), uDarkHour);
    vec3 tint = vTone < 0.5 ? warm : (vTone < 1.5 ? magenta : cyan);

    float lit = mix(0.008, mix(0.68, 0.94, vDepth), liveState);
    float dimMode = mix(1.0, 0.56, uDarkHour);
    float coreAlpha = rect * lit * flicker * dimMode;
    float glowAlpha = halo * lit * dimMode * (1.0 + pulseWave * 3.2);
    vec3 color = mix(tint * 0.74, vec3(1.0, 0.97, 0.83), rect * 0.22);
    color = mix(color, vec3(0.62, 0.9, 1.0), pulseWave * 0.48);
    gl_FragColor = vec4(color, max(coreAlpha, glowAlpha));
  }
`;

const hash01 = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const CityWindowLights = ({ timeOfDay = 'afternoon', enabled = true }) => {
  const canvasRef = useRef(null);
  const materialRef = useRef(null);
  const renderRef = useRef(null);
  const periodTweenRef = useRef(null);
  const periodRef = useRef(timeOfDay);
  periodRef.current = timeOfDay;

  useEffect(() => {
    const canvas = canvasRef.current;
    const sceneRoot = canvas?.parentElement;
    if (!canvas || !sceneRoot || !enabled) return undefined;

    // three.js loads on demand so it never blocks (or even downloads on)
    // the initial paint when this scene is disabled, e.g. on mobile.
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      if (cancelled) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 10);
    camera.position.z = 5;
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

    const count = descriptors.length;
    const geometry = new THREE.PlaneGeometry(1, 1);
    const facadeGeometry = new THREE.PlaneGeometry(1, 1);
    const phases = new Float32Array(count);
    const tones = new Float32Array(count);
    const litValues = new Float32Array(count);
    const animatedValues = new Float32Array(count);
    const depths = new Float32Array(count);
    const screenXs = new Float32Array(count);
    const pulseEligibleValues = new Float32Array(count);
    geometry.setAttribute('instancePhase', new THREE.InstancedBufferAttribute(phases, 1));
    geometry.setAttribute('instanceTone', new THREE.InstancedBufferAttribute(tones, 1));
    geometry.setAttribute('instanceLit', new THREE.InstancedBufferAttribute(litValues, 1));
    geometry.setAttribute('instanceAnimated', new THREE.InstancedBufferAttribute(animatedValues, 1));
    geometry.setAttribute('instanceDepth', new THREE.InstancedBufferAttribute(depths, 1));
    geometry.setAttribute('instanceScreenX', new THREE.InstancedBufferAttribute(screenXs, 1));
    geometry.setAttribute('instancePulseEligible', new THREE.InstancedBufferAttribute(pulseEligibleValues, 1));

    const uniforms = {
      uTime: { value: 0 },
      uNight: { value: periodRef.current === 'night' ? 1 : 0 },
      uDarkHour: { value: periodRef.current === 'darkHour' ? 1 : 0 },
      uPulseX: { value: -0.1 },
      uPulseStrength: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });
    materialRef.current = material;

    const mesh = new THREE.InstancedMesh(geometry, material, Math.max(count, 1));
    mesh.count = count;
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
    const facadeMaskMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
    });
    const facadeMasks = new THREE.InstancedMesh(
      facadeGeometry,
      facadeMaskMaterial,
      Math.max(facadeDescriptors.length, 1),
    );
    facadeMasks.count = facadeDescriptors.length;
    facadeMasks.frustumCulled = false;
    facadeMasks.renderOrder = 0;
    scene.add(facadeMasks);
    const matrix = new THREE.Matrix4();
    const center = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
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
    let previousFrameTime = 0;
    let visible = !document.hidden;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.left = 0;
      camera.right = width;
      camera.top = height;
      camera.bottom = 0;
      camera.updateProjectionMatrix();
      const roadRect = streetRoad?.getBoundingClientRect();
      const roadTop = roadRect?.height > 0 ? roadRect.top : height + 100;

      // Read pass: collect every rect first so layout is computed once,
      // then write all matrices without interleaved reads (no forced reflow).
      const facadeRects = facadeDescriptors.map((item) => item.facade.getBoundingClientRect());
      const descriptorRects = descriptors.map((item) => item.facade.getBoundingClientRect());

      facadeDescriptors.forEach((item, index) => {
        const rect = facadeRects[index];
        center.set(rect.left + rect.width * 0.5, height - rect.top - rect.height * 0.5, item.depth * 0.18);
        scale.set(rect.width, rect.height, 1);
        matrix.compose(center, quaternion, scale);
        facadeMasks.setMatrixAt(index, matrix);
      });
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
        const y = height - screenY;

        // Put the light just in front of its facade. Near facade masks occlude
        // windows behind them, so each depth layer keeps a coherent scale.
        center.set(x, y, item.depth * 0.18 + 0.006);
        scale.set(windowWidth * 1.45, windowHeight * 1.45, 1);
        matrix.compose(center, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
        phases[index] = item.random * Math.PI * 2;
        const toneRandom = hash01(item.seed * 191 + item.row * 37 + item.column * 59);
        tones[index] = toneRandom > 0.72 ? 2 : toneRandom > 0.42 ? 1 : 0;
        const lightChance = item.depth === 2 ? 0.48 : item.depth === 1 ? 0.32 : 0.22;
        litValues[index] = item.random < lightChance ? 1 : 0;
        const animationChance = item.depth === 2 ? (item.edge ? 1 : 0.42) : 0;
        animatedValues[index] = hash01(item.seed * 233 + item.row * 61 + item.column * 89) < animationChance ? 1 : 0;
        depths[index] = item.depth / 2;
        screenXs[index] = x / Math.max(width, 1);
        const rowChance = hash01(item.seed * 317 + item.row * 43 + item.column * 71) < 0.78;
        pulseEligibleValues[index] = pulseFacadeEligibility.get(item.facade) * (rowChance ? 1 : 0);
      });
      facadeMasks.instanceMatrix.needsUpdate = true;
      mesh.instanceMatrix.needsUpdate = true;
      geometry.attributes.instancePhase.needsUpdate = true;
      geometry.attributes.instanceTone.needsUpdate = true;
      geometry.attributes.instanceLit.needsUpdate = true;
      geometry.attributes.instanceAnimated.needsUpdate = true;
      geometry.attributes.instanceDepth.needsUpdate = true;
      geometry.attributes.instanceScreenX.needsUpdate = true;
      geometry.attributes.instancePulseEligible.needsUpdate = true;
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };
    renderRef.current = render;

    const animate = (time) => {
      if (!visible || reducedMotion.matches) return;
      if (lastFrame && time - lastFrame < 1000 / 24) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      const delta = previousFrameTime ? Math.min((time - previousFrameTime) / 1000, 0.1) : 0;
      previousFrameTime = time;
      elapsed += delta;
      uniforms.uTime.value = elapsed;
      if (!reducedMotion.matches) {
        if (!cityPulse.active && elapsed >= cityPulse.nextAt) {
          cityPulse.active = true;
          cityPulse.startedAt = elapsed;
          cityPulse.duration = 4.8 + Math.random() * 0.8;
          cityPulse.direction = Math.random() < 0.5 ? 1 : -1;
        }
        if (cityPulse.active) {
          const progress = Math.min((elapsed - cityPulse.startedAt) / cityPulse.duration, 1);
          uniforms.uPulseX.value = cityPulse.direction > 0 ? -0.08 + progress * 1.16 : 1.08 - progress * 1.16;
          uniforms.uPulseStrength.value = Math.sin(progress * Math.PI) * 0.96;
          if (progress >= 1) {
            cityPulse.active = false;
            uniforms.uPulseStrength.value = 0;
            cityPulse.nextAt = elapsed + 18 + Math.random() * 16;
          }
        }
      }
      lastFrame = time;
      render();
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      previousFrameTime = 0;
      if (!visible || reducedMotion.matches) {
        render();
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
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener?.('change', onMotionChange);

    cleanup = () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(resizeFrameId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener?.('change', onMotionChange);
      periodTweenRef.current?.kill();
      periodTweenRef.current = null;
      scene.remove(mesh);
      scene.remove(facadeMasks);
      materialRef.current = null;
      renderRef.current = null;
      geometry.dispose();
      facadeGeometry.dispose();
      material.dispose();
      facadeMaskMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    periodTweenRef.current?.kill();
    const timeline = gsap.timeline({ onUpdate: () => renderRef.current?.() })
      .to(material.uniforms.uNight, {
        value: timeOfDay === 'night' ? 1 : 0,
        duration: 1.4,
        ease: 'power2.out',
      }, 0)
      .to(material.uniforms.uDarkHour, {
        value: timeOfDay === 'darkHour' ? 1 : 0,
        duration: 1.4,
        ease: 'power2.out',
      }, 0);
    periodTweenRef.current = timeline;
  }, [timeOfDay]);

  return <canvas className="dark-hour-scene__window-lights" ref={canvasRef} aria-hidden="true" />;
};

export default CityWindowLights;
