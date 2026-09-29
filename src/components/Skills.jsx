import { useEffect, useMemo, useRef } from 'react';
import './Skills.css';
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, SiHtml5, SiJavascript, SiCss, SiSass, SiFirebase, SiFigma, SiGit, SiGithub, SiNodedotjs, SiExpress, SiPostgresql, SiPython, SiPrisma, SiFastapi, SiBootstrap, SiVite, SiDocker, SiJest, SiTestinglibrary, SiCypress, SiMongodb } from 'react-icons/si';
import postgresImg from '../assets/postgres.webp';
import exImg from '../assets/ex.webp';
import claudeIcon from '../assets/icons/claude.png';
import cursorIcon from '../assets/icons/cursor.png';
import n8nIcon from '../assets/icons/n8n.svg';

// NOTE: postgresImg / exImg kept for potential future use.
void postgresImg;
void exImg;

// Brand color per skill drives the icon tint + hover glow via --brand.
// react-icons inherit currentColor, so no per-icon color props needed.
const ICONS = {
  frontend: [
    { name: 'Next.js', brand: '#ffffff', icon: <SiNextdotjs size={40} /> },
    { name: 'React', brand: '#61DAFB', icon: <SiReact size={40} /> },
    { name: 'TypeScript', brand: '#3178C6', icon: <SiTypescript size={40} /> },
    { name: 'Tailwind', brand: '#38BDF8', icon: <SiTailwindcss size={40} /> },
    { name: 'JavaScript', brand: '#F7DF1E', icon: <SiJavascript size={40} /> },
    { name: 'HTML5', brand: '#E34F26', icon: <SiHtml5 size={40} /> },
    { name: 'CSS', brand: '#1572B6', icon: <SiCss size={40} /> },
    { name: 'SASS', brand: '#CF649A', icon: <SiSass size={40} /> },
    { name: 'Bootstrap', brand: '#7952B3', icon: <SiBootstrap size={40} /> },
    { name: 'Zustand', brand: '#a8a29e', icon: <span style={{ fontSize: '34px' }}>🐻</span> },
  ],
  backend: [
    { name: 'Node.js', brand: '#8CC84B', icon: <SiNodedotjs size={40} /> },
    { name: 'Express.js', brand: '#ffffff', icon: <SiExpress size={40} /> },
    { name: 'PostgreSQL', brand: '#5b9bd5', icon: <SiPostgresql size={40} /> },
    { name: 'MongoDB', brand: '#47A248', icon: <SiMongodb size={40} /> },
    { name: 'Firebase', brand: '#FFCA28', icon: <SiFirebase size={40} /> },
    { name: 'Python', brand: '#4B8BBE', icon: <SiPython size={40} /> },
    { name: 'Prisma', brand: '#ffffff', icon: <SiPrisma size={40} /> },
    { name: 'FastAPI', brand: '#05998B', icon: <SiFastapi size={40} /> },
  ],
  tools: [
    { name: 'Docker', brand: '#2496ED', icon: <SiDocker size={40} /> },
    { name: 'Jest', brand: '#C21325', icon: <SiJest size={40} /> },
    { name: 'Testing Library', brand: '#E33332', icon: <SiTestinglibrary size={40} /> },
    { name: 'Cypress', brand: '#ffffff', icon: <SiCypress size={40} /> },
    { name: 'Git', brand: '#F05032', icon: <SiGit size={40} /> },
    { name: 'GitHub', brand: '#ffffff', icon: <SiGithub size={40} /> },
    { name: 'Vite', brand: '#646CFF', icon: <SiVite size={40} /> },
    { name: 'Figma', brand: '#F24E1E', icon: <SiFigma size={40} /> },
  ],
  ai: [
    { name: 'Claude', brand: '#D97757', icon: <img src={claudeIcon} width="36" height="36" alt="Claude" /> },
    { name: 'Cursor', brand: '#ffffff', icon: <img src={cursorIcon} width="36" height="36" alt="Cursor" /> },
    { name: 'N8N', brand: '#EA4B71', icon: <img src={n8nIcon} width="36" height="36" alt="N8N" /> },
  ]
};

const CATEGORY_ICONS = {
  frontend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  ),
  backend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
  ),
  tools: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
  ),
  ai: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"></path><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"></path></svg>
  ),
};

const Skills = ({ t }) => {
  const gridRef = useRef(null);

  const skillCategories = useMemo(() => [
    { key: 'frontend', title: t.skills.categories.frontend, skills: ICONS.frontend },
    { key: 'backend', title: t.skills.categories.backend, skills: ICONS.backend },
    { key: 'tools', title: t.skills.categories.tools, skills: ICONS.tools },
    { key: 'ai', title: t.skills.categories.ai, skills: ICONS.ai }
  ], [t.skills.categories.frontend, t.skills.categories.backend, t.skills.categories.tools, t.skills.categories.ai]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <h2 className="section-title">{t.skills.title}</h2>
        <p className="section-subtitle">{t.skills.subtitle}</p>

        <div className="skills-grid-container" ref={gridRef}>
          {skillCategories.map((category) => (
            <div key={category.key} className="skill-category-box">
              <div className="category-header">
                <span className="category-icon">{CATEGORY_ICONS[category.key]}</span>
                <h3 className="category-title">{category.title}</h3>
                <span className="category-count">{category.skills.length}</span>
              </div>
              <div className="category-skills">
                {category.skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="skill-item"
                    style={{ '--brand': skill.brand, '--d': `${i * 55}ms` }}
                    title={skill.name}
                  >
                    <span className="skill-icon-tile">{skill.icon}</span>
                    <span className="skill-name">{skill.name}</span>
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
