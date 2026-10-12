import { memo } from 'react';
import './About.css';

const About = ({ t }) => {
  const softSkillIcons = [
    // Message Circle / Chat (Comunicación)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    // Kanban / Layout (Gestión de proyectos)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
    // Target / Crosshair (Autogestión)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    // Lightbulb (Resolución de problemas)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>
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
            
            <div className="education-card glass-card">
              <div className="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10V6C22 5.45 21.55 5 21 5H3C2.45 5 2 5.45 2 6V10C2 10.55 2.45 11 3 11H21C21.55 11 22 10.55 22 10ZM21 12H3C2.45 12 2 12.45 2 13V18C2 18.55 2.45 19 3 19H21C21.55 19 22 18.55 22 18V13C22 12.45 21.55 12 21 12Z" fill="currentColor"/>
                </svg>
                <span>{t.about.education}</span>
              </div>
              
              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.educationItems.frontEndCourse}</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">{t.about.educationItems.coderhouse}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.june} 2024</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.january} 2025</span>
                </div>
              </div>
              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>
              
              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.educationItems.trainingProgram}</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">{t.about.educationItems.utn}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.march} 2025</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.may} 2025</span>
                </div>
              </div>
              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>

              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.educationItems.fullStackCareer}</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">{t.about.educationItems.coderhouse}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.may} 2025</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.june} 2026</span>
                </div>
              </div>
              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>

              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.educationItems.aiAutomation}</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">{t.about.educationItems.coderhouse}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.april} 2026</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.june} 2026</span>
                </div>
              </div>
              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>

              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.educationItems.aiAutomationAdvanced}</h4>
                  <span className="completion-badge">{t.about.certified}</span>
                </div>
                <p className="course-name">{t.about.educationItems.coderhouse}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.june} 2026</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.august} 2026</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-sidebar">
            <div className="education-card glass-card">
              <div className="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{t.about.experience}</span>
              </div>

              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.experienceItems.bindin.role} · {t.about.experienceItems.bindin.company}</h4>
                </div>
                <p className="course-name">{t.about.experienceItems.bindin.location}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.january} 2026</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.months.august} 2026</span>
                </div>
                <ul className="experience-bullets">
                  {t.about.experienceItems.bindin.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="education-divider" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>

              <div className="education-item">
                <div className="education-header">
                  <h4>{t.about.experienceItems.freelance.role} · {t.about.experienceItems.freelance.company}</h4>
                </div>
                <p className="course-name">{t.about.experienceItems.freelance.location}</p>
                <div className="timeline">
                  <span className="date-start">{t.about.months.january} 2023</span>
                  <div className="timeline-line"></div>
                  <span className="date-end">{t.about.present}</span>
                </div>
                <p className="course-name" style={{ fontStyle: 'italic', opacity: 0.7, marginTop: '0.25rem' }}>
                  {t.about.experienceItems.freelance.note}
                </p>
                <ul className="experience-bullets">
                  {t.about.experienceItems.freelance.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="education-card glass-card" style={{ marginTop: '1.2rem' }}>
              <div className="card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                </svg>
                <span>{t.about.softSkillsTitle}</span>
              </div>
              <div className="soft-skill-list">
                {t.about.softSkills.map((skill, index) => (
                  <div key={index} className="soft-skill-item">
                    <div className="soft-skill-icon">
                      {softSkillIcons[index]}
                    </div>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Elimino la sección tech-stack-card completa */}
          </div>
        </div>


      </div>
    </section>
  );
};

export default memo(About);
