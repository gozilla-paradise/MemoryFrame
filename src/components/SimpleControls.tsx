import { PhotoTransform, FrameTemplate } from '../types/frame';
import { translations, Language } from '../utils/i18n';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Focus,
  Maximize2,
  Camera,
  Download,
} from 'lucide-react';

interface SimpleControlsProps {
  lang: Language;
  transform: PhotoTransform;
  image: HTMLImageElement | null;
  template: FrameTemplate;
  onTransformChange: (t: PhotoTransform) => void;
  onUploadClick: () => void;
  onOpenSamples: () => void;
  onOpenExport: () => void;
}

export function SimpleControls({
  lang,
  transform,
  image,
  onTransformChange,
  onUploadClick,
  onOpenSamples,
  onOpenExport,
}: SimpleControlsProps) {
  const t = translations[lang];

  // Nudge photo
  const handleNudge = (dx: number, dy: number) => {
    onTransformChange({
      ...transform,
      x: Math.round(transform.x + dx),
      y: Math.round(transform.y + dy),
    });
  };

  // Zoom
  const handleZoom = (factor: number) => {
    const next = Math.min(5, Math.max(0.1, transform.scale * factor));
    onTransformChange({
      ...transform,
      scale: Number(next.toFixed(2)),
    });
  };

  // Rotate 90
  const handleRotate = () => {
    let next = (transform.rotation + 90) % 360;
    if (next > 180) next -= 360;
    onTransformChange({
      ...transform,
      rotation: next,
    });
  };

  // Center
  const handleCenter = () => {
    onTransformChange({
      ...transform,
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="space-y-4">
      {/* 3 Step Guide Card for Seniors / Simple Usage */}
      <div className="bg-gradient-to-br from-indigo-50 to-amber-50/50 rounded-2xl p-4 border border-indigo-100/80 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs items-center justify-center">
            ✨
          </span>
          <h3 className="font-bold text-sm text-slate-800">
            {lang === 'th' ? 'วิธีใช้งานง่ายๆ 3 ขั้นตอน' : '3 Easy Steps'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Step 1 */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">{t.step1Photo}</div>
              <div className="text-[10px] text-slate-500">{lang === 'th' ? 'แตะเลือกรูป' : 'Choose photo'}</div>
            </div>
          </button>

          {/* Step 2 */}
          <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Focus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">{t.step2Move}</div>
              <div className="text-[10px] text-slate-500">{lang === 'th' ? 'ลากหรือซูม' : 'Pan / Zoom'}</div>
            </div>
          </div>

          {/* Step 3 */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2.5 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.step3Save}</div>
              <div className="text-[10px] text-indigo-100">{lang === 'th' ? 'โหลดรูปลงเครื่อง' : 'Download image'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Primary Big Action Buttons for Seniors & Mobile users */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Focus className="w-4 h-4 text-indigo-600" />
            {lang === 'th' ? 'ปุ่มควบคุมขนาดใหญ่' : 'Large Controls'}
          </span>
          <span className="text-[11px] text-slate-500">
            {lang === 'th' ? 'กดปุ่มเพื่อปรับรูป' : 'Tap to adjust photo'}
          </span>
        </div>

        {/* Big Quick Zoom and Rotate Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Zoom In */}
          <button
            onClick={() => handleZoom(1.15)}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ZoomIn className="w-5 h-5 text-indigo-600" />
            <span>{t.zoomBigger}</span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(0.85)}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ZoomOut className="w-5 h-5 text-indigo-600" />
            <span>{t.zoomSmaller}</span>
          </button>

          {/* Center */}
          <button
            onClick={handleCenter}
            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Focus className="w-5 h-5 text-slate-600" />
            <span>{t.oneClickCenter}</span>
          </button>

          {/* Rotate 90 */}
          <button
            onClick={handleRotate}
            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <RotateCw className="w-5 h-5 text-slate-600" />
            <span>{t.rotateRight}</span>
          </button>
        </div>

        {/* Nudge Direction D-Pad for Mobile Users */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600">
              {lang === 'th' ? 'ปุ่มเลื่อนตำแหน่งภาพ (ขึ้น/ลง/ซ้าย/ขวา)' : 'Position Nudge D-Pad'}
            </span>
            <span className="text-[10px] text-slate-400">
              {lang === 'th' ? 'หรือใช้นิ้วลากที่รูปได้เลย' : 'or drag photo on canvas'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-1">
            <button
              onClick={() => handleNudge(0, -20)}
              className="w-12 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNudge(-20, 0)}
                className="w-12 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
                title="Move Left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleCenter}
                className="w-12 h-10 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs active:scale-95 transition-transform cursor-pointer"
                title="Center"
              >
                •
              </button>

              <button
                onClick={() => handleNudge(20, 0)}
                className="w-12 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
                title="Move Right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => handleNudge(0, 20)}
              className="w-12 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Picture or Sample Picture */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onUploadClick}
            className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>{image ? t.changePhoto : t.uploadPhoto}</span>
          </button>

          <button
            onClick={onOpenSamples}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.samplePhotos}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
