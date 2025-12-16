import { getISTDate } from '@/src/utils/home.helpers';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

export function updateDailyBonusAvailability(params: {
  lastClaimedDate: string | null;
  setIsDailyBonusAvailable: SetState<boolean>;
}): void {
  const { lastClaimedDate, setIsDailyBonusAvailable } = params;
  const today = getISTDate();
  setIsDailyBonusAvailable(lastClaimedDate !== today);
}
