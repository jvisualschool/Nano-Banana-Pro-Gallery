import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface StarfieldConfig {
  count: number;
  speed: number;
  radius: number;
  width: number;
}

const defaultConfig: StarfieldConfig = {
  count: 80,
  speed: 0.002,
  radius: 360, // 300 * 1.2 = 360 (20% 증가)
  width: 1,
};

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const instanceRef = useRef<any>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let angle = 0;

    const config = { ...defaultConfig };
    const mouse = { x: width / 2, y: height / 2 };
    let points: Array<{ x: number; y: number; z: number }> = [];

    function initPoints() {
      points = [];
      for (let i = 0; i < config.count; i++) {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.sqrt(config.count * Math.PI) * theta;
        const r = config.radius;
        points.push({
          x: r * Math.sin(theta) * Math.cos(phi),
          y: r * Math.sin(theta) * Math.sin(phi),
          z: r * Math.cos(theta),
        });
      }
    }

    function project(p: { x: number; y: number; z: number }, width: number, height: number) {
      const mx = (mouse.x - width / 2) * 0.0001;
      const my = (mouse.y - height / 2) * 0.0001;

      const cosY = Math.cos(angle + mx);
      const sinY = Math.sin(angle + mx);
      const cosX = Math.cos(my);
      const sinX = Math.sin(my);

      // Rotate Y
      let x = p.x * cosY - p.z * sinY;
      let z = p.x * sinY + p.z * cosY;
      let y = p.y;

      // Rotate X
      let y1 = y * cosX - z * sinX;
      let z1 = z * cosX + y * sinX;

      const scale = 500 / (500 + z1 + config.radius + 100);

      return {
        x: width / 2 + x * scale,
        y: height / 2 + y1 * scale,
        z: z1,
        scale: scale,
      };
    }

    function draw() {
      if (!ctx) return;
      
      const bg = isDark ? '#0f172a' : '#f8fafc';
      const pointColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
      const lineColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const projected = points.map((p) => project(p, width, height));

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = config.width;

      ctx.beginPath();
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

          if (dist < 60) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      projected.forEach((p) => {
        const size = 2 * p.scale;
        const alpha = (p.z + config.radius) / (2 * config.radius);
        const finalAlpha = Math.max(0.1, Math.min(1, alpha));

        ctx.fillStyle = pointColor.replace('0.8)', `${finalAlpha * 0.8})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function animate() {
      angle += config.speed;
      draw();
      animationIdRef.current = requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initPoints();
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    // Initialize
    if (!canvas) return;
    initPoints();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    width = canvas.width;
    height = canvas.height;

    animate();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    instanceRef.current = {
      cleanup: () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', handleMouseMove);
      },
    };

    return () => {
      if (instanceRef.current) {
        instanceRef.current.cleanup();
      }
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

