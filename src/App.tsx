import { useCallback, useEffect } from 'react'
import type { Difficulty, Digit } from './lib/sudoku'
import { SudokuBoard } from './components/SudokuBoard'
import { NumberPad } from './components/NumberPad'
import { GameControls } from './components/GameControls'
import { useSudokuGame } from './hooks/useSudokuGame'

function App() {
  const game = useSudokuGame()
  const {
    difficulty,
    player,
    givens,
    notes,
    selected,
    conflicts,
    notesMode,
    elapsed,
    isComplete,
    newGame,
    setDifficulty,
    setSelected,
    setNotesMode,
    applyDigit,
    clearCell,
    moveSelection,
  } = game

  const handleNewGame = useCallback(() => {
    newGame(difficulty)
  }, [newGame, difficulty])

  const handleDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d)
      newGame(d)
    },
    [setDifficulty, newGame],
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        applyDigit(Number(e.key) as Digit)
        e.preventDefault()
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        clearCell()
        e.preventDefault()
        return
      }
      if (e.key === 'n' || e.key === 'N') {
        setNotesMode((m) => !m)
        return
      }
      const moves: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      }
      const delta = moves[e.key]
      if (delta) {
        moveSelection(...delta)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [applyDigit, clearCell, setNotesMode, moveSelection])

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-950 px-4 py-6 sm:gap-5 sm:py-8">
      <GameControls
        difficulty={difficulty}
        notesMode={notesMode}
        elapsed={elapsed}
        isComplete={isComplete}
        onDifficultyChange={handleDifficulty}
        onNotesModeToggle={() => setNotesMode((m) => !m)}
        onNewGame={handleNewGame}
      />

      <SudokuBoard
        player={player}
        givens={givens}
        notes={notes}
        selected={selected}
        conflicts={conflicts}
        onSelect={(row, col) => setSelected([row, col])}
      />

      <NumberPad
        onDigit={applyDigit}
        onClear={clearCell}
        disabled={isComplete}
      />

      <p className="max-w-[min(90dvw,90dvh)] text-center text-xs text-slate-500">
        Keys 1–9 to fill · arrows to move · N for notes · works offline
      </p>
    </div>
  )
}

export default App
