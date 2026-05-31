import { useCallback, useEffect } from 'react'
import type { Difficulty, Digit } from './lib/sudoku'
import { SudokuBoard } from './components/SudokuBoard'
import { NumberPad } from './components/NumberPad'
import { GameControls, GameHeader } from './components/GameControls'
import { useSudokuGame } from './hooks/useSudokuGame'
import useWindowInnderDemention from './hooks/useWindowInnerDimention'

function App() {
  const game = useSudokuGame()
  const {
    difficulty,
    player,
    givens,
    notes,
    selected,
    conflicts,
    elapsed,
    isComplete,
    newGame,
    setDifficulty,
    setSelected,
    fillDigit,
    applyNote,
    clearCell,
    clearNotes,
    moveSelection,
  } = game

  const { width: innerWindowWidth, height: innerWindowHeight } = useWindowInnderDemention();

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
        if (e.shiftKey) {
          applyNote(Number(e.key) as Digit)
        } else {
          fillDigit(Number(e.key) as Digit)
        }
        e.preventDefault()
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        if (e.shiftKey) {
          clearNotes()
        } else {
          clearCell()
        }
        e.preventDefault()
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
  }, [fillDigit, applyNote, clearCell, clearNotes, moveSelection])

  return (
    <div className="flex h-dvh w-full min-h-0 flex-col items-center gap-4 bg-slate-950">
      <GameHeader difficulty={difficulty} elapsed={elapsed} isComplete={isComplete} />

      {(innerWindowWidth > innerWindowHeight) ? (
        <div className="flex w-[96dvw] flex-1 min-h-0 flex-row justify-between gap-3 sm:gap-4 [container-type:size]">
          <div className="flex h-full w-[min(70cqw,100cqh)] shrink-0 items-start justify-start ">
            <div className="aspect-square w-full">
              <SudokuBoard
                player={player}
                givens={givens}
                notes={notes}
                selected={selected}
                conflicts={conflicts}
                onSelect={(row, col) => setSelected([row, col])}
              />
            </div>
          </div>
          <div className="flex w-[calc(min(70cqw,100cqh)*0.6)] flex-col gap-4 justify-center">
            <div className="flex gap-3 sm:gap-4">
              <NumberPad
                variant="note"
                onDigit={applyNote}
                onClear={clearNotes}
                disabled={isComplete}
              />
              <NumberPad
                variant="digit"
                onDigit={fillDigit}
                onClear={clearCell}
                disabled={isComplete}
              />
            </div>
            <GameControls
              onDifficultyChange={handleDifficulty}
            />
          </div>
        </div>
      ) : (
        <div className="flex w-[96svw] flex-1 min-w-0 flex-col gap-3 [container-type:size]">
          <div className="flex w-full h-[min(100cqw,70cqh)] shrink-0 items-start justify-center">
            <div className="aspect-square h-full">
              <SudokuBoard
                player={player}
                givens={givens}
                notes={notes}
                selected={selected}
                conflicts={conflicts}
                onSelect={(row, col) => setSelected([row, col])}
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-col gap-3 items-center">
            <div className="flex gap-3 w-[min(100cqw,35cqh)]">
            <NumberPad
                variant="note"
                onDigit={applyNote}
                onClear={clearNotes}
                disabled={isComplete}
              />
              <NumberPad
                variant="digit"
                onDigit={fillDigit}
                onClear={clearCell}
                disabled={isComplete}
              />
            </div>
            <GameControls
              onDifficultyChange={handleDifficulty}
            />
          </div>
        </div>
      )}
      <p className="max-w-[min(90dvw,90dvh)] shrink-0 text-center text-xs text-slate-500">
        Keys 1–9 for digits · Shift+1–9 for notes · arrows to move · works
        offline
      </p>
    </div>
  )
}

export default App
