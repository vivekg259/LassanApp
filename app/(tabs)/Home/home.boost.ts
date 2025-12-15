export type SetState<T> = (value: T | ((prev: T) => T)) => void;

export const DEFAULT_BOOST_DURATION_SECONDS = 30 * 60;
export const DEFAULT_BOOST_COOLDOWN_MS = 30 * 60 * 1000;
export const DEFAULT_DAILY_BOOST_LIMIT = 5;

export function activateBoostSession(params: {
  setBoostActive: (value: boolean) => void;
  setBoostTimeLeft: (value: number) => void;
  setBoostsUsedToday: SetState<number>;
  setLastBoostTime: (value: number) => void;
  durationSeconds?: number;
  nowMs?: number;
}): void {
  const {
    setBoostActive,
    setBoostTimeLeft,
    setBoostsUsedToday,
    setLastBoostTime,
    durationSeconds = DEFAULT_BOOST_DURATION_SECONDS,
    nowMs = Date.now(),
  } = params;

  setBoostActive(true);
  setBoostTimeLeft(durationSeconds);
  setBoostsUsedToday((prev) => prev + 1);
  setLastBoostTime(nowMs);
}

export function setupBoostCountdown(params: {
  boostActive: boolean;
  boostTimeLeft: number;
  setBoostTimeLeft: SetState<number>;
  setBoostActive: (value: boolean) => void;
}): () => void {
  const { boostActive, boostTimeLeft, setBoostTimeLeft, setBoostActive } = params;

  let interval: ReturnType<typeof setInterval> | undefined;
  if (boostActive && boostTimeLeft > 0) {
    interval = setInterval(() => {
      setBoostTimeLeft((prev) => {
        if (prev <= 1) {
          setBoostActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}

export function handleBoostPressAction(params: {
  powerOn: boolean;
  boostActive: boolean;
  boostsUsedToday: number;
  lastBoostTime: number | null;
  setActiveModal: (value: string | null) => void;
  showInfoAlert: (title: string, message: string) => void;
  nowMs?: number;
  cooldownMs?: number;
  dailyLimit?: number;
}): void {
  const {
    powerOn,
    boostActive,
    boostsUsedToday,
    lastBoostTime,
    setActiveModal,
    showInfoAlert,
    nowMs = Date.now(),
    cooldownMs = DEFAULT_BOOST_COOLDOWN_MS,
    dailyLimit = DEFAULT_DAILY_BOOST_LIMIT,
  } = params;

  if (!powerOn) {
    showInfoAlert('Mining Inactive', 'Please activate the mining session first to access Boost.');
    return;
  }

  if (boostActive) {
    setActiveModal('boost');
    return;
  }

  if (boostsUsedToday >= dailyLimit) {
    showInfoAlert('Limit Reached', `Daily Boost Limit Reached (${dailyLimit}/${dailyLimit})`);
    return;
  }

  if (lastBoostTime && nowMs - lastBoostTime < cooldownMs) {
    const remaining = Math.ceil((cooldownMs - (nowMs - lastBoostTime)) / (60 * 1000));
    showInfoAlert('Cooldown', `Next boost available in ${remaining}m`);
    return;
  }

  setActiveModal('boost');
}
