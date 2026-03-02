import { useEffect, useRef, useState } from 'react';

interface AsteroidBlitzProps {
  onGameEnd: (score: number, won: boolean) => void;
  difficulty: number;
  level: number;
  durationSeconds: number;
}

interface Asteroid {
  x: number;
  y: number;
  r: number;
  speed: number;
}

interface Laser {
  x: number;
  y: number;
  speed: number;
}

export default function AsteroidBlitz({ onGameEnd, difficulty, level, durationSeconds }: AsteroidBlitzProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [lives, setLives] = useState(3);

  const shipX = useRef(360);
  const asteroids = useRef<Asteroid[]>([]);
  const lasers = useRef<Laser[]>([]);
  const spawnTimer = useRef(0);
  const shotTimer = useRef(0);

  const targetScore = Math.max(100, 120 + level * 35 + difficulty * 40);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying && timeLeft === 0) {
      onGameEnd(score, score >= targetScore);
    }
  }, [isPlaying, timeLeft, score, targetScore, onGameEnd]);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      shipX.current = Math.max(28, Math.min(canvas.width - 28, x));
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') shipX.current = Math.max(28, shipX.current - 34);
      if (e.key === 'ArrowRight') shipX.current = Math.min(canvas.width - 28, shipX.current + 34);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKey);

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#1c2640');
      sky.addColorStop(1, '#080c16');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      spawnTimer.current += 1;
      shotTimer.current += 1;
      const spawnRate = Math.max(18, 62 - level * 2 - difficulty * 4);
      if (spawnTimer.current >= spawnRate) {
        spawnTimer.current = 0;
        asteroids.current.push({
          x: 20 + Math.random() * (w - 40),
          y: -20,
          r: 10 + Math.random() * 12,
          speed: 1.2 + difficulty * 0.3 + level * 0.04,
        });
      }

      const shotRate = Math.max(6, 14 - difficulty);
      if (shotTimer.current >= shotRate) {
        shotTimer.current = 0;
        lasers.current.push({ x: shipX.current, y: h - 56, speed: 7 });
      }

      lasers.current = lasers.current
        .map((l) => ({ ...l, y: l.y - l.speed }))
        .filter((l) => l.y > -12);

      asteroids.current = asteroids.current.map((a) => ({ ...a, y: a.y + a.speed }));

      // collisions laser vs asteroid
      for (let ai = asteroids.current.length - 1; ai >= 0; ai--) {
        const a = asteroids.current[ai];
        let destroyed = false;
        for (let li = lasers.current.length - 1; li >= 0; li--) {
          const l = lasers.current[li];
          const dx = a.x - l.x;
          const dy = a.y - l.y;
          if (dx * dx + dy * dy <= (a.r + 4) * (a.r + 4)) {
            asteroids.current.splice(ai, 1);
            lasers.current.splice(li, 1);
            setScore((s) => s + 12);
            destroyed = true;
            break;
          }
        }
        if (destroyed) continue;
      }

      // asteroid hit floor => lose life
      for (let ai = asteroids.current.length - 1; ai >= 0; ai--) {
        if (asteroids.current[ai].y > h - 40) {
          asteroids.current.splice(ai, 1);
          setLives((prev) => {
            if (prev <= 1) {
              setIsPlaying(false);
              onGameEnd(score, false);
              return 0;
            }
            return prev - 1;
          });
        }
      }

      // draw asteroids
      asteroids.current.forEach((a) => {
        ctx.beginPath();
        ctx.fillStyle = '#7c3aed';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#a78bfa';
        ctx.arc(a.x - a.r * 0.25, a.y - a.r * 0.2, a.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });

      // draw lasers
      lasers.current.forEach((l) => {
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(l.x - 2, l.y - 8, 4, 12);
      });

      // draw ship
      ctx.save();
      ctx.translate(shipX.current, h - 36);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(14, 14);
      ctx.lineTo(-14, 14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(-4, 2, 8, 10);
      ctx.restore();

      // hud
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px Rajdhani';
      ctx.fillText(`Score: ${score}`, 16, 28);
      ctx.fillText(`Lives: ${lives}`, 16, 50);
      ctx.fillText(`Target: ${targetScore}`, w - 130, 28);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isPlaying, difficulty, level, lives, onGameEnd, score, targetScore]);

  const startGame = () => {
    asteroids.current = [];
    lasers.current = [];
    setScore(0);
    setLives(3);
    setTimeLeft(durationSeconds);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 bg-slate-950 text-white">
      <div className="flex items-center justify-between mb-3 text-sm text-slate-300">
        <span>Asteroid Blitz Protocol</span>
        <span>{timeLeft}s</span>
      </div>

      {!isPlaying && (
        <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
          <h3 className="text-lg font-bold text-cyan-300">Defend the mining core</h3>
          <p className="text-sm text-slate-300 mt-1">Use mouse or arrow keys to move. Auto-lasers destroy asteroids.</p>
          <button className="mt-3 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold" onClick={startGame}>
            Start mission
          </button>
        </div>
      )}

      <canvas ref={canvasRef} width={720} height={420} className="w-full rounded-lg border border-slate-700 bg-[#080c16]" />
    </div>
  );
}
