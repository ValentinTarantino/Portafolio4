import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import OnlineCounter from './components/OnlineCounter';
import AnimatedBackground from './components/AnimatedBackground';

const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

import { Analytics } from '@vercel/analytics/react';
import es from './locales/es';
import en from './locales/en';

const translations = { es, en };

function App() {
  const [language, setLanguage] = useState('es');
  const [isDarkHour, setIsDarkHour] = useState(() => {
    try {
      return window.localStorage.getItem('persona-dark-hour') === 'true';
    } catch {
      return false;
    }
  });
  const [terminalMount, setTerminalMount] = useState(null);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem('persona-dark-hour', String(isDarkHour));
    } catch {
      // The current session still works when browser storage is unavailable.
    }
  }, [isDarkHour]);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className={`App persona-menu${isDarkHour ? ' dark-hour-mode' : ''}`}>
      <AnimatedBackground isDarkHour={isDarkHour} />
      <Header
        t={t}
        language={language}
        toggleLanguage={toggleLanguage}
        isDarkHour={isDarkHour}
        toggleDarkHour={() => setIsDarkHour((current) => !current)}
      />
      <Hero t={t} language={language} terminalMount={terminalMount} />
      <Suspense fallback={<div />}>
        <About t={t} />
        <Skills t={t} />
        <Projects t={t} language={language} />
        <Testimonials t={t} language={language} />
        <Contact t={t} setTerminalMount={setTerminalMount} />
        <Footer t={t} />
      </Suspense>
      <OnlineCounter t={t} />
      <Analytics />
    </div>
  );
}

export default App;
