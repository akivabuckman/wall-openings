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
