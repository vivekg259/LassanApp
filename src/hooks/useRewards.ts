import { updateDailyBonusAvailability } from '@/src/engines/rewards/home.bonus';
import { useCallback, useEffect } from 'react';

type UseRewardsParams = {
  lastClaimedDate: string | null;
  isDailyBonusAvailable: boolean;
  setLastClaimedDate: (value: string) => void;
  setIsDailyBonusAvailable: (value: boolean | ((prev: boolean) => boolean)) => void;
  totalRewards: number;
};

export function useRewards({
  lastClaimedDate,
  isDailyBonusAvailable,
  setLastClaimedDate,
  setIsDailyBonusAvailable,
  totalRewards,
}: UseRewardsParams) {
  useEffect(() => {
    updateDailyBonusAvailability({
      lastClaimedDate,
      setIsDailyBonusAvailable,
    });
  }, [lastClaimedDate, setIsDailyBonusAvailable]);

  const claimBonus = useCallback(
    (claimedDate: string) => {
      setLastClaimedDate(claimedDate);
      updateDailyBonusAvailability({
        lastClaimedDate: claimedDate,
        setIsDailyBonusAvailable,
      });
    },
    [setLastClaimedDate, setIsDailyBonusAvailable]
  );

  return {
    availableBonus: isDailyBonusAvailable,
    claimBonus,
    totalRewards,
  };
}