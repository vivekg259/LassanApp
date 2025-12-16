export function tickHmsCountdown(timeLeft: string): { next: string; finished: boolean } {
  const [h, m, s] = timeLeft.split(':').map(Number);
  if (h === 0 && m === 0 && s === 0) {
    return { next: '23:59:59', finished: true };
  }

  let newS = s - 1;
  let newM = m;
  let newH = h;

  if (newS < 0) {
    newS = 59;
    newM -= 1;
  }
  if (newM < 0) {
    newM = 59;
    newH -= 1;
  }

  const next = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`;
  return { next, finished: false };
}

export function diffDaysUtc(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffTime = Math.abs(b.getTime() - a.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
