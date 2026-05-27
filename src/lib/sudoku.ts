export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type CellValue = 0 | Digit
export type Board = CellValue[][]
export type Difficulty = 'easy' | 'medium' | 'hard'

const SIZE = 9
const BOX = 3

const CLUES: Record<Difficulty, number> = {
  easy: 40,
  medium: 32,
  hard: 26,
}

export function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as CellValue[])
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

function boxIndex(row: number, col: number): number {
  return Math.floor(row / BOX) * BOX + Math.floor(col / BOX)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: Digit,
): boolean {
  for (let c = 0; c < SIZE; c++) {
    if (board[row][c] === value) return false
  }
  for (let r = 0; r < SIZE; r++) {
    if (board[r][col] === value) return false
  }
  const br = Math.floor(row / BOX) * BOX
  const bc = Math.floor(col / BOX) * BOX
  for (let r = br; r < br + BOX; r++) {
    for (let c = bc; c < bc + BOX; c++) {
      if (board[r][c] === value) return false
    }
  }
  return true
}

export function findEmpty(board: Board): [number, number] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return [r, c]
    }
  }
  return null
}

export function solve(board: Board): boolean {
  const empty = findEmpty(board)
  if (!empty) return true
  const [row, col] = empty
  for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as Digit[])) {
    if (!isValidPlacement(board, row, col, n)) continue
    board[row][col] = n
    if (solve(board)) return true
    board[row][col] = 0
  }
  return false
}

export function countSolutions(board: Board, limit = 2): number {
  const copy = cloneBoard(board)
  let count = 0

  function backtrack(): void {
    if (count >= limit) return
    const empty = findEmpty(copy)
    if (!empty) {
      count++
      return
    }
    const [row, col] = empty
    for (let n = 1; n <= 9; n++) {
      const digit = n as Digit
      if (!isValidPlacement(copy, row, col, digit)) continue
      copy[row][col] = digit
      backtrack()
      copy[row][col] = 0
      if (count >= limit) return
    }
  }

  backtrack()
  return count
}

export function generateCompleteBoard(): Board {
  const board = createEmptyBoard()
  solve(board)
  return board
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: Board
  solution: Board
} {
  const solution = generateCompleteBoard()
  const puzzle = cloneBoard(solution)
  const targetClues = CLUES[difficulty]
  const cells = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, i) => [Math.floor(i / SIZE), i % SIZE] as [number, number]),
  )

  let removed = 0
  for (const [row, col] of cells) {
    if (SIZE * SIZE - removed <= targetClues) break
    const backup = puzzle[row][col]
    puzzle[row][col] = 0
    if (countSolutions(puzzle, 2) === 1) {
      removed++
    } else {
      puzzle[row][col] = backup
    }
  }

  return { puzzle, solution }
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

export function getConflicts(board: Board, row: number, col: number): Set<string> {
  const value = board[row][col]
  if (value === 0) return new Set()

  const conflicts = new Set<string>()
  const key = (r: number, c: number) => `${r},${c}`

  for (let c = 0; c < SIZE; c++) {
    if (c !== col && board[row][c] === value) {
      conflicts.add(key(row, c))
      conflicts.add(key(row, col))
    }
  }
  for (let r = 0; r < SIZE; r++) {
    if (r !== row && board[r][col] === value) {
      conflicts.add(key(r, col))
      conflicts.add(key(row, col))
    }
  }
  const br = Math.floor(row / BOX) * BOX
  const bc = Math.floor(col / BOX) * BOX
  for (let r = br; r < br + BOX; r++) {
    for (let c = bc; c < bc + BOX; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        conflicts.add(key(r, c))
        conflicts.add(key(row, col))
      }
    }
  }
  return conflicts
}

export function getAllConflicts(board: Board): Set<string> {
  const all = new Set<string>()
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      getConflicts(board, r, c).forEach((k) => all.add(k))
    }
  }
  return all
}

export { SIZE, BOX, boxIndex }
