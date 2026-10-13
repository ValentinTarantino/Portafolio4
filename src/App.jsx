import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import OnlineCounter from './components/OnlineCounter';
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
    try {
      window.localStorage.setItem('persona-language', language);
    } catch {
      // The selected language remains available for the current session.
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem('persona-dark-hour', String(isDarkHour));
    } catch {
      // The current session still works when browser storage is unavailable.
    }
  }, [isDarkHour]);

  const toggleLanguage = () => {
    setLanguage((current) => current === 'es' ? 'en' : 'es');
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
      <About t={t} />
      <Skills t={t} />
      <Projects t={t} language={language} />
      <Testimonials t={t} language={language} />
      <Contact t={t} setTerminalMount={setTerminalMount} />
      <Footer t={t} />
      <OnlineCounter t={t} />
      <Analytics />
    </div>
  );
}

export default App;
