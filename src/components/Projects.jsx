import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import './Projects.css';
import projectsData from '../data/projects';
import ProjectTechnology from './ProjectTechnology';

const ProjectModal = lazy(() => import('./ProjectModal'));

const pad = (value) => String(value).padStart(2, '0');

const TartarusMark = () => (
  <svg className="transmission-status__tower" viewBox="0 0 28 32" aria-hidden="true">
    <path d="M13 2h3v5h3v5h3v5h3v4H3v-4h3v-4h3v-5h3V7h1V2ZM5 23h18v7H5z" fill="currentColor" />
    <path d="M13 8h2m-5 7h2m5 2h2M9 25v3m5-3v3m5-3v3" stroke="#03100d" strokeWidth="1.2" />
  </svg>
);

const getProjectContent = (project, language) => {
  const name = typeof project.name === 'string' ? project.name : project.name[language];
  const description = project.description[language];
  const projectForModal = {
    ...project,
    title: name,
    description,
    technologies: project.stack,
    liveUrl: project.demoUrl,
    codeUrl: project.repoUrl
  };

  return { name, description, projectForModal };
};

const Projects = ({ t, language, isDarkHour = false, sceneQuality = 'optimized', setProjectTerminalMount }) => {
  const [activeId, setActiveId] = useState('goltv');
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [showDeveloperTerminal, setShowDeveloperTerminal] = useState(false);
  const [isStationPowered, setIsStationPowered] = useState(false);
  const [isStationContentMounted, setIsStationContentMounted] = useState(false);
  const sectionRef = useRef(null);
  const terminalMountRef = useRef(null);
  const stationUnmountTimerRef = useRef(null);
  const channelRefs = useRef({});
  const labels = t.projects.transmission;
  const setMonitorTerminalMount = useCallback((node) => {
    terminalMountRef.current = node;
    setProjectTerminalMount?.(node);
  }, [setProjectTerminalMount]);

  const toggleDeveloperTerminal = () => setShowDeveloperTerminal((isOpen) => !isOpen);

  const toggleStationPower = () => {
    window.clearTimeout(stationUnmountTimerRef.current);
    if (isStationPowered) {
      setIsStationPowered(false);
      stationUnmountTimerRef.current = window.setTimeout(() => setIsStationContentMounted(false), 300);
      return;
    }

    setIsStationContentMounted(true);
    window.requestAnimationFrame(() => setIsStationPowered(true));
  };

  useEffect(() => () => window.clearTimeout(stationUnmountTimerRef.current), []);

  const visibleProjects = projectsData;
  const activeProject = visibleProjects.find((project) => project.id === activeId && project.available)
    || visibleProjects.find((project) => project.available);
  const activeNumber = activeProject?.number || 1;
  const content = activeProject && getProjectContent(activeProject, language);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setIsSectionVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsSectionVisible(entry.isIntersecting);
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncPageVisibility = () => setIsPageVisible(document.visibilityState === 'visible');
    syncPageVisibility();
    document.addEventListener('visibilitychange', syncPageVisibility);
    return () => document.removeEventListener('visibilitychange', syncPageVisibility);
  }, []);

  useEffect(() => {
    setElapsedSeconds(0);
  }, [activeProject?.id]);

  useEffect(() => {
    if (!isSectionVisible || !isPageVisible || !isStationPowered || !activeProject) return undefined;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isSectionVisible, isPageVisible, isStationPowered, activeProject?.id]);

  const handleChannelKeyDown = (event, index) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const project = visibleProjects[index];
        if (project.available) setActiveId(project.id);
      }
      return;
    }

    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    let target = index;
    for (let count = 0; count < visibleProjects.length; count += 1) {
      target = (target + step + visibleProjects.length) % visibleProjects.length;
      if (visibleProjects[target].available) {
        channelRefs.current[visibleProjects[target].id]?.focus();
        break;
      }
    }
  };

  const monitorTime = `${pad(Math.floor(elapsedSeconds / 3600))}:${pad(Math.floor((elapsedSeconds % 3600) / 60))}:${pad(elapsedSeconds % 60)}`;
  const signalCount = isDarkHour ? 2 : activeProject?.signal || 0;
  const signalLabel = isDarkHour ? labels.unstable : activeProject?.signal === 4 ? labels.strong : labels.stable;

  return (
    <section
      id="projects"
      className="section projects transmission-section"
      ref={sectionRef}
      data-theme={isDarkHour ? 'dark-hour' : 'normal'}
      data-quality={sceneQuality}
      aria-labelledby="projects-title"
    >
      <div className="container">
        <h2 className="section-title" id="projects-title">{t.projects.title}</h2>

        <div className={`transmission-console${isDarkHour ? ' is-dark-hour' : ''}${isStationPowered ? ' is-powered' : ''}`}>
          <header className="transmission-console__header">
            <div className="transmission-console__station">
              <span className={`transmission-rec-dot${isStationPowered ? '' : ' is-off'}`} aria-hidden="true" />
              <span>{isStationPowered ? `${labels.station} · ${labels.channel} ${pad(activeNumber)}/${pad(visibleProjects.length)}` : labels.stationOffline}</span>
            </div>
            <div className="transmission-status" role="status">
              {isStationPowered && (isDarkHour ? <TartarusMark /> : <span className="transmission-status__normal-mark" aria-hidden="true">●</span>)}
              <span>{isStationPowered ? (isDarkHour ? labels.tartarusDetected : labels.noAnomalies) : labels.powerStandby}</span>
            </div>
            <button
              className={`transmission-power-button${isStationPowered ? ' is-on' : ''}`}
              type="button"
              aria-pressed={isStationPowered}
              onClick={toggleStationPower}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v10m5.66-6.66a8 8 0 1 1-11.32 0" /></svg>
              {isStationPowered ? labels.stationPowerOff : labels.stationPowerOn}
            </button>
          </header>

          {!isStationContentMounted && (
            <div className="transmission-standby" aria-live="polite">
              <span className="transmission-standby__indicator" aria-hidden="true" />
              <p>{labels.powerHint}</p>
            </div>
          )}

          {isStationContentMounted && <div className={`transmission-console__body${isStationPowered ? ' is-on' : ''}`}>
            <div className="transmission-channels" role="tablist" aria-orientation="vertical" aria-label={labels.channelList}>
              {visibleProjects.map((project, index) => {
                const selected = project.id === activeProject?.id;
                const name = project.available
                  ? (typeof project.name === 'string' ? project.name : project.name[language])
                  : labels.noSignal;
                return (
                  <button
                    key={project.id}
                    ref={(node) => { channelRefs.current[project.id] = node; }}
                    id={`project-channel-${project.number}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="project-transmission-panel"
                    aria-disabled={!project.available}
                    disabled={!project.available}
                    tabIndex={selected ? 0 : -1}
                    className={`transmission-channel${selected ? ' is-active' : ''}${!project.available ? ' is-unavailable' : ''}`}
                    onClick={() => project.available && setActiveId(project.id)}
                    onKeyDown={(event) => handleChannelKeyDown(event, index)}
                  >
                    <span className="transmission-channel__number">{pad(project.number)}</span>
                    <span className="transmission-channel__name">{name}</span>
                  </button>
                );
              })}
            </div>

            {activeProject && content && (
              <div
                className="transmission-detail"
                id="project-transmission-panel"
                role="tabpanel"
                aria-labelledby={`project-channel-${activeProject.number}`}
                aria-live="polite"
                tabIndex={0}
              >
                <div className="transmission-monitor" key={activeProject.id}>
                  <img
                    className="transmission-monitor__image"
                    src={activeProject.image}
                    alt={labels.preview.replace('{name}', content.name)}
                    width="960"
                    height="600"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="transmission-monitor__scanlines" aria-hidden="true" />
                  <span className="transmission-monitor__corner transmission-monitor__corner--tl" aria-hidden="true" />
                  <span className="transmission-monitor__corner transmission-monitor__corner--tr" aria-hidden="true" />
                  <span className="transmission-monitor__corner transmission-monitor__corner--bl" aria-hidden="true" />
                  <span className="transmission-monitor__corner transmission-monitor__corner--br" aria-hidden="true" />
                  <span className="transmission-monitor__tag transmission-monitor__tag--tl">{labels.file} {pad(activeNumber)}</span>
                  <span className="transmission-monitor__tag transmission-monitor__tag--tr">{isDarkHour ? labels.interference : `${labels.signalStatus}: ${signalLabel}`}</span>
                  <span className="transmission-monitor__tag transmission-monitor__tag--bl"><i className="transmission-rec-dot" aria-hidden="true" /> {labels.rec} <span aria-live="off">{monitorTime}</span></span>
                  <span className="transmission-monitor__tag transmission-monitor__tag--br">{isDarkHour ? labels.darkHour : labels.night}</span>
                </div>

                <div className="transmission-readouts">
                  <div className="transmission-readout">
                    <span className="transmission-readout__label">{labels.file}</span>
                    <strong>{pad(activeNumber)} / {pad(projectsData.length)}</strong>
                  </div>
                  <div className="transmission-readout transmission-readout--signal">
                    <span className="transmission-readout__label">{labels.signalStatus}</span>
                    <div className="transmission-readout__signal-line">
                      <span className="transmission-signal-bars" aria-label={`${signalCount} ${labels.bars}`}>
                        {[1, 2, 3, 4].map((bar) => <i key={bar} className={bar <= signalCount ? 'is-lit' : ''} />)}
                      </span>
                      <strong>{signalLabel}</strong>
                    </div>
                  </div>
                </div>

                <div className="transmission-project-copy">
                  <span className="transmission-project-copy__type">{activeProject.type[language]}</span>
                  <div className="transmission-project-copy__title-line">
                    <h3>{content.name}</h3>
                    {activeProject.featured && <span className="transmission-featured">{labels.featured}</span>}
                  </div>
                  <p>{content.description}</p>
                  <div className="transmission-stack" aria-label={labels.stack}>
                    {activeProject.stack.map((technology) => <ProjectTechnology key={technology} name={technology} />)}
                  </div>
                  <div className="transmission-project-actions">
                    {activeProject.caseStudyKey && (
                      <button type="button" className="project-btn case-study-btn" onClick={() => setActiveProjectModal(content.projectForModal)}>{t.projects.viewCaseStudy}</button>
                    )}
                    {activeProject.demoUrl && <a className="project-btn" href={activeProject.demoUrl} target="_blank" rel="noopener noreferrer">{labels.demo}</a>}
                    {activeProject.repoUrl && <a className="project-btn" href={activeProject.repoUrl} target="_blank" rel="noopener noreferrer">{labels.code}</a>}
                  </div>
                </div>
              </div>
            )}
          </div>}
        </div>

        <div className="transmission-terminal-access">
          <div className="transmission-terminal-access__intro">
            <div>
              <h3>{labels.terminalAccess}</h3>
              <p>{labels.terminalDescription}</p>
            </div>
            <button
              type="button"
              aria-expanded={showDeveloperTerminal}
              aria-controls="projects-developer-terminal"
              onClick={toggleDeveloperTerminal}
            >
              {showDeveloperTerminal ? labels.terminalClose : labels.terminalOpen}
            </button>
          </div>
          {showDeveloperTerminal && (
            <div
              id="projects-developer-terminal"
              className="transmission-terminal-access__mount is-open"
              ref={setMonitorTerminalMount}
            />
          )}
        </div>
      </div>

      {activeProjectModal && (
        <Suspense fallback={null}>
          <ProjectModal project={activeProjectModal} t={t} onClose={() => setActiveProjectModal(null)} />
        </Suspense>
      )}
    </section>
  );
};

export default memo(Projects);
