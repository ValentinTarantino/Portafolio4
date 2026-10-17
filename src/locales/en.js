const en = {
  nav: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    capabilities: 'Capabilities',
    contact: 'Contact'
  },
  hero: {
    greeting: 'Hi, I am',
    name: 'Valentín Thomas Tarantino',
    title: 'Fullstack Developer',
    description: 'I design and build robust, scalable web applications. Specialized in bridging highly interactive, fluid, and optimized user interfaces with efficient and secure backend architectures.',
    descriptionShort: 'I build robust web apps, connecting interactive interfaces with efficient backends.',
    downloadCV: 'Download CV',
    available: 'Available for new projects'
  },
  about: {
    onlineLabel: 'Online',
    profileLabel: 'Developer profile',
    identityHeadline: 'Full Stack',
    profileRole: 'Developer',
    profileStatement: 'Solid architecture. Simple experiences.',
    title: 'About Me',
    description: 'I have worked on complete application architectures and production freelance projects. I combine a focus on user experience, performance, and solid engineering practices with optimized databases, fluid APIs, and intuitive interfaces that deliver tangible business value.',
    education: 'Academic Background',
    currentEducation: 'Current Education',
    experienceLabel: 'Years of experience',
    projectsLabel: 'Solutions delivered',
    cleanCodeLabel: 'Clean code',
    stats: {
      users: 'active users',
      latency: 'latency reduction',
      deployments: 'deployment steps',
      years: 'years of experience'
    },
    stackTitle: 'Main stack',
    certified: 'Certified',
    months: {
      january: 'January',
      june: 'June',
      march: 'March',
      august: 'August',
      may: 'May',
      april: 'April'
    },
    educationItems: {
      coderhouse: 'Coderhouse',
      frontEndCourse: 'Front End Development Course',
      utn: 'e-Learning Center, UTN',
      trainingProgram: 'Training Program',
      fullStackCareer: 'Full Stack Developer Career',
      aiAutomation: 'AI Automation',
      aiAutomationAdvanced: 'AI Automation (Advanced)'
    },
    experience: 'Professional Experience',
    present: 'Present',
    experienceItems: {
      bindin: {
        role: 'Full Stack Developer',
        company: 'Bindin.gg',
        location: 'Remote, Argentina',
        bullets: [
          'Contributed to the backend (Node.js + Express.js) of a platform with 50,000+ active users.',
          'Diagnosed and fixed a dashboard bottleneck caused by an unindexed foreign key: -82% response time (3.9s → <0.9s).',
          'Automated the CI/CD pipeline, cutting manual release steps from 6 to 2.',
          'Built interfaces with Next.js and TypeScript, and took part in the team\'s code reviews.'
        ]
      },
      freelance: {
        role: 'Full Stack Developer',
        company: 'Freelance / Independent',
        location: 'Remote',
        note: '(Paused January–August 2026 while at Bindin.gg)',
        bullets: [
          'Delivered end-to-end client projects as a solo developer: requirements, architecture, development, and deployment.',
          'Optimized performance with code splitting, lazy loading, and image optimization: +31% load speed.',
          'Designed RESTful APIs with JWT authentication and integrated third-party services.',
          'Managed full project lifecycles with fluent English communication for international clients.'
        ]
      }
    },
    softSkillsTitle: 'Soft Skills',
    timelineTitle: 'My Career Journey',
    softSkills: [
      'Assertive communication',
      'Project management',
      'Attention to detail',
      'Problem solving'
    ]
  },
  skills: {
    listLabel: 'Tools',
    title: 'Technologies in context',
    subtitle: 'Tools I have used across real projects, grouped by area.',
    categories: {
      frontend: 'Frontend & UI',
      frontendDescription: 'Interfaces, state, and 3D experiences',
      backend: 'Backend, DB & Cloud',
      backendDescription: 'APIs, data, and infrastructure',
      tools: 'Quality & Workflow',
      toolsDescription: 'Testing, CI/CD, and development tools',
      ai: 'AI & Automation',
      aiDescription: 'Assistants and automated workflows'
    }
  },
  projects: {
    title: 'My Projects',
    transmission: {
      station: 'MONITORING STATION', channel: 'CHANNEL', file: 'FILE NO.',
      signalStatus: 'SIGNAL STATUS', strong: 'STRONG', stable: 'STABLE', unstable: 'UNSTABLE',
      noSignal: 'NO SIGNAL', night: 'NIGHT', darkHour: 'DARK HOUR',
      noAnomalies: 'NO ANOMALIES', tartarusDetected: 'TARTARUS SIGNAL DETECTED', interference: 'INTERFERENCE',
      rec: 'REC', demo: 'View demo', code: 'Code', bars: 'bars', channelList: 'Project channel list',
      stack: 'Technology stack', terminalAccess: 'DEVELOPER TERMINAL',
      terminalDescription: 'Run commands, explore the portfolio, and learn more about my work.',
      terminalOpen: 'OPEN TERMINAL', terminalClose: 'CLOSE TERMINAL',
      stationOffline: 'STATION OFFLINE', powerStandby: 'SYSTEM STANDBY',
      stationPowerOn: 'POWER ON STATION', stationPowerOff: 'POWER OFF STATION',
      powerHint: 'Press the power button to start monitoring.',
      preview: 'Screenshot of {name}', featured: 'Featured',
      channelUnavailable: 'This channel has no available signal yet.'
    },
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
      GolTV: 'Project for a client in the sports sector: a free web platform to track and watch live football matches. Features a Neo-Brutalist interface, integrated HLS player, live chat, and coverage of 25+ leagues with real-time updates.',
      DolarARG: 'Project for a client in the financial sector: a fullstack platform for monitoring dollar, euro, real and cryptocurrency exchange rates in Argentina in real time. Includes historical data, charts, calculator, email alert system, BCRA exchange rate bands, and works as an installable PWA. Runs on AWS (EC2 + RDS) with a Three.js 3D visual and continuous delivery via GitHub Actions.',
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
      GolTV: {
        challenge: 'Develop a real-time sports streaming platform capable of handling multiple HLS streams, live states, and concurrent chat while maintaining a fast, bilingual, and SEO-optimized interface.',
        solution: 'Robust frontend architecture using Next.js 16 (App Router) and React 19. Integrated Hls.js for smooth video playback and Tailwind CSS v4 for a Neo-Brutalist design. Implemented smart scoreboard auto-refresh, scroll restoration, and a chat with smart scroll. Containerized with Docker and tested using Jest, Testing Library and Cypress (E2E).',
        metrics: 'Support for 25+ global leagues, stable streams, and a highly interactive, bilingual user experience.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 16 + React 19', desc: 'App Router, TypeScript, Neo-Brutalism' },
          { title: 'Video & UI', tech: 'Hls.js + Tailwind v4', desc: 'HLS Streams, Tailwind CSS, Lucide' },
          { title: 'Testing & DevOps', tech: 'Jest + Cypress + Docker', desc: 'RTL, E2E, Docker Compose, CI/CD' }
        ]
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
        challenge: 'Build a real-time financial platform handling multiple data sources (dollar, euro, real, cryptocurrencies), maintaining historical exchange rates, sending automated email alerts, and working as an installable PWA, all with updates every 5 minutes and continuous deployments without manual intervention.',
        solution: 'Fullstack architecture on AWS with Next.js 14. Backend: Amazon EC2 with PM2 keeping the Next.js process running, Amazon RDS (PostgreSQL) with Prisma ORM for chronological data persistence inside a VPC with security groups (the database is not publicly exposed), cron job system for automated scraping from dolarapi.com, and Server-Sent Events (SSE) for real-time frontend updates. Alert system with nodemailer. Frontend: installable PWA with a Three.js 3D dollar symbol visual. Continuous delivery with GitHub Actions (SSH into EC2, build, Prisma migrations and PM2 restart) and DuckDNS domain.',
        metrics: 'Automatic updates every 5 minutes for 8+ exchange rate types, alert system with real-time email delivery, and PWA functionality with installation on Android/iOS without app stores. AWS infrastructure with automated CI/CD.',
        architectureNodes: [
          { title: 'Frontend', tech: 'Next.js 14 + Three.js', desc: 'SSR, TypeScript, PWA, 3D dollar visual' },
          { title: 'Backend', tech: 'Amazon EC2 + PM2', desc: 'Cron jobs, SSE, alerts with nodemailer' },
          { title: 'Database', tech: 'Amazon RDS + Prisma', desc: 'Managed PostgreSQL, VPC and security groups' },
          { title: 'Deploy', tech: 'GitHub Actions + DuckDNS', desc: 'SSH CI/CD, domain and deployments' }
        ]
      }
    }
  },
  capabilities: {
    title: 'Capabilities',
    intro: 'Four ways to turn an idea into a useful, clear, and memorable digital experience.',
    indexLabel: 'Capabilities index',
    items: {
      frontend: { title: 'Interfaces & Frontend', description: 'One interface reorganizes itself to fit the available space without losing hierarchy or clarity.' },
      motion: { title: 'Motion & Interaction', description: 'Type, timing, and cursor response guide attention without interrupting the reading flow.' },
      threeD: { title: '3D & Immersive Web', description: 'A 3D card cycles through Persona 3 arcana, revealing both sides with every turn.' },
      fullStack: { title: 'Full Stack Development', description: 'Two playable games: the dinosaur responds to keyboard and touch, and tateti offers local, online, and AI matches.' }
    },
    viewportLabel: 'Viewport size',
    devices: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' },
    sampleLinks: 'WORK   STUDIO   CONTACT',
    sampleMenu: 'Sample menu',
    sampleTag: 'DIGITAL STUDIO — BUENOS AIRES',
    sampleHeadline: 'Design finds its shape.',
    sampleDescription: 'A clear experience, from desktop to the palm of your hand.',
    sampleButton: 'See approach',
    sampleFooter: 'DIGITAL EXPERIENCES',
    motionKicker: 'INTERACTION / 002',
    motionHeadline: 'Move with intent.',
    motionDescription: 'Every transition supports an action and makes change visible.',
    replay: 'Replay demo',
    threeHeadline: 'Arcana in rotation.',
    threeDescription: 'The card turns on its own through Persona 3 arcana, alternating between the front and back.',
    arcanaKicker: 'CURRENT ARCANA',
    arcanaDetails: [
      { roman: '0', title: 'The Fool', description: 'The first step into the unknown: freedom, momentum, and open possibilities.' },
      { roman: 'I', title: 'The Magician', description: 'Will and initiative turn ideas into action.' },
      { roman: 'II', title: 'The Priestess', description: 'Intuition and patience reveal what remains hidden.' },
      { roman: 'III', title: 'The Empress', description: 'Creativity and care make growth possible.' },
      { roman: 'IV', title: 'The Emperor', description: 'Order and resolve build on solid foundations.' },
      { roman: 'V', title: 'The Hierophant', description: 'Learning and tradition offer guidance along the way.' },
      { roman: 'VI', title: 'The Lovers', description: 'Relationships and choices reveal what matters to us.' },
      { roman: 'VII', title: 'The Chariot', description: 'Move forward with focus and discipline amid opposing forces.' },
      { roman: 'VIII', title: 'Justice', description: 'Balance and responsibility shape every choice.' },
      { roman: 'IX', title: 'The Hermit', description: 'Pause to seek clarity and answers within.' },
      { roman: 'X', title: 'Fortune', description: 'Cycles turn; adapting makes room for new opportunities.' },
      { roman: 'XI', title: 'Strength', description: 'Quiet courage guides instinct with compassion.' },
      { roman: 'XII', title: 'The Hanged Man', description: 'A new perspective and a pause can bring understanding.' },
      { roman: 'XIII', title: 'Death', description: 'Closing one chapter makes room for transformation.' },
      { roman: 'XIV', title: 'Temperance', description: 'Bring opposites together with patience and find harmony.' },
      { roman: 'XV', title: 'The Devil', description: 'Recognize the desires and patterns that limit freedom.' },
      { roman: 'XVI', title: 'The Tower', description: 'When unstable structures fall, what can be rebuilt becomes clear.' },
      { roman: 'XVII', title: 'The Star', description: 'Hope and trust help us move forward after a crisis.' },
      { roman: 'XVIII', title: 'The Moon', description: 'Move through uncertainty and tell intuition from fear.' },
      { roman: 'XIX', title: 'The Sun', description: 'Clarity and vitality grow brighter when shared.' },
      { roman: 'XX', title: 'Aeon', description: 'A call to awaken, accept the past, and choose what comes next.' },
      { roman: 'XX', title: 'Judgement', description: 'A final reckoning gathers past choices and signals change.' },
      { roman: 'XXI', title: 'The World', description: 'A journey reaches completion and opens onto something larger.' },
    ],
    canvasLabel: 'Interactive three-dimensional tarot card',
    resetView: 'Center card',
    gameLoading: 'Loading game…',
    gameHint: 'SPACE / ↑ TO JUMP · TAP TO PLAY',
    gameSelector: 'Pick a game',
    gameDino: 'Dino Runner',
    gameTtt: 'Tatetí',
    ttt: {
      title: 'Tatetí',
      local: 'Local',
      localDesc: 'Two players taking turns on this device',
      online: 'Online',
      onlineDesc: 'Play remotely in real time',
      ai: 'vs AI',
      aiDesc: 'Three difficulty levels',
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      yourTurn: 'Your turn',
      playerTurn: "{player}'s turn",
      xWins: '✕ wins the match',
      oWins: '○ wins the match',
      draw: "It's a draw!",
      rematch: 'Rematch',
      rematchAccept: 'Accept rematch',
      rematchWaiting: 'Waiting for your opponent to accept…',
      rematchOpponentWants: 'Your opponent wants a rematch',
      backToMenu: 'Menu',
      createRoom: 'Create room',
      joinRoom: 'Join room',
      roomCode: 'Room code',
      enterCode: 'Enter code…',
      waitingPlayer: 'Waiting for player…',
      copyCode: 'Copy code',
      copied: 'Copied!',
      roomNotFound: 'Room not found or expired',
      roomFull: 'Room already has two players',
      opponentLeft: 'Your opponent left the room',
      connectionError: 'Connection error. Try again.',
      selectX: 'Choose your symbol',
      playX: 'Play as ✕',
      playO: 'Play as ○',
      thinking: 'Thinking…',
      onlineHint: 'Create a room and share the code with your rival',
      disconnected: 'Disconnected',
      rejoin: 'Reconnect',
    },
    ctaPrompt: 'Have an idea you want to take further?',
    cta: 'What if we built something for you?'
  },
  contact: {
    title: 'Contact Me',
    info: {
      email: 'valentinthomastarantino@gmail.com',
      phone: '+54 1149476457',
      location: 'Buenos Aires, Argentina',
    },
    cardLabels: {
      listLabel: 'Contact channels',
      cardTypes: { email: 'DIRECT LINE', linkedin: 'SOCIAL NETWORK', github: 'CODE', whatsapp: 'MESSAGING' },
      names: { email: 'EMAIL', linkedin: 'LINKEDIN', github: 'GITHUB', whatsapp: 'WHATSAPP' },
      details: { linkedin: 'Professional profile', github: 'Repositories and projects' },
      copy: 'COPY EMAIL', copied: 'EMAIL COPIED', open: 'OPEN PROFILE', message: 'START CHAT',
      location: 'LOCATION'
    }
  },
  footer: {
    cta: 'Shall we work together?',
    subtitle: "Let's build something amazing",
    tagline: 'Full Stack Developer specialized in creating exceptional digital experiences.',
    navigation: 'Navigation',
    madeWith: 'Made with',
    backToTop: 'Back to top',
    copyright: '© 2026 Valentín Thomas Tarantino. All rights reserved.',
    available: 'Available for new opportunities'
  }
};

export default en;
