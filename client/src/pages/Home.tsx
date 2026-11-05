import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trophy,
  RotateCcw,
  X,
} from 'lucide-react';
import { Wheel, WheelSegment } from '@/components/Wheel';
import { WheelCustomizer } from '@/components/WheelCustomizer';
import { soundFX } from '@/lib/sound';

const STAND_PALETTE = ['#F26521', '#181818', '#D95616', '#242424'];

const OLD_NEON_OR_PASTEL_COLORS = new Set([
  '#ffd580',
  '#ffc966',
  '#ffb84d',
  '#ffa500',
  '#ff8c00',
  '#ff6b35',
  '#ff4500',
  '#e65100',
  '#ff6b00',
  '#e65c00',
  '#c84610',
  '#a63609',
]);

export const DEFAULT_SEGMENTS: WheelSegment[] = [
  {
    id: '1',
    label: 'Caderno com Caneta',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '2',
    label: 'Power Bank',
    color: '#F26521', // Laranja
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '3',
    label: 'Xícara TSMX',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '4',
    label: 'Garrafa',
    color: '#F26521', // Laranja
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '5',
    label: 'Caderno',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '6',
    label: 'Caneta',
    color: '#F26521', // Laranja
    percentage: 8.35,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '7',
    label: 'Caderno com Caneta',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '8',
    label: 'Power Bank',
    color: '#F26521', // Laranja
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '9',
    label: 'Xícara TSMX',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '10',
    label: 'Garrafa',
    color: '#F26521', // Laranja
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '11',
    label: 'Caderno',
    color: '#181818', // Preto
    percentage: 8.33,
    showCongrats: true,
    customMessage: '',
  },
  {
    id: '12',
    label: 'Caneta',
    color: '#F26521', // Laranja
    percentage: 8.35,
    showCongrats: true,
    customMessage: '',
  },
];

const PRESET_VERSION = 'abrint_2026_default_v5';

export default function Home() {
  const [segments, setSegments] = useState<WheelSegment[]>(() => {
    if (typeof window !== 'undefined') {
      const savedVersion = localStorage.getItem('wheelPresetVersion');
      if (savedVersion !== PRESET_VERSION) {
        localStorage.setItem('wheelSegments', JSON.stringify(DEFAULT_SEGMENTS));
        localStorage.setItem('wheelStatic', JSON.stringify(true));
        localStorage.setItem('wheelTotemTitle', 'GIRE E GANHE!');
        localStorage.setItem('wheelPresetVersion', PRESET_VERSION);
        return DEFAULT_SEGMENTS;
      }
      const saved = localStorage.getItem('wheelSegments');
      if (saved) {
        try {
          const parsed: WheelSegment[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to load saved segments:', e);
        }
      }
    }
    return DEFAULT_SEGMENTS;
  });

  const [winner, setWinner] = useState<WheelSegment | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isStatic, setIsStatic] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFX.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totemTitle, setTotemTitle] = useState('GIRE E GANHE!');
  const [totemSubtitle, setTotemSubtitle] = useState('TSMX NA ABRINT • TESTE SUA SORTE');

  // Ensure preset version is applied even across HMR updates
  useEffect(() => {
    const savedVersion = localStorage.getItem('wheelPresetVersion');
    if (savedVersion !== PRESET_VERSION) {
      setSegments(DEFAULT_SEGMENTS);
      setIsStatic(true);
      setTotemTitle('GIRE E GANHE!');
      localStorage.setItem('wheelSegments', JSON.stringify(DEFAULT_SEGMENTS));
      localStorage.setItem('wheelStatic', JSON.stringify(true));
      localStorage.setItem('wheelTotemTitle', 'GIRE E GANHE!');
      localStorage.setItem('wheelPresetVersion', PRESET_VERSION);
    }
  }, []);

  // Load static mode and titles from localStorage
  useEffect(() => {
    const savedStatic = localStorage.getItem('wheelStatic');
    if (savedStatic) {
      try {
        setIsStatic(JSON.parse(savedStatic));
      } catch (e) {
        console.error('Failed to load static mode:', e);
      }
    }
    const savedTitle = localStorage.getItem('wheelTotemTitle');
    if (savedTitle) setTotemTitle(savedTitle);
    const savedSubtitle = localStorage.getItem('wheelTotemSubtitle');
    if (savedSubtitle) setTotemSubtitle(savedSubtitle);
  }, []);

  // Persist changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('wheelSegments', JSON.stringify(segments));
  }, [segments]);

  useEffect(() => {
    localStorage.setItem('wheelStatic', JSON.stringify(isStatic));
  }, [isStatic]);

  useEffect(() => {
    localStorage.setItem('wheelTotemTitle', totemTitle);
  }, [totemTitle]);

  useEffect(() => {
    localStorage.setItem('wheelTotemSubtitle', totemSubtitle);
  }, [totemSubtitle]);

  // Track browser fullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  const triggerCelebrationConfetti = useCallback(() => {
    const colors = ['#F26521', '#E5E5E5', '#242424', '#D95616'];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.55 },
      colors,
      zIndex: 100,
    });
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.65 },
        colors,
        zIndex: 100,
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.65 },
        colors,
        zIndex: 100,
      });
    }, 220);
  }, []);

  const handleSpinComplete = (winnerSegment: WheelSegment) => {
    setWinner(winnerSegment);
    setShowWinnerModal(true);

    if (winnerSegment.showCongrats !== false) {
      soundFX.playWin();
      triggerCelebrationConfetti();
    } else {
      soundFX.playTryAgain();
    }
  };

  // Keyboard shortcuts for modal & settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (showWinnerModal) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          setShowWinnerModal(false);
        }
        return;
      }

      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      } else if (e.key.toLowerCase() === 'c' && !isSettingsOpen) {
        setIsSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWinnerModal, isSettingsOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080808] flex flex-col justify-between items-center select-none">
      {/* TSMX Organic Outlined Pill Modules Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left & Bottom-Left Organic Connected Modules (exact TSMX S-curve geometry) */}
        <svg
          className="absolute left-0 top-0 h-full w-full"
          viewBox="0 0 1080 1920"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Top standalone capsule */}
          <rect
            x="170"
            y="-55"
            width="580"
            height="170"
            rx="85"
            stroke="#F26521"
            strokeWidth="2.5"
          />

          {/* Right upper standalone capsule */}
          <rect
            x="560"
            y="310"
            width="620"
            height="170"
            rx="85"
            stroke="#F26521"
            strokeWidth="2.5"
          />

          {/* Main connected multi-lobe TSMX metaball module */}
          <path
            d="
              M 135 280
              H 370
              A 85 85 0 0 1 400.04 444.52
              A 70 70 0 0 0 424.77 580
              H 1200
              V 750
              H 534.77
              A 70 70 0 0 0 510.04 885.48
              A 85 85 0 0 1 480 1135
              H 444.77
              A 70 70 0 0 0 420.04 1270.48
              A 95 95 0 1 1 289.96 1270.48
              A 70 70 0 0 0 265.23 1135
              H 230
              A 85 85 0 0 1 199.96 885.48
              A 70 70 0 0 0 175.23 750
              H 135
              A 85 85 0 0 1 135 580
              H 155.23
              A 70 70 0 0 0 180.04 444.52
              A 85 85 0 0 1 135 280
              Z
            "
            stroke="#F26521"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom-Right standalone capsule */}
          <rect
            x="560"
            y="1480"
            width="620"
            height="170"
            rx="85"
            stroke="#F26521"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* Discrete Floating Control Bar (Top-Right) */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={toggleSound}
          className="p-2.5 rounded-lg bg-[#181818] hover:bg-[#242424] border border-neutral-800 text-neutral-300 hover:text-white transition-all"
          title={isMuted ? 'Ativar som' : 'Silenciar som'}
        >
          {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2.5 rounded-lg bg-[#181818] hover:bg-[#242424] border border-neutral-800 text-neutral-300 hover:text-white transition-all"
          title="Alternar Tela Cheia"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#181818] hover:bg-[#242424] border border-neutral-800 hover:border-[#F26521] text-neutral-200 hover:text-white transition-all text-xs font-semibold"
          title="Configurar Roleta (Atalho: C)"
        >
          <Settings size={17} className="text-[#F26521]" />
          <span className="hidden sm:inline">Editar</span>
        </button>
      </div>

      {/* 1. TOP SECTION: Brand Logo + Vertical Totem Headline */}
      <header className="relative z-10 w-full pt-5 sm:pt-7 px-4 flex flex-col items-center text-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}logo-tsmx.webp`}
          alt="TSMX Logo"
          className="h-12 sm:h-16 md:h-20 object-contain"
        />

        {totemTitle && (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-[#F2F2F2] leading-none">
            {totemTitle}
          </h1>
        )}
      </header>

      {/* 2. CENTER & BOTTOM STAGE: Large Vertical Wheel */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-3 py-1 min-h-0">
        <Wheel
          segments={segments}
          onSpinComplete={handleSpinComplete}
          isStatic={isStatic}
          disabled={showWinnerModal || isSettingsOpen}
          containerClassName="w-[min(94vw,76vh)] sm:w-[min(90vw,78vh)] max-w-[880px]"
        />
      </main>

      {/* 3. FOOTER SIGNATURE */}
      <footer className="relative z-10 w-full pb-2.5 pt-0.5 text-center">
        <p className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-neutral-500 font-semibold">
          TSMX • Tecnologia Viva
        </p>
      </footer>

      {/* 4. VERTICAL TOTEM WINNER MODAL (Matte Stand Style) */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#141414] border border-neutral-800 p-7 sm:p-9 text-center shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Solid Top TSMX Orange Bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-[#F26521]" />

            {/* Icon Badge */}
            <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-[#1C1C1C] border border-neutral-800 flex items-center justify-center mb-5">
              {winner.showCongrats !== false ? (
                <Trophy size={40} className="text-[#F26521]" />
              ) : (
                <RotateCcw size={38} className="text-neutral-400" />
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="relative z-10 space-y-1.5 mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F26521]">
                {winner.showCongrats !== false ? 'Prêmio Sorteado' : 'Resultado do Giro'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#F2F2F2]">
                {winner.showCongrats !== false
                  ? 'PARABÉNS!'
                  : winner.customMessage || 'Quase lá!'}
              </h2>
            </div>

            {/* Prize Showcase Card */}
            <div className="relative z-10 p-6 sm:p-8 rounded-xl bg-[#0E0E0E] border border-neutral-800 mb-7">
              <p className="text-3xl sm:text-5xl font-display font-bold text-[#F2F2F2] tracking-tight break-words leading-tight">
                {winner.label}
              </p>
            </div>

            {/* Giant Action Button */}
            <button
              type="button"
              onClick={() => setShowWinnerModal(false)}
              className="relative z-10 w-full py-4 px-6 rounded-xl bg-[#F26521] hover:bg-[#D95616] active:bg-[#C04B11] text-[#F5F5F5] font-display font-bold text-lg sm:text-xl uppercase tracking-wider transition-all"
            >
              Próximo Giro
            </button>
          </div>
        </div>
      )}

      {/* 5. SLIDE-OVER SETTINGS DRAWER */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="flex-1"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="relative w-full max-w-lg h-full bg-[#121212] border-l border-neutral-800 p-6 shadow-2xl flex flex-col">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="Fechar (ESC)"
            >
              <X size={20} />
            </button>
            <div className="flex-1 min-h-0 pt-2">
              <WheelCustomizer
                segments={segments}
                onSegmentsChange={setSegments}
                isStatic={isStatic}
                onStaticChange={setIsStatic}
                totemTitle={totemTitle}
                onTotemTitleChange={setTotemTitle}
                totemSubtitle={totemSubtitle}
                onTotemSubtitleChange={setTotemSubtitle}
                onClose={() => setIsSettingsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
