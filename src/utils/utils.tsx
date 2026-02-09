import { Opening } from "../types";

export function sortAndFromPrevious(openings: Opening[]) {
  const sorted = openings
      .map((o, i) => ({ openingId: o.id ?? i, x: o.x }))
      .sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return a.openingId - b.openingId;
      });
    const withFromPrevious = sorted.map((item, idx, arr) => ({
      openingId: item.openingId,
      fromPrevious: idx === 0 ? 0 : item.x - arr[idx - 1].x
    }));
    return withFromPrevious;
};

export function extractXnodes(openings: Opening[]): number[] {
    const xNodes: number[] = Array.from(
      new Set(
        openings.flatMap(opening => [
          opening.shape === 'RECTANGLE' ? opening.x : opening.x - opening.radius,
          opening.x + (opening.shape === 'RECTANGLE' ? opening.width : opening.radius)
        ])
      )
    ).sort((a, b) => a - b);
  return xNodes;
};

export function getWallIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('wallId');
}

export function isValidWallId(wallId: string | null): boolean {
  return wallId !== null && wallId !== "" && wallId !== "null";
}

export function updateWallIdInUrl(wallId: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set('wallId', wallId);
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
};

export function getChangedOpening(prevOpenings: Opening[], openings: Opening[]): Opening | null {
  if (openings.length !== prevOpenings.length) return null;
  console.log(prevOpenings, openings)
  const prevMap = new Map(prevOpenings.map(o => [o.id, o]));
  for (const curr of openings) {
    const prev = prevMap.get(curr.id);
    if (!prev) continue;
    const coreChanged =
      prev.x !== curr.x ||
      prev.elevation !== curr.elevation ||
      prev.color !== curr.color ||
      (prev.shape === 'RECTANGLE' && curr.shape === 'RECTANGLE' &&
        (prev.width !== curr.width || prev.height !== curr.height)) ||
      (prev.shape === 'CIRCLE' && curr.shape === 'CIRCLE' &&
        prev.radius !== curr.radius);
    if (coreChanged) return curr;
  }
  return null;
}
