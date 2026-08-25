type Listener = () => void;

const listeners = new Set<Listener>();
let intervalId: number | null = null;
let snapshot = 0;

function tick() {
  snapshot = Date.now();
  listeners.forEach((listener) => listener());
}

/**
 * One shared 1s interval for every clock on the page, exposed as an external
 * store so components can read it without a mount effect.
 */
export function subscribeToClock(listener: Listener): () => void {
  listeners.add(listener);

  if (intervalId === null) {
    snapshot = Date.now();
    intervalId = window.setInterval(tick, 1000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
}

/** 0 until the first subscription — server and first client render agree. */
export function getClockSnapshot(): number {
  return snapshot;
}

export function getClockServerSnapshot(): number {
  return 0;
}
