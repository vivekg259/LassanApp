import { type AdAction } from '@/src/engines/ads/home.ad';
import { tickHmsCountdown } from './mining.helpers';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type TriggerAd = (action: AdAction) => void;

export function handlePowerPressAction(params: {
  powerOn: boolean;
  setPowerOn: (value: boolean) => void;
  triggerAd: TriggerAd;
}): void {
  const { powerOn, setPowerOn, triggerAd } = params;

  if (powerOn) {
    setPowerOn(false);
    return;
  }

  triggerAd('mining');
}

export function setupMiningSessionInterval(params: {
  powerOn: boolean;
  finalMiningRate: number;
  setTimeLeft: SetState<string>;
  setPowerOn: (value: boolean) => void;
  setBalance: SetState<number>;
}): () => void {
  const { powerOn, finalMiningRate, setTimeLeft, setPowerOn, setBalance } = params;

  let timer: ReturnType<typeof setInterval> | undefined;

  if (powerOn) {
    timer = setInterval(() => {
      setTimeLeft((prev) => {
        const { next, finished } = tickHmsCountdown(prev);
        if (finished) setPowerOn(false);
        return next;
      });

      setBalance((prevBalance) => {
        const ratePerSecond = finalMiningRate / 3600;
        return prevBalance + ratePerSecond;
      });
    }, 1000);
  }

  return () => {
    if (timer) clearInterval(timer);
  };
}
