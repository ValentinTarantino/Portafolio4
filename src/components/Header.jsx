
import { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ t, language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">VT</span>
          </div>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li><a onClick={() => scrollToSection('home')} className="nav-link">{t.nav.home}</a></li>
              <li><a onClick={() => scrollToSection('about')} className="nav-link">{t.nav.about}</a></li>
              <li><a onClick={() => scrollToSection('skills')} className="nav-link">{t.nav.skills}</a></li>
              <li><a onClick={() => scrollToSection('projects')} className="nav-link">{t.nav.projects}</a></li>
              <li><a onClick={() => scrollToSection('contact')} className="nav-link">{t.nav.contact}</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="language-toggle" onClick={toggleLanguage}>
              <span className="flag">{language === 'es' ? '' : ''}</span>
              <span className="lang-text">{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
            
            <button 
              className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
