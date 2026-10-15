console.log("INDEX_JSX_IS_LOADED");
import { useState } from 'react';
import '../App.css';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
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
      greeting: '',
      name: 'Valentín Thomas Tarantino',
      title: 'Desarrollador Full Stack',
      description: 'Desarrollo aplicaciones web interactivas y escalables con React y JavaScript.',
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
      viewCode: 'Ver Código',
    },
    testimonials: {
      title: 'Testimonios',
      subtitle: 'Lo que dicen quienes trabajaron conmigo'
    },
    contact: {
      title: 'Contáctame',
      subtitle: '¿Tienes un proyecto en mente?',
      labels: {
        phone: 'Teléfono',
        location: 'Ubicación'
      },
      info: {
        email: 'valentin.tarantino@email.com',
        phone: '+54 11 947 6457',
        location: 'Argentina, Buenos Aires'
      }
    },
    footer: {
      copyright: '© 2025 Valentín Thomas Tarantino. Todos los derechos reservados.'
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
      greeting: '',
      name: 'Valentín Thomas Tarantino',
      title: 'Full Stack Developer',
      description: 'I build interactive, scalable web apps with React and JavaScript.',
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
    testimonials: {
      title: 'Testimonials',
      subtitle: 'What people say about working with me'
    },
    contact: {
      title: 'Contact Me',
      subtitle: 'Have a project in mind?',
      labels: {
        phone: 'Phone',
        location: 'Location'
      },
      info: {
        email: 'valentin.tarantino@email.com',
        phone: '+54 11 947 6457',
        location: 'Argentina, Buenos Aires'
      }
    },
    footer: {
      copyright: '© 2025 Valentín Thomas Tarantino. All rights reserved.'
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
      <div style={{padding: '20px', background: '#ff4444', color: 'white', textAlign: 'center', fontSize: '24px', fontWeight: 'bold'}}>
        TEST VISIBLE - Si ves esto, Index.jsx se está ejecutando
      </div>
      <Header t={t} language={language} toggleLanguage={toggleLanguage} />
      <Hero t={t} language={language} />
      <About t={t} />
      <Skills t={t} />
      <Testimonials t={t} language={language} />
      <Projects t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </div>
  );
};

export default Index;
