import { FiCode, FiZap, FiArrowUp, FiDownload } from 'react-icons/fi';
import { SiReact, SiVite, SiJavascript } from 'react-icons/si';
import { FaCss3Alt } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ t }) => {
  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.contact, href: '#contact' }
  ];

  const techStack = [
    { icon: <SiReact />, name: 'React', color: '#61DAFB' },
    { icon: <SiVite />, name: 'Vite', color: '#646CFF' },
    { icon: <FaCss3Alt />, name: 'CSS3', color: '#264DE4' },
    { icon: <SiJavascript />, name: 'JavaScript', color: '#F7DF1E' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      {/* Animated Background Effects */}
      <div className="footer-glow"></div>
      <div className="footer-particles">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      
      {/* Gradient Overlay */}
      <div className="footer-gradient-overlay"></div>

      <div className="container relative-container">
        <div className="footer-content">
          
          {/* CTA Section */}
          <div className="footer-cta-section">
            <div className="cta-badge">
              <FiZap className="cta-icon" />
              <span>{t.footer.cta}</span>
            </div>
            <p className="cta-subtitle">Construyamos algo increíble juntos</p>
          </div>
          
          {/* Main Grid Section */}
          <div className="footer-main-grid">
            
            {/* Brand Column */}
            <div className="footer-brand-col">
              <a href="#home" className="footer-logo" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                <span className="logo-accent">V</span>
                <span className="logo-text">alentín </span>
                <span className="logo-accent">T</span>
                <span className="logo-text">arantino</span>
              </a>
              <p className="footer-tagline">
                Desarrollador Full Stack especializado en crear experiencias digitales excepcionales.
              </p>
              
              <div className="availability-badge">
                <span className="pulse-dot"></span>
                <span className="availability-text">
                  {t.footer.available}
                </span>
              </div>
              
              <a href="/cv-valentin-tarantino.pdf" download className="cv-download-btn">
                <FiDownload className="cv-icon" />
                <span>Descargar CV</span>
              </a>
            </div>

            {/* Navigation Column */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Navegación</h4>
              <nav className="footer-nav">
                {navLinks.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="footer-nav-link"
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Tech Stack Column */}
            <div className="footer-tech-col">
              <h4 className="footer-col-title">
                <FiCode className="col-icon" />
                Hecho con
              </h4>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-item" style={{ '--tech-color': tech.color }}>
                    <span className="tech-icon-wrapper">{tech.icon}</span>
                    <span className="tech-name">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright-wrapper">
              <p className="footer-copyright">
                {t.footer.copyright}
              </p>
            </div>

            <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Volver arriba">
              <span className="btn-text">Volver arriba</span>
              <FiArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
