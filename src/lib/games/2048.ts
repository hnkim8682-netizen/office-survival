export const BOARD_SIZE = 4;
export const WIN_VALUE = 2048;

export type Direction = "up" | "down" | "left" | "right";

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  /** Spawned by this move — used for the pop-in animation. */
  isNew?: boolean;
  /** Result of a merge this move. */
  merged?: boolean;
}

export interface MoveResult {
  tiles: Tile[];
  gained: number;
  moved: boolean;
}

let nextId = 1;

function createTile(row: number, col: number, value: number, isNew = false): Tile {
  return { id: nextId++, row, col, value, isNew };
}

function emptyCells(tiles: Tile[]): Array<{ row: number; col: number }> {
  const taken = new Set(tiles.map((tile) => `${tile.row}-${tile.col}`));
  const cells: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!taken.has(`${row}-${col}`)) cells.push({ row, col });
    }
  }
  return cells;
}

/** Adds a 2 (90%) or 4 (10%) to a random empty cell. */
export function spawnTile(tiles: Tile[]): Tile[] {
  const cells = emptyCells(tiles);
  if (cells.length === 0) return tiles;

  const cell = cells[Math.floor(Math.random() * cells.length)];
  return [...tiles, createTile(cell.row, cell.col, Math.random() < 0.9 ? 2 : 4, true)];
}

export function createGame(): Tile[] {
  return spawnTile(spawnTile([]));
}

const VECTORS: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

/**
 * Classic 2048 slide: tiles travel as far as they can, and two equal tiles
 * merge once per move.
 */
export function move(tiles: Tile[], direction: Direction): MoveResult {
  const vector = VECTORS[direction];
  const grid: Array<Array<Tile | null>> = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
  tiles.forEach((tile) => {
    grid[tile.row][tile.col] = { ...tile, isNew: false, merged: false };
  });

  // Traverse against the movement direction so the leading tile settles first.
  const rows = [...Array(BOARD_SIZE).keys()];
  const cols = [...Array(BOARD_SIZE).keys()];
  if (vector.row > 0) rows.reverse();
  if (vector.col > 0) cols.reverse();

  const mergedAt = new Set<string>();
  let moved = false;
  let gained = 0;

  for (const row of rows) {
    for (const col of cols) {
      const tile = grid[row][col];
      if (!tile) continue;

      let currentRow = row;
      let currentCol = col;

      for (;;) {
        const nextRow = currentRow + vector.row;
        const nextCol = currentCol + vector.col;
        const inBounds =
          nextRow >= 0 && nextRow < BOARD_SIZE && nextCol >= 0 && nextCol < BOARD_SIZE;
        if (!inBounds) break;

        const target = grid[nextRow][nextCol];
        if (!target) {
          grid[nextRow][nextCol] = tile;
          grid[currentRow][currentCol] = null;
          currentRow = nextRow;
          currentCol = nextCol;
          moved = true;
          continue;
        }

        const canMerge =
          target.value === tile.value &&
          !mergedAt.has(`${nextRow}-${nextCol}`) &&
          !mergedAt.has(`${currentRow}-${currentCol}`);

        if (canMerge) {
          grid[nextRow][nextCol] = {
            ...target,
            value: target.value * 2,
            merged: true,
          };
          grid[currentRow][currentCol] = null;
          mergedAt.add(`${nextRow}-${nextCol}`);
          gained += target.value * 2;
          moved = true;
        }
        break;
      }
    }
  }

  const next: Tile[] = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const tile = grid[row][col];
      if (tile) next.push({ ...tile, row, col });
    }
  }

  return { tiles: next, gained, moved };
}

export function canMove(tiles: Tile[]): boolean {
  if (tiles.length < BOARD_SIZE * BOARD_SIZE) return true;
  return (["up", "down", "left", "right"] as Direction[]).some(
    (direction) => move(tiles, direction).moved,
  );
}

export function hasWon(tiles: Tile[]): boolean {
  return tiles.some((tile) => tile.value >= WIN_VALUE);
}

/** Tile colors follow the original game closely enough to feel familiar. */
export const TILE_STYLES: Record<number, string> = {
  2: "bg-[#eee4da] text-[#776e65]",
  4: "bg-[#ede0c8] text-[#776e65]",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white",
  256: "bg-[#edcc61] text-white",
  512: "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
};

export function tileStyle(value: number): string {
  return TILE_STYLES[value] ?? "bg-[#3c3a32] text-white";
}
