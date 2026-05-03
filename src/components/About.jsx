import './About.css';

const About = ({ t }) => {
  const certificates = [
    {
      title: t.about.certificates.webDev,
      url: "https://pub.coderhouse.com/legacy-certificates/66fb5b5ed1c51d20ed892171?lang=es"
    },
    {
      title: t.about.certificates.javascript,
      url: "https://pub.coderhouse.com/legacy-certificates/674135608f408874aed9a83a?lang=es"
    },
    {
      title: t.about.certificates.react,
      url: "https://pub.coderhouse.com/legacy-certificates/679fa826e9330b55412d204a?lang=es"
    },
    {
      title: t.about.certificates.frontend,
      url: "https://pub.coderhouse.com/legacy-certificates/67a05912f390738459733a87?lang=es"
    }
  ];


  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">{t.about.title}</h2>
        
        <div className="about-content">
          <div className="about-main">
            <div className="developer-card glass-card">
              <div className="card-header">
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span>Online</span>
                </div>
                <div className="code-badge">
                  <span>{'</>'}</span>
                </div>
              </div>
              
              <div className="developer-info">
                <div className="name-section">
                  <h3 className="dev-name">Valentín Thomas Tarantino</h3>
                  <div className="role-tags">
                    <span className="tag primary">Full Stack</span>
                    <span className="tag secondary">React</span>
                    <span className="tag tertiary">Js</span>
                  </div>
                </div>
                
                <div className="description-box">
                  <p>{t.about.description}</p>
                </div>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.27L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="stat-number">2+</div>
                <div className="stat-label">{t.about.experienceLabel}</div>
              </div>
              
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-number">9+</div>
                <div className="stat-label">{t.about.projectsLabel}</div>
              </div>
            </div>
          </div>
          
          <div className="about-sidebar">
            <div className="education-card glass-card">
              <div className="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10V6C22 5.45 21.55 5 21 5H3C2.45 5 2 5.45 2 6V10C2 10.55 2.45 11 3 11H21C21.55 11 22 10.55 22 10ZM21 12H3C2.45 12 2 12.45 2 13V18C2 18.55 2.45 19 3 19H21C21.55 19 22 18.55 22 18V13C22 12.45 21.55 12 21 12Z" fill="currentColor"/>
                </svg>
                <span>{t.about.education}</span>
              </div>
              
              <div className="education-item">
                <div className="education-header">
                  <h4>Coderhouse</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">Curso de desarrollo Front End</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.june} 2024</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.january} 2025</span>
                </div>
              </div>
              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>
              
              <div className="education-item">
                <div className="education-header">
                  <h4>Centro de e-Learning, UTN</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">Programa de formación</p>
                <div className="timeline">
                  <span className="date-start">Marzo 2025</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">Agosto 2025</span>
                </div>
              </div>
            </div>
            
            {/* Elimino la sección tech-stack-card completa */}
          </div>
        </div>

        <div className="certificates-section">
          <h3 className="certificates-title">{t.about.certificationsTitle}</h3>
          <div className="certificates-grid">
            {certificates.map((cert, index) => (
              <a 
                key={index} 
                href={cert.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="certificate-card glass-card"
              >
                <div className="certificate-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.27L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <h4 className="certificate-title">{cert.title}</h4>
                <div className="certificate-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
