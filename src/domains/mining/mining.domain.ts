import { type AdAction } from '../../engines/ads/home.ad';
import { tickHmsCountdown } from '../../engines/mining/mining.helpers';

type TriggerAd = (action: AdAction) => void;

/**
 * PRIVATE: Updates mining streak based on last mining date
 * Called internally by ad reward flow, NOT exported
 */
export function _updateStreakInternal(params: {
  lastMiningDate: string | null;
  today: string;
}): {
  newStreak: number;
  shouldReset: boolean;
} {
  const { lastMiningDate, today } = params;

  if (lastMiningDate === today) {
    return { newStreak: 0, shouldReset: false };
  }

  // This is simplified - actual logic is in engine
  // Domain just decides, doesn't mutate
  return { newStreak: 1, shouldReset: true };
}

export const miningDomainImpl = {
  /**
   * Decides whether to start or stop mining
   * Returns intent, does NOT mutate state
   */
  start(params: {
    powerOn: boolean;
  }): {
    shouldTriggerAd: boolean;
    shouldStop: boolean;
  } {
    const { powerOn } = params;

    if (powerOn) {
      // Already mining, should stop
      return { shouldTriggerAd: false, shouldStop: true };
    }

    // Not mining, should trigger ad to start
    return { shouldTriggerAd: true, shouldStop: false };
  },

  /**
   * Returns stop intent
   * Does NOT mutate state
   */
  stop(): {
    shouldStop: boolean;
  } {
    return { shouldStop: true };
  },

  /**
   * Calculates one mining tick result
   * Returns deltas, does NOT mutate state
   */
  claimTick(params: {
    timeLeft: string;
    finalMiningRate: number;
  }): {
    rewardDelta: number;
    nextTimeLeft: string;
    shouldStop: boolean;
  } {
    const { timeLeft, finalMiningRate } = params;

    const { next, finished } = tickHmsCountdown(timeLeft);
    const ratePerSecond = finalMiningRate / 3600;

    return {
      rewardDelta: ratePerSecond,
      nextTimeLeft: next,
      shouldStop: finished,
    };
  },

  /**
   * Returns current mining state snapshot
   */
  getState(params: {
    balance: number;
    powerOn: boolean;
    timeLeft: string;
    miningStreak: number;
    boostActive: boolean;
    finalMiningRate: number;
  }): {
    balance: number;
    powerOn: boolean;
    timeLeft: string;
    miningStreak: number;
    boostActive: boolean;
    finalMiningRate: number;
  } {
    return params;
  },
};
