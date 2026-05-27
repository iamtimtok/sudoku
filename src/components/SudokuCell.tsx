type Props = {
  row: number
  col: number
  value: number
  notes?: number[]
  isGiven: boolean
  isSelected: boolean
  isPeer: boolean
  isSameNumber: boolean
  hasConflict: boolean
  onSelect: () => void
}

function borderClasses(row: number, col: number): string {
  const classes: string[] = ['border-slate-600']
  if (col % 3 === 2 && col < 8) classes.push('border-r-2 border-r-slate-400')
  if (row % 3 === 2 && row < 8) classes.push('border-b-2 border-b-slate-400')
  return classes.join(' ')
}

export function SudokuCell({
  row,
  col,
  value,
  notes,
  isGiven,
  isSelected,
  isPeer,
  isSameNumber,
  hasConflict,
  onSelect,
}: Props) {
  let bg = 'bg-slate-900'
  if (hasConflict) bg = 'bg-red-950/80'
  else if (isSelected) bg = 'bg-sky-900/70'
  else if (isSameNumber) bg = 'bg-sky-950/50'
  else if (isPeer) bg = 'bg-slate-800'

  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={isSelected}
      aria-label={
        value
          ? `Row ${row + 1} column ${col + 1}, ${value}`
          : `Row ${row + 1} column ${col + 1}, empty`
      }
      className={`relative flex items-center justify-center border ${borderClasses(row, col)} ${bg} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset`}
      onClick={onSelect}
    >
      {value !== 0 ? (
        <span
          className={`text-[clamp(1rem,4.5vmin,2.5rem)] font-semibold leading-none ${
            isGiven
              ? 'text-slate-100'
              : hasConflict
                ? 'text-red-300'
                : 'text-sky-300'
          }`}
        >
          {value}
        </span>
      ) : notes && notes.length > 0 ? (
        <span className="grid h-full w-full grid-cols-3 grid-rows-3 gap-px p-0.5">
          {Array.from({ length: 9 }, (_, i) => {
            const digit = i + 1
            const show = notes.includes(digit)
            return (
              <span
                key={digit}
                className={`flex items-center justify-center text-[clamp(0.35rem,1.8vmin,0.65rem)] leading-none ${
                  show ? 'text-slate-400' : 'text-transparent'
                }`}
              >
                {digit}
              </span>
            )
          })}
        </span>
      ) : null}
    </button>
  )
}
