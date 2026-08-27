import { GalleryTextItem } from '../types/frame';
import { Type, Sparkles } from 'lucide-react';

interface TextControlsProps {
  customText: GalleryTextItem;
  onTextChange: (text: GalleryTextItem) => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Indigo Sleek', value: '#6366f1' },
  { name: 'Pure Gold', value: '#facc15' },
  { name: 'Champagne Warm', value: '#f59e0b' },
  { name: 'Rose Quartz', value: '#fb7185' },
  { name: 'Diamond White', value: '#ffffff' },
  { name: 'Ocean Cyan', value: '#38bdf8' },
  { name: 'Emerald Mint', value: '#34d399' },
];

export function TextControls({ customText, onTextChange }: TextControlsProps) {
  return (
    <div className="space-y-4">
      {/* Toggle Text */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-600" />
          <div>
            <h4 className="text-xs font-semibold text-slate-800">
              Gallery Wall Typography
            </h4>
            <p className="text-[11px] text-slate-500">
              Displays elegant quotes & commemorative memory typography
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={customText.showText}
            onChange={(e) =>
              onTextChange({ ...customText, showText: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {customText.showText && (
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          {/* Quick Presets */}
          <div>
            <label className="text-[11px] text-slate-500 block mb-1.5 font-medium">
              Preset Quotes
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  onTextChange({
                    ...customText,
                    line1: 'ONE STORY',
                    line2: 'A MILLION',
                    highlight: 'Memories',
                    localized: '1 เรื่องราว 1 ล้านความทรงจำ',
                    highlightColor: '#facc15',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] transition-colors cursor-pointer"
              >
                One Story, A Million Memories
              </button>

              <button
                onClick={() =>
                  onTextChange({
                    ...customText,
                    line1: 'TIMELESS',
                    line2: 'PRECIOUS',
                    highlight: 'Moments',
                    localized: 'ช่วงเวลาแห่งความสุขที่ไม่มีวันลืม',
                    highlightColor: '#fb7185',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] transition-colors cursor-pointer"
              >
                Timeless Moments
              </button>

              <button
                onClick={() =>
                  onTextChange({
                    ...customText,
                    line1: 'ALWAYS &',
                    line2: 'FOREVER',
                    highlight: 'Together',
                    localized: 'บันทึกความรักและความผูกพัน',
                    highlightColor: '#6366f1',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] transition-colors cursor-pointer"
              >
                Always & Forever
              </button>
            </div>
          </div>

          {/* Line 1 & Line 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={customText.line1}
                onChange={(e) =>
                  onTextChange({ ...customText, line1: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="ONE STORY"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={customText.line2}
                onChange={(e) =>
                  onTextChange({ ...customText, line2: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="A MILLION"
              />
            </div>
          </div>

          {/* Highlight Script Word */}
          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1 flex items-center justify-between">
              <span>Script Highlight Word</span>
              <span className="text-[10px] text-indigo-600 font-sans">
                Rendered in Calligraphy
              </span>
            </label>
            <input
              type="text"
              value={customText.highlight}
              onChange={(e) =>
                onTextChange({ ...customText, highlight: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-indigo-600 font-serif focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              placeholder="Memories"
            />
          </div>

          {/* Localized / Secondary Subtitle */}
          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              Secondary Subtitle / Thai Caption
            </label>
            <input
              type="text"
              value={customText.localized}
              onChange={(e) =>
                onTextChange({ ...customText, localized: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="1 เรื่องราว 1 ล้านความทรงจำ"
            />
          </div>

          {/* Highlight Script Color */}
          <div>
            <span className="text-[11px] text-slate-600 font-medium block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Script Highlight Color
            </span>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() =>
                    onTextChange({ ...customText, highlightColor: c.value })
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                    customText.highlightColor === c.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-400/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="text-[11px]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
