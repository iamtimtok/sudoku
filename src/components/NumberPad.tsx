import type { Digit } from '../lib/sudoku'

type Props = {
  onDigit: (digit: Digit) => void
  onClear: () => void
  disabled?: boolean
}

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function NumberPad({ onDigit, onClear, disabled }: Props) {
  return (
    <div className="flex w-full max-w-[min(90dvw,90dvh)] flex-col gap-2">
      <div className="grid grid-cols-9 gap-1.5">
        {DIGITS.map((d) => (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onClick={() => onDigit(d)}
            className="aspect-square rounded-lg bg-slate-700 text-lg font-semibold text-slate-100 transition hover:bg-slate-600 active:scale-95 disabled:opacity-40 sm:text-xl"
          >
            {d}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onClear}
        className="rounded-lg bg-slate-700/80 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-600 disabled:opacity-40"
      >
        Clear cell
      </button>
    </div>
  )
}
