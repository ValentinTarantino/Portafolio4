import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './LampToggle.css';

const LampToggle = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [chainPosition, setChainPosition] = useState({ top: -9999, left: -9999 });
  const [chainPullY, setChainPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lampRef = useRef(null);
  const chainRef = useRef(null);
  const dragStartY = useRef(0);
  const currentPullY = useRef(0);
  const MAX_PULL = 20;
  const ACTIVATION_THRESHOLD = 15;

  useEffect(() => {
    const savedMode = localStorage.getItem('lampMode');
    if (savedMode) {
      const lightMode = JSON.parse(savedMode);
      setIsLightMode(lightMode);
      applyLampMode(lightMode);
    }
  }, []);

  // Sincronizar estado con MobileThemeToggle
  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsLightMode(e.detail);
      setTimeout(() => {
        if (lampRef.current) {
          const rect = lampRef.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          setChainPosition({
            top: rect.bottom,
            left: rect.left + rect.width / 2
          });
        }
      }, 100);
    };
    window.addEventListener('themeToggle', handleThemeChange);
    return () => window.removeEventListener('themeToggle', handleThemeChange);
  }, []);

  // Calcular posición de la cadena basada en la posición de la lámpara
  useEffect(() => {
    const updateChainPosition = () => {
      if (lampRef.current) {
        const rect = lampRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        setChainPosition({
          top: rect.bottom,
          left: rect.left + rect.width / 2
        });
      }
    };

    // Usar requestAnimationFrame para esperar al renderizado completo
    let rafId;
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        requestAnimationFrame(updateChainPosition);
      });
    };

    // Ejecutar inmediatamente pero después del renderizado actual
    scheduleUpdate();
    
    // Recálculos adicionales para asegurar posición correcta
    const timeout1 = setTimeout(scheduleUpdate, 100);
    const timeout2 = setTimeout(scheduleUpdate, 300);
    const timeout3 = setTimeout(scheduleUpdate, 600);
    
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate);

    // MutationObserver para detectar cambios de clase (modo claro/oscuro)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setTimeout(scheduleUpdate, 50);
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // ResizeObserver para detectar cambios de layout del header
    let resizeObserver;
    const header = document.querySelector('.header');
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        scheduleUpdate();
      });
      resizeObserver.observe(header);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);
    };
  }, []);

  const applyLampMode = (lightMode) => {
    const html = document.documentElement;
    if (lightMode) {
      html.classList.add('lamp-light-mode');
      html.classList.remove('lamp-dark-mode');
    } else {
      html.classList.remove('lamp-light-mode');
      html.classList.add('lamp-dark-mode');
    }
  };

  const handleToggle = () => {
    setIsAnimating(true);
    setChainPullY(0);
    currentPullY.current = 0;
    setTimeout(() => {
      const newMode = !isLightMode;
      setIsLightMode(newMode);
      localStorage.setItem('lampMode', JSON.stringify(newMode));
      applyLampMode(newMode);
      window.dispatchEvent(new CustomEvent('themeToggle', { detail: newMode }));
      setIsAnimating(false);
    }, 600);
  };

  // Handlers para arrastre de cadena
  const handleChainMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
  }, []);

  const handleChainTouchStart = useCallback((e) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    const clampedDelta = Math.max(0, Math.min(deltaY, MAX_PULL));
    currentPullY.current = clampedDelta;
    setChainPullY(clampedDelta);
  }, [isDragging]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    const clampedDelta = Math.max(0, Math.min(deltaY, MAX_PULL));
    currentPullY.current = clampedDelta;
    setChainPullY(clampedDelta);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (currentPullY.current >= ACTIVATION_THRESHOLD) {
      handleToggle();
    } else {
      // Volver a posición original con animación
      setChainPullY(0);
      currentPullY.current = 0;
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  // Cadena renderizada via Portal en document.body
  // Calculamos el estiramiento: base height + pullY
  const baseChainHeight = 36;
  const stretchFactor = (baseChainHeight + chainPullY) / baseChainHeight;
  // Counter-scale para mantener la bola circular
  const ballScale = 1 / stretchFactor;
  
  const chainElement = (
    <div 
      ref={chainRef}
      className={`hanging-chain ${isAnimating ? 'pulling' : ''} ${isLightMode ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        top: `${chainPosition.top}px`,
        left: `${chainPosition.left}px`,
        transform: `translateX(-50%)`,
        zIndex: 99999,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleChainMouseDown}
      onTouchStart={handleChainTouchStart}
      onClick={handleToggle}
    >
      {/* Cadena que se estira */}
      <div 
        className="chain-stretch-container"
        style={{
          transform: `scaleY(${stretchFactor})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.08s linear'
        }}
      >
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
        <div className="chain-segment"></div>
      </div>
      
      {/* Bola con counter-scale para mantener forma circular */}
      <div 
        className="chain-ball-wrapper"
        style={{
          transform: `translateY(${chainPullY}px)`,
          transition: isDragging ? 'none' : 'transform 0.08s linear'
        }}
      >
        <div 
          className="chain-ball"
          style={{
            transform: `scaleY(${ballScale})`,
            transformOrigin: 'center center'
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(chainElement, document.body)}

      <div className={`lamp-wrapper ${isLightMode ? 'light-active' : ''}`}>
        {/* Lámpara fija en el navbar */}
        <div 
          ref={lampRef}
          className={`lamp-container ${isLightMode ? 'active' : ''}`}
          style={{ cursor: 'default' }}
        >
          {/* Copa de la lámpara */}
          <div className="lamp-shade">
            {/* Aureola dorada alrededor de la lámpara */}
            <div className={`lamp-halo ${isLightMode ? 'halo-active' : ''}`}></div>
            
            {/* Borde superior */}
            <div className="shade-top"></div>
            
            {/* Cuerpo de la copa */}
            <div className="shade-body">
              {/* Bombilla dentro */}
              <div className="lamp-bulb-inner"></div>
              
              {/* Luz de la bombilla */}
              <div className={`lamp-glow ${isLightMode ? 'glowing' : ''}`}></div>
            </div>
            
            {/* Borde inferior */}
            <div className="shade-bottom"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LampToggle;
