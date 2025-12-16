import { claimReferralMilestoneReward, getReferralCode, getReferralCount, shareInvite } from '@/src/engines/referral/home.referral';
import { useCallback } from 'react';

export function useReferral() {
  const referralCode = getReferralCode();
  const referralCount = getReferralCount();

  const claimReferralReward = useCallback((params: Parameters<typeof claimReferralMilestoneReward>[0]) => {
    return claimReferralMilestoneReward(params);
  }, []);

  const shareReferral = useCallback(() => {
    return shareInvite({ referralCode });
  }, [referralCode]);

  return {
    referralCode,
    referralCount,
    claimReferralReward,
    shareReferral,
  };
}