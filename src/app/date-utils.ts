export function todayYmd(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function addDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return date.toISOString().slice(0, 10);
}
