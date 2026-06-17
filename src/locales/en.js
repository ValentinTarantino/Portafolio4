const en = {
  nav: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    testimonials: 'Testimonials',
    contact: 'Contact'
  },
  hero: {
    greeting: 'Hi, I am',
    name: 'Valentín Thomas Tarantino',
    title: 'Fullstack Developer',
    description: 'I design and build robust, scalable web applications. Specialized in bridging highly interactive, fluid, and optimized user interfaces with efficient and secure backend architectures.',
    downloadCV: 'Download CV',
    available: 'Available for new projects'
  },
  about: {
    title: 'About Me',
    description: 'I am a Full Stack developer specialized in building modern digital products with a rigorous focus on user experience, performance, and best practices. Experienced in both complex full-stack architectures and delivering freelance solutions for production-grade real clients. I am passionate about structuring optimized databases, designing fluid APIs, and creating intuitive interfaces that add tangible business value.',
    education: 'Academic Background',
    currentEducation: 'Current Education',
    experienceLabel: 'Years of experience',
    projectsLabel: 'Solutions delivered',
    cleanCodeLabel: 'Clean code',
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
      june: 'June',
      march: 'March',
      august: 'August'
    },
    educationItems: {
      coderhouse: 'Coderhouse',
      frontEndCourse: 'Front End Development Course',
      utn: 'e-Learning Center, UTN',
      trainingProgram: 'Training Program'
    }
  },
  skills: {
    title: 'My Main Stack',
    subtitle: 'Technologies I master',
    categories: {
      frontend: 'Frontend Mastery',
      backend: 'Backend & Cloud',
      tools: 'Design & DevTools',
      ai: 'Artificial Intelligence'
    }
  },
  projects: {
    title: 'My Projects',
    subtitle: 'Some featured work',
    viewProject: 'View Project',
    viewCode: 'View Code',
    filterFeatured: 'Featured ',
    filterAll: 'All Projects ',
    viewCaseStudy: 'Case Study ',
    caseStudyBadge: 'Case Study',
    showMore: 'Show more',
    showLess: 'Show less',
    close: 'Close',
    technicalDetails: 'Technical Details',
    challengeLabel: 'The Challenge',
    solutionLabel: 'Solution & Architecture',
    metricsLabel: 'Results & Impact',
    descriptions: {
      DolarARG: 'Fullstack platform for monitoring dollar, euro, real and cryptocurrency exchange rates in Argentina in real-time. Includes historical data, charts, calculator, email alert system, BCRA exchange rate bands, and works as an installable PWA. Data updated every 5 minutes with serverless backend on Vercel.',
      todoApp: 'Creation of an interactive application to manage tasks with JavaScript and DOM manipulation. Implementation of events and higher-order functions to enhance user experience.',
      WeatherReport: 'Weather report app in React. Using an API to retrieve real-time weather data from https://openweathermap.org/. Global state management with Zustand.',
      googleKeep: 'Replica of the Google Keep notes app, developed in React. Allows you to create, edit, and delete notes. Includes dark mode and translations in Spanish and English. Uses LocalStorage to save the notes.',
      ClipDrop: 'High-performance video downloader optimized for TikTok. YouTube and Instagram support is currently restricted due to platform updates.',
      LuminaCommerce: 'Ultra-modern tech E-commerce. Full-stack built with Next.js, Python (FastAPI), PostgreSQL, and Prisma. Premium design with fluid animations and Zustand state management.',
      ChromaFlow: 'Freelance project for Juan Ramirez. Site specialized in creating color palettes to customize CSS, contains these color generation modes: Random, Analogous, Monochromatic, Complementary and Triadic',
      LucasCaudanaBlog: 'Freelance personal blog for sports journalism student Lucas Ezequiel Caudana, featuring note creation and editing with images, portfolio mode using LocalStorage, and Firebase-based login.',
      TurnoApp: 'Appointment management app designed for independent professionals, with Client and Professional roles. In client mode, users can create appointments and cancel them once confirmed. In professional mode, users can accept, assign, cancel, and delete appointments, manage profiles (editable in professional mode), receive notifications, and log in with Google.',
      AdministracionConsorcios: 'Freelance landing page developed for a property management company. Designed to enhance digital presence, attract new clients, and provide clear information about their real estate management services.'
    },
      caseStudies: {
      tabs: {
        overview: 'Overview ',
        architecture: 'Architecture '
      },
      LuminaCommerce: {
        challenge: 'Design and deploy a high-fidelity e-commerce platform that maintains optimal load performance (<1.5s) while handling complex relational queries and real-time client persistent state management.',
        solution: 'High-performance decoupled architecture. Next.js 14 (App Router) was used in the frontend, optimized with SSR/ISR and Zustand for reactive local persistence cart. In the backend, a Python FastAPI microservice provides robust asynchronous endpoints backed by PostgreSQL, using Prisma as ORM for safe, fast relational transactions.',
        metrics: 'Server response time reduced by 40% and optimized frontend performance.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 14 + Zustand', desc: 'React, Tailwind, Local State' },
          { title: 'API', tech: 'FastAPI (Python)', desc: 'Async REST Endpoints' },
          { title: 'Database', tech: 'PostgreSQL + Prisma', desc: 'Relational DB, ORM, Transactions' }
        ]
      },
      TurnoApp: {
        challenge: 'Create a real-time SaaS booking system for independent professionals that prevents scheduling collisions, offers distinct user roles, and handles late cancellations securely.',
        solution: 'Robust multi-role (Client/Professional) system. Strict database transaction controls implemented in PostgreSQL to prevent double-booking. Sychronized authentication with Google Firebase and a complete dashboard in React to manage profiles and confirmations.',
        metrics: '100% success rate in booking collision prevention and seamless management of dozens of schedules simultaneously.',
        architectureNodes: [
          { title: 'Web Client', tech: 'React + Bootstrap', desc: 'SPA, State Management' },
          { title: 'Authentication', tech: 'Firebase Auth', desc: 'Google Sign-in, JWT' },
          { title: 'Backend / DB', tech: 'Supabase / PostgreSQL', desc: 'Row Level Security, Transactions' }
        ]
      },
      LucasCaudanaBlog: {
        challenge: 'Develop a dynamic and visually engaging sports journalism blog requiring an intuitive CMS for publishing rich multimedia articles and article saving without high server maintenance costs.',
        solution: 'Serverless and NoSQL integration. Responsive frontend built with React coupled with Firebase Firestore and Cloud Storage for active dynamic content management (adding, editing, and deleting articles with images). The article portfolio uses persistent local storage for offline favorites saving.',
        metrics: 'Zero-cost content hosting and administration ($0 USD/month) and instant Firestore response times (<100ms).',
        architectureNodes: [
          { title: 'Frontend App', tech: 'React', desc: 'React Router, LocalStorage' },
          { title: 'Database', tech: 'Firestore', desc: 'NoSQL Document, Real-time' },
          { title: 'Storage', tech: 'Firebase Storage', desc: 'Image Hosting, CDN' }
        ]
      },
      AdministracionConsorcios: {
        challenge: 'Digitally transform a traditional property management firm, attracting high-profile clients through a fast, modern, and reliable landing page with a direct communication channel.',
        solution: 'Developed a premium landing page optimized for speed and SEO using React, Vite, and high-fidelity custom CSS. Built clean Firebase routing integration and a highly responsive contact section designed to maximize conversion rates (CTR).',
        metrics: '35% increase in lead generation contact rate and a perfect (100/100) Lighthouse rating in accessibility and SEO best practices.',
        architectureNodes: [
          { title: 'Landing Page', tech: 'Vite + React', desc: 'Performance, SEO Optimization' },
          { title: 'Styles', tech: 'CSS Modules', desc: 'High-fidelity responsive design' },
          { title: 'Hosting & Routing', tech: 'Firebase Hosting', desc: 'Global Deployment, SSL' }
        ]
      },
      DolarARG: {
        challenge: 'Build a real-time financial platform handling multiple data sources (dollar, euro, real, cryptocurrencies), maintaining historical exchange rates, sending automated email alerts, and working as an installable PWA, all with updates every 5 minutes without a dedicated server.',
        solution: 'Fullstack serverless architecture with Next.js 14. Backend: Serverless API routes on Vercel with Prisma ORM over PostgreSQL for chronological data persistence, cron job system for automated scraping from dolarapi.com, and Server-Sent Events (SSE) for real-time frontend updates. Alert system with nodemailer. Frontend: PWA with manifest, service worker and manifest for native installation.',
        metrics: 'Automatic updates every 5 minutes for 8+ exchange rate types, alert system with real-time email delivery, and PWA functionality with installation on Android/iOS without app stores.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 14 + PWA', desc: 'SSR, TypeScript, Tailwind, PWA Manifest' },
          { title: 'Backend', tech: 'Serverless API Routes', desc: 'Cron jobs, SSE, node-cron, Vercel' },
          { title: 'Database', tech: 'PostgreSQL + Prisma', desc: 'ORM, DolarRate Models, Alerts' },
          { title: 'Notifications', tech: 'Nodemailer + SSE', desc: 'Email alerts, EventSource real-time' }
        ]
      }
    }
  },
  testimonials: {
    title: 'Testimonials',
    subtitle: 'What people I worked with say'
  },
  contact: {
    title: 'Contact Me',
    subtitle: 'Have a project in mind?',
    info: {
      email: 'valentinthomastarantino@gmail.com',
      phone: '+54 1149476457',
      location: 'Argentina, Buenos Aires'
    },
    labels: {
      phone: 'Phone',
      location: 'Location'
    },
    form: {
      namePlaceholder: 'Your full name',
      emailPlaceholder: 'you@email.com',
      messagePlaceholder: 'Tell me about your project...',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      successTitle: 'Message sent!',
      successText: "I'll get back to you shortly. Thank you!",
      errorTitle: 'Failed to send',
      errorText: 'Something went wrong. Try again or email me directly.',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is not valid',
      messageRequired: 'Message is required',
      messageMinLength: 'Message must be at least 10 characters'
    }
  },
  footer: {
    cta: 'Shall we work together?',
    copyright: '© 2026 Valentín Thomas Tarantino. All rights reserved.',
    available: 'Available for new opportunities'
  }
};

export default en;
