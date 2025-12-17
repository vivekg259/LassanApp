type SetState<T> = (value: T | ((prev: T) => T)) => void;

export function setupNetworkStatsSimulation(params: {
  setTotalMiners: SetState<number>;
  setLsnMined: SetState<number>;
  intervalMs?: number;
}): () => void {
  const { setTotalMiners, setLsnMined, intervalMs = 3000 } = params;

  const interval = setInterval(() => {
    setTotalMiners((prevMiners) => {
      const newUsers = Math.floor(Math.random() * 3);
      const currentMiners = prevMiners + newUsers;

      setLsnMined((prevLsn) => {
        const networkGeneration = currentMiners * 0.05;
        return prevLsn + networkGeneration;
      });

      return currentMiners;
    });
  }, intervalMs);

  return () => clearInterval(interval);
}

export function setupReferralNowInterval(params: {
  activeTab: string;
  setNow: (value: number) => void;
}): () => void {
  const { activeTab, setNow } = params;

  let interval: ReturnType<typeof setInterval> | undefined;
  if (activeTab === 'referral') {
    interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}
