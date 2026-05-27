import { boxIndex } from '../lib/sudoku'
import type { Board } from '../lib/sudoku'
import { SudokuCell } from './SudokuCell'

type Props = {
  player: Board
  givens: boolean[][]
  notes: Record<string, number[]>
  selected: [number, number] | null
  conflicts: Set<string>
  onSelect: (row: number, col: number) => void
}

function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

export function SudokuBoard({
  player,
  givens,
  notes,
  selected,
  conflicts,
  onSelect,
}: Props) {
  const [selRow, selCol] = selected ?? [-1, -1]
  const selectedValue =
    selRow >= 0 && selCol >= 0 ? player[selRow][selCol] : 0
  const selectedBox =
    selRow >= 0 && selCol >= 0 ? boxIndex(selRow, selCol) : -1

  return (
    <div
      className="aspect-square w-full max-w-[min(90dvw,90dvh)] select-none rounded-lg border-4 border-slate-600 bg-slate-800 shadow-2xl shadow-black/40"
      role="grid"
      aria-label="Sudoku board"
    >
      <div className="grid h-full w-full grid-cols-9 grid-rows-9">
        {player.map((row, r) =>
          row.map((value, c) => {
            const key = cellKey(r, c)
            const isSelected = r === selRow && c === selCol
            const isPeer =
              selected &&
              !isSelected &&
              (r === selRow ||
                c === selCol ||
                boxIndex(r, c) === selectedBox)
            const isSameNumber =
              selectedValue !== 0 && value === selectedValue
            const hasConflict = conflicts.has(key)

            return (
              <SudokuCell
                key={key}
                row={r}
                col={c}
                value={value}
                notes={notes[key]}
                isGiven={givens[r][c]}
                isSelected={isSelected}
                isPeer={!!isPeer}
                isSameNumber={isSameNumber}
                hasConflict={hasConflict}
                onSelect={() => onSelect(r, c)}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}
