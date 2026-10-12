import { useState, useEffect, useRef } from 'react';

import './Header.css';

const Header = ({ t, language, toggleLanguage, isDarkHour, toggleDarkHour }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);
  const logoRef = useRef(null);
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

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const header = headerRef.current;
        const logo = logoRef.current;

        setScrolled(scrollY > 50);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
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
          header.style.background = `rgba(${color.r}, ${color.g}, ${color.b}, 0.85)`;
          header.style.color = isLight ? '#1a1a2e' : '#ffffff';
          header.classList.toggle('nav-light', isLight);
          header.classList.toggle('nav-dark', !isLight);
        }

        const heroSection = document.getElementById('home');
        const inHero = heroSection ? heroSection.getBoundingClientRect().bottom > 100 : false;
        if (logo) {
          logo.classList.toggle('logo-white', inHero);
        }

        const sections = ['home', 'about', 'skills', 'projects', 'testimonials', 'contact'];
        const scrollPos = scrollY + 150;
        const isAtTop = scrollY <= 80;
        const isAtBottom = !isAtTop && scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
        let currentSection = 'home';

        if (isAtTop) {
          currentSection = 'home';
        } else if (isAtBottom) {
          currentSection = 'contact';
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            const element = document.getElementById(sections[i]);
            const sectionTop = element ? element.getBoundingClientRect().top + scrollY : Infinity;
            if (element && scrollPos >= sectionTop) {
              currentSection = sections[i];
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
      <div className="container">
        <div className="header-content">
          <div
            className="logo"
            role="button"
            tabIndex={0}
            aria-label={t.nav.home}
            onClick={() => scrollToSection('home')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                scrollToSection('home');
              }
            }}
          >
            <span ref={logoRef} className="logo-text logo-white">
              VT
            </span>
          </div>

          <nav id="primary-navigation" className={`nav ${isMenuOpen ? 'nav-open' : ''}`} aria-label={t.nav.menu || 'Navegación principal'}>
            <ul className="nav-list">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'skills', label: t.nav.skills },
                { id: 'projects', label: t.nav.projects },
                { id: 'testimonials', label: t.nav.testimonials },
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
              <li className="dark-hour-menu-item">
                <button
                  type="button"
                  className={`dark-hour-toggle${isDarkHour ? ' is-active' : ''}`}
                  onClick={toggleDarkHour}
                  aria-label="DARK HOUR"
                  aria-pressed={isDarkHour}
                >
                  <span className="dark-hour-toggle__label">DARK HOUR</span>
                  <span className="dark-hour-toggle__indicator" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
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
