import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import './Hero.css';

const Hero = ({ t }) => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="floating-elements">
            <div className="code-block code-1">{'<div>'}</div>
            <div className="code-block code-2">{'</>'}</div>
            <div className="code-block code-3">{'{ }'}</div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-text">
            <div className="typing-container">
              <p className="hero-greeting fade-in-up">{t.hero.greeting}</p>
              <h1 className="hero-name fade-in-up">
                <span className="name-highlight">{t.hero.name}</span>
              </h1>
              <h2 className="hero-title fade-in-up">
                <span className="title-bracket">{'<'}</span>
                <TypeAnimation
                  key={t.hero.title}
                  sequence={[
                    t.hero.title,
                    2000,
                    'Frontend Developer',
                    2000,
                    'React Specialist',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  style={{ display: 'inline-block' }}
                />
                <span className="title-bracket">{'/>'}</span>
              </h2>
              <p className="hero-description fade-in-up">{t.hero.description}</p>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="terminal-container">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="btn-close"></span>
                  <span className="btn-minimize"></span>
                  <span className="btn-maximize"></span>
                </div>
                <div className="terminal-title">developer.js</div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="prompt"></span>
                  <span className="command">const developer = {`{`}</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  name: </span>
                  <span className="string">"Valentín"</span>
                  <span>",</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  role: </span>
                  <span className="string">"Full Stack Dev"</span>
                  <span>",</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  passion: </span>
                  <span className="string">"Innovation"</span>
                  <span>"</span>
                </div>
                <div className="terminal-line">
                  <span className="command">{`};`}</span>
                </div>
                <div className="cursor"></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="scroll-indicator" onClick={scrollToAbout}>
          <div className="scroll-arrow"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
