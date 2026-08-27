import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FrameTemplate,
  PhotoTransform,
  PhotoFilters,
  MattingSettings,
  GalleryTextItem,
} from '../types/frame';
import { renderGalleryCanvas } from '../utils/canvasRenderer';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { Language } from '../utils/i18n';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Upload,
  Sparkles,
  Move,
  Camera,
  RotateCw,
  Focus,
} from 'lucide-react';

interface CanvasStageProps {
  lang: Language;
  isSimpleMode: boolean;
  image: HTMLImageElement | null;
  sceneImage: HTMLImageElement | null;
  template: FrameTemplate;
  transform: PhotoTransform;
  filters: PhotoFilters;
  matting: MattingSettings;
  customText: GalleryTextItem;
  showGuides: boolean;
  onTransformChange: (transform: PhotoTransform) => void;
  onUploadClick: () => void;
  onOpenSamples: () => void;
  onDropImage: (file: File) => void;
}

export function CanvasStage({
  lang,
  isSimpleMode,
  image,
  sceneImage,
  template,
  transform,
  filters,
  matting,
  customText,
  showGuides,
  onTransformChange,
  onUploadClick,
  onOpenSamples,
  onDropImage,
}: CanvasStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewScale, setViewScale] = useState(1);

  // Hook for handling direct drag, mouse wheel, and pinch-to-zoom on canvas
  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useCanvasInteraction({
    canvasRef,
    transform,
    onTransformChange,
    canvasScale: viewScale,
    enabled: !!image,
  });

  // Calculate container scale to fit responsive viewport (optimized for mobile)
  const updateContainerScale = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (!clientWidth || !clientHeight) return;

    // Mobile needs tight padding so canvas is large and clear
    const paddingX = window.innerWidth < 640 ? 12 : 36;
    const paddingY = window.innerWidth < 640 ? 12 : 36;
    const availW = clientWidth - paddingX;
    const availH = clientHeight - paddingY;

    const scaleX = availW / template.canvasWidth;
    const scaleY = availH / template.canvasHeight;
    const fitScale = Math.min(scaleX, scaleY, 1.05);

    setViewScale(Math.max(0.18, fitScale));
  }, [template]);

  useEffect(() => {
    updateContainerScale();
    window.addEventListener('resize', updateContainerScale);
    return () => window.removeEventListener('resize', updateContainerScale);
  }, [updateContainerScale]);

  // Render canvas whenever dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderGalleryCanvas({
      canvas,
      image,
      sceneImage,
      template,
      transform,
      filters,
      matting,
      customText,
      exportMode: 'full_scene',
      scaleFactor: 1,
      drawGuides: showGuides,
    });
  }, [image, sceneImage, template, transform, filters, matting, customText, showGuides]);

  // Drag & drop file handling on workspace
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDropImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex-1 w-full h-full min-h-[300px] sm:min-h-[420px] flex items-center justify-center overflow-hidden workspace-grid select-none transition-colors duration-200 ${
        isDragOver ? 'bg-indigo-50/60 ring-2 ring-indigo-400 ring-inset' : ''
      }`}
    >
      {/* Floating Canvas Card Wrapper */}
      <div
        className="relative transition-transform duration-75 ease-out shadow-2xl rounded-2xl bg-white border border-slate-200/90 p-1.5 sm:p-3"
        style={{
          width: template.canvasWidth * viewScale,
          height: template.canvasHeight * viewScale,
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
          onWheel={handleWheel}
          className={`w-full h-full rounded-xl object-contain touch-none block ${
            image
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-pointer'
          }`}
          onClick={() => {
            if (!image) onUploadClick();
          }}
          title={
            image
              ? lang === 'th'
                ? 'แตะลากรูปเพื่อปรับตำแหน่ง • กางนิ้วซูมเข้าออก'
                : 'Drag to reposition • Pinch to zoom'
              : 'Click to choose photo'
          }
        />

        {/* Floating Quick Canvas Overlay Badge */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-5 pointer-events-none flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium border border-white/10 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            {template.name}
          </span>
        </div>

        {/* Drag Hint overlay when hovering or moving */}
        {image && (
          <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 pointer-events-none flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] sm:text-[11px] border border-white/10 shadow-sm flex items-center gap-1.5">
              <Move className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'th' ? 'แตะลากที่รูปได้เลย' : 'Drag photo to move'}</span>
            </div>
          </div>
        )}

        {/* Drop zone indicator active */}
        {isDragOver && (
          <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-xs flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-500 z-20">
            <div className="p-4 bg-white rounded-2xl shadow-xl text-center space-y-2">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-slate-800">
                {lang === 'th' ? 'ปล่อยรูปภาพที่นี่' : 'Drop photo here'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Viewport Controls Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-2.5 py-1 shadow-lg flex items-center gap-1.5 sm:gap-2 z-10">
        <button
          onClick={() => setViewScale((s) => Math.max(0.18, s - 0.08))}
          className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Zoom View Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] font-mono text-slate-700 min-w-[36px] text-center font-medium">
          {Math.round(viewScale * 100)}%
        </span>

        <button
          onClick={() => setViewScale((s) => Math.min(2.0, s + 0.08))}
          className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Zoom View In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-200 mx-0.5" />

        <button
          onClick={updateContainerScale}
          className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Fit Canvas to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Empty State Banner if no image */}
      {!image && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto max-w-sm w-full bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center shadow-xl space-y-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'th' ? 'เลือกรูปภาพที่คุณต้องการใส่กรอบ' : 'Choose a Picture to Frame'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'th' ? 'กดปุ่มด้านล่างเพื่อเลือกรูปจากมือถือหรือคอมพิวเตอร์' : 'Tap below to select photo from device'}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onUploadClick}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'th' ? 'เลือกรูปภาพของคุณ' : 'Choose Your Photo'}</span>
              </button>

              <button
                onClick={onOpenSamples}
                className="w-full py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'th' ? 'ลองดูภาพตัวอย่าง' : 'Try Sample Photos'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
