import React, { useEffect, useRef, useState } from 'react';

interface TowerDefenseProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

const TowerDefense: React.FC<TowerDefenseProps> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [money, setMoney] = useState(500);

  // Tower Types
  const TOWER_TYPES = [
    { name: 'Basic', cost: 100, range: 100, damage: 1, color: '#06b6d4' },
    { name: 'Sniper', cost: 250, range: 250, damage: 3, color: '#3b82f6' },
    { name: 'Splash', cost: 400, range: 150, damage: 2, color: '#8b5cf6' },
  ];

  const [selectedTowerType, setSelectedTowerType] = useState(0);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let towers: any[] = [];
    let enemies: any[] = [];
    let projectiles: any[] = [];
    let wave = 1;
    let spawnTimer = 0;

    const path = [
      { x: 0, y: 150 },
      { x: 250, y: 150 },
      { x: 250, y: 350 },
      { x: 550, y: 350 },
      { x: 550, y: 100 },
      { x: 800, y: 100 },
    ];

    const handleClick = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       const x = e.clientX - rect.left;
       const y = e.clientY - rect.top;

       const towerType = TOWER_TYPES[selectedTowerType];
       if (money >= towerType.cost) {
         towers.push({ x, y, ...towerType, cooldown: 0 });
         setMoney(m => m - towerType.cost);
       }
    };
    canvas.addEventListener('click', handleClick);

    let animationFrameId: number;
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Path
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 40;
      ctx.stroke();
      ctx.closePath();

      // Enemies
      spawnTimer++;
      if (spawnTimer > 60 / (1 + level * 0.1)) {
        enemies.push({
          x: path[0].x,
          y: path[0].y,
          targetIndex: 1,
          hp: 3 + level,
          speed: 1.5 + difficulty * 0.5,
          value: 20
        });
        spawnTimer = 0;
      }

      enemies.forEach((e, idx) => {
        const target = path[e.targetIndex];
        const dx = target.x - e.x;
        const dy = target.y - e.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 5) {
          e.targetIndex++;
          if (e.targetIndex >= path.length) {
            setLives(l => l - 1);
            enemies.splice(idx, 1);
            return;
          }
        } else {
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        }

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
      });

      // Towers
      towers.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillRect(t.x - 15, t.y - 15, 30, 30);
        
        if (t.cooldown > 0) t.cooldown--;
        else {
           const nearest = enemies.find(e => {
             const dist = Math.sqrt((e.x - t.x)**2 + (e.y - t.y)**2);
             return dist <= t.range;
           });
           if (nearest) {
             projectiles.push({
               x: t.x, y: t.y,
               tx: nearest.x, ty: nearest.y,
               speed: 5, damage: t.damage
             });
             t.cooldown = 30;
           }
        }
      });

      // Projectiles
      projectiles.forEach((p, idx) => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 5) {
          const hit = enemies.find(e => Math.sqrt((e.x - p.tx)**2 + (e.y - p.ty)**2) < 15);
          if (hit) {
            hit.hp -= p.damage;
            if (hit.hp <= 0) {
              const hidx = enemies.indexOf(hit);
              enemies.splice(hidx, 1);
              setScore(s => s + hit.value);
              setMoney(m => m + hit.value);
            }
          }
          projectiles.splice(idx, 1);
        } else {
          p.x += (dx / dist) * p.speed;
          p.y += (dy / dist) * p.speed;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
          ctx.fill();
        }
      });

      if (lives <= 0) {
         setGameState('gameover');
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    return () => {
       canvas.removeEventListener('click', handleClick);
       cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, selectedTowerType, money, lives, level, difficulty]);

  useEffect(() => {
    if (gameState === 'gameover') {
       onGameEnd(score, score > level * 100);
    }
  }, [gameState]);

  return (
    <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden">
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" />
      
      {gameState === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <h3 className="text-4xl font-bold text-blue-400 mb-4 neon-text">Crypto Defender</h3>
          <p className="text-white mb-6 text-center max-w-md px-4">Place towers to defend your mining rig from malicious crypto-viruses.</p>
          <button 
            onClick={() => setGameState('playing')}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            START DEFENSE
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex gap-2">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span className="text-gray-400 text-xs uppercase block">Money</span>
              <span className="text-yellow-400 font-mono text-xl">${money}</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span className="text-gray-400 text-xs uppercase block">Lives</span>
              <span className="text-red-400 font-mono text-xl">♥ {lives}</span>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {TOWER_TYPES.map((t, i) => (
               <button
                 key={i}
                 onClick={() => setSelectedTowerType(i)}
                 className={`px-4 py-2 rounded-xl border-2 transition-all flex flex-col items-center ${
                   selectedTowerType === i ? 'border-cyan-400 bg-cyan-400/20' : 'border-white/10 bg-black/40'
                 }`}
               >
                 <span className="text-white text-xs font-bold">{t.name}</span>
                 <span className="text-cyan-400 font-mono text-sm">${t.cost}</span>
               </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
          <h3 className="text-4xl font-bold text-white mb-2">RIG BREACHED</h3>
          <div className="text-blue-400 text-2xl font-mono mb-6">{score} viruses blocked</div>
          <button 
            onClick={() => {
              setGameState('start');
              setScore(0);
              setLives(10);
              setMoney(500);
            }}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};

export default TowerDefense;
