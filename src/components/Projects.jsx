import { motion } from 'framer-motion';
import './Projects.css';
import dolarImg from '../assets/dolar.png';
import todoappImg from '../assets/todoapp.png';
import ecommerceImg from '../assets/ecommerce.png';
import clima from '../assets/clima.png'; 
import googlekeepImg from '../assets/googlekeep.png'; 
import youtubeImg from '../assets/youtube.png'; 
import flowImg from "../assets/flow.png";
import blogImg from "../assets/blog.png";
import turnosImg from "../assets/turnos.png";
import consorcioImg from "../assets/consorcio.png";


const Projects = ({ t, language }) => {
  const projects = [
    {
      id: 1,
      title: 'DolarARG',
      description: t.projects.descriptions.DolarARG,
      image: dolarImg,
      technologies: ['React', 'SASS','Boostrap', "API"],
      liveUrl: 'https://dolar-arg-hoy.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/DolarArg'
    },
    {
      id: 2,
      title: 'To-do list',
      description: t.projects.descriptions.todoApp,
      image: todoappImg,
      technologies: ["HTML5" ,'JavaScript', 'CSS3'],
      liveUrl: 'https://js-to-do-list-theta.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/JS-To-do-list'
    },
    {
      id: 3,
      title: 'Ecommerce Mundo Gamer',
      description: t.projects.descriptions.ecommerce,
      image: ecommerceImg,
      technologies: ['React', 'CSS3', 'Firebase', 'JavaScript'],
      liveUrl: 'https://react-gilt-kappa.vercel.app/',
      codeUrl: 'https://github.com/ValentinTarantino/React'
    },
    {
      id: 4,
      title: language === 'en' ? 'Weather Report' : 'Informe meteorológico',
      description: t.projects.descriptions.WeatherReport,
      image: clima,
      technologies: ['React', 'JavaScript', 'CSS3', 'API'],
      liveUrl: 'https://weather-report-oraora.vercel.app',
      codeUrl: 'https://github.com/ValentinTarantino/Weather'
    },
    {
      id: 5,
      title: 'Google Keep',
      description: t.projects.descriptions.googleKeep,
      image: googlekeepImg, // Placeholder image, replace with actual
      technologies: ['React', "JavaScript" , 'CSS3'],
      liveUrl: 'https://google-keep-replica.vercel.app/',
      codeUrl: "https://github.com/ValentinTarantino/Google-Keep-Replica-"
    },
    {
      id: 6,
      title: 'Youtube Downloader',
      description: t.projects.descriptions.Youtube,
      image: youtubeImg, // Placeholder image, replace with actual
      technologies: ['React', 'JavaScript', 'CSS3', "Boostrap", "Node.js", "Backend"],
      liveUrl: 'https://github.com/ValentinTarantino/Youtube-Downloader2.1?tab=readme-ov-file',
      codeUrl: "https://github.com/ValentinTarantino/Youtube-Downloader2.1?tab=readme-ov-file"
      },
      {
      id: 7,
      title: 'ChromaFlow',
      description: t.projects.descriptions.ChromaFlow,
      image: flowImg, // Placeholder image, replace with actual
      technologies: ['React', "JavaScript" , 'CSS3', "Boostrap"],
      liveUrl: 'https://chorma-flow.vercel.app',
      codeUrl: "https://github.com/ValentinTarantino/ChormaFlow"
      },
      {
      id: 8,
      title: 'Lucas Caudana Blog',
      description: t.projects.descriptions.LucasCaudanaBlog,
      image: blogImg, // Placeholder image, replace with actual
      technologies: ['React', "JavaScript" , 'CSS3' , "Boostrap", "Firebase"],
      liveUrl: 'https://lucas-caudana-blog.vercel.app/',
      codeUrl: "https://github.com/ValentinTarantino/LucasCaudanaBlog"
      },
      {
      id: 9,
      title: 'TurnoApp',
      description: t.projects.descriptions.TurnoApp,
      image: turnosImg, // Placeholder image, replace with actual
      technologies: ['React', "JavaScript" , 'CSS3' , "Boostrap", "PostgreSQL"],
      liveUrl: 'https://turno-app.vercel.app/',
      codeUrl: "https://github.com/ValentinTarantino/TurnoApp"
      },
      {
      id: 10,
      title: language === 'en' ? 'Property Management' : 'Administración de consorcios',
      description: t.projects.descriptions.AdministracionConsorcios,
      image: consorcioImg,
      technologies: ['React', 'JavaScript', 'CSS3', 'Vite', 'Firebase'],
      liveUrl: 'https://administracionclaudia.com/',
      codeUrl: 'https://github.com/ValentinTarantino/claudiaconsorcio'
      },
    ];




  return (
    <section id="projects" className="section projects">
      <div className="container">
        <h2 className="section-title">{t.projects.title}</h2>
        <p className="section-subtitle">{t.projects.subtitle}</p>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              className="project-card glass-card fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-actions">
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
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
