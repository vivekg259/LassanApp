import { applyAdReward, type AdAction } from '../../engines/ads/home.ad';
import { claimReferralMilestoneReward, type ReferralMilestone } from '../../engines/referral/home.referral';
import { updateDailyBonusAvailability } from '../../engines/rewards/home.bonus';

type Translate = (key: 'success' | 'bonus_claimed_msg') => string;

type RewardDecision =
  | { type: 'setPowerOn'; value: boolean }
  | { type: 'updateMiningStreak' }
  | { type: 'balanceDelta'; delta: number; nextBalance: number }
  | { type: 'setLastClaimedDate'; value: string }
  | { type: 'setActiveModal'; value: string | null }
  | { type: 'setMiningStreak'; value: number }
  | { type: 'activateBoost' }
  | { type: 'setPendingAction'; value: AdAction | null }
  | { type: 'showInfoAlert'; title: string; message: string }
  | { type: 'referralMilestone'; reward: number; updatedMilestones: ReferralMilestone[] };

type ClaimDailyDeps = {
  lastClaimedDate: string | null;
};

type GrantRewardDeps =
  | {
      type: 'ad';
      action: AdAction;
      balance: number;
      miningStreak: number;
      lastClaimedDate: string | null;
      t: Translate;
    }
  | {
      type: 'referral_milestone';
      balance: number;
      id: string;
      minReward: number;
      maxReward: number;
    };

type RewardStateSnapshot<TSocialTask> = {
  isDailyBonusAvailable: boolean;
  miningStreak: number;
  socialTasks: TSocialTask[];
  referralMilestones: ReferralMilestone[];
};

// Computes daily availability using the existing engine without mutating React state
function evaluateDailyAvailability(lastClaimedDate: string | null): boolean {
  let available = false;

  updateDailyBonusAvailability({
    lastClaimedDate,
    setIsDailyBonusAvailable: (value) => {
      available = typeof value === 'function' ? value(available) : value;
    },
  });

  return available;
}

// Runs ad reward engine with stub setters to collect ordered decisions
function collectAdRewardDecisions(params: {
  action: AdAction;
  balance: number;
  miningStreak: number;
  lastClaimedDate: string | null;
  t: Translate;
}): {
  decisions: RewardDecision[];
  nextBalance: number;
  nextMiningStreak: number;
  nextLastClaimedDate: string | null;
} {
  const { action, t } = params;
  let balance = params.balance;
  let miningStreak = params.miningStreak;
  let lastClaimedDate = params.lastClaimedDate;
  const decisions: RewardDecision[] = [];

  applyAdReward({
    action,
    t,
    showInfoAlert: (title, message) => {
      decisions.push({ type: 'showInfoAlert', title, message });
    },
    setPendingAction: (value) => {
      decisions.push({ type: 'setPendingAction', value });
    },
    setPowerOn: (value) => {
      decisions.push({ type: 'setPowerOn', value });
    },
    updateMiningStreak: () => {
      decisions.push({ type: 'updateMiningStreak' });
    },
    setBalance: (value) => {
      const next = typeof value === 'function' ? value(balance) : value;
      const delta = next - balance;
      balance = next;
      decisions.push({ type: 'balanceDelta', delta, nextBalance: balance });
    },
    setLastClaimedDate: (value) => {
      lastClaimedDate = value;
      decisions.push({ type: 'setLastClaimedDate', value });
    },
    setActiveModal: (value) => {
      decisions.push({ type: 'setActiveModal', value });
    },
    setMiningStreak: (value) => {
      miningStreak = value;
      decisions.push({ type: 'setMiningStreak', value: miningStreak });
    },
    activateBoost: () => {
      decisions.push({ type: 'activateBoost' });
    },
  });

  return { decisions, nextBalance: balance, nextMiningStreak: miningStreak, nextLastClaimedDate: lastClaimedDate };
}

// Handles referral milestone rewards using the existing engine
function handleReferralMilestoneReward(params: {
  balance: number;
  id: string;
  minReward: number;
  maxReward: number;
}): {
  decisions: RewardDecision[];
  nextBalance: number;
  updatedMilestones: ReferralMilestone[];
  reward: number;
} {
  const { balance, id, minReward, maxReward } = params;
  const { reward, updatedMilestones } = claimReferralMilestoneReward({ id, minReward, maxReward });

  return {
    reward,
    updatedMilestones,
    nextBalance: balance + reward,
    decisions: [
      { type: 'referralMilestone', reward, updatedMilestones },
      { type: 'balanceDelta', delta: reward, nextBalance: balance + reward },
    ],
  };
}

export const rewardsDomainImpl = {
  // Decides if a daily reward claim should proceed
  claimDaily(deps: ClaimDailyDeps): {
    canClaim: boolean;
    shouldTriggerAd: boolean;
    action: AdAction | null;
  } {
    const isAvailable = evaluateDailyAvailability(deps.lastClaimedDate);

    if (!isAvailable) {
      return { canClaim: false, shouldTriggerAd: false, action: null };
    }

    return { canClaim: true, shouldTriggerAd: true, action: 'daily_bonus' };
  },

  // Grants rewards for ad flows or referral milestones without mutating React state
  grantReward(deps: GrantRewardDeps): {
    decisions: RewardDecision[];
    nextBalance: number;
    nextMiningStreak?: number;
    nextLastClaimedDate?: string | null;
    reward?: number;
    updatedMilestones?: ReferralMilestone[];
  } {
    if (deps.type === 'ad') {
      const { decisions, nextBalance, nextMiningStreak, nextLastClaimedDate } = collectAdRewardDecisions({
        action: deps.action,
        balance: deps.balance,
        miningStreak: deps.miningStreak,
        lastClaimedDate: deps.lastClaimedDate,
        t: deps.t,
      });

      return { decisions, nextBalance, nextMiningStreak, nextLastClaimedDate };
    }

    const { reward, updatedMilestones, decisions, nextBalance } = handleReferralMilestoneReward({
      balance: deps.balance,
      id: deps.id,
      minReward: deps.minReward,
      maxReward: deps.maxReward,
    });

    return { decisions, nextBalance, reward, updatedMilestones };
  },

  // Returns a snapshot of rewards-related state without side effects
  getState<TSocialTask>(deps: RewardStateSnapshot<TSocialTask>): RewardStateSnapshot<TSocialTask> {
    return deps;
  },
};
