import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

import { Analytics } from '@vercel/analytics/react';
import es from './locales/es';
import en from './locales/en';
import { isArgentinaDarkHour } from './utils/argentinaTime';

const translations = { es, en };

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
      const shouldBeDarkHour = forcedHour === 'oscura'
        ? true
        : forcedHour === 'normal'
          ? false
          : isArgentinaDarkHour();
      setIsDarkHour((current) => current === shouldBeDarkHour ? current : shouldBeDarkHour);
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
    <div className={`App persona-menu${isDarkHour ? ' dark-hour-mode' : ''}`}>
      <AnimatedBackground isDarkHour={isDarkHour} quality={sceneQuality} />
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
      <Projects t={t} language={language} isDarkHour={isDarkHour} sceneQuality={sceneQuality} setProjectTerminalMount={setProjectTerminalMount} />
      <Testimonials t={t} language={language} />
      <Contact t={t} />
      <Footer t={t} />
      <Analytics />
    </div>
  );
}

export default App;
