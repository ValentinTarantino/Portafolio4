import goltvImage from '../assets/goltv.webp';
import dolarImage from '../assets/dolar-cover.webp';
import luminaImage from '../assets/ecommerce.webp';
import blogImage from '../assets/blog.webp';
import consorcioImage from '../assets/consorcio.webp';
import turnoImage from '../assets/turnos.webp';
import clipDropImage from '../assets/clipydropy.png';
import chromaFlowImage from '../assets/flow.webp';
import googleKeepImage from '../assets/googlekeep.webp';
import weatherImage from '../assets/clima.webp';

// Update this list to add or edit a project; the channel numbers drive the
// station display and the numbered seal artwork.
const projects = [
  {
    id: 'goltv', number: 1, name: 'GolTV Libre', type: { es: 'Deportes', en: 'Sports' },
    description: {
      es: 'Proyecto para un cliente del sector deportivo: plataforma web gratuita para seguir y ver partidos de fútbol en vivo. Interfaz Neo-Brutalista, reproductor HLS integrado, chat en vivo y cobertura de más de 25 ligas con actualizaciones en tiempo real.',
      en: 'Project for a client in the sports sector: a free web platform to track and watch live football matches. Features a Neo-Brutalist interface, integrated HLS player, live chat, and coverage of 25+ leagues with real-time updates.'
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Docker', 'Jest', 'Testing Library', 'Cypress', 'CI/CD'], image: goltvImage,
    demoUrl: 'https://goltv.onrender.com/', repoUrl: 'https://github.com/ValentinTarantino/GolTV',
    featured: true, arcana: 'VII', signal: 4, available: true, caseStudyKey: 'GolTV'
  },
  {
    id: 'dolararg', number: 2, name: 'DolarARG', type: { es: 'Finanzas', en: 'Finance' },
    description: {
      es: 'Proyecto para un cliente del sector financiero: plataforma fullstack para monitorear cotizaciones del dólar, euro, real y criptomonedas en Argentina en tiempo real. Incluye historial, gráficos, calculadora, sistema de alertas por email, bandas cambiarias del BCRA y funciona como PWA instalable. Corre en AWS (EC2 + RDS) con visual 3D en Three.js y despliegue continuo vía GitHub Actions.',
      en: 'Project for a client in the financial sector: a full-stack platform for monitoring dollar, euro, real, and cryptocurrency exchange rates in Argentina in real time. Includes historical data, charts, a calculator, email alerts, BCRA exchange-rate bands, and installable PWA support. Runs on AWS (EC2 + RDS), features a 3D Three.js visual, and uses continuous delivery via GitHub Actions.'
    },
    stack: ['Next.js', 'TypeScript', 'SASS', 'Prisma', 'PostgreSQL', 'AWS', 'Three.js', 'CI/CD'], image: dolarImage,
    demoUrl: 'https://dolar-arg.duckdns.org/', repoUrl: 'https://github.com/ValentinTarantino/DolarArg',
    featured: true, arcana: 'X', signal: 4, available: true, caseStudyKey: 'DolarARG'
  },
  {
    id: 'lumina-commerce', number: 3, name: 'Lumina Commerce', type: { es: 'E-commerce', en: 'E-commerce' },
    description: {
      es: 'E-commerce de tecnología ultra moderno. Full-stack con Next.js, Python (FastAPI), PostgreSQL y Prisma. Diseño premium con animaciones fluidas y gestión de estado con Zustand.',
      en: 'Ultra-modern tech e-commerce. Full-stack built with Next.js, Python (FastAPI), PostgreSQL, and Prisma. Premium design with fluid animations and Zustand state management.'
    },
    stack: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Prisma', 'Zustand', 'Tailwind CSS', 'Three.js', 'Stripe'], image: luminaImage,
    demoUrl: 'https://lumina-commerce2-1.onrender.com/', repoUrl: 'https://github.com/ValentinTarantino/lumina-commerce2',
    featured: true, arcana: 'IV', signal: 3, available: true, caseStudyKey: 'LuminaCommerce'
  },
  {
    id: 'lucas-blog', number: 4, name: 'Lucas Caudana Blog', type: { es: 'Blog freelance', en: 'Freelance blog' },
    description: {
      es: 'Blog personal freelance para el estudiante de periodismo deportivo Lucas Ezequiel Caudana, con creación y edición de notas con imágenes, modo portfolio con LocalStorage e inicio de sesión con Firebase.',
      en: 'Freelance personal blog for sports journalism student Lucas Ezequiel Caudana, featuring article creation and editing with images, a portfolio mode using LocalStorage, and Firebase login.'
    },
    stack: ['React', 'JavaScript', 'CSS3', 'Bootstrap', 'Firebase'], image: blogImage,
    demoUrl: 'https://lucas-caudana-blog.netlify.app/', repoUrl: 'https://github.com/ValentinTarantino/LucasCaudanaBlog',
    featured: true, arcana: 'XVII', signal: 3, available: true, caseStudyKey: 'LucasCaudanaBlog'
  },
  {
    id: 'consorcios', number: 5, name: { es: 'Administración de consorcios', en: 'Property Management' }, type: { es: 'Landing freelance', en: 'Freelance landing page' },
    description: {
      es: 'Landing page desarrollada como trabajo freelance para una empresa de administración de consorcios. Su objetivo es mejorar la presencia digital, atraer nuevos clientes y ofrecer información clara sobre sus servicios de gestión inmobiliaria.',
      en: 'Freelance landing page developed for a property management company. It aims to improve its digital presence, attract new clients, and clearly present its property-management services.'
    },
    stack: ['React', 'JavaScript', 'CSS3', 'Vite', 'Firebase'], image: consorcioImage,
    demoUrl: 'https://administracionclaudia.com/', repoUrl: 'https://github.com/ValentinTarantino/claudiaconsorcio',
    featured: true, arcana: 'VIII', signal: 4, available: true, caseStudyKey: 'AdministracionConsorcios'
  },
  {
    id: 'turnoapp', number: 6, name: 'TurnoApp', type: { es: 'App de turnos', en: 'Appointment app' },
    description: {
      es: 'App de gestión de turnos pensada para profesionales independientes, con roles de cliente y profesional. En modo cliente permite crear turnos y cancelarlos una vez confirmados; en modo profesional, aceptar, asignar, cancelar y eliminar turnos, gestionar perfiles, recibir notificaciones e iniciar sesión con Google.',
      en: 'Appointment-management app for independent professionals, with Client and Professional roles. Clients can create appointments and cancel them once confirmed; professionals can accept, assign, cancel, and delete appointments, manage profiles, receive notifications, and sign in with Google.'
    },
    stack: ['React', 'JavaScript', 'CSS3', 'Bootstrap', 'PostgreSQL'], image: turnoImage,
    demoUrl: 'https://turno-app1.netlify.app/login', repoUrl: 'https://github.com/ValentinTarantino/TurnoApp',
    featured: true, arcana: 'XIV', signal: 3, available: true, hidden: true, caseStudyKey: 'TurnoApp'
  },
  {
    id: 'clipdrop', number: 7, name: { es: 'ClipyDropy', en: 'ClipyDropy' }, type: { es: 'Pegá el link. Llevate el clip.', en: 'Drop a link. Grab your clip.' },
    description: {
      es: 'Descargador de video y audio para YouTube, TikTok e Instagram. En algunas ocasiones pueden ocurrir bloqueos o restricciones por parte de YouTube.',
      en: 'Video and audio downloader for YouTube, TikTok, and Instagram. In some cases, YouTube may block or restrict downloads.'
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'API'], image: clipDropImage,
    demoUrl: 'https://clipydropy.netlify.app/', repoUrl: 'https://github.com/ValentinTarantino/Youtube-Downloader2.1',
    featured: false, arcana: 'XXI', signal: 3, available: true
  },
  {
    id: 'chromaflow', number: 8, name: 'ChromaFlow', type: { es: 'Herramienta de color', en: 'Color tool' },
    description: {
      es: 'Proyecto freelance para Juan Ramírez. Sitio especializado en la creación de paletas de colores para personalizar CSS, con modos de generación aleatorio, análogo, monocromático, complementario y triádico.',
      en: 'Freelance project for Juan Ramirez: a site for creating color palettes to customize CSS, with random, analogous, monochromatic, complementary, and triadic generation modes.'
    },
    stack: ['React', 'JavaScript', 'CSS3', 'Bootstrap'], image: chromaFlowImage,
    demoUrl: 'https://chromaflow1.netlify.app/', repoUrl: 'https://github.com/ValentinTarantino/ChormaFlow',
    featured: false, arcana: 'XIV', signal: 3, available: true
  },
  {
    id: 'google-keep', number: 9, name: 'Google Keep', type: { es: 'Aplicación de notas', en: 'Notes app' },
    description: {
      es: 'Aplicación réplica de notas de Google Keep, desarrollada en React. Permite crear, editar y eliminar notas. Cuenta con modo oscuro y traducciones al español e inglés. Utiliza LocalStorage para guardar las notas.',
      en: 'Replica of the Google Keep notes app, developed in React. It allows you to create, edit, and delete notes, includes dark mode and English and Spanish translations, and uses LocalStorage to save notes.'
    },
    stack: ['React', 'JavaScript', 'CSS3'], image: googleKeepImage,
    demoUrl: 'https://google-keep-replica.netlify.app/', repoUrl: 'https://github.com/ValentinTarantino/Google-Keep-Replica-',
    featured: false, arcana: 'I', signal: 3, available: true
  },
  {
    id: 'weather-report', number: 10, name: { es: 'Informe meteorológico', en: 'Weather Report' }, type: { es: 'Aplicación meteorológica', en: 'Weather app' },
    description: {
      es: 'Aplicación de informe meteorológico en React. Utiliza una API para obtener datos climáticos en tiempo real desde OpenWeatherMap y gestiona el estado global con Zustand.',
      en: 'Weather report app in React. It uses an API to retrieve real-time weather data from OpenWeatherMap and manages global state with Zustand.'
    },
    stack: ['React', 'JavaScript', 'CSS3', 'API', 'Zustand'], image: weatherImage,
    demoUrl: 'https://weather-report2.netlify.app/', repoUrl: 'https://github.com/ValentinTarantino/Weather',
    featured: false, arcana: 'XIX', signal: 3, available: true
  }
];

export default projects;
