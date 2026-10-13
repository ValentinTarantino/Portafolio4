import {
  SiBootstrap, SiCss, SiCypress, SiDocker, SiFastapi, SiFirebase,
  SiGithubactions, SiHtml5, SiJest, SiJavascript, SiMongodb, SiNextdotjs,
  SiPostgresql, SiPostman, SiPrisma, SiPython, SiReact, SiSass, SiStripe,
  SiTailwindcss, SiTestinglibrary, SiThreedotjs, SiTypescript, SiVite
} from 'react-icons/si';
import awsIcon from '../assets/icons/aws.svg';
import zustandIcon from '../assets/icons/zustand.svg';

const techIcons = {
  'API': SiPostman,
  'AWS': null,
  'Bootstrap': SiBootstrap,
  'CI/CD': SiGithubactions,
  'CSS3': SiCss,
  'Cypress': SiCypress,
  'Docker': SiDocker,
  'FastAPI': SiFastapi,
  'Firebase': SiFirebase,
  'HTML5': SiHtml5,
  'JavaScript': SiJavascript,
  'Jest': SiJest,
  'MongoDB': SiMongodb,
  'Next.js': SiNextdotjs,
  'PostgreSQL': SiPostgresql,
  'Prisma': SiPrisma,
  'Python': SiPython,
  'React': SiReact,
  'SASS': SiSass,
  'Stripe': SiStripe,
  'Tailwind CSS': SiTailwindcss,
  'Testing Library': SiTestinglibrary,
  'Three.js': SiThreedotjs,
  'TypeScript': SiTypescript,
  'Vite': SiVite
};

const techColors = {
  'API': '#ff6c37', 'AWS': '#ff9900', 'Bootstrap': '#7952b3', 'CI/CD': '#2088ff',
  'CSS3': '#1572b6', 'Cypress': '#ffffff', 'Docker': '#2496ed', 'FastAPI': '#009688',
  'Firebase': '#ffca28', 'HTML5': '#e34f26', 'JavaScript': '#f7df1e', 'Jest': '#c21325',
  'MongoDB': '#47a248', 'Next.js': '#ffffff', 'PostgreSQL': '#4169e1', 'Prisma': '#ffffff',
  'Python': '#3776ab', 'React': '#61dafb', 'SASS': '#cf649a', 'Stripe': '#635bff',
  'Tailwind CSS': '#38bdf8', 'Testing Library': '#e33332', 'Three.js': '#ffffff',
  'TypeScript': '#3178c6', 'Vite': '#a78bfa'
};

const ProjectTechnology = ({ name }) => {
  const Icon = techIcons[name];
  return (
    <span className="transmission-stack__chip" title={name}>
      {name === 'AWS' ? (
        <img className="transmission-stack__icon" src={awsIcon} alt="" aria-hidden="true" />
      ) : name === 'Zustand' ? (
        <img className="transmission-stack__icon" src={zustandIcon} alt="" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="transmission-stack__icon" color={techColors[name] || 'currentColor'} aria-hidden="true" />
      ) : (
        <SiPostman className="transmission-stack__icon" aria-hidden="true" />
      )}
      <span>{name}</span>
    </span>
  );
};

export default ProjectTechnology;
