import { useEffect, useState } from 'react';

export function useMiningLogic() {
  const [balance, setBalance] = useState(10.0);
  const [powerOn, setPowerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEarlyPhaseInfo, setShowEarlyPhaseInfo] = useState(false);

  const [totalMiners, setTotalMiners] = useState(1500);
  const [lsnMined, setLsnMined] = useState(90000);

  // Ad Simulation
  const [isAdWatching, setIsAdWatching] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Boost
  const [boostActive, setBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [boostsUsedToday, setBoostsUsedToday] = useState(0);
  const [lastBoostTime, setLastBoostTime] = useState<number | null>(null);

  // Daily / Weekly
  const [lastClaimedDate, setLastClaimedDate] = useState<string | null>(null);
  const [isDailyBonusAvailable, setIsDailyBonusAvailable] = useState(true);
  const [miningStreak, setMiningStreak] = useState(0);
  const [lastMiningDate, setLastMiningDate] = useState<string | null>(null);

  // Referrals
  const [referralCode] = useState(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  });

  const [referrals, setReferrals] = useState<any[]>([]);

  // Timer for referral cooldowns
  const [now, setNow] = useState(Date.now());

  const [socialTasks, setSocialTasks] = useState<any[]>([]);
  const [referralMilestones, setReferralMilestones] = useState<any[]>([]);

  // User Profile (Mock Data)
  const [userProfile, setUserProfile] = useState({
    name: 'Vivek Gupta',
    email: 'vivek.gupta@example.com',
    isEarlyPhase: true,
    avatarLetter: 'V'
  });

  // My Referrer (Mock Data)
  const [referrer, setReferrer] = useState({
    name: 'LASSAN ADMIN',
    email: 'admin@lassan.app',
    status: 'active'
  });

  // Base rates
  const baseRate = 3.15;

  useEffect(() => {
    // initialize default referral list and tasks (lighter copy)
    setReferrals([
      { id: '1', name: 'SAURABH SONI', email: 'sonysaurabh3690@gmail.com', status: 'active', consecutiveDays: 5, lastNotified: null },
      { id: '2', name: 'RAHUL KUMAR', email: 'rahul.k@example.com', status: 'active', consecutiveDays: 4, lastNotified: null },
      { id: '3', name: 'VIKRAM MALHOTRA', email: 'vikram.m@example.com', status: 'active', consecutiveDays: 1, lastNotified: null },
    ]);

    setSocialTasks([
      { id: '1', title: 'Join Telegram Channel', reward: 30, icon: 'Send', status: 'pending', url: 'https://t.me/lassancoin' },
      { id: '2', title: 'Follow on X (Twitter)', reward: 30, icon: 'Twitter', status: 'pending', url: 'https://x.com/lassancoin' },
    ]);

    setReferralMilestones([
      { id: 'ref_3', target: 3, title: 'Invite 3 Friends', rewardDisplay: '300~900', minReward: 350, maxReward: 450, status: 'pending' },
      { id: 'ref_9', target: 9, title: 'Invite 9 Friends', rewardDisplay: '900~2700', minReward: 1000, maxReward: 1200, status: 'pending' },
    ]);
  }, []);

  // Simulate live user growth
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalMiners(prev => {
        const newUsers = Math.floor(Math.random() * 3);
        const currentMiners = prev + newUsers;
        setLsnMined(prevLsn => prevLsn + currentMiners * 0.05);
        return currentMiners;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Boost timer
  useEffect(() => {
    let interval: any;
    if (boostActive && boostTimeLeft > 0) {
      interval = setInterval(() => {
        setBoostTimeLeft(prev => {
          if (prev <= 1) {
            setBoostActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [boostActive, boostTimeLeft]);

  // Mining session timer and balance update
  useEffect(() => {
    let timer: any;
    if (powerOn) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const [h, m, s] = prev.split(':').map(Number);
          if (h === 0 && m === 0 && s === 0) {
            setPowerOn(false);
            return '23:59:59';
          }
          let newS = s - 1;
          let newM = m;
          let newH = h;
          if (newS < 0) { newS = 59; newM -= 1; }
          if (newM < 0) { newM = 59; newH -= 1; }
          return `${String(newH).padStart(2,'0')}:${String(newM).padStart(2,'0')}:${String(newS).padStart(2,'0')}`;
        });

        // update balance based on final rate
        setBalance(prev => {
          const activeReferralsCount = referrals.filter(r => r.status === 'active').length;
          const referralBoostPercentage = activeReferralsCount * 10;
          const referralBoostAmount = baseRate * (referralBoostPercentage / 100);
          const activeMiningRate = baseRate + referralBoostAmount;
          const finalMiningRate = activeMiningRate + (boostActive ? baseRate : 0);
          const ratePerSecond = finalMiningRate / 3600;
          return prev + ratePerSecond;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [powerOn, boostActive, referrals]);

  // Public actions
  const triggerAd = (action: string) => {
    setPendingAction(action);
    setIsAdWatching(true);
    setTimeout(() => {
      setIsAdWatching(false);
      // apply reward
      if (action === 'mining') {
        setPowerOn(true);
        updateMiningStreak();
      } else if (action === 'daily_bonus') {
        const reward = Math.floor(Math.random() * 6) + 10;
        setBalance(prev => prev + reward);
        setLastClaimedDate(getISTDate());
        setActiveModal(null);
      } else if (action === 'weekly_bonus') {
        const reward = Math.floor(Math.random() * 31) + 100;
        setBalance(prev => prev + reward);
        setMiningStreak(0);
        setActiveModal(null);
      } else if (action === 'boost') {
        activateBoost();
        setActiveModal(null);
      }
      setPendingAction(null);
    }, 3000);
  };

  const activateBoost = () => {
    setBoostActive(true);
    setBoostTimeLeft(30 * 60);
    setBoostsUsedToday(prev => prev + 1);
    setLastBoostTime(Date.now());
  };

  const getISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utc + istOffset);
    return istDate.toISOString().split('T')[0];
  };

  const updateMiningStreak = () => {
    const today = getISTDate();
    if (lastMiningDate === today) return;
    if (lastMiningDate) {
      const lastDate = new Date(lastMiningDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000*60*60*24));
      if (diffDays === 1) setMiningStreak(prev => prev + 1);
      else setMiningStreak(1);
    } else setMiningStreak(1);
    setLastMiningDate(today);
  };

  const handleNotify = (id: string) => {
    const now = Date.now();
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, lastNotified: now } : r));
  };

  const handleShareInvite = async (referralCodeArg?: string) => {
    try {
      return { message: `Join me on Lassan App! Use my referral code ${referralCodeArg || referralCode} to get a bonus. Download now!` };
    } catch {
      return null;
    }
  };

  const handleClaimReferralMilestone = (id: string, minReward: number, maxReward: number) => {
    const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    setReferralMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'completed' } : m));
    setBalance(prev => prev + reward);
  };

  return {
    balance, setBalance,
    powerOn, setPowerOn,
    timeLeft, setTimeLeft,
    activeModal, setActiveModal,
    showLanguageModal, setShowLanguageModal,
    showEarlyPhaseInfo, setShowEarlyPhaseInfo,
    totalMiners, lsnMined,
    isAdWatching, pendingAction, triggerAd,
    boostActive, boostTimeLeft, boostsUsedToday, lastBoostTime, activateBoost,
    lastClaimedDate, setLastClaimedDate, isDailyBonusAvailable, setIsDailyBonusAvailable,
    miningStreak, setMiningStreak, lastMiningDate, setLastMiningDate,
    referralCode, referrals, setReferrals,
    now, setNow,
    socialTasks, setSocialTasks,
    referralMilestones, setReferralMilestones,
    userProfile, setUserProfile,
    referrer, setReferrer,
    baseRate,
    handleNotify, handleShareInvite, handleClaimReferralMilestone, updateMiningStreak,
  };
}

export default useMiningLogic;
