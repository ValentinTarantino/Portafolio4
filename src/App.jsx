import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import About from './components/About';
import Skills from './components/Skills';

// Below-fold sections load in separate chunks so the initial bundle
// stays lean. Fallbacks reserve space and keep anchor ids working.
const Projects = lazy(() => import('./components/Projects'));
const Capabilities = lazy(() => import('./components/Capabilities'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

import { Analytics } from '@vercel/analytics/react';
import es from './locales/es';
import en from './locales/en';
import { isArgentinaDarkHour } from './utils/argentinaTime';
import { getArgentinaTimeParts } from './utils/argentinaTime';
import { getDayPeriod } from './utils/dayPeriod';

const translations = { es, en };

// Keeps layout stable while a lazy section loads (no CLS) and preserves
// anchor targets for nav links.
const SectionFallback = ({ id, minHeight }) => (
  <div {...(id ? { id } : {})} className="section section-fallback" style={{ minHeight }} aria-hidden="true">
    <div className="container">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-block" />
    </div>
  </div>
);

// Renders children only when close to the viewport, so below-fold chunks
// are neither fetched nor evaluated until needed. Fallback keeps the
// anchor id working for nav links in the meantime.
const useNearViewport = (margin = '1200px 0px') => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);
  return [ref, visible];
};

const NearViewportSection = ({ id, minHeight, children }) => {
  const [ref, visible] = useNearViewport();
  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<SectionFallback id={id} minHeight={minHeight} />}>{children}</Suspense>
      ) : (
        <SectionFallback id={id} minHeight={minHeight} />
      )}
    </div>
  );
};

function App() {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = window.localStorage.getItem('persona-language');
      return savedLanguage === 'en' || savedLanguage === 'es' ? savedLanguage : 'es';
    } catch {
      return 'es';
    }
  });
  const [isDarkHour, setIsDarkHour] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(() => getDayPeriod(getArgentinaTimeParts().hour));
  const [sceneQuality, setSceneQuality] = useState(() => {
    try {
      const saved = window.localStorage.getItem('persona-scene-quality');
      return saved === 'full' || saved === 'light' ? saved : 'optimized';
    } catch {
      return 'optimized';
    }
  });
  const [projectTerminalMount, setProjectTerminalMount] = useState(null);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem('persona-language', language);
    } catch {
      // The selected language remains available for the current session.
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem('persona-scene-quality', sceneQuality);
    } catch {
      // The selected quality remains available for the current session.
    }
  }, [sceneQuality]);

  useEffect(() => {
    const syncDarkHour = () => {
      const forcedHour = import.meta.env.DEV
        ? new URLSearchParams(window.location.search).get('hora')
        : null;
      const argentinaHour = getArgentinaTimeParts().hour;
      const actualPeriod = getDayPeriod(argentinaHour);
      const shouldBeDarkHour = forcedHour === 'oscura'
        ? true
        : forcedHour === 'normal'
          ? false
          : isArgentinaDarkHour({ hour: argentinaHour });
      const visualPeriod = forcedHour === 'oscura'
        ? 'darkHour'
        : forcedHour === 'normal' && actualPeriod === 'darkHour'
          ? 'night'
          : actualPeriod;
      setIsDarkHour((current) => current === shouldBeDarkHour ? current : shouldBeDarkHour);
      setTimeOfDay((current) => current === visualPeriod ? current : visualPeriod);
    };

    syncDarkHour();
    const intervalId = window.setInterval(syncDarkHour, 30_000);
    window.addEventListener('focus', syncDarkHour);
    document.addEventListener('visibilitychange', syncDarkHour);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', syncDarkHour);
      document.removeEventListener('visibilitychange', syncDarkHour);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage((current) => current === 'es' ? 'en' : 'es');
  };



  return (
    <div className={`App persona-menu${isDarkHour ? ' dark-hour-mode' : ''}${timeOfDay === 'night' ? ' deep-night-mode' : ''}${sceneQuality === 'light' ? ' is-light-mode' : ''}`}>
      <AnimatedBackground isDarkHour={isDarkHour} timeOfDay={timeOfDay} quality={sceneQuality} />
      <Header
        t={t}
        language={language}
        toggleLanguage={toggleLanguage}
        isDarkHour={isDarkHour}
        sceneQuality={sceneQuality}
        onSceneQualityChange={setSceneQuality}
      />
      <main id="main-content">
      <Hero t={t} language={language} projectTerminalMount={projectTerminalMount} />
      <About t={t} />
      <Skills t={t} />
      <NearViewportSection id="projects" minHeight="110vh">
        <Projects t={t} language={language} isDarkHour={isDarkHour} sceneQuality={sceneQuality === 'light' ? 'optimized' : sceneQuality} setProjectTerminalMount={setProjectTerminalMount} />
      </NearViewportSection>
      <NearViewportSection id="capabilities" minHeight="100vh">
        <Capabilities t={t} language={language} isDarkHour={isDarkHour} />
      </NearViewportSection>
      <NearViewportSection id="contact" minHeight="80vh">
        <Contact t={t} />
      </NearViewportSection>
      </main>
      <NearViewportSection minHeight="50vh">
        <Footer t={t} />
      </NearViewportSection>
      <Analytics />
    </div>
  );
}

export default App;
