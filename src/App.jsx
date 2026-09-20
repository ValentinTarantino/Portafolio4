import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';

const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

import es from './locales/es';
import en from './locales/en';

const translations = { es, en };

function App() {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="App">
      <div className="hero-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <Header t={t} language={language} toggleLanguage={toggleLanguage} />
      <Hero t={t} language={language} />
      <Suspense fallback={<div />}>
        <About t={t} />
        <Skills t={t} />
        <Projects t={t} language={language} />
        <Testimonials t={t} language={language} />
        <Contact t={t} />
        <Footer t={t} />
      </Suspense>
    </div>
  );
}

export default App;
