import { useEffect, useRef } from 'react';

const ANCHORS = [
  { x: 223.1, y: 200, radius: 19.5, haloRadius: 27, haloColor: 0x50ff79, haloGlow: 1.42, phase: 0 },
  { x: 187, y: 396, radius: 15.6, phase: 1.7 },
  { x: 257.6, y: 529, radius: 15.6, phase: 3.1 },
  { x: 168.2, y: 677, radius: 17.5, phase: 4.6 },
];

// Three small fixed energy beads on the right middle flank of the tower.
const DETAIL_BEADS = [
  { x: 250, y: 270, phase: 0.6 },
  { x: 262, y: 258, phase: 1.5 },
  { x: 274, y: 246, phase: 2.4 },
];

const coreVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFragmentShader = `
  uniform float uTime;
  uniform float uPhase;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    float facing = max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
    float volume = pow(facing, 0.58);
    float center = pow(facing, 32.0);
    float flowA = sin(vPosition.y * 1.15 + vPosition.x * 0.72 + uTime + uPhase);
    float flowB = sin(vPosition.x * 1.42 - vPosition.z * 0.85 - uTime + uPhase * 0.6);
    float current = smoothstep(0.48, 0.91, flowA * 0.5 + flowB * 0.5);
    vec3 deep = vec3(0.006, 0.13, 0.36);
    vec3 cyan = vec3(0.012, 0.53, 0.82);
    vec3 whiteCyan = vec3(0.9, 1.42, 1.62);
    vec3 color = mix(deep, cyan, 0.24 + volume * 0.72);
    color = mix(color, whiteCyan, center * 0.96 + current * 0.2);
    color *= 1.12 + volume * 0.78 + current * 0.18;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const shellFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.2);
    float innerTint = 0.035 + fresnel * 0.48;
    vec3 color = mix(vec3(0.025, 0.48, 0.58), vec3(0.5, 0.96, 1.0), fresnel);
    gl_FragColor = vec4(color, innerTint);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const haloFragmentShader = `
  uniform float uGlow;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float radius = distance(vUv, vec2(0.5));
    float falloff = exp(-radius * radius * 23.0) * (1.0 - smoothstep(0.32, 0.5, radius));
    vec3 color = uColor * mix(0.62, 1.2, smoothstep(0.0, 0.34, radius));
    gl_FragColor = vec4(color, falloff * uGlow);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const mountEnergyScene = (host, THREE, lightweight, lowPower = false) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let renderer;
    let resizeObserver;
    let active = !document.hidden;
  let disposed = false;
    const uniforms = [];
    const glowValues = [];

    try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lightweight && !lowPower, powerPreference: 'low-power' });
    } catch {
    // The existing SVG tower remains visible if WebGL is unavailable.
    host.dataset.webgl = 'unavailable';
    return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lightweight || lowPower ? 1 : 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.className = 'tartarus-energy-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
    host.style.cssText = 'position:relative;width:100%;height:100%;overflow:visible;pointer-events:none';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Orthographic bounds are relative to the camera center; these map the full SVG viewBox.
    const camera = new THREE.OrthographicCamera(-210, 210, 450, -450, 0.1, 1000);
    camera.position.set(210, 450, 500);
    camera.lookAt(210, 450, 0);

    const sphereGeometry = new THREE.SphereGeometry(1, lightweight ? 20 : 32, lightweight ? 14 : 24);
    const haloGeometry = new THREE.PlaneGeometry(1, 1);
    const ambient = new THREE.HemisphereLight(0xb8ffff, 0x07313c, 1.1);
    scene.add(ambient);

  ANCHORS.forEach(({ x, y, radius, haloRadius = radius, haloColor = 0x2dd9ff, haloGlow = 1.22, phase }) => {
    const anchor = new THREE.Group();
    // These are the SVG's original viewBox coordinates; no animation targets the group.
    anchor.position.set(x, 900 - y, 0);
    const haloUniforms = {
      uGlow: { value: haloGlow },
      uColor: { value: new THREE.Color(haloColor) },
    };
    const coreUniforms = { uTime: { value: 0 }, uPhase: { value: phase } };
    uniforms.push(coreUniforms);
    glowValues.push(haloUniforms.uGlow);

    const halo = new THREE.Mesh(haloGeometry, new THREE.ShaderMaterial({
      uniforms: haloUniforms,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: haloFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }));
    halo.position.z = -15;
    halo.scale.set(haloRadius * 4.65, haloRadius * 4.65, 1);
    anchor.add(halo);

    const litVolume = new THREE.Mesh(sphereGeometry, new THREE.MeshPhysicalMaterial({
      color: 0x64eaff,
      emissive: 0x0a6277,
      emissiveIntensity: 0.42,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }));
    litVolume.scale.setScalar(radius * 1.16);
    litVolume.position.z = 0.7;
    anchor.add(litVolume);

    const shell = new THREE.Mesh(sphereGeometry, new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; varying vec3 vViewPosition; void main(){ vNormal=normalize(normalMatrix*normal); vec4 viewPosition=modelViewMatrix*vec4(position,1.0); vViewPosition=viewPosition.xyz; gl_Position=projectionMatrix*viewPosition; }`,
      fragmentShader: shellFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    }));
    shell.scale.setScalar(radius * 1.27);
    shell.position.z = 1;
    anchor.add(shell);

    const core = new THREE.Mesh(sphereGeometry, new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      transparent: true,
      depthWrite: true,
    }));
    core.scale.setScalar(radius);
    core.position.z = 2.5;
    anchor.add(core);

    const light = new THREE.PointLight(0x43eaff, 24, radius * 8, 2);
    light.position.set(0, 0, radius * 0.8);
    anchor.add(light);
    scene.add(anchor);
    });

    DETAIL_BEADS.forEach(({ x, y, phase }) => {
      const bead = new THREE.Group();
      // Apply the same horizontal mapping as the SVG architecture; the bead stays spherical.
      bead.position.set(210 + (x - 210) * 0.82, 900 - y, 0);
      const haloUniforms = {
        uGlow: { value: 0.68 },
        uColor: { value: new THREE.Color(0x2dd9ff) },
      };
      const coreUniforms = { uTime: { value: 0 }, uPhase: { value: phase } };
      uniforms.push(coreUniforms);
      glowValues.push(haloUniforms.uGlow);

      const halo = new THREE.Mesh(haloGeometry, new THREE.ShaderMaterial({
        uniforms: haloUniforms,
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: haloFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }));
      halo.position.z = -9;
      halo.scale.set(17.5, 17.5, 1);
      bead.add(halo);

      const shell = new THREE.Mesh(sphereGeometry, new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vNormal; varying vec3 vViewPosition; void main(){ vNormal=normalize(normalMatrix*normal); vec4 viewPosition=modelViewMatrix*vec4(position,1.0); vViewPosition=viewPosition.xyz; gl_Position=projectionMatrix*viewPosition; }`,
        fragmentShader: shellFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      }));
      shell.scale.setScalar(5.2);
      shell.position.z = 1;
      bead.add(shell);

      const core = new THREE.Mesh(sphereGeometry, new THREE.ShaderMaterial({
        uniforms: coreUniforms,
        vertexShader: coreVertexShader,
        fragmentShader: coreFragmentShader,
        transparent: true,
        depthWrite: true,
      }));
      core.scale.setScalar(4.4);
      core.position.z = 2.5;
      bead.add(core);
      scene.add(bead);
    });

    let lastRenderTime = 0;
    const renderInterval = lightweight || lowPower ? 1000 / 30 : 0;
    const render = () => {
    const now = performance.now();
    if (!disposed && active && now - lastRenderTime >= renderInterval) {
      lastRenderTime = now;
      renderer.render(scene, camera);
    }
    };
    const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lightweight || lowPower ? 1 : 1.25));
    render();
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener('resize', resize);
    resize();

    // GSAP-free driver with identical curves: uTime ramps 0 → 2π linearly
    // per duration and repeats; glow ping-pongs between its initial value
    // and 1.08 with a sine.inOut easing — pixel-identical motion.
    const animated = !reducedMotion.matches;
    // Solo en modo light el loop descansa fuera del hero. Se observa #home
    // y no el host porque vive en un foreignObject donde el observer falla.
    let heroVisible = true;
    const easeInOutSine = (p) => -(Math.cos(Math.PI * p) - 1) / 2;
    const uTimeJobs = uniforms.map((uniform, index) => ({ target: uniform.uTime, duration: 12 + index * 1.4 }));
    const glowJobs = glowValues.map((glow, index) => ({ target: glow, start: glow.value, duration: 2.8 + index * 0.45 }));
    let animTime = 0;
    let lastTick = 0;
    let tickId = 0;
    const tick = (now) => {
      tickId = 0;
      if (disposed) return;
      const dt = Math.min(Math.max((now - lastTick) / 1000, 0), 0.1);
      lastTick = now;
      if (active && (!lowPower || heroVisible)) {
        animTime += dt;
        uTimeJobs.forEach(({ target, duration }) => {
          target.value = ((animTime % duration) / duration) * Math.PI * 2;
        });
        glowJobs.forEach(({ target, start, duration }) => {
          const phase = (animTime % (duration * 2)) / duration;
          const eased = phase < 1 ? easeInOutSine(phase) : easeInOutSine(2 - phase);
          target.value = start + (1.08 - start) * eased;
        });
        render();
      }
      if (!disposed && animated && active && (!lowPower || heroVisible)) tickId = window.requestAnimationFrame(tick);
    };
    const setActive = () => {
    active = !document.hidden;
    if (animated && active && (!lowPower || heroVisible)) {
      lastTick = performance.now();
      if (!tickId) tickId = window.requestAnimationFrame(tick);
    }
    if (active) render();
    };
    document.addEventListener('visibilitychange', setActive);
    let heroObserver;
    if (lowPower) {
      const hero = document.getElementById('home');
      if (hero && 'IntersectionObserver' in window) {
        heroObserver = new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          setActive();
        }, { threshold: 0 });
        heroObserver.observe(hero);
      }
    }

    if (animated && active) {
      lastTick = performance.now();
      tickId = window.requestAnimationFrame(tick);
    }

    return () => {
    disposed = true;
    document.removeEventListener('visibilitychange', setActive);
    heroObserver?.disconnect();
    if (tickId) window.cancelAnimationFrame(tickId);
      window.removeEventListener('resize', resize);
    resizeObserver?.disconnect();
    scene.traverse((object) => {
      if (object.isMesh) {
        object.material.dispose();
      }
    });
    sphereGeometry.dispose();
    haloGeometry.dispose();
    renderer.dispose();
    renderer.domElement.remove();
      host.style.cssText = '';
      delete host.dataset.webgl;
    };

};

const TartarusEnergyCores = ({ isDarkHour, lightweight = false, lowPower = false }) => {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!isDarkHour || !hostRef.current) return undefined;

    let cancelled = false;
    let cleanup;
    const host = hostRef.current;

    import('three').then((THREE) => {
      if (!cancelled) cleanup = mountEnergyScene(host, THREE, lightweight, lowPower);
    }).catch(() => {
      if (!cancelled) host.dataset.webgl = 'unavailable';
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [isDarkHour, lightweight, lowPower]);

  return <div ref={hostRef} className="tartarus-energy-webgl" aria-hidden="true" />;
};

export default TartarusEnergyCores;
