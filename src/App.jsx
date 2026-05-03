import { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
      name: 'Valentín Thomas Tarantino',
      title: 'Desarrollador Fullstack',
      description: 'Desarrollador Full Stack con conocimiento en el desarrollo de aplicaciones web enfocadas en interfaces de usuario intuitivas, atractivas y accesibles. Me gusta aportar soluciones creativas y efectivas.'
    },
    about: {
      title: 'Acerca de mí',
      description: 'Soy programador Full Stack con conocimiento en el desarrollo de aplicaciones web enfocadas en interfaces de usuario intuitivas, atractivas y accesibles. Me gusta aportar soluciones creativas y efectivas para los proyectos en los que participo. Además, valoro mucho el trabajo en equipo y siempre estoy dispuesto a aprender nuevas tecnologías.',
      education: 'Formación Académica',
      currentEducation: 'Formación Actual',
      experienceLabel: 'Año de experiencia',
      projectsLabel: 'Proyectos completados',
      certificationsTitle: 'Certificaciones',
      stackTitle: 'Stack principal',
      certified: 'Certificado',
      certificates: {
        webDev: 'Certificación de desarrollo web',
        javascript: 'Certificación de Javascript',
        react: 'Certificación de React',
        frontend: 'Certificación de Desarrollo Frontend React'
      },
      months: {
        january: 'Enero',
        june: 'Junio'
      }
    },
    skills: {
      title: 'Mi Stack Principal',
      subtitle: 'Tecnologías que domino'
    },
    projects: {
      title: 'Mis Proyectos',
      subtitle: 'Algunos trabajos destacados',
      viewProject: 'Ver Proyecto',
      viewCode: 'Ver Código',
      descriptions: {
        DolarARG: 'Sitio web que muestra los diferentes tipos de dólar en Argentina, la información esta manejada por https://dolarapi.com/docs/',
        todoApp: 'Creación de una aplicación interactiva para gestionar tareas con JavaScript y manipulación del DOM. Implementación de eventos y funciones de orden superior para mejorar la experiencia del usuario.',
        ecommerce: 'Plataforma de comercio electrónico en React para la compra de productos relacionados con el mundo de las computadoras. Implementación de navegación por categorías, detalles de productos, carrito de compras y procesamiento de pedidos.',
        WeatherReport: 'Aplicación de informe meteorológico en React. Utilización de una API para obtener datos climáticos en tiempo real , la información es traida desde https://openweathermap.org/ . Manejo del estado con hooks.',
        googleKeep: 'Aplicación réplica de notas de Google Keep, desarrollada en React. Permite crear, editar y eliminar notas. Cuenta con modo oscuro y traducciones al español e inglés. Utiliza LocalStorage para guardar las notas.',
        Youtube: 'Aplicación en React para descargar videos de YouTube en MP4 y MP3. Requiere ejecutarse localmente porque YouTube bloquea el acceso desde plataformas como Vercel o Netlify. Instrucciones disponibles en el repositorio de GitHub.',
        ChromaFlow: "Proyecto Freelance para Juan Ramirez. Sitio especializado en la creación de paletas de colores para personalizar el CSS, contiene estos modos de generación de colores: Aleatorio, Análoga, Monocromático, Complementario y Triádica",
        LucasCaudanaBlog: "Blog personal Freelance para estudiante de periodismo deportivo Lucas Ezequiel Caudana, con creación y edición de notas con imágenes, modo portafolio con LocalStorage e inicio de sesión con Firebase",
        TurnoApp: "App de gestión de turnos pensada para profesionales independientes, con roles de Cliente y Profesional. En modo cliente permite crear turnos y cancelarlos una vez confirmados, En profesional aceptar, asignar, cancelar y eliminar turnos, gestionar perfiles (en modo profesional permite editarlos), recibir notificaciones y un login con Google.",
        AdministracionConsorcios: "Landing page desarrollada como trabajo freelance para una empresa de administración de consorcios. Su objetivo es mejorar la presencia digital, atraer nuevos clientes y ofrecer información clara sobre sus servicios de gestión inmobiliaria."
      }
    },
    contact: {
      title: 'Contáctame',
      subtitle: '¿Tienes un proyecto en mente?',
      info: {
        email: 'zaheil444@gmail.com',
        phone: '+54 1149476457',
        location: 'Argentina, Buenos Aires'
      },
      labels: {
        phone: 'Teléfono',
        location: 'Ubicación'
      }
    },
    footer: {
      text: 'Este proyecto fue hecho con React'
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
      name: 'Valentín Thomas Tarantino',
      title: 'Fullstack Developer',
      description: 'Full Stack developer with knowledge in developing web applications focused on intuitive, attractive and accessible user interfaces. I like to provide creative and effective solutions.'
    },
    about: {
      title: 'About Me',
      description: 'I am a Full Stack programmer with knowledge in developing web applications focused on intuitive, attractive and accessible user interfaces. I like to provide creative and effective solutions for the projects I participate in. Additionally, I highly value teamwork and I am always willing to learn new technologies.',
      education: 'Academic Background',
      currentEducation: 'Current Education',
      experienceLabel: 'Year of experience',
      projectsLabel: 'Completed projects',
      certificationsTitle: 'Certifications',
      stackTitle: 'Main stack',
      certified: 'Certified',
      certificates: {
        webDev: 'Web development certification',
        javascript: 'Javascript certification',
        react: 'React certification',
        frontend: 'React Frontend Development Certification'
      },
      months: {
        january: 'January',
        june: 'June'
      }
    },
    skills: {
      title: 'My Main Stack',
      subtitle: 'Technologies I master'
    },
    projects: {
      title: 'My Projects',
      subtitle: 'Some featured work',
      viewProject: 'View Project',
      viewCode: 'View Code',
      descriptions: {
        DolarARG: 'Website showing the different types of dollars in Argentina, the information is managed by https://dolarapi.com/docs/',
        todoApp: 'Creation of an interactive application to manage tasks with JavaScript and DOM manipulation. Implementation of events and higher-order functions to enhance user experience.',
        ecommerce: 'E-commerce platform in React for purchasing products related to the computer world. Implementation of category navigation, product details, shopping cart and order processing.',
        WeatherReport: 'Weather report app in React. Using an API to retrieve real-time weather data from https://openweathermap.org/. State management with hooks.',
        googleKeep: 'Replica of the Google Keep notes app, developed in React. Allows you to create, edit, and delete notes. Includes dark mode and translations in Spanish and English. Uses LocalStorage to save the notes.',
        Youtube: 'React app to download YouTube videos in MP4 and MP3. Must be run locally, as YouTube blocks access from platforms like Vercel or Netlify. Instructions available on the GitHub repository.',
        ChromaFlow: "Freelance project for Juan Ramirez. Site specialized in creating color palettes to customize CSS, contains these color generation modes: Random, Analogous, Monochromatic, Complementary and Triadic",
        LucasCaudanaBlog: "Freelance personal blog for sports journalism student Lucas Ezequiel Caudana, featuring note creation and editing with images, portfolio mode using LocalStorage, and Firebase-based login.",
        TurnoApp: "Appointment management app designed for independent professionals, with Client and Professional roles. In client mode, users can create appointments and cancel them once confirmed. In professional mode, users can accept, assign, cancel, and delete appointments, manage profiles (editable in professional mode), receive notifications, and log in with Google.",
        AdministracionConsorcios: "Freelance landing page developed for a property management company. Designed to enhance digital presence, attract new clients, and provide clear information about their real estate management services."
      }
    },
    contact: {
      title: 'Contact Me',
      subtitle: 'Have a project in mind?',
      info: {
        email: 'zaheil444@gmail.com',
        phone: '+54 1149476457',
        location: 'Argentina, Buenos Aires'
      },
      labels: {
        phone: 'Phone',
        location: 'Location'
      }
    },
    footer: {
      text: 'This project was made with React'
    }
  }
};

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
      <Hero t={t} />
      <About t={t} />
      <Skills t={t} />
      <Projects t={t} language={language} />
      <Contact t={t} />
      <Footer t={t} />
    </div>
  );
}

export default App;
