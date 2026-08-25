"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import {
  BOARD_SIZE,
  canMove,
  createGame,
  hasWon,
  move,
  spawnTile,
  tileStyle,
  type Direction,
  type Tile,
} from "@/lib/games/2048";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";
import { cn } from "@/lib/utils/cn";

interface GameState {
  tiles: Tile[];
  score: number;
  best: number;
  status: "playing" | "won" | "over";
  /** Set after clearing 2048 so the game can continue. */
  keepPlaying: boolean;
}

type GameAction =
  | { type: "start" }
  | { type: "move"; direction: Direction }
  | { type: "hydrate"; best: number }
  | { type: "continue" };

const INITIAL: GameState = {
  tiles: [],
  score: 0,
  best: 0,
  status: "playing",
  keepPlaying: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "hydrate":
      return { ...state, best: action.best, tiles: createGame() };

    case "start":
      return { ...state, tiles: createGame(), score: 0, status: "playing", keepPlaying: false };

    case "continue":
      return { ...state, status: "playing", keepPlaying: true };

    case "move": {
      if (state.status === "over" || (state.status === "won" && !state.keepPlaying)) return state;

      const result = move(state.tiles, action.direction);
      if (!result.moved) return state;

      const tiles = spawnTile(result.tiles);
      const score = state.score + result.gained;
      const status = hasWon(tiles) && !state.keepPlaying ? "won" : canMove(tiles) ? "playing" : "over";

      return { ...state, tiles, score, best: Math.max(state.best, score), status };
    }
  }
}

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const SWIPE_THRESHOLD = 24;

export function Game2048() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // The starting board is random, so it can only be built on the client.
  useEffect(() => {
    dispatch({ type: "hydrate", best: readLocal<number>(STORAGE_KEYS.game2048, 0) });
  }, []);

  useEffect(() => {
    if (state.best > 0) writeLocal(STORAGE_KEYS.game2048, state.best);
  }, [state.best]);

  useEffect(() => {
    if (state.status === "over") track(ANALYTICS_EVENTS.gameOver, { game: "2048", score: state.score });
  }, [state.status, state.score]);

  const startGame = useCallback(() => {
    dispatch({ type: "start" });
    track(ANALYTICS_EVENTS.gameStart, { game: "2048" });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[event.key];
      if (!direction) return;
      event.preventDefault();
      dispatch({ type: "move", direction });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    touchStart.current = null;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

    dispatch({
      type: "move",
      direction: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up",
    });
  };

  const cellSize = `calc((100% - ${BOARD_SIZE - 1} * var(--gap)) / ${BOARD_SIZE})`;
  const showOverlay = state.status === "over" || (state.status === "won" && !state.keepPlaying);

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="flex gap-2">
          <ScorePanel label="SCORE" value={state.score} />
          <ScorePanel label="BEST" value={state.best} />
        </div>
        <Button onClick={startGame} variant="secondary">
          새 게임
        </Button>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="application"
        aria-label="2048 게임판"
        className="relative touch-none select-none rounded-2xl bg-[#bbada0] p-[var(--gap)] [--gap:10px] sm:[--gap:12px]"
      >
        <div className="relative aspect-square w-full">
          <div
            className="grid h-full w-full gap-[var(--gap)]"
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
            aria-hidden="true"
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => (
              <div key={index} className="rounded-lg bg-[#cdc1b4]" />
            ))}
          </div>

          {/* Positioning and appearance are split so the pop animation does not
              fight the translate that places the tile. */}
          {state.tiles.map((tile) => (
            <div
              key={tile.id}
              className="absolute left-0 top-0 transition-transform duration-[110ms] ease-out"
              style={{
                width: cellSize,
                height: cellSize,
                transform: `translate(calc((100% + var(--gap)) * ${tile.col}), calc((100% + var(--gap)) * ${tile.row}))`,
              }}
            >
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-lg font-bold tabular",
                  tile.value >= 1024
                    ? "text-[clamp(1rem,5vw,1.6rem)]"
                    : "text-[clamp(1.3rem,7vw,2.1rem)]",
                  tile.isNew && "animate-[pop_0.18s_ease-out]",
                  tile.merged && "animate-[pop_0.18s_ease-out]",
                  tileStyle(tile.value),
                )}
              >
                {tile.value}
              </div>
            </div>
          ))}

          {showOverlay ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-[#eee4da]/85 backdrop-blur-[2px]">
              <p className="text-2xl font-bold text-[#776e65]">
                {state.status === "won" ? "2048 달성!" : "더 이상 움직일 수 없습니다"}
              </p>
              <p className="text-[13px] text-[#776e65]">
                점수 {state.score.toLocaleString("ko-KR")}
              </p>
              <div className="flex gap-2">
                {state.status === "won" ? (
                  <Button variant="secondary" onClick={() => dispatch({ type: "continue" })}>
                    계속하기
                  </Button>
                ) : null}
                <Button onClick={startGame}>다시 시작</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-[12.5px] text-subtle">
        <span className="hidden sm:inline">
          <Kbd>←</Kbd> <Kbd>↑</Kbd> <Kbd>→</Kbd> <Kbd>↓</Kbd> 방향키
        </span>
        <span className="sm:hidden">화면을 밀어서 이동</span>
        <span>· 같은 숫자를 합쳐 2048을 만드세요</span>
      </p>
    </div>
  );
}

function ScorePanel({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[86px] rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-center">
      <p className="text-[11px] font-medium tracking-wider text-subtle">{label}</p>
      <p className="mt-0.5 font-mono text-[17px] font-semibold tabular">
        {value.toLocaleString("ko-KR")}
      </p>
    </div>
  );
}
