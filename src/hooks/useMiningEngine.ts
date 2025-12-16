import { type AdAction } from '@/src/engines/ads/home.ad';
import { handlePowerPressAction, setupMiningSessionInterval } from '@/src/engines/mining/home.mining';
import { useCallback, useEffect, useState } from 'react';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type UseMiningEngineParams = {
  triggerAd: (action: AdAction) => void;
  finalMiningRate: number;
  initialBalance?: number;
  initialTimeLeft?: string;
  initialTotalMined?: number;
};

export function useMiningEngine(params: UseMiningEngineParams) {
  const {
    triggerAd,
    finalMiningRate,
    initialBalance = 10,
    initialTimeLeft = '23:59:59',
    initialTotalMined = 0,
  } = params;

  const [isMining, setIsMining] = useState(false);
  const [balance, setBalance] = useState(initialBalance);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [totalMined, setTotalMined] = useState(initialTotalMined);

  const updateBalance: SetState<number> = useCallback(
    (value) => {
      setBalance((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        const delta = next - prev;
        if (delta > 0) {
          setTotalMined((prevTotal) => prevTotal + delta);
        }
        return next;
      });
    },
    [setTotalMined]
  );

  useEffect(() => {
    return setupMiningSessionInterval({
      powerOn: isMining,
      finalMiningRate,
      setTimeLeft,
      setPowerOn: setIsMining,
      setBalance: updateBalance,
    });
  }, [isMining, finalMiningRate, setTimeLeft, updateBalance, setIsMining]);

  const startMining = useCallback(() => {
    handlePowerPressAction({
      powerOn: isMining,
      setPowerOn: setIsMining,
      triggerAd,
    });
  }, [isMining, triggerAd, setIsMining]);

  const stopMining = useCallback(() => {
    if (isMining) {
      setIsMining(false);
    }
  }, [isMining, setIsMining]);

  return {
    isMining,
    totalMined,
    miningRate: finalMiningRate,
    startMining,
    stopMining,
  };
}