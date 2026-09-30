const es = {
  nav: {
    home: 'Inicio',
    about: 'Acerca de',
    skills: 'Herramientas',
    projects: 'Proyectos',
    testimonials: 'Testimonios',
    contact: 'Contacto'
  },
  hero: {
    greeting: 'Hola, soy',
    name: 'Valentín Thomas Tarantino',
    title: 'Desarrollador Fullstack',
    description: 'Diseño y construyo aplicaciones web robustas y escalables. Especializado en conectar interfaces altamente interactivas, fluidas y optimizadas con arquitecturas de backend eficientes y seguras.',
    downloadCV: 'Ver CV',
    cvModalTitle: 'Mi CV',
    cvDownload: 'Descargar PDF',
    cvClose: 'Cerrar',
    available: 'Disponible para nuevos proyectos'
  },
  onlineNow: 'en línea',
  about: {
    title: 'Acerca de mí',
    description: 'Soy desarrollador Full Stack especializado en crear productos digitales modernos con un enfoque riguroso en la experiencia de usuario, el rendimiento y las buenas prácticas. Con experiencia tanto en proyectos complejos de arquitectura completa como en el desarrollo de soluciones freelance para clientes reales de producción. Me apasiona estructurar bases de datos optimizadas, diseñar APIs fluidas y crear interfaces web intuitivas que añadan valor de negocio tangible. Trabajo respetando la confidencialidad que cada cliente requiere, garantizando la privacidad y seguridad de su información.',
    education: 'Formación Académica',
    currentEducation: 'Formación Actual',
    experienceLabel: 'Años de experiencia',
    projectsLabel: 'Soluciones entregadas',
    cleanCodeLabel: 'Código limpio',
    stackTitle: 'Stack principal',
    certified: 'Certificado',
    months: {
      january: 'Enero',
      june: 'Junio',
      march: 'Marzo',
      august: 'Agosto',
      may: 'Mayo',
      april: 'Abril'
    },
    educationItems: {
      coderhouse: 'Coderhouse',
      frontEndCourse: 'Curso de desarrollo Front End',
      utn: 'Centro de e-Learning, UTN',
      trainingProgram: 'Programa de formación',
      fullStackCareer: 'Carrera de Desarrollador Full Stack',
      aiAutomation: 'AI Automation',
      aiAutomationAdvanced: 'AI Automation (Avanzado)'
    },
    experience: 'Experiencia Profesional',
    present: 'Presente',
    experienceItems: {
      bindin: {
        role: 'Full Stack Developer',
        company: 'Bindin.gg',
        location: 'Remoto, Argentina',
        bullets: [
          'Contribuí al backend (Node.js + Express.js) de una plataforma con más de 50.000 usuarios activos.',
          'Detecté y resolví un cuello de botella en el dashboard por una foreign key sin indexar: -82% en tiempo de respuesta (de 3.9s a <0.9s).',
          'Automaticé el pipeline de CI/CD, reduciendo los pasos manuales de despliegue de 6 a 2.',
          'Construí interfaces con Next.js y TypeScript, y participé en code reviews del equipo.',
          'Sumé tests unitarios con Jest y tests E2E con Cypress al pipeline de CI/CD, cubriendo los flujos críticos (auth, dashboard, alertas) y reduciendo los fallos detectados en producción.'
        ]
      },
      freelance: {
        role: 'Full Stack Developer',
        company: 'Freelance / Independiente',
        location: 'Remoto',
        note: '(Pausado enero–agosto 2026 mientras trabajé en Bindin.gg)',
        bullets: [
          'Entregué proyectos de punta a punta como desarrollador único: relevamiento, arquitectura, desarrollo y despliegue.',
          'Optimicé el rendimiento con code splitting, lazy loading e imágenes optimizadas: +31% en velocidad de carga.',
          'Diseñé APIs RESTful con autenticación JWT e integré servicios de terceros.',
          'Gestión integral de proyectos y comunicación directa en inglés con clientes internacionales.'
        ]
      }
    },
    softSkillsTitle: 'Habilidades Blandas',
    softSkills: [
      'Comunicación asertiva',
      'Gestión de proyectos',
      'Autogestión',
      'Resolución de problemas'
    ]
  },
  skills: {
    title: 'Mi Stack Principal',
    subtitle: 'Tecnologías que domino',
    categories: {
      frontend: 'Dominio Frontend',
      backend: 'Backend y Cloud',
      tools: 'Herramientas, DevOps y Testing',
      ai: 'Inteligencia Artificial'
    }
  },
  projects: {
    title: 'Mis Proyectos',
    subtitle: 'Algunos trabajos destacados',
    viewProject: 'Ver Proyecto',
    viewCode: 'Ver Código',
    filterFeatured: 'Destacados',
    filterAll: 'Todos los Proyectos',
    viewCaseStudy: 'Caso de Estudio ',
    caseStudyBadge: 'Caso de Estudio',
    showMore: 'Ver más',
    showLess: 'Ver menos',
    close: 'Cerrar',
    technicalDetails: 'Detalles Técnicos',
    challengeLabel: 'El Desafío',
    solutionLabel: 'Solución y Arquitectura',
    metricsLabel: 'Resultados e Impacto',
    descriptions: {
      GolTV: 'Trabajo freelance para un cliente del sector deportivo. GolTV es una plataforma web gratuita para seguir y ver partidos de fútbol en vivo. Interfaz Neo-Brutalista, reproductor HLS integrado, chat en vivo y cobertura de más de 25 ligas con actualizaciones en tiempo real.',
      DolarARG: 'Proyecto independiente para un cliente del sector financiero. DolarARG es una plataforma fullstack para monitorear cotizaciones del dólar, euro, real y criptomonedas en Argentina en tiempo real. Incluye historial, gráficos, calculadora, sistema de alertas por email, bandas cambiarias del BCRA y funciona como PWA instalable. Datos actualizados cada 5 minutos con backend serverless en Vercel.',
      todoApp: 'Creación de una aplicación interactiva para gestionar tareas con JavaScript y manipulación del DOM. Implementación de eventos y funciones de orden superior para mejorar la experiencia del usuario.',
      WeatherReport: 'Aplicación de informe meteorológico en React. Utilización de una API para obtener datos climáticos en tiempo real, la información es traida desde https://openweathermap.org/. Manejo del estado global con Zustand.',
      googleKeep: 'Aplicación réplica de notas de Google Keep, desarrollada en React. Permite crear, editar y eliminar notas. Cuenta con modo oscuro y traducciones al español e inglés. Utiliza LocalStorage para guardar las notas.',
      ClipDrop: 'Descargador de videos optimizado para TikTok. Nota: el soporte para YouTube e Instagram se encuentra pausado por restricciones técnicas de esas plataformas.',
      LuminaCommerce: 'E-commerce de tecnología ultra moderno. Full-stack con Next.js, Python (FastAPI), PostgreSQL y Prisma. Diseño premium con animaciones fluidas y gestión de estado con Zustand.',
      ChromaFlow: 'Proyecto Freelance para Juan Ramirez. Sitio especializado en la creación de paletas de colores para personalizar el CSS, contiene estos modos de generación de colores: Aleatorio, Análoga, Monocromático, Complementario y Triádica',
      LucasCaudanaBlog: 'Blog personal Freelance para estudiante de periodismo deportivo Lucas Ezequiel Caudana, con creación y edición de notas con imágenes, modo portafolio con LocalStorage e inicio de sesión con Firebase',
      TurnoApp: 'App de gestión de turnos pensada para profesionales independientes, con roles de Cliente y Profesional. En modo cliente permite crear turnos y cancelarlos una vez confirmados, En profesional aceptar, asignar, cancelar y eliminar turnos, gestionar perfiles (en modo profesional permite editarlos), recibir notificaciones y un login con Google.',
      AdministracionConsorcios: 'Landing page desarrollada como trabajo freelance para una empresa de administración de consorcios. Su objetivo es mejorar la presencia digital, atraer nuevos clientes y ofrecer información clara sobre sus servicios de gestión inmobiliaria.'
    },
    caseStudies: {
      tabs: {
        overview: 'Resumen ',
        architecture: 'Arquitectura '
      },
      GolTV: {
        challenge: 'Encargo freelance de un cliente del sector deportivo. Desarrollar una plataforma de streaming deportivo en tiempo real que pueda manejar múltiples transmisiones HLS, estados en vivo, y un chat concurrente, manteniendo una interfaz rápida, bilingüe y optimizada para SEO.',
        solution: 'Arquitectura frontend robusta con Next.js 16 (App Router) y React 19. Integración de Hls.js para reproducción de video fluida y Tailwind CSS v4 para un diseño Neo-Brutalista. Se implementó auto-refresh inteligente de marcadores, persistencia de scroll y un chat con smart scroll. Entorno dockerizado y testeado con Jest, Testing Library y Cypress (E2E).',
        metrics: 'Soporte para más de 25 ligas globales, transmisiones estables y una experiencia de usuario altamente interactiva y bilingüe.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 16 + React 19', desc: 'App Router, TypeScript, Neo-Brutalism' },
          { title: 'Video & UI', tech: 'Hls.js + Tailwind v4', desc: 'HLS Streams, Tailwind CSS, Lucide' },
          { title: 'Testing & DevOps', tech: 'Jest + Cypress + Docker', desc: 'RTL, E2E, Docker Compose, CI/CD' }
        ]
      },
      LuminaCommerce: {
        challenge: 'Diseñar y desplegar una plataforma de comercio electrónico de alta fidelidad que mantenga un rendimiento óptimo de carga (<1.5s) mientras maneja consultas relacionales complejas y control de estados persistentes del cliente en tiempo real.',
        solution: 'Arquitectura desacoplada de alto rendimiento. En el frontend se usó Next.js 14 (App Router) optimizado con SSR/ISR y Zustand para un carrito reactivo de persistencia local. En el backend, un microservicio de FastAPI en Python proporciona endpoints asíncronos y robustos respaldados por PostgreSQL, usando Prisma como ORM para transacciones relacionales rápidas y seguras.',
        metrics: 'Tiempo de respuesta del servidor reducido en un 40% y rendimiento de frontend optimizado.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 14 + Zustand', desc: 'React, Tailwind, Estado local' },
          { title: 'API', tech: 'FastAPI (Python)', desc: 'Endpoints asíncronos REST' },
          { title: 'Base de Datos', tech: 'PostgreSQL + Prisma', desc: 'DB Relacional, ORM, Transacciones' }
        ]
      },
      TurnoApp: {
        challenge: 'Crear un SaaS de reserva de turnos en tiempo real para profesionales autónomos que prevenga colisiones de horarios, ofrezca roles de usuario diferenciados y maneje cancelaciones tardías de forma segura.',
        solution: 'Sistema multi-rol (Cliente/Profesional) robusto. Implementación de control transaccional estricto en PostgreSQL para evitar duplicados en la asignación de turnos. Autenticación unificada con Google Firebase y panel administrativo completo en React que permite la gestión proactiva de perfiles y confirmaciones.',
        metrics: 'Prevención del 100% en colisiones de reserva de citas y gestión fluida de hasta decenas de agendas simultáneas.',
        architectureNodes: [
          { title: 'Cliente Web', tech: 'React + Bootstrap', desc: 'SPA, Manejo de estado' },
          { title: 'Autenticación', tech: 'Firebase Auth', desc: 'Google Sign-in, JWT' },
          { title: 'Backend / BD', tech: 'Supabase / PostgreSQL', desc: 'Row Level Security, Transacciones' }
        ]
      },
      LucasCaudanaBlog: {
        challenge: 'Desarrollar un blog de periodismo dinámico y visualmente atractivo que requería un CMS intuitivo para la publicación de notas multimedia y un portafolio de artículos persistente sin costos de servidor elevados.',
        solution: 'Integración Serverless y NoSQL. Frontend responsivo desarrollado en React acoplado con Firebase Firestore y Storage para una gestión ágil de contenidos dinámicos (creación, edición y eliminación de notas con fotos). El portafolio de lectura utiliza almacenamiento local persistente para guardar favoritos offline.',
        metrics: 'Despliegue y administración de contenido costo-cero ($0 USD/mes) y velocidad de respuesta de Firestore instantánea (<100ms).',
        architectureNodes: [
          { title: 'Frontend App', tech: 'React', desc: 'React Router, LocalStorage' },
          { title: 'Base de Datos', tech: 'Firestore', desc: 'NoSQL Documental, Tiempo real' },
          { title: 'Almacenamiento', tech: 'Firebase Storage', desc: 'Hosting de imágenes, CDN' }
        ]
      },
      AdministracionConsorcios: {
        challenge: 'Digitalizar la presencia de una empresa tradicional de administración de consorcios, atrayendo nuevos clientes de alto perfil mediante una landing page moderna, rápida y con un canal de contacto directo y confiable.',
        solution: 'Desarrollo de una Landing Page premium optimizada en velocidad y SEO usando React, Vite y CSS personalizado de alta fidelidad. Se incorporó una integración limpia con Firebase para el ruteo dinámico y una sección de contacto fluida diseñada para maximizar el ratio de conversión (CTR).',
        metrics: 'Aumento del 35% en la tasa de contacto y calificación perfecta (100/100) en accesibilidad y buenas prácticas SEO de Lighthouse.',
        architectureNodes: [
          { title: 'Landing Page', tech: 'Vite + React', desc: 'Performance, SEO Optimization' },
          { title: 'Estilos', tech: 'CSS Modules', desc: 'Diseño responsive de alta fidelidad' },
          { title: 'Hosting & Routing', tech: 'Firebase Hosting', desc: 'Despliegue global, SSL' }
        ]
      },
      DolarARG: {
        challenge: 'Proyecto por encargo para un cliente del sector financiero. Construir una plataforma financiera en tiempo real que maneje múltiples fuentes de datos (dólar, euro, real, criptomonedas), mantenga histórico de cotizaciones, envíe alertas automáticas por email y funcione como PWA instalable, todo con actualizaciones cada 5 minutos sin servidor dedicado.',
        solution: 'Arquitectura serverless fullstack con Next.js 14. Backend: API routes serverless en Vercel con Prisma ORM sobre PostgreSQL para persistencia de datos cronológicos, sistema de cron jobs para scraping automatizado desde dolarapi.com, y Server-Sent Events (SSE) para actualización en tiempo real del frontend. Sistema de alertas con nodemailer. Frontend: PWA con manifiesto, service worker y manifest para instalación nativa.',
        metrics: 'Actualización automática cada 5 minutos de 8+ tipos de cotizaciones, sistema de alertas con envío de emails en tiempo real, y funcionalidad PWA con instalación en Android/iOS sin tiendas de aplicaciones.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 14 + PWA', desc: 'SSR, TypeScript, Tailwind, PWA Manifest' },
          { title: 'Backend', tech: 'API Routes Serverless', desc: 'Cron jobs, SSE, node-cron, Vercel' },
          { title: 'Base de Datos', tech: 'PostgreSQL + Prisma', desc: 'ORM, Modelos DolarRate, Alertas' },
          { title: 'Notificaciones', tech: 'Nodemailer + SSE', desc: 'Email alerts, EventSource real-time' }
        ]
      }
    }
  },
  testimonials: {
    title: 'Testimonios',
    subtitle: 'Lo que dicen quienes trabajaron conmigo'
  },
  contact: {
    title: 'Contáctame',
    subtitle: '¿Tienes un proyecto en mente?',
    info: {
      email: 'valentinthomastarantino@gmail.com',
      phone: '+54 11 4947-6457',
      location: 'Argentina, Buenos Aires'
    },
    labels: {
      phone: 'Teléfono',
      location: 'Ubicación'
    },
    form: {
      namePlaceholder: 'Tu nombre completo',
      emailPlaceholder: 'tu@email.com',
      messagePlaceholder: 'Contame sobre tu proyecto...',
      nameLabel: 'Nombre',
      emailLabel: 'Email',
      messageLabel: 'Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      successTitle: '¡Mensaje enviado!',
      successText: 'Te responderé a la brevedad. ¡Gracias!',
      errorTitle: 'Error al enviar',
      errorText: 'Algo salió mal. Intentalo de nuevo o escribime directo al email.',
      nameRequired: 'El nombre es requerido',
      emailRequired: 'El email es requerido',
      emailInvalid: 'El email no es válido',
      messageRequired: 'El mensaje es requerido',
      messageMinLength: 'El mensaje debe tener al menos 10 caracteres'
    }
  },
  footer: {
    cta: '¿Trabajamos juntos?',
    subtitle: 'Construyamos algo increíble juntos',
    tagline: 'Desarrollador Full Stack especializado en crear experiencias digitales excepcionales.',
    navigation: 'Navegación',
    madeWith: 'Hecho con',
    backToTop: 'Volver arriba',
    copyright: '© 2026 Valentín Thomas Tarantino. Todos los derechos reservados.',
    available: 'Disponible para nuevas oportunidades'
  }
};

export default es;
