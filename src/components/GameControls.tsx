import type { Difficulty } from '../lib/sudoku'

type Props = {
  difficulty: Difficulty
  notesMode: boolean
  elapsed: number
  isComplete: boolean
  onDifficultyChange: (d: Difficulty) => void
  onNotesModeToggle: () => void
  onNewGame: () => void
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function GameControls({
  difficulty,
  notesMode,
  elapsed,
  isComplete,
  onDifficultyChange,
  onNotesModeToggle,
  onNewGame,
}: Props) {
  return (
    <header className="flex w-full max-w-[min(90dvw,90dvh)] flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
          Sudoku
        </h1>
        <span className="tabular-nums text-sm text-slate-400">
          {formatTime(elapsed)}
        </span>
      </div>

      {isComplete && (
        <p className="rounded-lg bg-emerald-900/50 px-3 py-2 text-center text-sm font-medium text-emerald-300">
          Puzzle complete!
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-slate-800 p-0.5">
          {DIFFICULTIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onDifficultyChange(value)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                difficulty === value
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNotesModeToggle}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
            notesMode
              ? 'bg-amber-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Notes {notesMode ? 'on' : 'off'}
        </button>

        <button
          type="button"
          onClick={onNewGame}
          className="ml-auto rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-600 sm:text-sm"
        >
          New game
        </button>
      </div>
    </header>
  )
}
