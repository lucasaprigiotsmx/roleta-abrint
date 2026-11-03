import { Plus, Trash2, Copy, Scale, Check, Palette, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WheelSegment } from '@/components/Wheel';
import { DEFAULT_SEGMENTS } from '@/pages/Home';

interface WheelCustomizerProps {
  segments: WheelSegment[];
  onSegmentsChange: (segments: WheelSegment[]) => void;
  isStatic?: boolean;
  onStaticChange?: (isStatic: boolean) => void;
  totemTitle?: string;
  onTotemTitleChange?: (title: string) => void;
  totemSubtitle?: string;
  onTotemSubtitleChange?: (subtitle: string) => void;
  onClose?: () => void;
}

export const CORPORATE_BLACK_ORANGE_COLORS = [
  '#F26521', // Laranja Oficial TSMX
  '#181818', // Preto Fosco
  '#D95616', // Laranja Escuro TSMX
  '#242424', // Grafite Escuro
  '#BF4910', // Laranja Queimado
  '#121212', // Carvão Profundo
  '#FF7A38', // Laranja Claro
  '#2E2E2E', // Cinza Chumbo
];

export function WheelCustomizer({
  segments,
  onSegmentsChange,
  isStatic = false,
  onStaticChange,
  totemTitle = 'GIRE E GANHE!',
  onTotemTitleChange,
  totemSubtitle = 'TSMX NA ABRINT • TESTE SUA SORTE',
  onTotemSubtitleChange,
  onClose,
}: WheelCustomizerProps) {
  const [copied, setCopied] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const addSegment = () => {
    const newCount = segments.length + 1;
    const equalPct = Math.round((100 / newCount) * 10) / 10;

    const newSegment: WheelSegment = {
      id: Date.now().toString(),
      label: `Prêmio ${newCount}`,
      color:
        CORPORATE_BLACK_ORANGE_COLORS[
          segments.length % CORPORATE_BLACK_ORANGE_COLORS.length
        ],
      percentage: equalPct,
      showCongrats: true,
      customMessage: '',
    };

    const updatedSegments = segments.map((s) => ({
      ...s,
      percentage: equalPct,
    }));

    onSegmentsChange([...updatedSegments, newSegment]);
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 2) return;

    const filtered = segments.filter((s) => s.id !== id);
    const newPercentage = Math.round((100 / filtered.length) * 10) / 10;

    onSegmentsChange(
      filtered.map((s) => ({
        ...s,
        percentage: newPercentage,
      }))
    );
  };

  const updateSegment = (id: string, updates: Partial<WheelSegment>) => {
    onSegmentsChange(
      segments.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const equalizePercentages = () => {
    if (segments.length === 0) return;
    const equal = Math.round((100 / segments.length) * 10) / 10;
    onSegmentsChange(segments.map((s) => ({ ...s, percentage: equal })));
  };

  const applyBlackOrangePalette = () => {
    const palette = ['#F26521', '#181818', '#D95616', '#242424'];
    onSegmentsChange(
      segments.map((s, idx) => ({
        ...s,
        color: palette[idx % palette.length],
      }))
    );
  };

  const totalPercentage = segments.reduce((sum, s) => sum + s.percentage, 0);
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.5;

  const saveToLocalStorage = () => {
    localStorage.setItem('wheelSegments', JSON.stringify(segments));
    localStorage.setItem('wheelStatic', JSON.stringify(isStatic));
    localStorage.setItem('wheelTotemTitle', totemTitle);
    localStorage.setItem('wheelTotemSubtitle', totemSubtitle);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose?.();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Configurar Totem & Roleta
          </h2>
          <p className="text-neutral-400 text-xs mt-0.5">
            Alterações aplicadas em tempo real
          </p>
        </div>
        <Button
          onClick={saveToLocalStorage}
          className="bg-[#F26521] hover:bg-[#D95616] text-white font-bold px-5"
        >
          {savedFeedback ? (
            <span className="flex items-center gap-1.5">
              <Check size={16} /> Salvo!
            </span>
          ) : (
            'Salvar e Fechar'
          )}
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
        {/* Totem Texts */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F26521]">
            Cabeçalho do Totem Vertical
          </p>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Subtítulo (Badge superior)
              </label>
              <input
                type="text"
                value={totemSubtitle}
                onChange={(e) => onTotemSubtitleChange?.(e.target.value)}
                placeholder="Ex: TSMX NA ABRINT • TESTE SUA SORTE"
                className="w-full px-3 py-2 bg-[#0E0E0E] border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F26521]"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={totemTitle}
                onChange={(e) => onTotemTitleChange?.(e.target.value)}
                placeholder="Ex: GIRE E GANHE!"
                className="w-full px-3 py-2 bg-[#0E0E0E] border border-neutral-800 rounded-lg text-sm text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#F26521]"
              />
            </div>
          </div>
        </div>

        {/* Static Mode Toggle */}
        <div className="flex items-center gap-3 p-3.5 bg-[#161616] border border-neutral-800 rounded-xl">
          <input
            type="checkbox"
            id="staticMode"
            checked={isStatic}
            onChange={(e) => onStaticChange?.(e.target.checked)}
            className="w-5 h-5 rounded cursor-pointer accent-[#F26521]"
          />
          <label htmlFor="staticMode" className="flex-1 cursor-pointer">
            <p className="text-sm font-semibold text-white">
              Fatias Visuais Iguais (Modo Estático)
            </p>
            <p className="text-xs text-neutral-400">
              Todas as fatias têm o mesmo tamanho na tela, mas respeitam a probabilidade no sorteio
            </p>
          </label>
        </div>

        {/* Quick Actions: Apply Black & Orange Theme + Equalize % */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#161616] rounded-xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Total:</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                isValidTotal
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-amber-400 bg-amber-500/15'
              }`}
            >
              {Math.round(totalPercentage * 10) / 10}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSegmentsChange(DEFAULT_SEGMENTS);
                onStaticChange?.(true);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              title="Restaurar os 5 prêmios padrão da ABRINT"
            >
              <RotateCcw size={13} />
              Padrão ABRINT
            </button>

            <button
              type="button"
              onClick={applyBlackOrangePalette}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F26521]/20 hover:bg-[#F26521]/30 border border-[#F26521]/50 text-[#F26521] transition-colors"
              title="Alternar fatias entre Preto Fosco e Laranja TSMX"
            >
              <Palette size={14} />
              Preto & Laranja
            </button>

            <button
              type="button"
              onClick={equalizePercentages}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              title="Distribuir probabilidades igualmente"
            >
              <Scale size={14} />
              Igualar %
            </button>
          </div>
        </div>

        {/* Segments List */}
        <div className="space-y-3">
          {segments.map((segment, idx) => (
            <div
              key={segment.id}
              className="bg-[#161616] border border-neutral-800 rounded-xl p-4 space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-2 justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Fatia #{idx + 1}
                </span>

                {/* Color Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {CORPORATE_BLACK_ORANGE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateSegment(segment.id, { color })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        segment.color.toLowerCase() === color.toLowerCase()
                          ? 'border-white scale-110'
                          : 'border-neutral-700 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <input
                    type="color"
                    value={segment.color}
                    onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-neutral-700 bg-transparent"
                    title="Cor personalizada"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeSegment(segment.id)}
                  disabled={segments.length <= 2}
                  className="p-1.5 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Remover fatia"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>

              {/* Label & Probability Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={segment.label}
                    onChange={(e) => updateSegment(segment.id, { label: e.target.value })}
                    placeholder="Nome do prêmio"
                    className="w-full px-3 py-2 bg-[#0E0E0E] border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C84610]"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[#0E0E0E] border border-neutral-800 rounded-lg px-2.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={Math.round(segment.percentage * 10) / 10}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updateSegment(segment.id, {
                        percentage: Math.min(100, Math.max(0, val)),
                      });
                    }}
                    className="w-full py-2 bg-transparent text-sm text-white font-semibold focus:outline-none text-right"
                  />
                  <span className="text-xs text-neutral-400">%</span>
                </div>
              </div>

              {/* Visual Percentage Bar */}
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F26521] transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, segment.percentage))}%` }}
                />
              </div>

              {/* Congratulations Toggle */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label
                  htmlFor={`congrats-${segment.id}`}
                  className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300"
                >
                  <input
                    type="checkbox"
                    id={`congrats-${segment.id}`}
                    checked={segment.showCongrats ?? true}
                    onChange={(e) =>
                      updateSegment(segment.id, { showCongrats: e.target.checked })
                    }
                    className="w-4 h-4 rounded cursor-pointer accent-[#F26521]"
                  />
                  É um prêmio vencedor (mostrar "Parabéns!" e confetes)
                </label>
              </div>

              {!(segment.showCongrats ?? true) && (
                <input
                  type="text"
                  value={segment.customMessage || ''}
                  onChange={(e) =>
                    updateSegment(segment.id, { customMessage: e.target.value })
                  }
                  placeholder="Título do modal (Ex: Quase lá! Tente novamente)"
                  className="w-full px-3 py-1.5 bg-[#0E0E0E] border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F26521] text-xs"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-neutral-800 flex gap-2">
        <button
          type="button"
          onClick={addSegment}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F26521]/20 hover:bg-[#F26521]/30 border border-[#F26521]/40 rounded-xl text-[#F26521] font-semibold text-sm transition-all"
        >
          <Plus size={18} />
          Adicionar Fatia
        </button>

        <button
          type="button"
          onClick={() => {
            const json = JSON.stringify(segments, null, 2);
            navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-neutral-200 text-sm transition-all"
          title="Copiar JSON"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          {copied ? 'Copiado' : 'JSON'}
        </button>
      </div>
    </div>
  );
}
