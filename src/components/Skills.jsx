import { memo, useMemo } from 'react';
import './Skills.css';
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, SiHtml5, SiJavascript, SiCss, SiSass, SiFirebase, SiFigma, SiGit, SiGithub, SiNodedotjs, SiExpress, SiPostgresql, SiPython, SiPrisma, SiFastapi, SiBootstrap, SiVite, SiDocker, SiJest, SiTestinglibrary, SiCypress, SiMongodb, SiThreedotjs, SiGithubactions, SiSqlite, SiOpenai } from 'react-icons/si';
import claudeIcon from '../assets/icons/claude.png';
import cursorIcon from '../assets/icons/cursor.png';
import n8nIcon from '../assets/icons/n8n.svg';
import awsIcon from '../assets/icons/aws.svg';
import zustandIcon from '../assets/icons/zustand.svg';

const ICONS = {
  frontend: [
    { name: 'Next.js', brand: '#ffffff', level: 5, icon: <SiNextdotjs size={40} /> },
    { name: 'React', brand: '#61DAFB', level: 5, icon: <SiReact size={40} /> },
    { name: 'Three.js', brand: '#ffffff', level: 3, icon: <SiThreedotjs size={40} /> },
    { name: 'TypeScript', brand: '#3178C6', level: 4, icon: <SiTypescript size={40} /> },
    { name: 'Tailwind', brand: '#38BDF8', level: 5, icon: <SiTailwindcss size={40} /> },
    { name: 'JavaScript', brand: '#F7DF1E', level: 5, icon: <span className="javascript-brand-icon"><SiJavascript size={18} /></span> },
    { name: 'HTML5', brand: '#E34F26', level: 5, icon: <SiHtml5 size={40} /> },
    { name: 'CSS', brand: '#1572B6', level: 5, icon: <SiCss size={40} /> },
    { name: 'SASS', brand: '#CF649A', level: 4, icon: <SiSass size={40} /> },
    { name: 'Bootstrap', brand: '#7952B3', level: 3, icon: <SiBootstrap size={40} /> },
    { name: 'Zustand', brand: '#a8a29e', level: 4, icon: <img src={zustandIcon} width="36" height="36" alt="Zustand" /> },
  ],
  backend: [
    { name: 'Node.js', brand: '#8CC84B', level: 5, icon: <SiNodedotjs size={40} /> },
    { name: 'Express.js', brand: '#ffffff', level: 4, icon: <SiExpress size={40} /> },
    { name: 'PostgreSQL', brand: '#5b9bd5', level: 4, icon: <SiPostgresql size={40} /> },
    { name: 'SQLite', brand: '#44A2CF', level: 4, icon: <SiSqlite size={40} /> },
    { name: 'MongoDB', brand: '#47A248', level: 3, icon: <SiMongodb size={40} /> },
    { name: 'Firebase', brand: '#FFCA28', level: 4, icon: <SiFirebase size={40} /> },
    { name: 'Python', brand: '#4B8BBE', level: 4, icon: <SiPython size={40} /> },
    { name: 'Prisma', brand: '#ffffff', level: 4, icon: <SiPrisma size={40} /> },
    { name: 'FastAPI', brand: '#05998B', level: 4, icon: <SiFastapi size={40} /> },
    { name: 'AWS', brand: '#FF9900', level: 3, icon: <img src={awsIcon} width="36" height="36" alt="AWS" /> },
  ],
  tools: [
    { name: 'Docker', brand: '#2496ED', level: 4, icon: <SiDocker size={40} /> },
    { name: 'CI/CD', brand: '#2088FF', level: 3, icon: <SiGithubactions size={40} /> },
    { name: 'Jest', brand: '#C21325', level: 4, icon: <SiJest size={40} /> },
    { name: 'Testing Library', brand: '#E33332', level: 4, icon: <SiTestinglibrary size={40} /> },
    { name: 'Cypress', brand: '#ffffff', level: 3, icon: <SiCypress size={40} /> },
    { name: 'Git', brand: '#F05032', level: 5, icon: <SiGit size={40} /> },
    { name: 'GitHub', brand: '#ffffff', level: 5, icon: <SiGithub size={40} /> },
    { name: 'Vite', brand: '#646CFF', level: 5, icon: <SiVite size={40} /> },
    { name: 'Figma', brand: '#F24E1E', level: 3, icon: <SiFigma size={40} /> },
  ],
  ai: [
    { name: 'Claude', brand: '#D97757', level: 4, icon: <img src={claudeIcon} width="36" height="36" alt="Claude" /> },
    { name: 'Codex', brand: '#ffffff', level: 4, icon: <SiOpenai size={40} /> },
    { name: 'Cursor', brand: '#ffffff', level: 4, icon: <img src={cursorIcon} width="36" height="36" alt="Cursor" /> },
    { name: 'N8N', brand: '#EA4B71', level: 3, icon: <img src={n8nIcon} width="36" height="36" alt="N8N" /> },
  ]
};

const Skills = ({ t }) => {
  const skillCategories = useMemo(() => [
    { key: 'frontend', arcana: 'I', title: t.skills.categories.frontend, skills: ICONS.frontend },
    { key: 'backend', arcana: 'II', title: t.skills.categories.backend, skills: ICONS.backend },
    { key: 'tools', arcana: 'III', title: t.skills.categories.tools, skills: ICONS.tools },
    { key: 'ai', arcana: 'IV', title: t.skills.categories.ai, skills: ICONS.ai }
  ], [
    t.skills.categories.frontend,
    t.skills.categories.backend,
    t.skills.categories.tools,
    t.skills.categories.ai
  ]);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <h2 className="section-title skills-section-title">{t.skills.listLabel}</h2>

        <div className="skills-layout">
          <div className="skills-grid-container skills-grid-container--compact">
            {skillCategories.map((category) => (
              <article
                key={category.key}
                className="skill-category-box skill-category-box--compact"
                data-category={category.key}
              >
                <div className="category-header">
                  <span className="category-arcana" aria-hidden="true">{category.arcana}</span>
                  <div className="category-heading-copy">
                    <h3 className="category-title">{category.title}</h3>
                  </div>
                </div>
                <ul className="category-skills">
                  {category.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="skill-chip"
                      style={{ '--brand': skill.brand }}
                    >
                      <span className="skill-chip-icon" aria-hidden="true">{skill.icon}</span>
                      <span className="skill-chip-name">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Skills);
