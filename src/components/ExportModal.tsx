import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FrameTemplate,
  PhotoTransform,
  PhotoFilters,
  MattingSettings,
  GalleryTextItem,
  ExportMode,
  ExportFormat,
  ExportResolution,
  SceneImageStatus,
} from '../types/frame';
import { calculateRenderViewport, renderGalleryCanvas } from '../utils/canvasRenderer';
import { triggerExportConfetti } from '../utils/confetti';
import { translations, Language } from '../utils/i18n';
import {
  Download,
  Copy,
  Share2,
  X,
  Sparkles,
  Check,
  Image as ImageIcon,
  Crop,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  image: HTMLImageElement | null;
  sceneImage: HTMLImageElement | null;
  sceneImageStatus: SceneImageStatus;
  onRetrySceneImage: () => void;
  template: FrameTemplate;
  transform: PhotoTransform;
  filters: PhotoFilters;
  matting: MattingSettings;
  customText: GalleryTextItem;
}

export function ExportModal({
  lang,
  isOpen,
  onClose,
  image,
  sceneImage,
  sceneImageStatus,
  onRetrySceneImage,
  template,
  transform,
  filters,
  matting,
  customText,
}: ExportModalProps) {
  const t = translations[lang];
  const [exportMode, setExportMode] = useState<ExportMode>('full_scene');
  const [format, setFormat] = useState<ExportFormat>('image/png');
  const [resolution, setResolution] = useState<ExportResolution>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneUnavailable =
    Boolean(template.embeddedScene) && (sceneImageStatus !== 'ready' || !sceneImage);


  // Generate preview when modal opens or settings change
  const generatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    if (sceneUnavailable) {
      setPreviewUrl('');
      return;
    }


    renderGalleryCanvas({
      canvas,
      image,
      sceneImage,
      template,
      transform,
      filters,
      matting,
      customText,
      exportMode,
      scaleFactor: 0.5, // fast preview scale
      drawGuides: false,
    });

    setPreviewUrl(canvas.toDataURL(format, 0.9));
  }, [
    image,
    sceneImage,
    sceneUnavailable,
    template,
    transform,
    filters,
    matting,
    customText,
    exportMode,
    format,
  ]);

  useEffect(() => {
    if (isOpen) {
      triggerExportConfetti();
      const timer = setTimeout(generatePreview, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, generatePreview]);

  if (!isOpen) return null;
  const exportViewport = calculateRenderViewport(template, exportMode, resolution);


  // Render high-res canvas to blob
  const generateExportBlob = async (scale: number, mimeType: string): Promise<Blob> => {
    if (sceneUnavailable) {
      throw new Error('Frame scene is not ready for export');
    }

    return new Promise((resolve, reject) => {
      const exportCanvas = document.createElement('canvas');
      renderGalleryCanvas({
        canvas: exportCanvas,
        image,
        sceneImage,
        template,
        transform,
        filters,
        matting,
        customText,
        exportMode,
        scaleFactor: scale,
        drawGuides: false,
      });

      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas export failed'));
          }
        },
        mimeType,
        0.96
      );
    });
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      triggerExportConfetti();

      const blob = await generateExportBlob(resolution, format);
      const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp';
      const filename = `Frame_${template.id}_${Date.now()}.${ext}`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      setIsExporting(true);
      triggerExportConfetti();

      // Clipboard API strictly supports PNG
      const blob = await generateExportBlob(1.5, 'image/png');
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed', err);
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      triggerExportConfetti();

      const blob = await generateExportBlob(1.5, 'image/png');
      const file = new File([blob], 'Frame.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'รูปภาพงานเกษียณ',
          text: 'ดูรูปภาพงานเกษียณที่ฉันทำไว้สิ!',
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Hidden canvas for fast rendering */}
      <canvas ref={previewCanvasRef} className="hidden" />

      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                {t.exportTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.exportSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Preview + Controls */}
        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Live Export Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 p-3 sm:p-4">
            <div className="relative max-h-[35vh] sm:max-h-[44vh] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl">
              {sceneImageStatus === 'error' && template.embeddedScene ? (
                <div className="w-64 h-64 px-6 flex flex-col items-center justify-center gap-3 text-center text-slate-300">
                  <span>
                    {lang === 'th'
                      ? 'โหลดกรอบรูปไม่สำเร็จ'
                      : 'The frame image could not be loaded.'}
                  </span>
                  <button
                    onClick={onRetrySceneImage}
                    className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
                  >
                    {lang === 'th' ? 'ลองอีกครั้ง' : 'Try again'}
                  </button>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Export Preview"
                  className="max-w-full max-h-[35vh] sm:max-h-[44vh] object-contain rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                  {t.generating}
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-400">
                ขนาดภาพ:{' '}
                <span className="font-mono text-indigo-300 font-semibold">
                  {`${Math.round(exportViewport.targetWidth)} × ${Math.round(
                    exportViewport.targetHeight
                  )} px`}
                </span>
              </span>
            </div>
          </div>

          {/* Right Column: Export Settings */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Action Button Prominent for Quick Save */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
              <button
                onClick={handleDownload}
                disabled={isExporting || sceneUnavailable}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? t.generating : t.downloadImage}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyClipboard}
                  disabled={isExporting || sceneUnavailable}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
                  <span>{copied ? t.copied : t.copyImage}</span>
                </button>

                <button
                  onClick={handleShare}
                  disabled={isExporting || sceneUnavailable}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>{t.share}</span>
                </button>
              </div>
            </div>

            {/* Export Mode / Crop Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                {t.exportCropArea}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setExportMode('full_scene')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                    exportMode === 'full_scene'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mb-1 text-indigo-600" />
                  <div className="text-xs font-bold">{t.fullWall}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.fullWallDesc}</div>
                </button>

                <button
                  onClick={() => setExportMode('frame_only')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                    exportMode === 'frame_only'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Crop className="w-4 h-4 mb-1 text-indigo-600" />
                  <div className="text-xs font-bold">{t.frameOnly}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.frameOnlyDesc}</div>
                </button>

                <button
                  onClick={() => setExportMode('inner_artwork')}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                    exportMode === 'inner_artwork'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Layers className="w-4 h-4 mb-1 text-indigo-600" />
                  <div className="text-xs font-bold">{t.innerArt}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.innerArtDesc}</div>
                </button>
              </div>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                {t.resolution}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { scale: 1 as ExportResolution, label: t.resStandard, desc: '100%' },
                  { scale: 2 as ExportResolution, label: t.resHd, desc: '200% 4K' },
                  { scale: 3 as ExportResolution, label: t.resPrint, desc: '300% Print' },
                ].map((r) => (
                  <button
                    key={r.scale}
                    onClick={() => setResolution(r.scale)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      resolution === r.scale
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-500/20 font-medium'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                {t.fileFormat}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/png' as ExportFormat, name: 'PNG', hint: 'คมชัดสูงสุด' },
                  { id: 'image/jpeg' as ExportFormat, name: 'JPG', hint: 'ขนาดไฟล์เล็ก' },
                  { id: 'image/webp' as ExportFormat, name: 'WebP', hint: 'ไฟล์ทันสมัย' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer shadow-2xs ${
                      format === f.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold ring-2 ring-indigo-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">{f.name}</span>
                    <span className="text-[9px] text-slate-500">{f.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
