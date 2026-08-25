/**
 * Deterministic pseudo-random numbers. Fake dashboards need "messy looking"
 * data that is identical on the server and the client, so Math.random() is not
 * an option during render.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4_294_967_296;
  };
}

export function seededSeries(seed: number, length: number, min: number, max: number): number[] {
  const random = seededRandom(seed);
  return Array.from({ length }, () => min + random() * (max - min));
}
