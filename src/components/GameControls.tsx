import type { Difficulty } from '../lib/sudoku'

type Props = {
  difficulty: Difficulty
  elapsed: number
  isComplete: boolean
  onDifficultyChange: (d: Difficulty) => void
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

export function GameHeader({
  difficulty,
  elapsed,
  isComplete,
}: Pick<Props, 'difficulty' | 'elapsed' | 'isComplete'>) {
  return (
    <header className="flex w-full max-w-[min(90dvw,90dvh)] flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
          Sudoku{' '}
          <span className="text-base font-semibold text-slate-400 sm:text-lg">
            ({DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? difficulty})
          </span>
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
    </header>
  )
}

export function GameControls({
  onDifficultyChange,
}: Pick<Props, 'onDifficultyChange'>) {
  return (
    <div className="flex w-full flex-wrap justify-center items-center gap-2">
      <span className="text-sm font-medium text-slate-300 sm:text-sm">
        New game:
      </span>
      <div className="flex rounded-lg bg-slate-800 p-0.5">
        {DIFFICULTIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onDifficultyChange(value)}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-slate-100 sm:px-3 sm:text-sm"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
