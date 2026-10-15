import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FiX, FiTarget, FiCpu, FiAward, FiServer, FiDatabase, FiLayout } from 'react-icons/fi';
import './ProjectModal.css';

const getIconForTitle = (title) => {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('front') || normalizedTitle.includes('web') || normalizedTitle.includes('landing') || normalizedTitle.includes('estilos')) return <FiLayout />;
  if (normalizedTitle.includes('base de datos') || normalizedTitle.includes('database') || normalizedTitle.includes('storage') || normalizedTitle.includes('almacenamiento')) return <FiDatabase />;
  if (normalizedTitle.includes('test') || normalizedTitle.includes('devops') || normalizedTitle.includes('video')) return <FiCpu />;
  return <FiServer />;
};

const ProjectModal = ({ project, t, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const returnFocusRef = useRef(null);
  const study = t.projects.caseStudies[project.caseStudyKey];
  const tabsText = t.projects.caseStudies.tabs;
  const hasArchitecture = Boolean(study?.architectureNodes?.length);

  useLayoutEffect(() => {
    returnFocusRef.current = document.activeElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const originalStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      Object.entries(originalStyles).forEach(([property, value]) => {
        body.style[property] = value;
      });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
      requestAnimationFrame(() => returnFocusRef.current?.focus?.({ preventScroll: true }));
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll(
        'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
  }, [activeTab]);

  if (!study) return null;

  const selectTab = (tab) => {
    setActiveTab(tab);
    document.getElementById(`case-study-tab-${tab}`)?.focus();
  };

  const handleTabKeyDown = (event) => {
    if (!hasArchitecture) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const nextTab = event.key === 'Home'
        ? 'overview'
        : event.key === 'End'
          ? 'architecture'
          : activeTab === 'overview' ? 'architecture' : 'overview';
      selectTab(nextTab);
    }
  };

  return (
    <div
      className="modal-overlay project-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="modal-content glass-card modal-enter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-project-header">
            <span className="modal-badge">{t.projects.caseStudyBadge}</span>
            <h2 className="modal-project-title" id="project-modal-title">{project.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t.projects.close}
          >
            <FiX aria-hidden="true" />
          </button>
        </header>

        <div
          className="modal-tabs"
          role="tablist"
          aria-label={t.projects.caseStudyBadge}
          onKeyDown={handleTabKeyDown}
        >
          <button
            type="button"
            id="case-study-tab-overview"
            className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="case-study-panel"
            tabIndex={activeTab === 'overview' ? 0 : -1}
            onClick={() => setActiveTab('overview')}
          >
            <span>{tabsText.overview}</span>
          </button>
          {hasArchitecture && (
            <button
              type="button"
              id="case-study-tab-architecture"
              className={`modal-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'architecture'}
              aria-controls="case-study-panel"
              tabIndex={activeTab === 'architecture' ? 0 : -1}
              onClick={() => setActiveTab('architecture')}
            >
              <span>{tabsText.architecture}</span>
            </button>
          )}
        </div>

        <div className="modal-scroll-area" ref={scrollAreaRef}>
          <div
            className="modal-tab-content-wrapper"
            id="case-study-panel"
            role="tabpanel"
            aria-labelledby={`case-study-tab-${activeTab}`}
            tabIndex={0}
          >
              {activeTab === 'overview' && (
                <div
                  key="overview"
                  className="modal-grid modal-tab-enter"
                >
                  <section className="modal-section challenge">
                    <div className="modal-section-title">
                      <FiTarget className="section-title-icon challenge-icon" aria-hidden="true" />
                      <h3>{t.projects.challengeLabel}</h3>
                    </div>
                    <p>{study.challenge}</p>
                  </section>

                  <section className="modal-section solution">
                    <div className="modal-section-title">
                      <FiCpu className="section-title-icon solution-icon" aria-hidden="true" />
                      <h3>{t.projects.solutionLabel}</h3>
                    </div>
                    <p>{study.solution}</p>
                  </section>

                  <section className="modal-section metrics">
                    <div className="modal-section-title">
                      <FiAward className="section-title-icon metrics-icon" aria-hidden="true" />
                      <h3>{t.projects.metricsLabel}</h3>
                    </div>
                    <p className="highlighted-metrics">{study.metrics}</p>
                  </section>
                </div>
              )}

              {activeTab === 'architecture' && hasArchitecture && (
                <div
                  key="architecture"
                  className="modal-architecture modal-tab-enter"
                >
                  <div
                    className="architecture-diagram"
                    style={{ '--architecture-columns': Math.min(study.architectureNodes.length, 4) }}
                  >
                    {study.architectureNodes.map((node, index) => (
                      <div key={`${node.title}-${index}`} className="architecture-step">
                        <article className="architecture-node glass-card">
                          <span className="node-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                          <span className="node-icon" aria-hidden="true">{getIconForTitle(node.title)}</span>
                          <div className="node-content">
                            <span className="node-title">{node.title}</span>
                            <span className="node-tech">{node.tech}</span>
                            {node.desc && <span className="node-desc">{node.desc}</span>}
                          </div>
                        </article>
                        {index < study.architectureNodes.length - 1 && (
                          <span className="architecture-arrow" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <footer className="modal-footer">
            <h3 className="tech-title">{t.projects.technicalDetails}</h3>
            <div className="modal-technologies" aria-label={t.projects.technicalDetails}>
              {project.technologies.map((tech) => (
                <span key={tech} className="modal-tech-tag">{tech}</span>
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
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
