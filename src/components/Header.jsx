import { useState, useEffect, useRef } from 'react';

import './Header.css';
import LampToggle from './LampToggle';
import MobileThemeToggle from './MobileThemeToggle';

const Header = ({ t, language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const lastSectionRef = useRef('home');

  const gradientStops = [
    { percent: 0, r: 12, g: 12, b: 12 },
    { percent: 25, r: 20, g: 20, b: 30 },
    { percent: 50, r: 26, g: 26, b: 46 },
    { percent: 75, r: 24, g: 30, b: 54 },
    { percent: 100, r: 22, g: 33, b: 62 }
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
        const isAtBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
        let currentSection = 'home';

        if (isAtBottom) {
          currentSection = 'contact';
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            const element = document.getElementById(sections[i]);
            if (element && scrollPos >= element.offsetTop) {
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
          const navLinks = header.querySelectorAll('.nav-link');
          const textColor = isLight ? '#1a1a2e' : '#ffffff';
          navLinks.forEach(link => { link.style.color = textColor; });
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${scrolled ? 'scrolled' : ''} nav-dark`}
    >
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => scrollToSection('home')}>
            <span ref={logoRef} className="logo-text logo-white">
              VT
            </span>
          </div>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
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
                    onClick={() => scrollToSection(id)}
                    className={`nav-link ${activeSection === id ? 'active' : ''}`}
                    style={{ color: '#ffffff' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <LampToggle />
            <MobileThemeToggle />
            <div
              className="language-toggle"
              onClick={toggleLanguage}
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
