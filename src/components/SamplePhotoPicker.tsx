import { useState, useEffect } from 'react';
import { SAMPLE_IMAGES, getSampleImageUrl } from '../utils/sampleImages';
import { translations, Language } from '../utils/i18n';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface SamplePhotoPickerProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (dataUrl: string, name: string) => void;
}

export function SamplePhotoPicker({
  lang,
  isOpen,
  onClose,
  onSelectSample,
}: SamplePhotoPickerProps) {
  const t = translations[lang];
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const urls: Record<string, string> = {};
      SAMPLE_IMAGES.forEach((sample) => {
        urls[sample.id] = getSampleImageUrl(sample.id);
      });
      setThumbnails(urls);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {t.sampleTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.sampleSub}
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

        {/* Samples Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {SAMPLE_IMAGES.map((sample) => {
            const thumb = thumbnails[sample.id];
            return (
              <button
                key={sample.id}
                onClick={() => {
                  const url = thumb || getSampleImageUrl(sample.id);
                  onSelectSample(url, sample.name);
                  onClose();
                }}
                className="group relative rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all p-2 text-left cursor-pointer overflow-hidden shadow-2xs hover:shadow-md active:scale-95"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      {t.loading}
                    </div>
                  )}

                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] text-indigo-700 font-semibold border border-slate-200 shadow-2xs">
                    {sample.category}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {sample.name}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
