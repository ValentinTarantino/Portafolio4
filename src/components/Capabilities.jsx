import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDownRight, ArrowUpRight, CirclePlay, Monitor } from 'lucide-react';
import './Capabilities.css';

const CAPABILITY_IDS = ['frontend', 'motion', 'threeD', 'fullStack'];
const DinoGame = lazy(() => import('./DinoGame'));
const noop = () => {};
const DEVICE_WIDTHS = { desktop: '100%', tablet: '72%', mobile: '36%' };
const TAROT_ARCANA_FRONTS = [
  '/Fool-0.webp',
  '/mago.jpg',
  '/3.png',
  '/83px-P3P_Empress_Arcana_Graphic.png',
  '/83px-P3P_Emperor_Arcana_Graphic.png',
  '/83px-P3P_Hierophant_Arcana_Graphic.png',
  '/83px-P3P_Lovers_Arcana_Graphic.png',
  '/83px-P3P_Chariot_Arcana_Graphic.png',
  '/83px-P3P_Justice_Arcana_Graphic.png',
  '/83px-P3P_Hermit_Arcana_Graphic.png',
  '/83px-P3P_Fortune_Arcana_Graphic.png',
  '/85px-P3P_Strength_Arcana_Graphic.png',
  '/83px-P3P_Hanged_Man_Arcana_Graphic.png',
  '/83px-P3P_Death_Arcana_Graphic.png',
  '/83px-P3P_Temperance_Arcana_Graphic.png',
  '/83px-P3P_Devil_Arcana_Graphic.png',
  '/83px-P3P_Tower_Arcana_Graphic.png',
  '/83px-P3P_Star_Arcana_Graphic.png',
  '/83px-P3P_Moon_Arcana_Graphic.png',
  '/83px-P3P_Sun_Arcana_Graphic.png',
  '/83px-P3P_Aeon_Arcana_Graphic.png',
  '/83px-P3P_Judgement_Arcana_Graphic.png',
  '/83px-P3P_World_Arcana_Graphic.png',
];
const TAROT_FOOL_BACK = '/behind.webp';

function ThreeShowcase({ active, copy, onArcanaChange }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const objectRef = useRef(null);
  const frameRef = useRef(0);
  const arcanaIndexRef = useRef(0);
  const wasBackFacingRef = useRef(false);
  const activeRef = useRef(active);
  const reducedMotionRef = useRef(false);
  const [fallback, setFallback] = useState(false);
  activeRef.current = active;

  useEffect(() => {
    const host = mountRef.current;
    const canvas = host?.querySelector('canvas');
    if (!host || !canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reducedMotionRef.current = reducedMotion;
    let renderer;
    let scene;
    let camera;
    let resizeObserver;
    let contextLost = false;
    let contextLostHandler;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (event) => {
      reducedMotionRef.current = event.matches;
      window.cancelAnimationFrame(frameRef.current);
      if (activeRef.current && !event.matches) frameRef.current = window.requestAnimationFrame(renderFrame);
      else if (event.matches) renderFrame();
    };

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      const isTouchViewport = window.matchMedia('(pointer: coarse)').matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouchViewport ? 1.15 : 1.5));
      renderer.setClearColor(0x000000, 0);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0, 7.15);

      const ambient = new THREE.AmbientLight(0xd8edff, 2.15);
      const keyLight = new THREE.DirectionalLight(0xc0e6ff, 2.8);
      keyLight.position.set(2.8, 3.4, 4.5);
      const rimLight = new THREE.DirectionalLight(0x57dcba, 1.25);
      rimLight.position.set(-3, -1.5, 2);
      scene.add(ambient, keyLight, rimLight);

      const textureLoader = new THREE.TextureLoader();
      const loadTexture = (source) => {
        const texture = textureLoader.load(source);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        return texture;
      };
      const frontTextures = TAROT_ARCANA_FRONTS.map(loadTexture);
      const backTexture = loadTexture(TAROT_FOOL_BACK);
      const card = new THREE.Group();
      const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x071722, metalness: 0.35, roughness: 0.4 });
      const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTextures[arcanaIndexRef.current], roughness: 0.72, metalness: 0.06 });
      const cardMaterial = new THREE.Mesh(
        new THREE.BoxGeometry(2.16, 3.2, 0.032),
        [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial,
          frontMaterial,
          new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.72, metalness: 0.06 })],
      );
      const cardOutline = new THREE.LineSegments(
        new THREE.EdgesGeometry(cardMaterial.geometry),
        new THREE.LineBasicMaterial({ color: 0x8ee5ff, transparent: true, opacity: 0.24 }),
      );
      card.add(cardMaterial, cardOutline);
      card.scale.setScalar(0.9);
      card.rotation.set(0.04, 0, 0);
      scene.add(card);

      const floatShadowMaterial = new THREE.MeshBasicMaterial({ color: 0x020a10, transparent: true, opacity: 0.3, depthWrite: false });
      const floatShadow = new THREE.Mesh(new THREE.CircleGeometry(0.9, 40), floatShadowMaterial);
      floatShadow.rotation.x = -Math.PI / 2;
      floatShadow.scale.set(1.15, 0.2, 1);
      floatShadow.position.set(0, -1.72, 0);
      scene.add(floatShadow);

      const renderFrame = (time = 0) => {
        if (contextLost || !renderer || !scene || !camera) return;
        if (!reducedMotionRef.current) {
          card.rotation.y += 0.006;
          card.rotation.x = 0.04 + Math.sin(time * 0.00032) * 0.025;
          const floatOffset = Math.sin(time * 0.0012) * 0.12;
          card.position.y = floatOffset;
          card.rotation.z = Math.sin(time * 0.0008) * 0.018;
          floatShadow.material.opacity = 0.24 - (floatOffset * 0.55);
          floatShadow.scale.x = 1.15 + (floatOffset * 0.7);
          const isBackFacing = Math.cos(card.rotation.y) < 0;
          if (isBackFacing && !wasBackFacingRef.current) {
            arcanaIndexRef.current = (arcanaIndexRef.current + 1) % frontTextures.length;
            frontMaterial.map = frontTextures[arcanaIndexRef.current];
            frontMaterial.needsUpdate = true;
          } else if (!isBackFacing && wasBackFacingRef.current) {
            onArcanaChange(arcanaIndexRef.current);
          }
          wasBackFacingRef.current = isBackFacing;
        }
        renderer.render(scene, camera);
        if (activeRef.current && !reducedMotionRef.current) frameRef.current = window.requestAnimationFrame(renderFrame);
      };

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (!activeRef.current || reducedMotionRef.current) renderFrame();
      };

      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;
      objectRef.current = card;
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
      contextLostHandler = (event) => {
        event.preventDefault();
        contextLost = true;
        setFallback(true);
      };
      canvas.addEventListener('webglcontextlost', contextLostHandler);
      motionPreference.addEventListener?.('change', handleMotionPreference);

      const animationController = { renderFrame };
      scene.userData.animationController = animationController;
      if (activeRef.current && !reducedMotionRef.current) frameRef.current = window.requestAnimationFrame(renderFrame);
    } catch {
      setFallback(true);
      scene?.traverse((node) => {
        node.geometry?.dispose();
        if (node.material) {
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => {
            material.map?.dispose();
            material.dispose();
          });
        }
      });
      renderer?.dispose();
      return undefined;
    }

    return () => {
      contextLost = true;
      window.cancelAnimationFrame(frameRef.current);
      resizeObserver?.disconnect();
      canvas.removeEventListener('webglcontextlost', contextLostHandler);
      motionPreference.removeEventListener?.('change', handleMotionPreference);
      scene?.traverse((node) => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => {
            material.map?.dispose();
            material.dispose();
          });
        }
      });
      renderer?.dispose();
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      objectRef.current = null;
    };
  }, [onArcanaChange]);

  useEffect(() => {
    window.cancelAnimationFrame(frameRef.current);
    if (active && !reducedMotionRef.current && sceneRef.current) {
      frameRef.current = window.requestAnimationFrame(sceneRef.current.userData.animationController.renderFrame);
    } else if (sceneRef.current?.userData.animationController) {
      sceneRef.current.userData.animationController.renderFrame();
    }
  }, [active]);

  return (
    <div
      className={`capabilities__orb-stage capabilities__tarot-stage${fallback ? ' is-fallback' : ''}`}
      ref={mountRef}
    >
      <canvas aria-label={copy.canvasLabel} />
      {fallback && <div className="capabilities__fallback-tarot" style={{ backgroundImage: `url(${TAROT_ARCANA_FRONTS[0]})` }} aria-hidden="true" />}
    </div>
  );
}

const Capabilities = ({ t, language, isDarkHour }) => {
  const [activeCapability, setActiveCapability] = useState(0);
  const [viewport, setViewport] = useState('desktop');
  const [replayId, setReplayId] = useState(0);
  const [activeArcanaIndex, setActiveArcanaIndex] = useState(0);
  const interactiveStageRef = useRef(null);
  const copy = t.capabilities;
  const threeCopy = copy.arcanaDetails?.[activeArcanaIndex] || copy.arcanaDetails?.[0];
  const active = CAPABILITY_IDS[activeCapability];

  const handleStagePointer = (event) => {
    if (!interactiveStageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    interactiveStageRef.current.style.setProperty('--pointer-x', `${pointerX * 100}%`);
    interactiveStageRef.current.style.setProperty('--pointer-y', `${pointerY * 100}%`);
    interactiveStageRef.current.style.setProperty('--motion-shift-x', `${(pointerX - 0.5) * 12}px`);
    interactiveStageRef.current.style.setProperty('--motion-shift-y', `${(pointerY - 0.5) * 12}px`);
  };

  const handleIndexKeyDown = (event, index) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = (index + (event.key === 'ArrowDown' ? 1 : -1) + CAPABILITY_IDS.length) % CAPABILITY_IDS.length;
    setActiveCapability(nextIndex);
    document.getElementById(`capability-tab-${CAPABILITY_IDS[nextIndex]}`)?.focus();
  };

  return (
    <section
      id="testimonials"
      className="section capabilities"
      data-dark-hour={isDarkHour ? 'true' : 'false'}
      aria-labelledby="capabilities-title"
    >
      <div className="container capabilities__container">
        <header className="capabilities__header">
          <h2 id="capabilities-title" className="section-title capabilities__section-title">{copy.title}</h2>
        </header>

        <div className="capabilities__layout">
          <nav className="capabilities__index" aria-label={copy.indexLabel} role="tablist" aria-orientation="vertical">
            {CAPABILITY_IDS.map((id, index) => (
              <button
                className={`capabilities__index-item${activeCapability === index ? ' is-active' : ''}`}
                id={`capability-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={activeCapability === index}
                aria-controls={`capability-panel-${id}`}
                tabIndex={activeCapability === index ? 0 : -1}
                key={id}
                onClick={() => setActiveCapability(index)}
                onKeyDown={(event) => handleIndexKeyDown(event, index)}
              >
                <span className="capabilities__number">0{index + 1}</span>
                <span className="capabilities__index-copy"><strong>{copy.items[id].title}</strong></span>
                <ArrowDownRight size={17} aria-hidden="true" />
              </button>
            ))}
          </nav>

          <div className="capabilities__demo-column">
            {CAPABILITY_IDS.map((id, index) => (
              <section
                className={`capabilities__panel${activeCapability === index ? ' is-active' : ''}`}
                id={`capability-panel-${id}`}
                role="tabpanel"
                aria-labelledby={`capability-tab-${id}`}
                tabIndex={0}
                hidden={activeCapability !== index}
                key={id}
                ref={id === 'motion' ? interactiveStageRef : undefined}
                onPointerMove={id === 'motion' ? handleStagePointer : undefined}
              >
                <div className="capabilities__panel-heading">
                  <div><span className="capabilities__panel-number">0{index + 1} / 04</span><h3>{copy.items[id].title}</h3></div>
                  <p>{copy.items[id].description}</p>
                </div>

                {id === 'frontend' && (
                  <div className="capabilities__demo capabilities__demo--responsive">
                    <div className="capabilities__demo-toolbar">
                      <span className="capabilities__demo-label"><Monitor size={14} aria-hidden="true" /> {copy.viewportLabel}</span>
                      <div className="capabilities__device-controls" role="group" aria-label={copy.viewportLabel}>
                        {['desktop', 'tablet', 'mobile'].map((device) => (
                          <button type="button" key={device} aria-pressed={viewport === device} className={viewport === device ? 'is-active' : ''} onClick={() => setViewport(device)}>{copy.devices[device]}</button>
                        ))}
                      </div>
                    </div>
                    <div className="capabilities__responsive-stage">
                      <div className="capabilities__responsive-frame" data-viewport={viewport} style={{ '--device-width': DEVICE_WIDTHS[viewport] }}>
                        <div className="capabilities__sample-app">
                          <div className="capabilities__sample-top"><b>MONO<span>STUDIO</span></b><span className="capabilities__sample-links">{copy.sampleLinks}</span><button type="button" aria-label={copy.sampleMenu}>☰</button></div>
                          <div className="capabilities__sample-main"><div><small>{copy.sampleTag}</small><h4>{copy.sampleHeadline}</h4><p>{copy.sampleDescription}</p><button type="button">{copy.sampleButton}<ArrowUpRight size={13} aria-hidden="true" /></button></div><div className="capabilities__sample-art" aria-hidden="true"><span>01</span></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {id === 'motion' && (
                  <div className="capabilities__demo capabilities__demo--motion" key={`motion-${replayId}`}>
                    <div className="capabilities__motion-copy">
                      <span>{copy.motionKicker}</span>
                      <p className="capabilities__motion-title">{copy.motionHeadline.split(' ').map((word, wordIndex) => (
                        <span className="capabilities__motion-word" key={`${wordIndex}-${replayId}`}>
                          {word.split('').map((letter, letterIndex) => <span key={`${wordIndex}-${letterIndex}`} style={{ '--letter-index': wordIndex * 10 + letterIndex }}>{letter}</span>)}
                        </span>
                      ))}</p>
                      <p className="capabilities__motion-description">{copy.motionDescription}</p>
                      <button type="button" className="capabilities__replay" onClick={() => setReplayId((current) => current + 1)}><CirclePlay size={16} aria-hidden="true" />{copy.replay}</button>
                    </div>
                    <div className="capabilities__motion-side" aria-hidden="true"><span>MOVE</span><span>WITH</span><span>INTENT.</span></div>
                  </div>
                )}

                {id === 'threeD' && (
                  <div className="capabilities__demo capabilities__demo--three">
                    <ThreeShowcase active={activeCapability === index} copy={copy} onArcanaChange={setActiveArcanaIndex} />
                    <div className="capabilities__three-copy" aria-live="polite" data-arcana-roman={threeCopy?.roman} data-arcana-length={threeCopy?.roman?.length || 1}>
                      <div className="capabilities__arcana-meta">
                        <span className="capabilities__arcana-kicker">{copy.arcanaKicker}</span>
                        <span className="capabilities__arcana-count">{String(activeArcanaIndex + 1).padStart(2, '0')} / {String(copy.arcanaDetails?.length || 23).padStart(2, '0')}</span>
                      </div>
                      <h4 key={`arcana-title-${activeArcanaIndex}`} className="capabilities__arcana-title">{threeCopy?.title || copy.threeHeadline}</h4>
                      <p key={`arcana-description-${activeArcanaIndex}`} className="capabilities__arcana-description">{threeCopy?.description || copy.threeDescription}</p>
                      <div className="capabilities__arcana-progress" aria-hidden="true">
                        <span style={{ width: `${((activeArcanaIndex + 1) / (copy.arcanaDetails?.length || 23)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {id === 'fullStack' && (
                  <div className="capabilities__demo capabilities__demo--stack">
                    {activeCapability === index && (
                      <div className="capabilities__game-shell">
                        <Suspense fallback={<p className="capabilities__game-loading">{copy.gameLoading}</p>}>
                          <DinoGame onExit={noop} isSpanish={language === 'es'} />
                        </Suspense>
                        <p className="capabilities__game-hint">{copy.gameHint}</p>
                      </div>
                    )}
                  </div>
                )}

              </section>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default memo(Capabilities);
