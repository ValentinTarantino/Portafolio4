import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTarget, FiCpu, FiAward, FiServer, FiDatabase, FiLayout } from 'react-icons/fi';
import './ProjectModal.css';

const getIconForTitle = (title) => {
  const t = title.toLowerCase();
  if (t.includes('front') || t.includes('web') || t.includes('landing') || t.includes('estilos')) return <FiLayout />;
  if (t.includes('base de datos') || t.includes('database') || t.includes('storage') || t.includes('almacenamiento')) return <FiDatabase />;
  return <FiServer />;
};

const ProjectModal = ({ project, t, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture'

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const study = t.projects.caseStudies[project.caseStudyKey];
  const tabsText = t.projects.caseStudies.tabs;

  if (!study) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label={t.projects.close}>
          <FiX />
        </button>

        <div className="modal-body">
          <div className="modal-project-header">
            <span className="modal-badge"> {t.projects.caseStudyBadge}</span>
            <h2 className="modal-project-title">{project.title}</h2>
          </div>

          {/* ── Tabs Navigation ── */}
          <div className="modal-tabs">
            <button 
              className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              {tabsText.overview}
            </button>
            {study.architectureNodes && (
              <button 
                className={`modal-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
                onClick={() => setActiveTab('architecture')}
              >
                {tabsText.architecture}
              </button>
            )}
          </div>

          <div className="modal-tab-content-wrapper">
            <AnimatePresence mode="wait">
              {/* ── Tab: Overview ── */}
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  className="modal-grid"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Challenge */}
                  <div className="modal-section challenge">
                    <div className="modal-section-title">
                      <FiTarget className="section-title-icon challenge-icon" />
                      <h3>{t.projects.challengeLabel}</h3>
                    </div>
                    <p>{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="modal-section solution">
                    <div className="modal-section-title">
                      <FiCpu className="section-title-icon solution-icon" />
                      <h3>{t.projects.solutionLabel}</h3>
                    </div>
                    <p>{study.solution}</p>
                  </div>

                  {/* Metrics */}
                  <div className="modal-section metrics">
                    <div className="modal-section-title">
                      <FiAward className="section-title-icon metrics-icon" />
                      <h3>{t.projects.metricsLabel}</h3>
                    </div>
                    <p className="highlighted-metrics">{study.metrics}</p>
                  </div>
                </motion.div>
              )}

              {/* ── Tab: Architecture ── */}
              {activeTab === 'architecture' && study.architectureNodes && (
                <motion.div 
                  key="architecture"
                  className="modal-architecture"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="architecture-diagram">
                    {study.architectureNodes.map((node, index) => (
                      <div key={index} className="architecture-step">
                        <div className="architecture-node glass-card fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                          <div className="node-icon">
                            {getIconForTitle(node.title)}
                          </div>
                          <div className="node-content">
                            <span className="node-title">{node.title}</span>
                            <span className="node-tech">{node.tech}</span>
                            <span className="node-desc">{node.desc}</span>
                          </div>
                        </div>
                        {/* Draw an arrow to the next node (except for the last one) */}
                        {index < study.architectureNodes.length - 1 && (
                          <div className="architecture-arrow fade-in-up" style={{ animationDelay: `${index * 0.15 + 0.1}s` }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="modal-footer">
            <h4 className="tech-title">{t.projects.technicalDetails}</h4>
            <div className="modal-technologies">
              {project.technologies.map((tech, index) => (
                <span key={index} className="modal-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            <div className="modal-actions-row">
              <a href={project.liveUrl} className="modal-action-btn primary" target="_blank" rel="noopener noreferrer">
                {t.projects.viewProject}
              </a>
              <a href={project.codeUrl} className="modal-action-btn secondary" target="_blank" rel="noopener noreferrer">
                {t.projects.viewCode}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;
