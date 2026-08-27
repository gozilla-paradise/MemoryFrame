import {
  Upload,
  Sparkles,
  Grid,
  Download,
  Image as ImageIcon,
  Languages,
  Zap,
} from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isSimpleMode: boolean;
  onToggleMode: () => void;
  onUploadClick: () => void;
  onOpenSamples: () => void;
  onResetTransform: () => void;
  onToggleGuides: () => void;
  showGuides: boolean;
  onOpenExport: () => void;
  hasImage: boolean;
}

export function Header({
  lang,
  onToggleLang,
  isSimpleMode,
  onToggleMode,
  onUploadClick,
  onOpenSamples,
  onToggleGuides,
  showGuides,
  onOpenExport,
  hasImage,
}: HeaderProps) {
  const t = translations[lang];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 truncate">
              {lang === 'th' ? (
                <>
                  ReptileHiso <span className="text-indigo-600 font-semibold">กรอบรูปหรู</span>
                </>
              ) : (
                <>
                  Frame<span className="text-indigo-600">Craft</span> Studio
                </>
              )}
            </h1>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shrink-0">
              ReptileHiso.com
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            {t.appSub}
          </p>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Simple / Pro Mode Toggle Button */}
        <button
          onClick={onToggleMode}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isSimpleMode
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={isSimpleMode ? 'สลับเป็นโหมดปรับแต่งละเอียด' : 'สลับเป็นโหมดใช้งานง่าย'}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="text-xs">
            {isSimpleMode ? (lang === 'th' ? 'โหมดง่าย' : 'Simple') : (lang === 'th' ? 'โหมดละเอียด' : 'Pro')}
          </span>
        </button>

        {/* Thai / English Language Switcher */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          title="สลับภาษาไทย / Switch to English"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-bold">{lang === 'th' ? 'TH' : 'EN'}</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          title={t.uploadDesc}
        >
          <Upload className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.upload}</span>
        </button>

        {/* Samples library button */}
        <button
          onClick={onOpenSamples}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          title="เลือกภาพตัวอย่าง"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.samplePhotos}</span>
        </button>

        {/* Grid Guides Toggle */}
        <button
          onClick={onToggleGuides}
          className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            showGuides
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title="เปิด/ปิด เส้นตารางวัดตำแหน่ง"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.grid}</span>
        </button>

        {/* Primary Export / Save Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm active:scale-98 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{t.exportBtn}</span>
          <span className="xs:hidden">{lang === 'th' ? 'บันทึก' : 'Save'}</span>
        </button>
      </div>
    </header>
  );
}
