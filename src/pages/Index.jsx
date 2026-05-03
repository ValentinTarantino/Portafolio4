
import { useState } from 'react';
import '../App.css';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      skills: 'Herramientas',
      projects: 'Proyectos',
      contact: 'Contacto'
    },
    hero: {
      greeting: 'Hola, soy',
      name: 'Valentín Tarantino',
      title: 'Desarrollador Full Stack',
      description: 'Apasionado por crear experiencias web únicas y funcionales. Especializado en React, JavaScript y diseño UI/UX.',
      downloadCV: 'Descargar CV',
      contactMe: 'Contáctame'
    },
    about: {
      title: 'Acerca de mí',
      description: 'Soy un desarrollador Full Stack con más de 3 años de experiencia creando aplicaciones web modernas y responsivas. Me encanta transformar ideas creativas en código funcional y estéticamente atractivo.',
      experience: 'Años de experiencia',
      projects: 'Proyectos completados',
      clients: 'Clientes satisfechos'
    },
    skills: {
      title: 'Mis Herramientas',
      subtitle: 'Tecnologías que domino'
    },
    projects: {
      title: 'Mis Proyectos',
      subtitle: 'Algunos trabajos destacados',
      viewProject: 'Ver Proyecto',
      viewCode: 'Ver Código'
    },
    contact: {
      title: 'Contáctame',
      subtitle: '¿Tienes un proyecto en mente?',
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      greeting: 'Hi, I am',
      name: 'Juan Pérez',
      title: 'Full Stack Developer',
      description: 'Passionate about creating unique and functional web experiences. Specialized in React, JavaScript and UI/UX design.',
      downloadCV: 'Download CV',
      contactMe: 'Contact Me'
    },
    about: {
      title: 'About Me',
      description: 'I am a Full Stack developer with over 3 years of experience creating modern and responsive web applications. I love transforming creative ideas into functional and aesthetically appealing code.',
      experience: 'Years of experience',
      projects: 'Completed projects',
      clients: 'Satisfied clients'
    },
    skills: {
      title: 'My Skills',
      subtitle: 'Technologies I master'
    },
    projects: {
      title: 'My Projects',
      subtitle: 'Some featured work',
      viewProject: 'View Project',
      viewCode: 'View Code'
    },
    contact: {
      title: 'Contact Me',
      subtitle: 'Have a project in mind?',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message'
      },
      info: {
        email: 'juan.perez@email.com',
        phone: '+54 114 947 6457',
        location: 'Argentina, Buenos Aires'
      }
    }
  }
};

const Index = () => {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="App">
      <Header t={t} language={language} toggleLanguage={toggleLanguage} />
      <Hero t={t} />
      <About t={t} />
      <Skills t={t} />
      <Projects t={t} />
      <Contact t={t} />
      <Footer />
    </div>
  );
};

export default Index;
