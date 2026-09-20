import { useRef, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DOC_REF = doc(db, 'dino_leaderboard', 'global');

const DinoGame = ({ onExit, isSpanish }) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const animRef = useRef(null);
  const cleanupRef = useRef(null);

  const W = 600;
  const H = 270;
  const GROUND = 170;

  const INITIAL_SPEED = 2.6;
  const MAX_SPEED = 10;
  const ACCELERATION = 0.0015;
  const JUMP_VEL = -8.7;
  const GRAVITY = 0.30;
  const NIGHT_DISTANCE = 700;
  const NIGHT_FADE_FRAMES = 40;
  const FLASH_DURATION = 16;

  const initGame = useCallback((hs) => {
    const stars = [];
    for (let i = 0; i < 15; i++) {
      stars.push({
        x: Math.random() * W,
        y: 5 + Math.random() * 55,
        size: Math.random() > 0.5 ? 3 : 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return {
      status: 'waiting',
      speed: INITIAL_SPEED,
      distance: 0,
      score: 0,
      highScore: hs || 0,
      frame: 0,

      // Night mode
      nightMode: false,
      nightFade: 0,
      nightCycles: 0,

      // Flash on milestone
      flashTimer: 0,
      lastMilestone: 0,

      // Dino
      dino: {
        x: 25, y: GROUND - 44, w: 40, h: 44,
        vy: 0, jumping: false, dead: false,
        runFrame: 0, runTimer: 0, blinkTimer: 0,
      },

      // Ground segments
      groundOffset: 0,

      // Obstacles
      obstacles: [],
      obstacleTimer: 60,

      // Clouds
      clouds: [
        { x: 80, y: 18 }, { x: 260, y: 32 }, { x: 440, y: 12 },
      ],

      // Stars & moon (night)
      stars,
      moonX: W + 50,
      moonPhase: 0,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let destroyed = false;
    getDoc(DOC_REF).then(snap => {
      if (destroyed) return;
      const hs = snap.exists() ? snap.data().highScore : 0;
      gameRef.current = initGame(hs);

      // --- Color system ---
      const DAY = { bg: [247, 247, 247], fg: [83, 83, 83] };
      const NIGHT = { bg: [38, 38, 60], fg: [224, 224, 224] };

      const lerp = (a, b, t) => Math.round(a + (b - a) * t);
      const getColors = (g) => {
        const t = g.nightFade;
        return {
          bg: `rgb(${lerp(DAY.bg[0], NIGHT.bg[0], t)},${lerp(DAY.bg[1], NIGHT.bg[1], t)},${lerp(DAY.bg[2], NIGHT.bg[2], t)})`,
          fg: `rgb(${lerp(DAY.fg[0], NIGHT.fg[0], t)},${lerp(DAY.fg[1], NIGHT.fg[1], t)},${lerp(DAY.fg[2], NIGHT.fg[2], t)})`,
        };
      };

      // --- Sprite drawing ---
      // All sprites drawn procedurally to match Chrome T-Rex style

      const drawDinoStand = (x, y, color) => {
        ctx.fillStyle = color;
        // Head
        ctx.fillRect(x + 16, y, 24, 12);
        ctx.fillRect(x + 14, y + 4, 2, 8);
        ctx.fillRect(x + 12, y + 6, 2, 6);
        // Jaw
        ctx.fillRect(x + 22, y + 12, 18, 4);
        // Eye socket (bg-colored hole)
        const bgC = getColors(gameRef.current).bg;
        ctx.fillStyle = bgC;
        ctx.fillRect(x + 30, y + 4, 4, 4);
        ctx.fillStyle = color;
        // Neck
        ctx.fillRect(x + 14, y + 12, 10, 6);
        // Body
        ctx.fillRect(x + 6, y + 16, 28, 16);
        ctx.fillRect(x + 4, y + 18, 2, 12);
        ctx.fillRect(x + 2, y + 20, 2, 8);
        // Arm
        ctx.fillRect(x + 26, y + 26, 6, 6);
        ctx.fillRect(x + 30, y + 30, 4, 4);
        // Tail
        ctx.fillRect(x, y + 18, 4, 4);
        ctx.fillRect(x - 2, y + 16, 4, 4);
        ctx.fillRect(x - 4, y + 14, 4, 4);
        // Left leg
        ctx.fillRect(x + 10, y + 32, 6, 8);
        ctx.fillRect(x + 10, y + 38, 8, 4);
        // Right leg
        ctx.fillRect(x + 22, y + 32, 6, 8);
        ctx.fillRect(x + 22, y + 38, 8, 4);
      };

      const drawDinoRun = (x, y, color, frame) => {
        ctx.fillStyle = color;
        // Head
        ctx.fillRect(x + 16, y, 24, 12);
        ctx.fillRect(x + 14, y + 4, 2, 8);
        ctx.fillRect(x + 12, y + 6, 2, 6);
        // Jaw
        ctx.fillRect(x + 22, y + 12, 18, 4);
        // Eye socket
        const bgC = getColors(gameRef.current).bg;
        ctx.fillStyle = bgC;
        ctx.fillRect(x + 30, y + 4, 4, 4);
        ctx.fillStyle = color;
        // Neck
        ctx.fillRect(x + 14, y + 12, 10, 6);
        // Body
        ctx.fillRect(x + 6, y + 16, 28, 16);
        ctx.fillRect(x + 4, y + 18, 2, 12);
        ctx.fillRect(x + 2, y + 20, 2, 8);
        // Arm
        ctx.fillRect(x + 26, y + 26, 6, 6);
        ctx.fillRect(x + 30, y + 30, 4, 4);
        // Tail
        ctx.fillRect(x, y + 18, 4, 4);
        ctx.fillRect(x - 2, y + 16, 4, 4);
        ctx.fillRect(x - 4, y + 14, 4, 4);
        // Legs (animated)
        if (frame === 0) {
          // Right leg forward, left leg back
          ctx.fillRect(x + 10, y + 32, 6, 6);
          ctx.fillRect(x + 8, y + 36, 4, 2);
          ctx.fillRect(x + 22, y + 32, 6, 10);
          ctx.fillRect(x + 22, y + 40, 8, 2);
        } else {
          // Left leg forward, right leg back
          ctx.fillRect(x + 10, y + 32, 6, 10);
          ctx.fillRect(x + 10, y + 40, 8, 2);
          ctx.fillRect(x + 22, y + 32, 6, 6);
          ctx.fillRect(x + 28, y + 36, 4, 2);
        }
      };

      const drawDinoDead = (x, y, color) => {
        ctx.fillStyle = color;
        // Head
        ctx.fillRect(x + 16, y, 24, 12);
        ctx.fillRect(x + 14, y + 4, 2, 8);
        ctx.fillRect(x + 12, y + 6, 2, 6);
        // Jaw open
        ctx.fillRect(x + 22, y + 12, 18, 5);
        // X eyes
        const bgC = getColors(gameRef.current).bg;
        ctx.fillStyle = bgC;
        ctx.fillRect(x + 28, y + 3, 2, 2);
        ctx.fillRect(x + 32, y + 3, 2, 2);
        ctx.fillRect(x + 30, y + 5, 2, 2);
        ctx.fillRect(x + 28, y + 7, 2, 2);
        ctx.fillRect(x + 32, y + 7, 2, 2);
        ctx.fillStyle = color;
        // Neck + body
        ctx.fillRect(x + 14, y + 12, 10, 6);
        ctx.fillRect(x + 6, y + 16, 28, 16);
        ctx.fillRect(x + 4, y + 18, 2, 12);
        ctx.fillRect(x + 2, y + 20, 2, 8);
        // Arm
        ctx.fillRect(x + 26, y + 26, 6, 6);
        ctx.fillRect(x + 30, y + 30, 4, 4);
        // Tail
        ctx.fillRect(x, y + 18, 4, 4);
        ctx.fillRect(x - 2, y + 16, 4, 4);
        ctx.fillRect(x - 4, y + 14, 4, 4);
        // Legs straight
        ctx.fillRect(x + 10, y + 32, 6, 8);
        ctx.fillRect(x + 10, y + 38, 8, 4);
        ctx.fillRect(x + 22, y + 32, 6, 8);
        ctx.fillRect(x + 22, y + 38, 8, 4);
      };

      const drawCactusSmall = (x, color) => {
        ctx.fillStyle = color;
        const y = GROUND - 28;
        // Trunk
        ctx.fillRect(x + 4, y, 6, 28);
        // Left arm
        ctx.fillRect(x, y + 8, 4, 4);
        ctx.fillRect(x, y + 4, 2, 8);
        // Right arm
        ctx.fillRect(x + 10, y + 12, 4, 4);
        ctx.fillRect(x + 12, y + 8, 2, 8);
        // Spikes
        ctx.fillRect(x + 2, y - 2, 2, 4);
        ctx.fillRect(x + 8, y - 2, 2, 4);
      };

      const drawCactusLarge = (x, color) => {
        ctx.fillStyle = color;
        const y = GROUND - 40;
        // Trunk
        ctx.fillRect(x + 6, y, 8, 40);
        // Left arm
        ctx.fillRect(x, y + 12, 6, 6);
        ctx.fillRect(x, y + 6, 3, 12);
        // Right arm
        ctx.fillRect(x + 14, y + 18, 6, 6);
        ctx.fillRect(x + 17, y + 12, 3, 12);
        // Top
        ctx.fillRect(x + 4, y - 2, 4, 4);
        ctx.fillRect(x + 12, y - 2, 4, 4);
      };

      const drawCactusDouble = (x, color) => {
        ctx.fillStyle = color;
        // First cactus
        const y1 = GROUND - 32;
        ctx.fillRect(x + 2, y1, 6, 32);
        ctx.fillRect(x, y1 + 8, 2, 4);
        ctx.fillRect(x + 8, y1 + 14, 2, 4);
        ctx.fillRect(x + 4, y1 - 2, 2, 4);
        // Second cactus (taller, offset)
        const y2 = GROUND - 38;
        ctx.fillRect(x + 14, y2, 6, 38);
        ctx.fillRect(x + 12, y2 + 10, 2, 4);
        ctx.fillRect(x + 20, y2 + 18, 2, 4);
        ctx.fillRect(x + 16, y2 - 2, 2, 4);
      };

      const drawPterodactyl = (x, y, color, frame) => {
        ctx.fillStyle = color;
        // Body
        ctx.fillRect(x + 4, y + 10, 28, 8);
        // Head
        ctx.fillRect(x + 30, y + 8, 12, 6);
        ctx.fillRect(x + 40, y + 10, 6, 3);
        // Eye
        const bgC = getColors(gameRef.current).bg;
        ctx.fillStyle = bgC;
        ctx.fillRect(x + 34, y + 10, 2, 2);
        ctx.fillStyle = color;
        // Tail
        ctx.fillRect(x, y + 12, 6, 4);
        // Wings
        if (frame === 0) {
          // Wings up
          ctx.fillRect(x + 8, y, 6, 12);
          ctx.fillRect(x + 12, y - 4, 8, 8);
          ctx.fillRect(x + 18, y - 6, 6, 6);
        } else {
          // Wings down
          ctx.fillRect(x + 8, y + 16, 6, 10);
          ctx.fillRect(x + 12, y + 22, 8, 6);
          ctx.fillRect(x + 18, y + 24, 6, 4);
        }
      };

      const drawCloud = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(x, y + 4, 32, 6);
        ctx.fillRect(x + 4, y, 22, 6);
        ctx.fillRect(x + 10, y - 2, 12, 4);
        ctx.globalAlpha = 1;
      };

      const drawStar = (x, y, size, color, alpha) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        // Cross shape
        ctx.fillRect(x, y - size, size, size * 3);
        ctx.fillRect(x - size, y, size * 3, size);
        ctx.globalAlpha = 1;
      };

      const drawMoon = (x, y, color, phase) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        // Circle
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        // Phase shadow (carve out a crescent)
        const bgC = getColors(gameRef.current).bg;
        ctx.fillStyle = bgC;
        const offset = [-8, -4, 0, 4, 8][phase % 5];
        ctx.beginPath();
        ctx.arc(x + 12 + offset, y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      };

      const drawGround = (g, color) => {
        ctx.fillStyle = color;
        // Main ground line
        ctx.fillRect(0, GROUND, W, 2);
        // Bumps scrolling
        const offset = g.groundOffset % W;
        ctx.globalAlpha = 0.5;
        for (let i = -1; i < W / 12 + 2; i++) {
          const bx = i * 12 - (offset % 12);
          const pattern = ((i * 7 + Math.floor(offset / 12)) % 5);
          if (pattern < 2) {
            ctx.fillRect(bx, GROUND + 4 + pattern * 3, 3 + pattern * 2, 1);
          }
          if (pattern === 3) {
            ctx.fillRect(bx + 2, GROUND + 6, 6, 1);
          }
        }
        ctx.globalAlpha = 1;
      };

      const drawScore = (g, color) => {
        ctx.fillStyle = color;
        ctx.font = 'bold 18px monospace';
        const scoreStr = String(Math.floor(g.score)).padStart(5, '0');
        const hiStr = String(g.highScore).padStart(5, '0');

        // Flash effect
        if (g.flashTimer > 0 && g.flashTimer % 4 < 2) return;

        ctx.fillText(`HI ${hiStr}  ${scoreStr}`, W - 240, 26);
      };

      const drawGameOver = (g, color) => {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px monospace';
        const text = 'G A M E   O V E R';
        const tw = ctx.measureText(text).width;
        ctx.fillText(text, (W - tw) / 2, 55);

        // Restart icon (circular arrow)
        const cx = W / 2;
        const cy = 75;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, -Math.PI * 0.3, Math.PI * 1.3);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 7);
        ctx.lineTo(cx + 8, cy - 1);
        ctx.lineTo(cx + 14, cy - 4);
        ctx.closePath();
        ctx.fill();
      };

      const drawWaitScreen = () => { };

      // --- GAME LOGIC ---

      const spawnObstacle = (g) => {
        const rand = Math.random();
        let obs;

        if (rand > 0.5) {
          obs = { type: 'cactus_large', x: W + 10, y: GROUND - 40, w: 20, h: 40 };
        } else if (rand > 0.25) {
          obs = { type: 'cactus_double', x: W + 10, y: GROUND - 38, w: 22, h: 38 };
        } else {
          obs = { type: 'cactus_small', x: W + 10, y: GROUND - 28, w: 14, h: 28 };
        }

        g.obstacles.push(obs);
      };

      const getMinGap = (speed) => {
        return Math.max(250, speed * 25 + 100);
      };

      const update = (g) => {
        if (g.status !== 'playing') return;

        g.frame++;
        g.speed = Math.min(MAX_SPEED, g.speed + ACCELERATION);
        g.distance += g.speed;
        g.score = g.distance * 0.025;
        g.groundOffset += g.speed;

        // Milestone flash
        const milestone = Math.floor(g.score / 100) * 100;
        if (milestone > 0 && milestone > g.lastMilestone) {
          g.lastMilestone = milestone;
          g.flashTimer = FLASH_DURATION;
        }
        if (g.flashTimer > 0) g.flashTimer--;

        // Day/night cycle
        const nightCyclePos = Math.floor(g.distance / (NIGHT_DISTANCE / 0.025));
        if (nightCyclePos > g.nightCycles) {
          g.nightCycles = nightCyclePos;
          g.nightMode = !g.nightMode;
        }
        // Fade transition
        const targetFade = g.nightMode ? 1 : 0;
        if (g.nightFade < targetFade) {
          g.nightFade = Math.min(1, g.nightFade + 1 / NIGHT_FADE_FRAMES);
        } else if (g.nightFade > targetFade) {
          g.nightFade = Math.max(0, g.nightFade - 1 / NIGHT_FADE_FRAMES);
        }

        // Dino physics
        const d = g.dino;
        if (d.jumping) {
          d.vy += GRAVITY;
          d.y += d.vy;
          if (d.y >= GROUND - 44) {
            d.y = GROUND - 44;
            d.vy = 0;
            d.jumping = false;
          }
        } else {
          d.y = GROUND - 44;
        }

        // Run animation
        d.runTimer++;
        if (d.runTimer >= 6) {
          d.runTimer = 0;
          d.runFrame = d.runFrame === 0 ? 1 : 0;
        }

        // Spawn obstacles
        g.obstacleTimer--;
        if (g.obstacleTimer <= 0) {
          const lastObs = g.obstacles[g.obstacles.length - 1];
          if (!lastObs || lastObs.x < W - getMinGap(g.speed)) {
            spawnObstacle(g);
            g.obstacleTimer = 60 + Math.floor(Math.random() * 80);
          } else {
            g.obstacleTimer = 10;
          }
        }

        // Move obstacles
        g.obstacles.forEach(obs => {
          obs.x -= g.speed;
          if (obs.type === 'ptero') {
            obs.frameTimer++;
            if (obs.frameTimer >= 15) {
              obs.frameTimer = 0;
              obs.frame = obs.frame === 0 ? 1 : 0;
            }
          }
        });
        g.obstacles = g.obstacles.filter(obs => obs.x > -60);

        // Move clouds
        g.clouds.forEach(c => {
          c.x -= g.speed * 0.2;
          if (c.x < -40) {
            c.x = W + 20 + Math.random() * 80;
            c.y = 10 + Math.random() * 40;
          }
        });

        // Move moon (night)
        if (g.nightMode || g.nightFade > 0) {
          g.moonX -= g.speed * 0.1;
          if (g.moonX < -30) {
            g.moonX = W + 30;
            g.moonPhase = (g.moonPhase + 1) % 5;
          }
        }

        // Stars twinkle
        g.stars.forEach(s => {
          s.phase += 0.03;
        });

        // Collision detection
        const dBox = { x: d.x + 6, y: d.y + 4, w: 32, h: 38 };

        for (const obs of g.obstacles) {
          let oBox;
          if (obs.type === 'ptero') {
            oBox = { x: obs.x + 6, y: obs.y + 6, w: 36, h: 18 };
          } else if (obs.type === 'cactus_small') {
            oBox = { x: obs.x + 2, y: obs.y + 2, w: 10, h: 24 };
          } else if (obs.type === 'cactus_large') {
            oBox = { x: obs.x + 4, y: obs.y + 2, w: 14, h: 36 };
          } else {
            oBox = { x: obs.x + 2, y: obs.y + 2, w: 18, h: 34 };
          }

          if (
            dBox.x < oBox.x + oBox.w &&
            dBox.x + dBox.w > oBox.x &&
            dBox.y < oBox.y + oBox.h &&
            dBox.y + dBox.h > oBox.y
          ) {
            d.dead = true;
            g.status = 'gameover';
            if (Math.floor(g.score) > g.highScore) {
              g.highScore = Math.floor(g.score);
              setDoc(DOC_REF, { highScore: g.highScore }).catch(() => { });
            }
            break;
          }
        }
      };

      // --- RENDER ---
      const render = (g) => {
        const colors = getColors(g);

        // Background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, W, H);

        // Stars (only visible at night)
        if (g.nightFade > 0.1) {
          g.stars.forEach(s => {
            const alpha = g.nightFade * (0.4 + 0.6 * Math.sin(s.phase));
            drawStar(s.x, s.y, s.size, colors.fg, alpha * 0.6);
          });
        }

        // Moon
        if (g.nightFade > 0.1) {
          drawMoon(g.moonX, 10, colors.fg, g.moonPhase);
        }

        // Clouds
        g.clouds.forEach(c => drawCloud(c.x, c.y, colors.fg));

        // Ground
        drawGround(g, colors.fg);

        // Obstacles
        g.obstacles.forEach(obs => {
          if (obs.type === 'cactus_small') drawCactusSmall(obs.x, colors.fg);
          else if (obs.type === 'cactus_large') drawCactusLarge(obs.x, colors.fg);
          else if (obs.type === 'cactus_double') drawCactusDouble(obs.x, colors.fg);
          else if (obs.type === 'ptero') drawPterodactyl(obs.x, obs.y, colors.fg, obs.frame);
        });

        // Dino
        const d = g.dino;
        if (d.dead) {
          drawDinoDead(d.x, d.y, colors.fg);
        } else if (d.jumping) {
          drawDinoStand(d.x, d.y, colors.fg);
        } else if (g.status === 'waiting') {
          // Blink animation
          d.blinkTimer++;
          if (d.blinkTimer > 60 && d.blinkTimer < 68) {
            drawDinoDead(d.x, GROUND - 44, colors.fg); // reuse for blink
          } else {
            drawDinoStand(d.x, GROUND - 44, colors.fg);
            if (d.blinkTimer > 100) d.blinkTimer = 0;
          }
        } else {
          drawDinoRun(d.x, d.y, colors.fg, d.runFrame);
        }

        // Score
        if (g.status !== 'waiting') drawScore(g, colors.fg);

        // Game over overlay
        if (g.status === 'gameover') drawGameOver(g, colors.fg);

        // Waiting screen
        if (g.status === 'waiting') drawWaitScreen(g, colors.fg);
      };

      // --- MAIN LOOP ---
      const loop = () => {
        const g = gameRef.current;
        if (!g) return;
        update(g);
        render(g);
        animRef.current = requestAnimationFrame(loop);
      };
      loop();

      // --- INPUT ---
      const handleKeyDown = (e) => {
        const g = gameRef.current;
        if (!g) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onExit();
          return;
        }

        if (e.key === ' ' || e.key === 'ArrowUp') {
          e.preventDefault();
          e.stopPropagation();

          if (g.status === 'waiting') {
            g.status = 'playing';
            g.dino.jumping = true;
            g.dino.vy = JUMP_VEL;
            return;
          }

          if (g.status === 'gameover') {
            // Restart
            const hs = g.highScore;
            gameRef.current = initGame();
            gameRef.current.highScore = hs;
            gameRef.current.status = 'playing';
            gameRef.current.dino.jumping = true;
            gameRef.current.dino.vy = JUMP_VEL;
            return;
          }

          if (!g.dino.jumping) {
            g.dino.jumping = true;
            g.dino.vy = JUMP_VEL;
          }
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (g.status === 'gameover') {
            const hs = g.highScore;
            gameRef.current = initGame();
            gameRef.current.highScore = hs;
            gameRef.current.status = 'playing';
            gameRef.current.dino.jumping = true;
            gameRef.current.dino.vy = JUMP_VEL;
          }
        }
      };

      const handleKeyUp = () => { };

      window.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('keyup', handleKeyUp, true);

      cleanupRef.current = () => {
        window.removeEventListener('keydown', handleKeyDown, true);
        window.removeEventListener('keyup', handleKeyUp, true);
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    }); // end getDoc.then

    return () => {
      destroyed = true;
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [onExit, isSpanish]);

  return (
    <div style={{ margin: '0.5rem 0', textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          maxWidth: '800px',
          height: 'auto',
          borderRadius: '6px',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default DinoGame;
