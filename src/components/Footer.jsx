import { memo } from 'react';
import { FiCode, FiDownload } from 'react-icons/fi';
import { SiReact, SiVite, SiJavascript } from 'react-icons/si';
import { FaCss3Alt } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ t }) => {
  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.capabilities, href: '#capabilities' },
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
              <span className="cta-text">{t.footer.cta}</span>
            </div>
            <p className="cta-subtitle">{t.footer.subtitle}</p>
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
              <p className="footer-tagline">{t.footer.tagline}</p>
            </div>

            {/* Navigation Column */}
            <div className="footer-nav-col">
              <h3 className="footer-col-title">{t.footer.navigation}</h3>
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
              <h3 className="footer-col-title">
                <FiCode className="col-icon" />
                {t.footer.madeWith}
              </h3>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-item" style={{ '--tech-color': tech.color }}>
                    <span className="tech-icon-wrapper" aria-hidden="true">{tech.icon}</span>
                    <span className="tech-name">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
