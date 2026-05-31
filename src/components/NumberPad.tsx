import type { Digit } from '../lib/sudoku'

export type NumberPadVariant = 'digit' | 'note'

type Props = {
  variant: NumberPadVariant
  onDigit: (digit: Digit) => void
  onClear: () => void
  disabled?: boolean
}

/** Classic numpad order: 7–9 top row, 1–3 bottom row */
const NUMPAD_ROWS: Digit[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

const variantStyles: Record<
  NumberPadVariant,
  { key: string; clear: string; label: string; clearLabel: string }
> = {
  digit: {
    key: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
    clear: 'bg-slate-700/80 text-slate-300 hover:bg-slate-600',
    label: 'Digit pad',
    clearLabel: 'Clear',
  },
  note: {
    key: 'bg-amber-900/80 text-amber-100 hover:bg-amber-800/90',
    clear: 'bg-amber-900/60 text-amber-200/90 hover:bg-amber-800/80',
    label: 'Note pad',
    clearLabel: 'Clear',
  },
}

export function NumberPad({ variant, onDigit, onClear, disabled }: Props) {
  const styles = variantStyles[variant]
  const keyClass = `aspect-square items-center justify-center rounded-lg text-lg font-bold transition active:scale-95 disabled:opacity-40 ${styles.key}`

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-start text-base font-medium text-slate-500">
        {variant === 'digit' ? 'Digits' : 'Notes'}
      </span>
      <div
        className="grid grid-cols-3 gap-1"
        role="group"
        aria-label={styles.label}
      >
        {NUMPAD_ROWS.map((row) =>
          row.map((d) => (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onDigit(d)}
              className={keyClass}
            >
              {d}
            </button>
          )),
        )}
        <div className="col-span-3">
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className={`flex aspect-[8/2] w-full items-center justify-center rounded-lg text-base font-bold transition active:scale-[0.99] disabled:opacity-40  ${styles.clear}`}
          >
            {styles.clearLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
