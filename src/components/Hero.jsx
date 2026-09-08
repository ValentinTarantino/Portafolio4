import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import './Hero.css';

// Dynamic terminal outputs renderer for seamless real-time bilingual updates
const renderHistoryItem = (item, index, isSpanish) => {
  if (item.type === 'input') {
    return (
      <div key={index} className="terminal-line">
        <span className="prompt">
          {item.promptLabel || 'visitor@valentin:~$'}
        </span>
        <span className="command" style={{ color: '#fbbf24' }}>{item.text}</span>
      </div>
    );
  }

  switch (item.cmdType) {
    case 'help': {
      const lines = isSpanish
        ? [
            'Comandos disponibles:',
            '  bio          - Sobre mi en pocas palabras',
            '  skills       - Mi stack de tecnologias principal',
            '  projects     - Ver mis proyectos destacados',
            '  npm run dev  - Activa el modo Super Desarrollador',
            '  clear        - Limpia la consola'
          ]
        : [
            'Available commands:',
            '  bio          - A brief summary about me',
            '  skills       - My main tech stack',
            '  projects     - View featured projects',
            '  npm run dev  - Run live Super Developer compilation',
            '  clear        - Clear the terminal'
          ];
      return lines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span>{line}</span>
        </div>
      ));
    }
    case 'bio': {
      const bioLines = isSpanish
        ? [
            'Valentin Thomas Tarantino - Desarrollador Full Stack',
            'Creo soluciones creativas, escalables y 100% responsivas.',
            'Valoro el trabajo en equipo, las buenas practicas y el aprendizaje continuo.'
          ]
        : [
            'Valentin Thomas Tarantino - Full Stack Developer',
            'Building creative, scalable, and 100% responsive solutions.',
            'Valuing teamwork, clean code, and continuous learning.'
          ];
      return bioLines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span>{line}</span>
        </div>
      ));
    }
    case 'skills': {
      const skillLines = isSpanish
        ? [
            'Mi stack principal:',
            '  * Frontend: Next.js, React, TypeScript, Zustand, Tailwind CSS',
            '  * Backend : Node.js, Express, FastAPI, Python, PostgreSQL, Prisma',
            '  * Herramientas: Git, GitHub, Figma, Firebase'
          ]
        : [
            'My main tech stack:',
            '  * Frontend: Next.js, React, TypeScript, Zustand, Tailwind CSS',
            '  * Backend : Node.js, Express, FastAPI, Python, PostgreSQL, Prisma',
            '  * Tools   : Git, GitHub, Figma, Firebase'
          ];
      return skillLines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span>{line}</span>
        </div>
      ));
    }
    case 'projects': {
      const projectLines = isSpanish
        ? [
            'Proyectos destacados:',
            '  * DolarARG        - Cotizaciones de divisas en tiempo real (PWA)',
            '  * Lumina Commerce - E-commerce de tecnologia ultra moderno',
            '  * TurnoApp        - App de gestion de turnos inteligente',
            '  * Lucas Caudana   - Blog freelance con Firebase',
            '  * Consorcios      - Landing page para administracion inmobiliaria',
            'Pista: Ejecuta "npm run dev" para ver la magia!'
          ]
        : [
            'Featured projects:',
            '  * DolarARG        - Real-time currency exchange rates (PWA)',
            '  * Lumina Commerce - Ultra-modern tech E-commerce platform',
            '  * TurnoApp        - Smart booking and schedule manager',
            '  * Lucas Caudana   - Freelance personal blog built with Firebase',
            '  * Consorcios      - Property management landing page',
            'Tip: Execute "npm run dev" to see the magic!'
          ];
      return projectLines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span>{line}</span>
        </div>
      ));
    }
    case 'npm_start':
      return (
        <div key={index}>
          <div className="terminal-line output-line">
            <span>{`> my-portfolio@3.0.0 dev`}</span>
          </div>
          <div className="terminal-line output-line">
            <span>{`> vite`}</span>
          </div>
        </div>
      );
    case 'npm_loading':
      return (
        <div key={index} className="terminal-line output-line">
          <span>{isSpanish ? 'Cargando dependencias...' : 'Loading dependencies...'}</span>
        </div>
      );
    case 'npm_compiling':
      return (
        <div key={index} className="terminal-line output-line">
          <span>{isSpanish ? 'Compilando modulos del cliente...' : 'Compiling client modules...'}</span>
        </div>
      );
    case 'npm_launched':
      return (
        <div key={index} className="terminal-line output-line">
          <span>Vite development server launched successfully.</span>
        </div>
      );
    case 'npm_local':
      return (
        <div key={index} className="terminal-line output-line link">
          <span>  Local:   http://localhost:5173/</span>
        </div>
      );
    case 'npm_success':
      return (
        <div key={index}>
          <div className="terminal-line output-line success">
            <span>{isSpanish ? 'MODO SUPER DESARROLLADOR ACTIVADO' : 'SUPER DEVELOPER MODE ACTIVATED'}</span>
          </div>
          <div className="terminal-line output-line" style={{ color: '#718096', marginTop: '0.25rem' }}>
            <span>{isSpanish ? 'Pista: Se ha desbloqueado una trivia secreta. Escribe "game" para iniciar.' : 'Tip: A secret trivia has been unlocked. Type "game" to start.'}</span>
          </div>
        </div>
      );
    case 'already_running':
      return (
        <div key={index} className="terminal-line output-line">
          <span>
            {isSpanish
              ? 'El servidor de desarrollo ya se esta ejecutando en http://localhost:5173/'
              : 'Development server is already running at http://localhost:5173/'}
          </span>
        </div>
      );
    case 'error':
      return (
        <div key={index} className="terminal-line output-line">
          <span>
            {isSpanish
              ? `Comando no reconocido: "${item.commandText}". Escribe "help" para ver los comandos.`
              : `Command not recognized: "${item.commandText}". Type "help" to see available commands.`}
          </span>
        </div>
      );
    
    // Interactive Trivia Game Render Actions
    case 'trivia_start': {
      const lines = isSpanish
        ? [
            'Iniciando la Trivia del Portafolio de Valentin...',
            'Responde escribiendo la letra de la opcion (A, B o C) y presiona Enter.'
          ]
        : [
            'Starting Valentin\'s Portfolio Trivia Game...',
            'Answer by typing the letter of the option (A, B or C) and press Enter.'
          ];
      return lines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line" style={{ color: '#63b3ed' }}>
          <span>{line}</span>
        </div>
      ));
    }
    case 'trivia_q1': {
      const lines = isSpanish
        ? [
            'Pregunta 1: ¿Que tecnologias principales utilice para desarrollar Lumina Commerce?',
            '  A) Next.js, Python (FastAPI), PostgreSQL y Prisma',
            '  B) React, Node.js, Express y MongoDB',
            '  C) Angular, PHP y MySQL'
          ]
        : [
            'Question 1: What main technologies did I use to build Lumina Commerce?',
            '  A) Next.js, Python (FastAPI), PostgreSQL and Prisma',
            '  B) React, Node.js, Express and MongoDB',
            '  C) Angular, PHP and MySQL'
          ];
      return lines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span style={{ fontWeight: lIdx === 0 ? 'bold' : 'normal', color: lIdx === 0 ? '#f7fafc' : '#cbd5e0' }}>{line}</span>
        </div>
      ));
    }
    case 'trivia_q2': {
      const lines = isSpanish
        ? [
            'Pregunta 2: ¿Para quien esta diseñada la aplicacion TurnoApp?',
            '  A) Para grandes cadenas de supermercados',
            '  B) Para profesionales independientes y freelancers',
            '  C) Para administracion inmobiliaria de edificios'
          ]
        : [
            'Question 2: Who is TurnoApp designed for?',
            '  A) Large supermarket chains',
            '  B) Independent professionals and freelancers',
            '  C) Property management of buildings'
          ];
      return lines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span style={{ fontWeight: lIdx === 0 ? 'bold' : 'normal', color: lIdx === 0 ? '#f7fafc' : '#cbd5e0' }}>{line}</span>
        </div>
      ));
    }
    case 'trivia_q3': {
      const lines = isSpanish
        ? [
            'Pregunta 3: ¿Cual es mi stack frontend preferido?',
            '  A) Angular + Sass',
            '  B) Vue + Pinia',
            '  C) React/Next.js + TypeScript + Tailwind CSS'
          ]
        : [
            'Question 3: What is my preferred frontend stack?',
            '  A) Angular + Sass',
            '  B) Vue + Pinia',
            '  C) React/Next.js + TypeScript + Tailwind CSS'
          ];
      return lines.map((line, lIdx) => (
        <div key={`${index}-${lIdx}`} className="terminal-line output-line">
          <span style={{ fontWeight: lIdx === 0 ? 'bold' : 'normal', color: lIdx === 0 ? '#f7fafc' : '#cbd5e0' }}>{line}</span>
        </div>
      ));
    }
    case 'trivia_correct':
      return (
        <div key={index} className="terminal-line output-line success">
          <span>{isSpanish ? '✓ ¡Correcto! Buen trabajo.' : '✓ Correct! Good job.'}</span>
        </div>
      );
    case 'trivia_incorrect':
      return (
        <div key={index} className="terminal-line output-line" style={{ color: '#e85d75' }}>
          <span>
            {isSpanish 
              ? `✗ Incorrecto. La respuesta correcta era la ${item.correctOpt}.` 
              : `✗ Incorrect. The correct answer was ${item.correctOpt}.`}
          </span>
        </div>
      );
    case 'trivia_invalid':
      return (
        <div key={index} className="terminal-line output-line" style={{ color: '#e8a64c' }}>
          <span>{isSpanish ? 'Respuesta no valida. Por favor escribe A, B o C.' : 'Invalid answer. Please type A, B or C.'}</span>
        </div>
      );
    case 'trivia_end': {
      const score = item.score;
      const lines = isSpanish
        ? [
            `¡Trivia completada! Tu puntuacion: ${score}/3.`,
            score === 3 
              ? '¡Perfecto! Has demostrado ser un verdadero Developer. ¡Felicitaciones!'
              : 'Buen intento. ¡Escribe "game" si quieres volver a probar!'
          ]
        : [
            `Trivia completed! Your score: ${score}/3.`,
            score === 3 
              ? 'Perfect! You proved to be a true Developer. Congratulations!'
              : 'Good try. Type "game" if you want to try again!'
          ];
      
      return (
        <div key={index}>
          {score === 3 && (
            <pre style={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.2', margin: '0.75rem 0', textAlign: 'left' }}>
{`          _______________
         |  3 / 3 SCORE  |
       .-|_______________|-.
      /  |               |  \\
     |   |   DEVELOPER   |   |
     |   |      CUP      |   |
      \\  |               |  /
       '-|_______________|-'
               |   |
              /|___|\\
            .-'_____'-.
           /___________\\`}
            </pre>
          )}
          {lines.map((line, lIdx) => (
            <div key={`${index}-${lIdx}`} className="terminal-line output-line" style={{ color: score === 3 ? '#48bb78' : '#a0aec0' }}>
              <span>{line}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'raw':
      return (
        <div key={index} className="terminal-line output-line">
          <span>{item.text}</span>
        </div>
      );
    default:
      return null;
  }
};

const Hero = ({ t, language }) => {
  const isSpanish = language === 'es';

  // Interactive Terminal States
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [superActive, setSuperActive] = useState(false);
  const [trivia, setTrivia] = useState(null); // { step: 1|2|3, score: 0 }

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory, inputValue]);

  // Focus hidden input on terminal click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Initial prompt focus
  useEffect(() => {
    focusInput();
  }, []);

  // Dynamically load canvas-confetti from CDN and burst party particles on 3/3 score
  const triggerConfetti = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.onload = () => {
      window.confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#38bdf8']
      });
    };
    document.body.appendChild(script);
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const commandText = inputValue.trim();
      const cleanCommand = commandText.toLowerCase();

      // TRIVIA INTERACTIVE CONSOLE STATE MACHINE
      if (trivia) {
        if (!commandText) {
          setTerminalHistory((prev) => [...prev, { type: 'input', text: '', promptLabel: `${isSpanish ? 'pregunta' : 'question'}-${trivia.step}:~$` }]);
          return;
        }

        const validOptions = ['a', 'b', 'c'];
        if (!validOptions.includes(cleanCommand)) {
          setTerminalHistory((prev) => [
            ...prev,
            { type: 'input', text: commandText, promptLabel: `${isSpanish ? 'pregunta' : 'question'}-${trivia.step}:~$` },
            { type: 'output', cmdType: 'trivia_invalid' }
          ]);
          setInputValue('');
          return;
        }

        const newHistory = [
          ...terminalHistory,
          { type: 'input', text: commandText, promptLabel: `${isSpanish ? 'pregunta' : 'question'}-${trivia.step}:~$` }
        ];

        let isCorrect = false;
        let correctOpt = '';

        if (trivia.step === 1) {
          isCorrect = cleanCommand === 'a';
          correctOpt = 'A';
        } else if (trivia.step === 2) {
          isCorrect = cleanCommand === 'b';
          correctOpt = 'B';
        } else if (trivia.step === 3) {
          isCorrect = cleanCommand === 'c';
          correctOpt = 'C';
        }

        const nextScore = isCorrect ? trivia.score + 1 : trivia.score;
        const answerOutput = isCorrect
          ? { type: 'output', cmdType: 'trivia_correct' }
          : { type: 'output', cmdType: 'trivia_incorrect', correctOpt };

        if (trivia.step < 3) {
          const nextStep = trivia.step + 1;
          const nextQuestionCmd = nextStep === 2 ? 'trivia_q2' : 'trivia_q3';
          setTerminalHistory([
            ...newHistory,
            answerOutput,
            { type: 'output', cmdType: nextQuestionCmd }
          ]);
          setTrivia({ step: nextStep, score: nextScore });
        } else {
          // Finished Trivia Game
          setTerminalHistory([
            ...newHistory,
            answerOutput,
            { type: 'output', cmdType: 'trivia_end', score: nextScore }
          ]);
          setTrivia(null); // Return terminal to standard state
          if (nextScore === 3) {
            triggerConfetti();
          }
        }

        setInputValue('');
        return;
      }

      // STANDARD PORTFOLIO SHELL ROUTER
      if (!commandText) {
        setTerminalHistory((prev) => [...prev, { type: 'input', text: '' }]);
        return;
      }

      const newHistory = [...terminalHistory, { type: 'input', text: commandText }];

      if (cleanCommand === 'clear') {
        setTerminalHistory([]);
        setInputValue('');
        return;
      }

      if (cleanCommand === 'help') {
        setTerminalHistory([...newHistory, { type: 'output', cmdType: 'help' }]);
      } else if (cleanCommand === 'bio') {
        setTerminalHistory([...newHistory, { type: 'output', cmdType: 'bio' }]);
      } else if (cleanCommand === 'skills') {
        setTerminalHistory([...newHistory, { type: 'output', cmdType: 'skills' }]);
      } else if (cleanCommand === 'projects') {
        setTerminalHistory([...newHistory, { type: 'output', cmdType: 'projects' }]);
      } else if (cleanCommand === 'game') {
        if (!superActive) {
          const lockedText = isSpanish
            ? 'La trivia secreta esta bloqueada. Ejecuta "npm run dev" primero para desbloquearla.'
            : 'The secret trivia is locked. Run "npm run dev" first to unlock it.';
          setTerminalHistory([...newHistory, { type: 'output', cmdType: 'raw', text: lockedText }]);
          setInputValue('');
          return;
        }

        // Start interactive trivia
        setTerminalHistory([
          ...newHistory,
          { type: 'output', cmdType: 'trivia_start' },
          { type: 'output', cmdType: 'trivia_q1' }
        ]);
        setTrivia({ step: 1, score: 0 });
      } else if (cleanCommand === 'npm run dev') {
        if (superActive) {
          setTerminalHistory([...newHistory, { type: 'output', cmdType: 'already_running' }]);
          setInputValue('');
          return;
        }

        setIsCompiling(true);
        setTerminalHistory([
          ...newHistory,
          { type: 'output', cmdType: 'npm_start' }
        ]);

        setTimeout(() => {
          setTerminalHistory(prev => [...prev, { type: 'output', cmdType: 'npm_loading' }]);
        }, 500);

        setTimeout(() => {
          setTerminalHistory(prev => [...prev, { type: 'output', cmdType: 'npm_compiling' }]);
        }, 1000);

        setTimeout(() => {
          setTerminalHistory(prev => [...prev, { type: 'output', cmdType: 'npm_launched' }]);
        }, 1600);

        setTimeout(() => {
          setTerminalHistory(prev => [...prev, 
            { type: 'output', cmdType: 'npm_local' },
            { type: 'output', cmdType: 'npm_success' }
          ]);
          setIsCompiling(false);
          setSuperActive(true);
        }, 2200);
      } else {
        setTerminalHistory([
          ...newHistory,
          { type: 'output', cmdType: 'error', commandText: commandText }
        ]);
      }

      setInputValue('');
    }
  };

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
        <div className="hero-content">
          <div className="hero-text">
            <div className="typing-container">
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
              <div className="hero-cta fade-in-up">
                <a
                  href={language === 'es' ? '/CV_Valentin_Tarantino_ES.pdf' : '/CV_Valentin_Tarantino.pdf'}
                  download
                  className="cta-button primary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3M12 15L8 11M12 15L16 11M2 17L2.621 19.485C2.72915 19.9177 2.97881 20.3018 3.32754 20.572C3.67627 20.8422 4.10267 20.9823 4.534 20.969H19.466C19.8973 20.9823 20.3237 20.8422 20.6725 20.572C21.0212 20.3018 21.2708 19.9177 21.379 19.485L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t.hero.downloadCV}</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className={`terminal-container ${superActive ? 'super-active' : ''}`}>
              <div className="terminal-header" onClick={focusInput}>
                <div className="terminal-buttons">
                  <span className="btn-close"></span>
                  <span className="btn-minimize"></span>
                  <span className="btn-maximize"></span>
                </div>
                <div className="terminal-title">developer.js</div>
              </div>
              <div className="terminal-body" onClick={focusInput} ref={terminalBodyRef}>
                {/* Initial object structure */}
                <div className="terminal-line">
                  <span className="command">const developer = {`{`}</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  name: </span>
                  <span className="string">"Valentín"</span>
                  <span>,</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  role: </span>
                  <span className="string">"Full Stack Dev"</span>
                  <span>,</span>
                </div>
                <div className="terminal-line">
                  <span className="indent">  passion: </span>
                  <span className="string">"Innovation"</span>
                </div>
                <div className="terminal-line">
                  <span className="command">{`};`}</span>
                </div>

                {/* Helpful tip */}
                <div className="terminal-line output-line" style={{ marginTop: '0.75rem', opacity: 0.5, fontSize: '0.8rem' }}>
                  <span>{isSpanish ? '// Escribe "help" y pulsa Enter' : '// Type "help" and press Enter'}</span>
                </div>

                {/* Commands history mapping */}
                {terminalHistory.map((item, index) => renderHistoryItem(item, index, isSpanish))}

                {/* Active interactive prompt input */}
                {!isCompiling && (
                  <div className="terminal-input-wrapper">
                    <span className="prompt">
                      {trivia 
                        ? `${isSpanish ? 'pregunta' : 'question'}-${trivia.step}:~$` 
                        : 'visitor@valentin:~$'}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      className="terminal-hidden-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleCommand}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                )}

                {/* Loading indicator line during compile command */}
                {isCompiling && (
                  <div className="terminal-line" style={{ marginTop: '0.25rem' }}>
                    <span className="cursor-blink"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator" onClick={scrollToAbout}>
          <div className="scroll-arrow"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
