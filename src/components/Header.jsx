

import { useState, useEffect } from 'react';

import './Header.css';



const Header = ({ t, language, toggleLanguage }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [navStyle, setNavStyle] = useState({

    background: 'rgba(12, 12, 12, 0.9)',

    textColor: '#ffffff',

    isLight: false

  });

  

  // Color específico para el logo VT

  const [logoStyle, setLogoStyle] = useState({

    background: '#ffffff',  // Blanco al inicio

    isWhite: true

  });

  

  // Sección activa para indicador

  const [activeSection, setActiveSection] = useState('home');



  // Sistema de gradiente continuo suave

  // Gradientes EXACTOS del sitio (de App.css)

  // linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)

  const gradientStops = [

    { percent: 0, r: 12, g: 12, b: 12 },       // 0% - #0c0c0c (negro)

    { percent: 25, r: 20, g: 20, b: 30 },      // 25% - interpolación

    { percent: 50, r: 26, g: 26, b: 46 },     // 50% - #1a1a2e (azul oscuro)

    { percent: 75, r: 24, g: 30, b: 54 },     // 75% - interpolación

    { percent: 100, r: 22, g: 33, b: 62 }   // 100% - #16213e (azul medio)

  ];



  // Función para interpolar entre dos colores

  const interpolateColor = (color1, color2, factor) => {

    return {

      r: Math.round(color1.r + (color2.r - color1.r) * factor),

      g: Math.round(color1.g + (color2.g - color1.g) * factor),

      b: Math.round(color1.b + (color2.b - color1.b) * factor)

    };

  };



  useEffect(() => {

    let rafId = null;

    

    const handleScroll = () => {

      if (rafId) return; // Prevenir múltiples llamadas

      

      rafId = requestAnimationFrame(() => {

        const scrollY = window.scrollY;

        setScrolled(scrollY > 50);

        

        // Calcular porcentaje de scroll

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        const scrollPercent = Math.min((scrollY / docHeight) * 100, 100);

        

        // Encontrar los dos stops entre los que estamos

        let start = gradientStops[0];

        let end = gradientStops[gradientStops.length - 1];

        

        for (let i = 0; i < gradientStops.length - 1; i++) {

          if (scrollPercent >= gradientStops[i].percent && scrollPercent <= gradientStops[i + 1].percent) {

            start = gradientStops[i];

            end = gradientStops[i + 1];

            break;

          }

        }

        

        // Calcular factor de interpolación

        const range = end.percent - start.percent;

        const factor = range === 0 ? 0 : (scrollPercent - start.percent) / range;

        

        // Interpolar color

        const color = interpolateColor(start, end, factor);

        

        // Calcular luminosidad para color de texto

        const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

        const isLight = luminance > 0.5;

        

        setNavStyle({

          background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.85)`,

          textColor: isLight ? '#1a1a2e' : '#ffffff',

          isLight

        });

        

        // Lógica especial para el logo VT

        // En el hero (inicio) el logo es blanco, después toma el color del gradiente

        const heroSection = document.getElementById('home');

        let inHero = false;

        if (heroSection) {

          const heroRect = heroSection.getBoundingClientRect();

          // Si estamos dentro del hero (navbar está sobre el hero)

          inHero = heroRect.bottom > 100;

        }

        

        if (inHero) {

          // En el hero: logo blanco

          setLogoStyle({

            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',

            isWhite: true

          });

        } else {

          // Fuera del hero: logo toma el color del gradiente actual

          setLogoStyle({

            background: `linear-gradient(135deg, rgb(${color.r + 40}, ${color.g + 40}, ${color.b + 40}) 0%, rgb(${color.r}, ${color.g}, ${color.b}) 100%)`,

            isWhite: false

          });

        }

        

        // Detectar sección activa para indicador

        const sections = ['home', 'about', 'skills', 'projects', 'testimonials', 'contact'];

        let currentSection = 'home';

        const scrollPos = window.scrollY + 150;

        const pageHeight = document.documentElement.scrollHeight;

        const isAtBottom = window.scrollY + window.innerHeight >= pageHeight - 100;

        

        // Si estamos al final de la página, mostrar Contact

        if (isAtBottom) {

          currentSection = 'contact';

        } else {

          // Buscar la sección actual (desde atrás hacia adelante)

          for (let i = sections.length - 1; i >= 0; i--) {

            const sectionId = sections[i];

            const element = document.getElementById(sectionId);

            if (element) {

              const offsetTop = element.offsetTop;

              if (scrollPos >= offsetTop) {

                currentSection = sectionId;

                break;

              }

            }

          }

        }

        setActiveSection(currentSection);

        

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

      className={`header ${scrolled ? 'scrolled' : ''} ${navStyle.isLight ? 'nav-light' : 'nav-dark'}`}

      style={{ 

        background: navStyle.background,

        color: navStyle.textColor

      }}

    >

      <div className="container">

        <div className="header-content">

          <div className="logo" onClick={() => scrollToSection('home')}>

            <span className={`logo-text ${logoStyle.isWhite ? 'logo-white' : ''}`}>

              VT

            </span>

          </div>

          

          <nav 

            className={`nav ${isMenuOpen ? 'nav-open' : ''}`}

          >

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

                    style={{ color: navStyle.textColor }}

                  >

                    {label}

                  </a>

                </li>

              ))}

            </ul>

          </nav>



          <div className="header-actions">

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

              style={{ color: navStyle.textColor }}

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

