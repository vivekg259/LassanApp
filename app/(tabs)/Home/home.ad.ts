import { getISTDate } from './home.helpers';

export type AdAction = 'mining' | 'daily_bonus' | 'weekly_bonus' | 'boost';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type ShowInfoAlert = (title: string, message: string) => void;

type Translate = (key: 'success' | 'bonus_claimed_msg') => string;

export function startAdSimulation(params: {
  action: AdAction;
  setPendingAction: (value: AdAction | null) => void;
  setIsAdWatching: (value: boolean) => void;
  onReward: (action: AdAction) => void;
  durationMs?: number;
}): void {
  const { action, setPendingAction, setIsAdWatching, onReward, durationMs = 3000 } = params;
  setPendingAction(action);
  setIsAdWatching(true);

  setTimeout(() => {
    setIsAdWatching(false);
    onReward(action);
  }, durationMs);
}

export function applyAdReward(params: {
  action: AdAction;
  t: Translate;
  showInfoAlert: ShowInfoAlert;
  setPendingAction: (value: AdAction | null) => void;

  setPowerOn: (value: boolean) => void;
  updateMiningStreak: () => void;

  setBalance: SetState<number>;
  setLastClaimedDate: (value: string) => void;
  setActiveModal: (value: string | null) => void;

  setMiningStreak: (value: number) => void;

  activateBoost: () => void;
}): void {
  const {
    action,
    t,
    showInfoAlert,
    setPendingAction,
    setPowerOn,
    updateMiningStreak,
    setBalance,
    setLastClaimedDate,
    setActiveModal,
    setMiningStreak,
    activateBoost,
  } = params;

  if (action === 'mining') {
    setPowerOn(true);
    updateMiningStreak();
  } else if (action === 'daily_bonus') {
    const reward = Math.floor(Math.random() * 6) + 10; // 10-15
    setBalance((prev) => prev + reward);
    showInfoAlert(t('success'), `${t('bonus_claimed_msg')}: +${reward} LSN`);
    setLastClaimedDate(getISTDate());
    setActiveModal(null);
  } else if (action === 'weekly_bonus') {
    const reward = Math.floor(Math.random() * 31) + 100; // 100-130
    setBalance((prev) => prev + reward);
    showInfoAlert('Success', `Weekly Bonus Claimed: +${reward} LSN`);
    setMiningStreak(0);
    setActiveModal(null);
  } else if (action === 'boost') {
    activateBoost();
    setActiveModal(null);
  }

  setPendingAction(null);
}
