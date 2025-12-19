import { getISTDate } from '@/src/utils/home.helpers';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

/**
 * PURE FUNCTION: Computes daily bonus availability
 * Returns boolean, does NOT mutate state
 */
export function isDailyBonusAvailable(lastClaimedDate: string | null): boolean {
  const today = getISTDate();
  return lastClaimedDate !== today;
}

/**
 * LEGACY: Wrapper that calls setState for backward compatibility
 * Delegates to pure function
 */
export function updateDailyBonusAvailability(params: {
  lastClaimedDate: string | null;
  setIsDailyBonusAvailable: SetState<boolean>;
}): void {
  const { lastClaimedDate, setIsDailyBonusAvailable } = params;
  const available = isDailyBonusAvailable(lastClaimedDate);
  setIsDailyBonusAvailable(available);
}
