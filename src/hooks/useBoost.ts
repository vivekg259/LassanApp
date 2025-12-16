import { activateBoostSession, setupBoostCountdown } from '@/src/engines/boost/home.boost';
import { useCallback, useEffect } from 'react';

type UseBoostParams = {
  boostActive: boolean;
  boostTimeLeft: number;
  setBoostActive: (value: boolean) => void;
  setBoostTimeLeft: (value: number | ((prev: number) => number)) => void;
  setBoostsUsedToday: (value: number | ((prev: number) => number)) => void;
  setLastBoostTime: (value: number) => void;
};

export function useBoost({
  boostActive,
  boostTimeLeft,
  setBoostActive,
  setBoostTimeLeft,
  setBoostsUsedToday,
  setLastBoostTime,
}: UseBoostParams) {
  useEffect(
    () =>
      setupBoostCountdown({
        boostActive,
        boostTimeLeft,
        setBoostTimeLeft,
        setBoostActive,
      }),
    [boostActive, boostTimeLeft, setBoostTimeLeft, setBoostActive]
  );

  const activateBoost = useCallback(() => {
    activateBoostSession({
      setBoostActive,
      setBoostTimeLeft,
      setBoostsUsedToday,
      setLastBoostTime,
    });
  }, [setBoostActive, setBoostTimeLeft, setBoostsUsedToday, setLastBoostTime]);

  return {
    isBoostActive: boostActive,
    remainingBoostTime: boostTimeLeft,
    activateBoost,
  };
}
