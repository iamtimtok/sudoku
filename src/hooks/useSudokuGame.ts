import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type Board,
  type CellValue,
  type Difficulty,
  type Digit,
  cloneBoard,
  generatePuzzle,
  getAllConflicts,
  boardsEqual,
} from '../lib/sudoku'

const STORAGE_KEY = 'sudoku-game-v1'

type SavedGame = {
  puzzle: Board
  solution: Board
  player: Board
  notes: Record<string, number[]>
  difficulty: Difficulty
  selected: [number, number] | null
  notesMode: boolean
  startedAt: number
}

type GameState = {
  difficulty: Difficulty
  puzzle: Board
  solution: Board
  player: Board
  givens: boolean[][]
  notes: Record<string, number[]>
  selected: [number, number] | null
  notesMode: boolean
  startedAt: number
}

function notesKey(row: number, col: number): string {
  return `${row},${col}`
}

function loadSaved(): SavedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedGame
  } catch {
    return null
  }
}

function saveGame(state: SavedGame): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createInitialState(difficulty: Difficulty = 'medium'): GameState {
  const { puzzle, solution } = generatePuzzle(difficulty)
  return {
    difficulty,
    puzzle,
    solution,
    player: cloneBoard(puzzle),
    givens: puzzle.map((row) => row.map((cell) => cell !== 0)),
    notes: {},
    selected: null,
    notesMode: false,
    startedAt: Date.now(),
  }
}

function stateFromSaved(saved: SavedGame): GameState {
  return {
    difficulty: saved.difficulty,
    puzzle: saved.puzzle,
    solution: saved.solution,
    player: saved.player,
    givens: saved.puzzle.map((row) => row.map((cell) => cell !== 0)),
    notes: saved.notes,
    selected: saved.selected,
    notesMode: saved.notesMode,
    startedAt: saved.startedAt,
  }
}

function initGameState(): GameState {
  const saved = loadSaved()
  return saved ? stateFromSaved(saved) : createInitialState('medium')
}

export function useSudokuGame() {
  const [game, setGame] = useState<GameState>(initGameState)

  const {
    difficulty,
    puzzle,
    solution,
    player,
    givens,
    notes,
    selected,
    notesMode,
    startedAt,
  } = game

  useEffect(() => {
    saveGame({
      puzzle,
      solution,
      player,
      notes,
      difficulty,
      selected,
      notesMode,
      startedAt,
    })
  }, [puzzle, solution, player, notes, difficulty, selected, notesMode, startedAt])

  const conflicts = useMemo(() => getAllConflicts(player), [player])
  const isComplete = useMemo(
    () => boardsEqual(player, solution),
    [player, solution],
  )
  const elapsed = useElapsed(startedAt, isComplete)

  const newGame = useCallback((diff: Difficulty = difficulty) => {
    setGame(createInitialState(diff))
  }, [difficulty])

  const setDifficulty = useCallback((diff: Difficulty) => {
    setGame((prev) => ({ ...prev, difficulty: diff }))
  }, [])

  const setSelected = useCallback((cell: [number, number] | null) => {
    setGame((prev) => ({ ...prev, selected: cell }))
  }, [])

  const setNotesMode = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setGame((prev) => ({
        ...prev,
        notesMode: typeof value === 'function' ? value(prev.notesMode) : value,
      }))
    },
    [],
  )

  const setCell = useCallback((row: number, col: number, value: CellValue) => {
    setGame((prev) => {
      if (prev.givens[row][col]) return prev
      const player = cloneBoard(prev.player)
      player[row][col] = value
      const key = notesKey(row, col)
      const { [key]: removed, ...restNotes } = prev.notes
      void removed
      return {
        ...prev,
        player,
        notes: key in prev.notes ? restNotes : prev.notes,
      }
    })
  }, [])

  const toggleNote = useCallback((row: number, col: number, digit: Digit) => {
    setGame((prev) => {
      if (prev.givens[row][col] || prev.player[row][col] !== 0) return prev
      const key = notesKey(row, col)
      const current = prev.notes[key] ?? []
      const has = current.includes(digit)
      const next = has
        ? current.filter((d) => d !== digit)
        : [...current, digit].sort((a, b) => a - b)
      if (next.length === 0) {
        const { [key]: removed, ...rest } = prev.notes
        void removed
        return { ...prev, notes: rest }
      }
      return { ...prev, notes: { ...prev.notes, [key]: next } }
    })
  }, [])

  const applyDigit = useCallback(
    (digit: Digit) => {
      if (!selected) return
      const [row, col] = selected
      if (givens[row][col]) return
      if (notesMode) {
        toggleNote(row, col, digit)
      } else {
        setCell(row, col, player[row][col] === digit ? 0 : digit)
      }
    },
    [selected, givens, notesMode, player, setCell, toggleNote],
  )

  const clearCell = useCallback(() => {
    if (!selected) return
    const [row, col] = selected
    if (givens[row][col]) return
    setGame((prev) => {
      const player = cloneBoard(prev.player)
      player[row][col] = 0
      const key = notesKey(row, col)
      const { [key]: removed, ...restNotes } = prev.notes
      void removed
      return { ...prev, player, notes: restNotes }
    })
  }, [selected, givens])

  const moveSelection = useCallback((dr: number, dc: number) => {
    setGame((prev) => {
      const [r, c] = prev.selected ?? [0, 0]
      return {
        ...prev,
        selected: [
          Math.max(0, Math.min(8, r + dr)),
          Math.max(0, Math.min(8, c + dc)),
        ],
      }
    })
  }, [])

  return {
    difficulty,
    puzzle,
    player,
    givens,
    notes,
    selected,
    notesMode,
    conflicts,
    isComplete,
    elapsed,
    newGame,
    setDifficulty,
    setSelected,
    setNotesMode,
    applyDigit,
    clearCell,
    moveSelection,
  }
}

function useElapsed(startedAt: number, paused: boolean): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const update = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    }

    update()
    if (paused) return

    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [paused, startedAt])

  return elapsed
}
