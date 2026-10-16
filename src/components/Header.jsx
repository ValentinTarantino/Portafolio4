import { useState, useEffect, useRef } from 'react';
import { formatArgentinaClock, getArgentinaTimeParts } from '../utils/argentinaTime';
import PersonaCalendar from './PersonaCalendar';

import './Header.css';

const ROMAN_HOURS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const ArgentinaClock = ({ isDarkHour }) => {
  const [time, setTime] = useState(() => getArgentinaTimeParts());
  const accessibleTime = `${formatArgentinaClock(time)}:${String(time.second).padStart(2, '0')}`;
  const hourAngle = ((time.hour % 12) + time.minute / 60 + time.second / 3600) * 30;
  const minuteAngle = (time.minute + time.second / 60) * 6;
  const secondAngle = time.second * 6;
  const romanHours = ROMAN_HOURS.map((label, index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + Math.cos(angle) * 40;
    const y = 50 + Math.sin(angle) * 40;
    return { label, index, x, y };
  });
  const compassMarkers = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
    const radialX = Math.cos(angle);
    const radialY = Math.sin(angle);
    const tangentX = -radialY;
    const tangentY = radialX;
    const tip = { x: 50 + radialX * 51, y: 50 + radialY * 51 };
    const base = { x: 50 + radialX * 45, y: 50 + radialY * 45 };
    return [
      `${tip.x.toFixed(2)},${tip.y.toFixed(2)}`,
      `${(base.x + tangentX * 1.8).toFixed(2)},${(base.y + tangentY * 1.8).toFixed(2)}`,
      `${(base.x - tangentX * 1.8).toFixed(2)},${(base.y - tangentY * 1.8).toFixed(2)}`,
    ].join(' ');
  });

  useEffect(() => {
    const updateTime = () => setTime(getArgentinaTimeParts());
    const intervalId = window.setInterval(updateTime, 1000);
    window.addEventListener('focus', updateTime);
    document.addEventListener('visibilitychange', updateTime);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', updateTime);
      document.removeEventListener('visibilitychange', updateTime);
    };
  }, []);

  return (
    <div
      className={`argentina-clock${isDarkHour ? ' is-dark-hour' : ''}`}
      role="timer"
      aria-label={`Hora de Argentina: ${accessibleTime}`}
      title="Hora de Argentina (America/Argentina/Buenos_Aires)"
    >
      <svg className="argentina-clock__face" viewBox="-4 -4 108 108" aria-hidden="true">
        <circle className="argentina-clock__dial" cx="50" cy="50" r="46.5" />
        <circle className="argentina-clock__rim" cx="50" cy="50" r="46.5" />
        <circle className="argentina-clock__inner-rim" cx="50" cy="50" r="34" />
        {compassMarkers.map((points, index) => (
          <polygon className="argentina-clock__marker" key={index} points={points} />
        ))}
        {romanHours.map(({ label, index, x, y }) => (
          <text
            className="argentina-clock__roman"
            key={label}
            x={x}
            y={y}
            transform={`rotate(${index * 30} ${x} ${y})`}
          >
            {label}
          </text>
        ))}
        <path className="argentina-clock__hand argentina-clock__hand--hour" d="M50 50 47.7 46.5 46 22 50 14 54 22 52.3 46.5Z" transform={`rotate(${hourAngle} 50 50)`} />
        <path className="argentina-clock__hand argentina-clock__hand--minute" d="M50 50 48.7 48.5 48.2 12.2 50 5.8 51.8 12.2 51.3 48.5Z" transform={`rotate(${minuteAngle} 50 50)`} />
        <line className="argentina-clock__hand argentina-clock__hand--second" x1="50" y1="55" x2="50" y2="7" transform={`rotate(${secondAngle} 50 50)`} />
        <circle className="argentina-clock__pin" cx="50" cy="50" r="2.5" />
      </svg>
    </div>
  );
};

const NAV_SECTION_IDS = ['home', 'about', 'skills', 'projects', 'capabilities', 'contact'];

const QUALITY_OPTIONS = [
  {
    value: 'full',
    es: 'Completa',
    en: 'Full',
    titleEs: 'Activa en mobile los efectos completos de desktop',
    titleEn: 'Enables full desktop effects on mobile',
  },
  {
    value: 'light',
    es: 'Modo light',
    en: 'Light mode',
    titleEs: 'Fuerza los efectos livianos también en escritorio',
    titleEn: 'Forces lightweight effects on desktop too',
  },
];

const SceneQualityMenu = ({ language, sceneQuality, onSceneQualityChange, direct = false }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const gearRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        gearRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  const label = language === 'es' ? 'Calidad de gráficos' : 'Graphics quality';

  const renderOptions = (inline) => QUALITY_OPTIONS.map((option) => (
    <div
      key={option.value}
      className={`sq-option${sceneQuality === option.value ? ' is-selected' : ''}`}
      role={inline ? 'radio' : 'menuitemradio'}
      aria-checked={sceneQuality === option.value}
      tabIndex={0}
      title={language === 'es' ? option.titleEs : option.titleEn}
      onClick={() => {
        onSceneQualityChange(option.value);
        if (!inline) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSceneQualityChange(option.value);
          if (!inline) setOpen(false);
        }
      }}
    >
      <span>{language === 'es' ? option.es : option.en}</span>
    </div>
  ));

  if (direct) {
    return (
      <div className="scene-quality-menu scene-quality-menu--inline" role="radiogroup" aria-label={label}>
        {renderOptions(true)}
      </div>
    );
  }

  return (
    <div className="scene-quality-menu" ref={rootRef}>
      <button
        type="button"
        className="sq-gear"
        ref={gearRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen((current) => !current)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div className="sq-panel" role="menu" aria-label={label}>
          {renderOptions(false)}
        </div>
      )}
    </div>
  );
};

const Header = ({ t, language, toggleLanguage, isDarkHour, sceneQuality, onSceneQualityChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);
  const lastSectionRef = useRef('home');

  const gradientStops = [
    { percent: 0, r: 4, g: 15, b: 35 },
    { percent: 25, r: 6, g: 30, b: 67 },
    { percent: 50, r: 8, g: 43, b: 87 },
    { percent: 75, r: 6, g: 32, b: 70 },
    { percent: 100, r: 4, g: 20, b: 48 }
  ];

  const interpolateColor = (c1, c2, f) => ({
    r: Math.round(c1.r + (c2.r - c1.r) * f),
    g: Math.round(c1.g + (c2.g - c1.g) * f),
    b: Math.round(c1.b + (c2.b - c1.b) * f)
  });

  // Geometry reads are cached (2s TTL): per-scroll getBoundingClientRect
  // calls forced a reflow on every scroll event.
  const layoutCacheRef = useRef({ time: 0, tops: new Map(), scrollHeight: 0 });
  const getLayout = () => {
    const cached = layoutCacheRef.current;
    if (performance.now() - cached.time < 2000 && cached.tops.size > 0) return cached;
    const tops = new Map();
    NAV_SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      tops.set(id, element ? element.getBoundingClientRect().top + window.scrollY : Infinity);
    });
    const fresh = { time: performance.now(), tops, scrollHeight: document.documentElement.scrollHeight };
    layoutCacheRef.current = fresh;
    return fresh;
  };

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const header = headerRef.current;

        setScrolled(scrollY > 50);

        const { tops, scrollHeight } = getLayout();
        const docHeight = scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollY / docHeight) * 100, 100);

        let start = gradientStops[0];
        let end = gradientStops[gradientStops.length - 1];
        for (let i = 0; i < gradientStops.length - 1; i++) {
          if (scrollPercent >= gradientStops[i].percent && scrollPercent <= gradientStops[i + 1].percent) {
            start = gradientStops[i];
            end = gradientStops[i + 1];
            break;
          }
        }

        const range = end.percent - start.percent;
        const factor = range === 0 ? 0 : (scrollPercent - start.percent) / range;
        const color = interpolateColor(start, end, factor);
        const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
        const isLight = luminance > 0.5;

        if (header) {
          header.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
          header.style.color = isLight ? '#1a1a2e' : '#ffffff';
          header.classList.toggle('nav-light', isLight);
          header.classList.toggle('nav-dark', !isLight);
        }

        const scrollPos = scrollY + 150;
        const isAtTop = scrollY <= 80;
        const isAtBottom = !isAtTop && scrollY + window.innerHeight >= scrollHeight - 100;
        let currentSection = 'home';

        if (isAtTop) {
          currentSection = 'home';
        } else if (isAtBottom) {
          currentSection = 'contact';
        } else {
          for (let i = NAV_SECTION_IDS.length - 1; i >= 0; i--) {
            const sectionTop = tops.get(NAV_SECTION_IDS[i]);
            if (sectionTop !== Infinity && scrollPos >= sectionTop) {
              currentSection = NAV_SECTION_IDS[i];
              break;
            }
          }
        }

        if (currentSection !== lastSectionRef.current) {
          lastSectionRef.current = currentSection;
          setActiveSection(currentSection);
        }

        if (header) {
          const textColor = isLight ? '#1a1a2e' : '#ffffff';
          const menuBtn = header.querySelector('.menu-toggle');
          if (menuBtn) menuBtn.style.color = textColor;
        }

        rafId = null;
      });
    };

    const bustLayoutCache = () => {
      layoutCacheRef.current = { time: 0, tops: new Map(), scrollHeight: 0 };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', bustLayoutCache);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', bustLayoutCache);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${scrolled ? 'scrolled' : ''} nav-dark${isDarkHour ? ' dark-hour-active' : ''}`}
    >
      <span className="header-fx" aria-hidden="true" />
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-clock">
              <ArgentinaClock isDarkHour={isDarkHour} />
            </div>
            <div className="header-calendar-slot">
              <PersonaCalendar language={language} isDarkHour={isDarkHour} />
            </div>

          </div>

          <nav id="primary-navigation" className={`nav ${isMenuOpen ? 'nav-open' : ''}`} aria-label={t.nav.menu || 'Navegación principal'}>
            <ul className="nav-list">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'skills', label: t.nav.skills },
                { id: 'projects', label: t.nav.projects },
                { id: 'capabilities', label: t.nav.capabilities },
                { id: 'contact', label: t.nav.contact },
              ].map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(event) => { event.preventDefault(); scrollToSection(id); }}
                    className={`nav-link ${activeSection === id ? 'active' : ''}`}
                    aria-current={activeSection === id ? 'location' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="scene-quality-menu-item">
                <SceneQualityMenu language={language} sceneQuality={sceneQuality} onSceneQualityChange={onSceneQualityChange} direct />
              </li>
              <li className="language-menu-item">
                <div
                  className="language-toggle"
                  role="button"
                  tabIndex={0}
                  aria-label={language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
                  onClick={toggleLanguage}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleLanguage();
                    }
                  }}
                >
                  <span className={`lang-label ${language === 'es' ? 'active' : ''}`}>ES</span>
                  <div className={`lang-switch ${language === 'en' ? 'en-active' : ''}`}>
                    <div className="lang-indicator"></div>
                  </div>
                  <span className={`lang-label ${language === 'en' ? 'active' : ''}`}>EN</span>
                </div>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <SceneQualityMenu language={language} sceneQuality={sceneQuality} onSceneQualityChange={onSceneQualityChange} />
            <div
              className="language-toggle"
              role="button"
              tabIndex={0}
              aria-label={language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
              onClick={toggleLanguage}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleLanguage();
                }
              }}
            >
              <span className={`lang-label ${language === 'es' ? 'active' : ''}`}>ES</span>
              <div className={`lang-switch ${language === 'en' ? 'en-active' : ''}`}>
                <div className="lang-indicator"></div>
              </div>
              <span className={`lang-label ${language === 'en' ? 'active' : ''}`}>EN</span>
            </div>

            <button
              className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              style={{ color: '#ffffff' }}
            >
              <span></span> 
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
