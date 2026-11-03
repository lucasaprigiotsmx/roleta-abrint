import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { soundFX } from '@/lib/sound';

export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  percentage: number;
  showCongrats?: boolean;
  customMessage?: string;
}

interface WheelProps {
  segments: WheelSegment[];
  onSpinComplete?: (winnerSegment: WheelSegment) => void;
  isSpinning?: boolean;
  isStatic?: boolean;
  canvasSize?: number;
  containerClassName?: string;
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export function Wheel({
  segments,
  onSpinComplete,
  isStatic = false,
  canvasSize = 820,
  containerClassName = 'w-full max-w-[780px]',
  disabled = false,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [dynamicCanvasSize, setDynamicCanvasSize] = useState(canvasSize);
  const [fontLoaded, setFontLoaded] = useState(false);
  const pointerAngleRef = useRef(0);
  const lastSegmentIndexRef = useRef<number>(-1);

  // Re-render canvas once Clash Display webfont finishes loading
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    }
  }, []);

  // Responsive high-DPI canvas sizing
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          const size = Math.min(width, height > 0 ? height : width);
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          setDynamicCanvasSize(Math.min(Math.round(size * pixelRatio), 1800));
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to get segment index currently under top pointer (0 deg)
  const getSegmentIndexAtPointer = useCallback(
    (currentRot: number) => {
      if (segments.length === 0) return 0;
      const normalizedAngle = ((360 - (currentRot % 360)) + 360) % 360;
      let accAngle = 0;
      for (let i = 0; i < segments.length; i++) {
        const sliceAngle = isStatic
          ? 360 / segments.length
          : (segments[i].percentage / 100) * 360;
        if (normalizedAngle >= accAngle && normalizedAngle < accAngle + sliceAngle) {
          return i;
        }
        accAngle += sliceAngle;
      }
      return segments.length - 1;
    },
    [segments, isStatic]
  );

  // Draw the wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || segments.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = dynamicCanvasSize / 500;
    const centerX = dynamicCanvasSize / 2;
    const centerY = dynamicCanvasSize / 2;
    const outerRadius = Math.min(centerX, centerY) - 10 * scale;
    const rimWidth = 18 * scale;
    const wheelRadius = outerRadius - rimWidth;

    ctx.clearRect(0, 0, dynamicCanvasSize, dynamicCanvasSize);

    // 1. Outer Matte Charcoal Bezel
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#141414';
    ctx.fill();

    // Matte TSMX orange outer border ring
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#F26521';
    ctx.stroke();

    // Subtle dark inner border ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius + 1.5 * scale, 0, Math.PI * 2);
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#262626';
    ctx.stroke();
    ctx.restore();

    // 2. Subtle Matte Studs on Outer Bezel
    const numStuds = 24;
    const studOrbitRadius = wheelRadius + rimWidth / 2 + 0.5 * scale;
    for (let i = 0; i < numStuds; i++) {
      const angle = (i * (360 / numStuds) - 90) * (Math.PI / 180);
      const lx = centerX + Math.cos(angle) * studOrbitRadius;
      const ly = centerY + Math.sin(angle) * studOrbitRadius;
      const isPrimary = i % 2 === 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, (isPrimary ? 3 : 2.2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = isPrimary ? '#F26521' : '#333333';
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Rotating Wheel Segments (Flat Matte Corporate Finish)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((rotation - 90) * Math.PI) / 180);

    let currentAngle = 0;
    const pegAngles: number[] = [];

    segments.forEach((segment) => {
      const sliceAngle = isStatic
        ? 360 / segments.length
        : (segment.percentage / 100) * 360;

      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + sliceAngle) * Math.PI) / 180;
      pegAngles.push(startAngle);

      // Solid matte segment fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      // Clean dark divider line
      ctx.strokeStyle = '#0D0D0D';
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      // Draw Prize Text radially along the slice bisector using Clash Display
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      ctx.save();
      ctx.rotate(midAngle);

      const baseFontSize = segments.length > 8 ? 14 : segments.length > 6 ? 16 : 18;
      const lengthFactor =
        segment.label.length > 18 ? 0.84 : segment.label.length > 12 ? 0.92 : 1;
      const fontSize = Math.round(baseFontSize * lengthFactor * scale);

      ctx.font = `700 ${fontSize}px "Clash Display", sans-serif`;
      ctx.fillStyle = '#F2F2F2';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textRadius = wheelRadius * 0.62;
      const maxTextWidth = wheelRadius * 0.52;
      const lineHeight = fontSize * 1.15;

      wrapRadialText(ctx, segment.label.toUpperCase(), textRadius, 0, maxTextWidth, lineHeight);
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // 4. Pegs (Pinos) at segment boundaries
    pegAngles.forEach((angle) => {
      const px = Math.cos(angle) * (wheelRadius - 4 * scale);
      const py = Math.sin(angle) * (wheelRadius - 4 * scale);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 3.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#E5E5E5';
      ctx.fill();
      ctx.lineWidth = 1.5 * scale;
      ctx.strokeStyle = '#141414';
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();

    // 5. Top Pointer (Matte White & Charcoal Stand Style)
    ctx.save();
    const pointerPivotX = centerX;
    const pointerPivotY = centerY - outerRadius + 4 * scale;
    ctx.translate(pointerPivotX, pointerPivotY);
    ctx.rotate((pointerAngleRef.current * Math.PI) / 180);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 6 * scale;
    ctx.shadowOffsetY = 3 * scale;

    ctx.beginPath();
    ctx.moveTo(0, 34 * scale);
    ctx.lineTo(-14 * scale, 4 * scale);
    ctx.arc(0, 0, 14 * scale, Math.PI, 0, false);
    ctx.lineTo(14 * scale, 4 * scale);
    ctx.closePath();

    ctx.fillStyle = '#F2F2F2';
    ctx.fill();

    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#141414';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 2 * scale, 4.8 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#F26521';
    ctx.fill();

    ctx.restore();
  }, [segments, rotation, isStatic, dynamicCanvasSize, fontLoaded]);

  const spin = useCallback(() => {
    if (spinning || disabled || segments.length === 0) return;

    setSpinning(true);

    const random = Math.random() * 100;
    let accumulated = 0;
    let winnerIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      accumulated += segments[i].percentage;
      if (random <= accumulated) {
        winnerIndex = i;
        break;
      }
    }
    const winner = segments[winnerIndex];

    let winnerStartAngle = 0;
    for (let i = 0; i < winnerIndex; i++) {
      winnerStartAngle += isStatic ? 360 / segments.length : segments[i].percentage * 3.6;
    }
    const winnerArc = isStatic ? 360 / segments.length : winner.percentage * 3.6;
    const jitter = (Math.random() - 0.5) * (winnerArc * 0.4);
    const targetAngleInWheel = winnerStartAngle + winnerArc / 2 + jitter;
    const finalRotationAtTop = (360 - targetAngleInWheel + 360) % 360;

    const spins = 6 + Math.floor(Math.random() * 3);
    const totalRotation =
      spins * 360 + ((finalRotationAtTop - (rotation % 360) + 360) % 360);

    const startRotation = rotation;
    const duration = 4800;
    const startTime = performance.now();
    lastSegmentIndexRef.current = getSegmentIndexAtPointer(startRotation);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + totalRotation * easeProgress;

      const currentSegIdx = getSegmentIndexAtPointer(currentRotation);
      if (currentSegIdx !== lastSegmentIndexRef.current) {
        lastSegmentIndexRef.current = currentSegIdx;
        const speedFactor = Math.max(0.4, 1 - progress);
        soundFX.playTick(speedFactor);
        pointerAngleRef.current = -24 * Math.max(0.35, 1 - progress * 0.6);
      } else {
        pointerAngleRef.current *= 0.82;
      }

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pointerAngleRef.current = 0;
        setRotation(startRotation + totalRotation);
        setSpinning(false);
        onSpinComplete?.(winner);
      }
    };

    requestAnimationFrame(animate);
  }, [spinning, disabled, segments, isStatic, rotation, getSegmentIndexAtPointer, onSpinComplete]);

  const reset = () => {
    if (spinning) return;
    pointerAngleRef.current = 0;
    setRotation(0);
    setSpinning(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || spinning) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spin, disabled, spinning]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-5 select-none">
      {/* Wheel Stage */}
      <div
        ref={containerRef}
        className={`relative w-full ${containerClassName} aspect-square flex items-center justify-center`}
      >
        <canvas
          ref={canvasRef}
          width={dynamicCanvasSize}
          height={dynamicCanvasSize}
          onClick={spin}
          className="w-full h-full object-contain cursor-pointer drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)]"
        />

        {/* Center Matte Hub Button with TSMX Logo */}
        <button
          type="button"
          onClick={spin}
          disabled={spinning || disabled}
          aria-label="Girar Roleta"
          className="group absolute w-[20%] h-[20%] rounded-full flex flex-col items-center justify-center bg-[#121212] border-[3px] border-[#2A2A2A] hover:border-[#F26521] shadow-[0_6px_20px_rgba(0,0,0,0.85)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed overflow-hidden"
        >
          <img
            src="/logo-tsmx.webp"
            alt="TSMX"
            className="w-[70%] h-auto object-contain"
          />
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-display font-bold tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">
            {spinning ? 'Girando' : 'Girar'}
          </span>
        </button>
      </div>
    </div>
  );
}

function wrapRadialText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = y - totalHeight / 2;

  lines.forEach((line, index) => {
    context.fillText(line, x, startY + index * lineHeight);
  });
}
