import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FrameTemplate,
  PhotoTransform,
  PhotoFilters,
  MattingSettings,
  GalleryTextItem,
} from './types/frame';
import { FRAME_TEMPLATES } from './utils/frameTemplates';
import { calculateInitialCoverTransform } from './utils/canvasRenderer';
import { getSampleImageUrl } from './utils/sampleImages';
import { translations, Language } from './utils/i18n';
import { Header } from './components/Header';
import { CanvasStage } from './components/CanvasStage';
import { SimpleControls } from './components/SimpleControls';
import { TransformControls } from './components/TransformControls';
import { FrameSelector } from './components/FrameSelector';
import { FilterControls } from './components/FilterControls';
import { TextControls } from './components/TextControls';
import { ExportModal } from './components/ExportModal';
import { SamplePhotoPicker } from './components/SamplePhotoPicker';
import { Move, Frame, Sliders, Type, Camera, Download, Zap, Sparkles } from 'lucide-react';

type ControlTab = 'transform' | 'frame' | 'filters' | 'text';

export default function App() {
  // Default to Thai Language ('th') and Simple Mode (true) for easiest experience!
  const [lang, setLang] = useState<Language>('th');
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);

  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate>(FRAME_TEMPLATES[0]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [transform, setTransform] = useState<PhotoTransform>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    flipH: false,
    flipV: false,
    fitMode: 'cover',
  });

  const [filters, setFilters] = useState<PhotoFilters>({
    preset: 'original',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    sepia: 0,
    vignette: 0,
    glassReflect: 25,
  });

  const [matting, setMatting] = useState<MattingSettings>({
    enabled: selectedTemplate.defaultMatting?.enabled ?? false,
    color: selectedTemplate.defaultMatting?.color ?? '#ffffff',
    widthPercent: selectedTemplate.defaultMatting?.widthPercent ?? 6,
    bevel: true,
    innerBorder: false,
  });

  const [customText, setCustomText] = useState<GalleryTextItem>(
    selectedTemplate.defaultText ?? {
      line1: 'ONE STORY',
      line2: 'A MILLION',
      highlight: 'Memories',
      localized: '1 เรื่องราว 1 ล้านความทรงจำ',
      showText: true,
      textColor: '#ffffff',
      highlightColor: '#facc15',
      fontStyle: 'cinzel',
    }
  );

  const [showGuides, setShowGuides] = useState(false);
  const [activeTab, setActiveTab] = useState<ControlTab>('transform');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSamplePickerOpen, setIsSamplePickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[lang];

  // Load a starter sample image initially
  useEffect(() => {
    const starterUrl = getSampleImageUrl('sunset');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = starterUrl;
    img.onload = () => {
      setImage(img);
      setImageSrc(starterUrl);
      const rawApW = selectedTemplate.aperture.width * selectedTemplate.canvasWidth;
      const rawApH = selectedTemplate.aperture.height * selectedTemplate.canvasHeight;
      setTransform(
        calculateInitialCoverTransform(img.naturalWidth, img.naturalHeight, rawApW, rawApH)
      );
    };
  }, []);

  // Handle template switch: update default texts & matting if untouched
  const handleSelectTemplate = (template: FrameTemplate) => {
    setSelectedTemplate(template);
    if (template.defaultMatting) {
      setMatting((prev) => ({
        ...prev,
        enabled: template.defaultMatting?.enabled ?? prev.enabled,
        color: template.defaultMatting?.color ?? prev.color,
        widthPercent: template.defaultMatting?.widthPercent ?? prev.widthPercent,
      }));
    }
    if (template.defaultText) {
      setCustomText((prev) => ({
        ...prev,
        line1: template.defaultText?.line1 ?? prev.line1,
        line2: template.defaultText?.line2 ?? prev.line2,
        highlight: template.defaultText?.highlight ?? prev.highlight,
        localized: template.defaultText?.localized ?? prev.localized,
        showText: template.defaultText?.showText ?? prev.showText,
        fontStyle: template.defaultText?.fontStyle ?? prev.fontStyle,
      }));
    }
    // Re-adjust cover transform for new frame opening
    if (image) {
      const rawApW = template.aperture.width * template.canvasWidth;
      const rawApH = template.aperture.height * template.canvasHeight;
      setTransform(
        calculateInitialCoverTransform(image.naturalWidth, image.naturalHeight, rawApW, rawApH)
      );
    }
  };

  // Process selected or dropped image file
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
      img.onload = () => {
        setImage(img);
        setImageSrc(dataUrl);
        const rawApW = selectedTemplate.aperture.width * selectedTemplate.canvasWidth;
        const rawApH = selectedTemplate.aperture.height * selectedTemplate.canvasHeight;
        setTransform(
          calculateInitialCoverTransform(img.naturalWidth, img.naturalHeight, rawApW, rawApH)
        );
        setActiveTab('transform');
      };
    };
    reader.readAsDataURL(file);
  }, [selectedTemplate]);

  // Load sample image
  const handleSelectSample = (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      setImage(img);
      setImageSrc(dataUrl);
      const rawApW = selectedTemplate.aperture.width * selectedTemplate.canvasWidth;
      const rawApH = selectedTemplate.aperture.height * selectedTemplate.canvasHeight;
      setTransform(
        calculateInitialCoverTransform(img.naturalWidth, img.naturalHeight, rawApW, rawApH)
      );
      setActiveTab('transform');
    };
  };

  // Keyboard navigation & realignment nudges
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const step = e.shiftKey ? 15 : 4;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setTransform((prev) => ({ ...prev, y: prev.y - step }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setTransform((prev) => ({ ...prev, y: prev.y + step }));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setTransform((prev) => ({ ...prev, x: prev.x - step }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setTransform((prev) => ({ ...prev, x: prev.x + step }));
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setTransform((prev) => ({
          ...prev,
          scale: Math.min(5, prev.scale * 1.08),
        }));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setTransform((prev) => ({
          ...prev,
          scale: Math.max(0.1, prev.scale * 0.92),
        }));
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setTransform((prev) => {
          let next = (prev.rotation + 90) % 360;
          if (next > 180) next -= 360;
          return { ...prev, rotation: next };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResetTransform = () => {
    if (!image) return;
    const rawApW = selectedTemplate.aperture.width * selectedTemplate.canvasWidth;
    const rawApH = selectedTemplate.aperture.height * selectedTemplate.canvasHeight;
    setTransform(
      calculateInitialCoverTransform(image.naturalWidth, image.naturalHeight, rawApW, rawApH)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processImageFile(e.target.files[0]);
          }
        }}
      />

      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'th' ? 'en' : 'th'))}
        isSimpleMode={isSimpleMode}
        onToggleMode={() => setIsSimpleMode((m) => !m)}
        onUploadClick={() => fileInputRef.current?.click()}
        onOpenSamples={() => setIsSamplePickerOpen(true)}
        onResetTransform={handleResetTransform}
        onToggleGuides={() => setShowGuides((prev) => !prev)}
        showGuides={showGuides}
        onOpenExport={() => setIsExportOpen(true)}
        hasImage={!!image}
      />

      {/* Main Workspace Layout - Optimized for Mobile & Desktop */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center Area: Interactive Canvas Workspace Stage */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
          <CanvasStage
            lang={lang}
            isSimpleMode={isSimpleMode}
            image={image}
            template={selectedTemplate}
            transform={transform}
            filters={filters}
            matting={matting}
            customText={customText}
            showGuides={showGuides}
            onTransformChange={setTransform}
            onUploadClick={() => fileInputRef.current?.click()}
            onOpenSamples={() => setIsSamplePickerOpen(true)}
            onDropImage={processImageFile}
          />
        </div>

        {/* Right Sidebar Controls Panel (Optimized for Seniors & Mobile) */}
        <aside className="w-full lg:w-[410px] xl:w-[440px] flex flex-col bg-white shrink-0 lg:max-h-[calc(100vh-64px)] overflow-hidden shadow-xs">
          {/* If in Pro Mode: Show Tabs. If in Simple Mode: Show Simple Header */}
          {!isSimpleMode ? (
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('transform')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'transform'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <Move className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.tabAlign}</span>
              </button>

              <button
                onClick={() => setActiveTab('frame')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'frame'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <Frame className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.tabFrames}</span>
              </button>

              <button
                onClick={() => setActiveTab('filters')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'filters'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.tabFilters}</span>
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.tabQuote}</span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-indigo-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">
                  {t.easyMode}
                </span>
              </div>
              <button
                onClick={() => setIsSimpleMode(false)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
              >
                {lang === 'th' ? 'สลับเป็นโหมดละเอียด' : 'Switch to Pro Mode'}
              </button>
            </div>
          )}

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-slate-50/30">
            {isSimpleMode ? (
              <SimpleControls
                lang={lang}
                transform={transform}
                image={image}
                template={selectedTemplate}
                onTransformChange={setTransform}
                onUploadClick={() => fileInputRef.current?.click()}
                onOpenSamples={() => setIsSamplePickerOpen(true)}
                onOpenExport={() => setIsExportOpen(true)}
              />
            ) : (
              <>
                {activeTab === 'transform' && (
                  <TransformControls
                    lang={lang}
                    transform={transform}
                    image={image}
                    template={selectedTemplate}
                    onTransformChange={setTransform}
                  />
                )}

                {activeTab === 'frame' && (
                  <FrameSelector
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={handleSelectTemplate}
                    matting={matting}
                    onMattingChange={setMatting}
                  />
                )}

                {activeTab === 'filters' && (
                  <FilterControls filters={filters} onFilterChange={setFilters} />
                )}

                {activeTab === 'text' && (
                  <TextControls customText={customText} onTextChange={setCustomText} />
                )}
              </>
            )}
          </div>

          {/* Quick Photo Upload & Replace Footer Bar */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-2xs"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>{imageSrc ? t.changePhoto : t.uploadPhoto}</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportBtn}</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Export Modal with Confetti Celebration */}
      <ExportModal
        lang={lang}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        image={image}
        template={selectedTemplate}
        transform={transform}
        filters={filters}
        matting={matting}
        customText={customText}
      />

      {/* Sample Photo Picker Modal */}
      <SamplePhotoPicker
        lang={lang}
        isOpen={isSamplePickerOpen}
        onClose={() => setIsSamplePickerOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
