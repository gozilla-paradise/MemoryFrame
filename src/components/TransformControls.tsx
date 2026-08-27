import { PhotoTransform, FrameTemplate } from '../types/frame';
import { calculateInitialCoverTransform } from '../utils/canvasRenderer';
import { translations, Language } from '../utils/i18n';
import {
  ZoomIn,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  Crosshair,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TransformControlsProps {
  lang: Language;
  transform: PhotoTransform;
  image: HTMLImageElement | null;
  template: FrameTemplate;
  onTransformChange: (newTransform: PhotoTransform) => void;
}

export function TransformControls({
  lang,
  transform,
  image,
  template,
  onTransformChange,
}: TransformControlsProps) {
  const t = translations[lang];
  const apertureW = template.aperture.width * template.canvasWidth;
  const apertureH = template.aperture.height * template.canvasHeight;

  // Fit Image Entirely inside aperture
  const handleFitInside = () => {
    if (!image) return;
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const apRatio = apertureW / apertureH;

    let scale = 1;
    if (imgRatio > apRatio) {
      scale = apertureW / image.naturalWidth;
    } else {
      scale = apertureH / image.naturalHeight;
    }

    onTransformChange({
      ...transform,
      scale: parseFloat(scale.toFixed(3)),
      x: 0,
      y: 0,
      fitMode: 'contain',
    });
  };

  // Fill Image completely covering aperture (cover)
  const handleFillCover = () => {
    if (!image) return;
    const cover = calculateInitialCoverTransform(
      image.naturalWidth,
      image.naturalHeight,
      apertureW,
      apertureH
    );
    onTransformChange({
      ...transform,
      scale: cover.scale,
      x: 0,
      y: 0,
      fitMode: 'cover',
    });
  };

  // Center alignment
  const handleCenter = () => {
    onTransformChange({
      ...transform,
      x: 0,
      y: 0,
    });
  };

  // Rotate 90 degrees clockwise
  const handleRotate90 = () => {
    let next = (transform.rotation + 90) % 360;
    if (next > 180) next -= 360;
    onTransformChange({
      ...transform,
      rotation: next,
    });
  };

  // Rotate 90 degrees counter-clockwise
  const handleRotateCounter90 = () => {
    let next = (transform.rotation - 90) % 360;
    if (next < -180) next += 360;
    onTransformChange({
      ...transform,
      rotation: next,
    });
  };

  // Flip horizontal
  const handleFlipH = () => {
    onTransformChange({
      ...transform,
      flipH: !transform.flipH,
    });
  };

  // Flip vertical
  const handleFlipV = () => {
    onTransformChange({
      ...transform,
      flipV: !transform.flipV,
    });
  };

  // Fine positional nudges
  const handleNudge = (dx: number, dy: number) => {
    onTransformChange({
      ...transform,
      x: Math.round(transform.x + dx),
      y: Math.round(transform.y + dy),
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Auto-Fit Action Strip */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleFillCover}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Maximize className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.fillCover}</span>
        </button>

        <button
          onClick={handleFitInside}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Minimize className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.fitInside}</span>
        </button>

        <button
          onClick={handleCenter}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Crosshair className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.centerBtn}</span>
        </button>
      </div>

      {/* Zoom / Scale Precision Slider */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.zoom}</span>
          </label>
          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
            {Math.round(transform.scale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.1}
            max={3.5}
            step={0.01}
            value={transform.scale}
            onChange={(e) =>
              onTransformChange({
                ...transform,
                scale: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>10%</span>
          <span>100%</span>
          <span>350%</span>
        </div>
      </div>

      {/* Rotation Slider & 90-degree buttons */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.rotate}</span>
          </label>
          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
            {Math.round(transform.rotation)}°
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={transform.rotation}
            onChange={(e) =>
              onTransformChange({
                ...transform,
                rotation: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={handleRotateCounter90}
            className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Rotate Left 90°"
          >
            <RotateCcw className="w-3 h-3 text-indigo-600" />
            <span>-90°</span>
          </button>

          <button
            onClick={handleRotate90}
            className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Rotate Right 90°"
          >
            <RotateCw className="w-3 h-3 text-indigo-600" />
            <span>+90°</span>
          </button>

          <button
            onClick={handleFlipH}
            className={`py-1.5 px-2 border rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              transform.flipH
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3 h-3" />
            <span>{t.flipH}</span>
          </button>

          <button
            onClick={handleFlipV}
            className={`py-1.5 px-2 border rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              transform.flipV
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-3 h-3" />
            <span>{t.flipV}</span>
          </button>
        </div>
      </div>

      {/* Fine Positional Nudge Pad */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">{t.pan}</span>
          <span className="text-[11px] font-mono text-slate-500">
            X: {Math.round(transform.x)}px | Y: {Math.round(transform.y)}px
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 py-1">
          <button
            onClick={() => handleNudge(0, -10)}
            className="w-10 h-8 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNudge(-10, 0)}
              className="w-10 h-8 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleCenter}
              className="w-10 h-8 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xs active:scale-95 transition-transform cursor-pointer"
              title="Reset to 0,0"
            >
              •
            </button>

            <button
              onClick={() => handleNudge(10, 0)}
              className="w-10 h-8 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleNudge(0, 10)}
            className="w-10 h-8 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
