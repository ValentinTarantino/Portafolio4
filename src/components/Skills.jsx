import { useMemo } from 'react';
import './Skills.css';
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, SiHtml5, SiJavascript, SiCss, SiSass, SiFirebase, SiFigma, SiGit, SiGithub, SiNodedotjs, SiExpress, SiPostgresql, SiPython, SiPrisma, SiFastapi, SiBootstrap, SiVite, SiDocker, SiJest, SiTestinglibrary, SiCypress } from 'react-icons/si';
import postgresImg from '../assets/postgres.webp';
import exImg from '../assets/ex.webp';
import claudeIcon from '../assets/icons/claude.png';
import copilotIcon from '../assets/icons/copilot.webp';
import cursorIcon from '../assets/icons/cursor.png';
import geminiIcon from '../assets/icons/gemini.png';
import n8nIcon from '../assets/icons/n8n.svg';
import chatgptIcon from '../assets/icons/chatgpt.svg';
import v0Icon from '../assets/icons/v0.png';
import windsurfIcon from '../assets/icons/windsurf.png';
import aistudioIcon from '../assets/icons/google-ai-studio.png';
import antigravityIcon from '../assets/icons/antigravity.png';

const ICONS = {
  frontend: [
    { name: 'Next.js', icon: <SiNextdotjs size={32} color="#ffffff" /> },
    { name: 'React', icon: <SiReact size={32} color="#61DAFB" /> },
    { name: 'TypeScript', icon: <SiTypescript size={32} color="#3178C6" /> },
    { name: 'Tailwind', icon: <SiTailwindcss size={32} color="#38BDF8" /> },
    { name: 'JavaScript', icon: <SiJavascript size={32} color="#F7DF1E" /> },
    { name: 'HTML5', icon: <SiHtml5 size={32} color="#E34F26" /> },
    { name: 'CSS', icon: <SiCss size={32} color="#1572B6" /> },
    { name: 'SASS', icon: <SiSass size={32} color="#CF649A" /> },
    { name: 'Bootstrap', icon: <SiBootstrap size={32} color="#7952B3" /> },
    { name: 'Zustand', icon: <span style={{ fontSize: '32px' }}>🐻</span> },
  ],
  backend: [
    { name: 'Node.js', icon: <SiNodedotjs size={32} color="#8CC84B" /> },
    { name: 'Express.js', icon: <SiExpress size={32} color="#ffffff" /> },
    { name: 'PostgreSQL', icon: <SiPostgresql size={32} color="#336791" /> },
    { name: 'Firebase', icon: <SiFirebase size={32} color="#FFCA28" /> },
    { name: 'Python', icon: <SiPython size={32} color="#3776AB" /> },
    { name: 'Prisma', icon: <SiPrisma size={32} color="#ffffff" /> },
    { name: 'FastAPI', icon: <SiFastapi size={32} color="#05998B" /> },
  ],
  tools: [
    { name: 'Docker', icon: <SiDocker size={32} color="#2496ED" /> },
    { name: 'Jest', icon: <SiJest size={32} color="#C21325" /> },
    { name: 'Testing Library', icon: <SiTestinglibrary size={32} color="#E33332" /> },
    { name: 'Cypress', icon: <SiCypress size={32} color="#ffffff" /> },
    { name: 'Git', icon: <SiGit size={32} color="#F05032" /> },
    { name: 'GitHub', icon: <SiGithub size={32} color="#ffffff" /> },
    { name: 'Vite', icon: <SiVite size={32} color="#646CFF" /> },
    { name: 'Figma', icon: <SiFigma size={32} color="#F24E1E" /> },
  ],
  ai: [
    { name: 'ChatGPT', icon: <img src={chatgptIcon} width="32" height="32" alt="ChatGPT" /> },
    { name: 'Claude', icon: <img src={claudeIcon} width="32" height="32" alt="Claude" /> },
    { name: 'Gemini', icon: <img src={geminiIcon} width="32" height="32" alt="Gemini" /> },
    { name: 'Cursor', icon: <img src={cursorIcon} width="32" height="32" alt="Cursor" /> },
    { name: 'Copilot', icon: <img src={copilotIcon} width="32" height="32" alt="Copilot" /> },
    { name: 'Windsurf', icon: <img src={windsurfIcon} width="32" height="32" alt="Windsurf" /> },
    { name: 'v0', icon: <img src={v0Icon} width="32" height="32" alt="v0" /> },
    { name: 'Antigravity', icon: <img src={antigravityIcon} width="32" height="32" alt="Antigravity" /> },
    { name: 'AI Studio', icon: <img src={aistudioIcon} width="32" height="32" alt="AI Studio" /> },
    { name: 'N8N', icon: <img src={n8nIcon} width="32" height="32" alt="N8N" /> },
  ]
};

const Skills = ({ t }) => {
  const skillCategories = useMemo(() => [
    { title: t.skills.categories.frontend, skills: ICONS.frontend },
    { title: t.skills.categories.backend, skills: ICONS.backend },
    { title: t.skills.categories.tools, skills: ICONS.tools },
    { title: t.skills.categories.ai, skills: ICONS.ai }
  ], [t.skills.categories.frontend, t.skills.categories.backend, t.skills.categories.tools, t.skills.categories.ai]);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <h2 className="section-title">{t.skills.title}</h2>
        <p className="section-subtitle">{t.skills.subtitle}</p>
        
        <div className="skills-grid-container">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="skill-category-box">
              <h3 className="category-title">{category.title}</h3>
              <div className="category-skills">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-item glass-card">
                    <div className="skill-icon-wrapper">{skill.icon}</div>
                    <span className="skill-name-small">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
