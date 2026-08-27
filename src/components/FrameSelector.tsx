import { FrameTemplate, MattingSettings } from '../types/frame';
import { FRAME_TEMPLATES } from '../utils/frameTemplates';
import { Sparkles, Check } from 'lucide-react';

interface FrameSelectorProps {
  selectedTemplate: FrameTemplate;
  onSelectTemplate: (template: FrameTemplate) => void;
  matting: MattingSettings;
  onMattingChange: (matting: MattingSettings) => void;
}

const MAT_COLORS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Museum Cream', value: '#fcf8e3' },
  { name: 'Warm Linen', value: '#f5f0eb' },
  { name: 'Slate Gray', value: '#475569' },
  { name: 'Midnight Navy', value: '#0f172a' },
  { name: 'Matte Black', value: '#1e293b' },
];

export function FrameSelector({
  selectedTemplate,
  onSelectTemplate,
  matting,
  onMattingChange,
}: FrameSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Frame Gallery Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Gallery Wall Theme
          </label>
          <span className="text-[11px] text-slate-400">
            {FRAME_TEMPLATES.length} Styles
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {FRAME_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border shadow-xs shrink-0"
                    style={{
                      backgroundColor:
                        tmpl.id === 'royal_navy'
                          ? '#0b1626'
                          : tmpl.id === 'gilded_baroque'
                          ? '#1c150c'
                          : tmpl.id === 'nordic_oak'
                          ? '#f1ebe3'
                          : tmpl.id === 'modern_slate'
                          ? '#1e293b'
                          : tmpl.id === 'polaroid_desk'
                          ? '#451a03'
                          : '#141419',
                      borderColor:
                        tmpl.id === 'gilded_baroque' ? '#d4af37' : '#cbd5e1',
                    }}
                  >
                    <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                      {tmpl.id.slice(0, 3)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tmpl.name}
                      </h4>
                      {tmpl.id === 'royal_navy' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                          Original
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passe-Partout Matting Controls */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <div>
              <h4 className="text-xs font-semibold text-slate-800">
                Passe-Partout Matting
              </h4>
              <p className="text-[11px] text-slate-500">
                Museum bevel border card around photo
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={matting.enabled}
              onChange={(e) =>
                onMattingChange({ ...matting, enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {matting.enabled && (
          <div className="pt-2 border-t border-slate-100 space-y-3">
            {/* Matting Width Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Mat Margin Width</span>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {matting.widthPercent}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={matting.widthPercent}
                onChange={(e) =>
                  onMattingChange({
                    ...matting,
                    widthPercent: parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Matting Color Swatches */}
            <div>
              <label className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                Mat Color
              </label>
              <div className="flex flex-wrap gap-2">
                {MAT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() =>
                      onMattingChange({ ...matting, color: c.value })
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      matting.color === c.value
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

            {/* Bevel Cut Core & Gold Fillet Checkboxes */}
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matting.bevel}
                  onChange={(e) =>
                    onMattingChange({ ...matting, bevel: e.target.checked })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>45° Beveled Core</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matting.innerBorder}
                  onChange={(e) =>
                    onMattingChange({
                      ...matting,
                      innerBorder: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Gold Accent Fillet</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
