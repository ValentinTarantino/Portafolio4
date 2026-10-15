import { lazy, Suspense, useState, useEffect } from 'react';
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
  <div {...(id ? { id } : {})} style={{ minHeight }} aria-hidden="true" />
);

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
      return window.localStorage.getItem('persona-scene-quality') === 'full' ? 'full' : 'optimized';
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

  // Warm up below-fold chunks once the browser is idle, so they are
  // ready before the user scrolls — without blocking the initial paint.
  useEffect(() => {
    const warm = () => {
      import('./components/Projects');
      import('./components/Capabilities');
      import('./components/Contact');
      import('./components/Footer');
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 6000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(warm, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`App persona-menu${isDarkHour ? ' dark-hour-mode' : ''}${timeOfDay === 'night' ? ' deep-night-mode' : ''}`}>
      <AnimatedBackground isDarkHour={isDarkHour} timeOfDay={timeOfDay} quality={sceneQuality} />
      <Header
        t={t}
        language={language}
        toggleLanguage={toggleLanguage}
        isDarkHour={isDarkHour}
        sceneQuality={sceneQuality}
        onSceneQualityChange={setSceneQuality}
      />
      <Hero t={t} language={language} projectTerminalMount={projectTerminalMount} />
      <About t={t} />
      <Skills t={t} />
      <Suspense fallback={<SectionFallback id="projects" minHeight="110vh" />}>
        <Projects t={t} language={language} isDarkHour={isDarkHour} sceneQuality={sceneQuality} setProjectTerminalMount={setProjectTerminalMount} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="testimonials" minHeight="100vh" />}>
        <Capabilities t={t} language={language} isDarkHour={isDarkHour} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="contact" minHeight="80vh" />}>
        <Contact t={t} />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="50vh" />}>
        <Footer t={t} />
      </Suspense>
      <Analytics />
    </div>
  );
}

export default App;
