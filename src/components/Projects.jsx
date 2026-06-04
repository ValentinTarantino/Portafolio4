import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiReact, SiSass, SiBootstrap, SiHtml5, SiJavascript, SiFirebase, SiNextdotjs, SiTypescript, SiTailwindcss, SiVite, SiPostgresql, SiPostman, SiCss, SiPython, SiPrisma, SiFastapi } from 'react-icons/si';
import './Projects.css';
import ProjectModal from './ProjectModal';
import dolarImg from '../assets/dolar.webp';
import ecommerceImg from '../assets/ecommerce.webp';
import clima from '../assets/clima.png';
import googlekeepImg from '../assets/googlekeep.webp';
import youtubeImg from '../assets/youtube.webp';
import flowImg from "../assets/flow.webp";
import blogImg from "../assets/blog.webp";
import turnosImg from "../assets/turnos.webp";
import consorcioImg from "../assets/consorcio.webp";

const techIcons = {
  'React': <SiReact className="tech-icon" color="#61DAFB" />,
  'SASS': <SiSass className="tech-icon" color="#CF649A" />,
  'Bootstrap': <SiBootstrap className="tech-icon" color="#7952B3" />,
  'API': <SiPostman className="tech-icon" color="#FF6C37" />,
  'HTML5': <SiHtml5 className="tech-icon" color="#E34F26" />,
  'JavaScript': <SiJavascript className="tech-icon" color="#F7DF1E" />,
  'CSS3': <SiCss className="tech-icon" color="#1572B6" />,
  'Firebase': <SiFirebase className="tech-icon" color="#FFCA28" />,
  'Next.js': <SiNextdotjs className="tech-icon" color="#ffffff" />,
  'TypeScript': <SiTypescript className="tech-icon" color="#3178C6" />,
  'Tailwind CSS': <SiTailwindcss className="tech-icon" color="#38BDF8" />,
  'Vite': <SiVite className="tech-icon" color="#646CFF" />,
  'PostgreSQL': <SiPostgresql className="tech-icon" color="#336791" />,
  'Python': <SiPython className="tech-icon" color="#3776AB" />,
  'Prisma': <SiPrisma className="tech-icon" color="#ffffff" />,
  'FastAPI': <SiFastapi className="tech-icon" color="#05998B" />,
  'Zustand': <span className="tech-icon-text">🐻</span>
};

const ProjectDescription = ({ text, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const threshold = 120;

  if (text.length <= threshold) {
    return <p className="project-description">{text}</p>;
  }

  const displayText = isExpanded ? text : `${text.slice(0, threshold)}`;

  return (
    <p className="project-description">
      {displayText}
      {!isExpanded && '...'}
      <button 
        type="button" 
        className="read-more-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? t.projects.showLess : t.projects.showMore}
      </button>
    </p>
  );
};

const Projects = ({ t, language }) => {
  const [filter, setFilter] = useState('featured'); // 'featured' | 'all'
  const [activeProject, setActiveProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const projects = [
    {
      id: 3,
      title: 'Lumina Commerce',
      featured: true,
      caseStudyKey: 'LuminaCommerce',
      description: t.projects.descriptions.LuminaCommerce,
      image: ecommerceImg,
      technologies: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Prisma', 'Zustand', 'Tailwind CSS'],
      liveUrl: 'https://lumina-commerce-beta.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/lumina-commerce'
    },
    {
      id: 9,
      title: 'TurnoApp',
      featured: true,
      caseStudyKey: 'TurnoApp',
      description: t.projects.descriptions.TurnoApp,
      image: turnosImg,
      technologies: ['React', 'JavaScript', 'CSS3', 'Bootstrap', 'PostgreSQL'],
      liveUrl: 'https://turno-app.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/TurnoApp'
    },
    {
      id: 8,
      title: 'Lucas Caudana Blog',
      featured: true,
      caseStudyKey: 'LucasCaudanaBlog',
      description: t.projects.descriptions.LucasCaudanaBlog,
      image: blogImg,
      technologies: ['React', 'JavaScript', 'CSS3', 'Bootstrap', 'Firebase'],
      liveUrl: 'https://lucas-caudana-blog.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/LucasCaudanaBlog'
    },
    {
      id: 10,
      title: language === 'en' ? 'Property Management' : 'Administración de consorcios',
      featured: true,
      caseStudyKey: 'AdministracionConsorcios',
      description: t.projects.descriptions.AdministracionConsorcios,
      image: consorcioImg,
      technologies: ['React', 'JavaScript', 'CSS3', 'Vite', 'Firebase'],
      liveUrl: 'https://administracionclaudia.com/',
      codeUrl: 'https://github.com/ValentinTarantino/claudiaconsorcio'
    },
    {
      id: 1,
      title: 'DolarARG',
      featured: true,
      caseStudyKey: 'DolarARG',
      description: t.projects.descriptions.DolarARG,
      image: dolarImg,
      technologies: ['Next.js', 'TypeScript', 'SASS', 'Prisma', 'PostgreSQL', 'API'],
      liveUrl: 'https://dolar-arg-hoy.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/DolarArg'
    },
    {
      id: 6,
      title: 'ClipDrop',
      featured: false,
      description: t.projects.descriptions.ClipDrop,
      image: youtubeImg,
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'API'],
      liveUrl: 'https://youtube-downloader2-1-ibdv.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/Youtube-Downloader2.1'
    },
    {
      id: 7,
      title: 'ChromaFlow',
      featured: false,
      description: t.projects.descriptions.ChromaFlow,
      image: flowImg,
      technologies: ['React', 'JavaScript', 'CSS3', 'Bootstrap'],
      liveUrl: 'https://chorma-flow.vercel.app',
      codeUrl: 'https://github.com/ValentinTarantino/ChormaFlow'
    },
    {
      id: 5,
      title: 'Google Keep',
      featured: false,
      description: t.projects.descriptions.googleKeep,
      image: googlekeepImg,
      technologies: ['React', 'JavaScript', 'CSS3'],
      liveUrl: 'https://google-keep-replica.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/Google-Keep-Replica-'
    },
    {
      id: 4,
      title: language === 'en' ? 'Weather Report' : 'Informe meteorológico',
      featured: false,
      description: t.projects.descriptions.WeatherReport,
      image: clima,
      technologies: ['React', 'JavaScript', 'CSS3', 'API', 'Zustand'],
      liveUrl: 'https://weather-report-oraora.vercel.app',
      codeUrl: 'https://github.com/ValentinTarantino/Weather'
    },
  ];

  const filteredProjects = projects.filter(project => 
    filter === 'all' ? true : project.featured
  );

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <h2 className="section-title">{t.projects.title}</h2>
        <p className="section-subtitle">{t.projects.subtitle}</p>
        
        {/* Category Filter Tabs */}
        <div className="filter-container">
          <button 
            className={`filter-btn filter-btn--featured ${filter === 'featured' ? 'active' : ''}`}
            onClick={() => setFilter('featured')}
          >
            {t.projects.filterFeatured}
          </button>
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t.projects.filterAll}
          </button>
        </div>

        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div 
                layout={!isMobile ? "position" : false}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id} 
                className={`project-card glass-card ${project.featured ? 'project-card--featured' : 'project-card--standard'}`} 
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-actions">
                      {project.featured && project.caseStudyKey && (
                        <button 
                          onClick={() => setActiveProject(project)}
                          className="project-btn case-study-btn"
                        >
                          {t.projects.viewCaseStudy}
                        </button>
                      )}
                      <a href={project.liveUrl} className="project-btn" target="_blank" rel="noopener noreferrer">
                        🔗 {t.projects.viewProject}
                      </a>
                      <a href={project.codeUrl} className="project-btn" target="_blank" rel="noopener noreferrer">
                        💻 {t.projects.viewCode}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="project-content">
                  <div className="project-header-row">
                    <h3 className="project-title">{project.title}</h3>
                    {project.featured && (
                      <span className="featured-badge">⭐️ {language === 'en' ? 'Featured' : 'Destacado'}</span>
                    )}
                  </div>
                  <ProjectDescription text={project.description} t={t} />
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag" data-name={tech}>
                        {techIcons[tech] || tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal 
            project={activeProject} 
            t={t} 
            onClose={() => setActiveProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
