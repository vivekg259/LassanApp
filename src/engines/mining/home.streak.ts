import { getISTDate } from '@/src/utils/home.helpers';
import { diffDaysUtc } from './mining.helpers';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

export function updateMiningStreakAction(params: {
  lastMiningDate: string | null;
  setMiningStreak: SetState<number>;
  setLastMiningDate: (value: string) => void;
}): void {
  const { lastMiningDate, setMiningStreak, setLastMiningDate } = params;

  const today = getISTDate();
  if (lastMiningDate === today) return;

  if (lastMiningDate) {
    const diffDays = diffDaysUtc(lastMiningDate, today);
    if (diffDays === 1) {
      setMiningStreak((prev) => prev + 1);
    } else {
      setMiningStreak(1);
    }
  } else {
    setMiningStreak(1);
  }

  setLastMiningDate(today);
}
