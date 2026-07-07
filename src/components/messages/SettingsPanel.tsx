import { X } from 'lucide-react'
import { SETTINGS_OPTIONS, type SettingsState } from '../../data/messages'

export default function SettingsPanel({
  open,
  settings,
  onToggle,
  onClose,
  onSave,
}: {
  open: boolean
  settings: SettingsState
  onToggle: (key: keyof SettingsState) => void
  onClose: () => void
  onSave: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <div className="animate-[slideIn_0.25s_ease-out] flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">알림 설정</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {SETTINGS_OPTIONS.map((s) => (
            <label
              key={s.key}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-800">{s.label}</span>
                <span className="block text-xs text-slate-400">{s.desc}</span>
              </span>
              <span
                onClick={() => onToggle(s.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  settings[s.key] ? 'bg-sky-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    settings[s.key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={onSave}
          className="mt-auto flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          저장하기
        </button>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}
