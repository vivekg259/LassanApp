import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

import { buildInviteMessage, generateReferralCode } from '@/src/utils/home.helpers';

export type ReferralMilestone = {
  id: string;
  target: number;
  title: string;
  rewardDisplay: string;
  minReward: number;
  maxReward: number;
  status: 'pending' | 'completed';
};

let referralCode = generateReferralCode();
let referralMilestones: ReferralMilestone[] = [
  { id: 'ref_3', target: 3, title: 'Invite 3 Friends', rewardDisplay: '300~900', minReward: 350, maxReward: 450, status: 'pending' },
  { id: 'ref_9', target: 9, title: 'Invite 9 Friends', rewardDisplay: '900~2700', minReward: 1000, maxReward: 1200, status: 'pending' },
  { id: 'ref_27', target: 27, title: 'Invite 27 Friends', rewardDisplay: '8100', minReward: 8100, maxReward: 8100, status: 'pending' },
];

export function getReferralCode(): string {
  return referralCode;
}

export function getReferralCount(): number {
  return referralMilestones.length;
}

export function getReferralMilestones(): ReferralMilestone[] {
  return referralMilestones;
}

type ClaimReferralRewardParams = {
  id: string;
  minReward: number;
  maxReward: number;
};

export function claimReferralMilestoneReward(params: ClaimReferralRewardParams) {
  const { id, minReward, maxReward } = params;
  const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

  const updatedMilestones: ReferralMilestone[] = referralMilestones.map((m) =>
    m.id === id ? { ...m, status: 'completed' } : m
  );
  referralMilestones = updatedMilestones;
  const milestone = updatedMilestones.find((m) => m.id === id) ?? null;

  return {
    reward,
    milestone,
    updatedMilestones: [...updatedMilestones],
  };
}

type NotifyReferralParams<TReferral extends { id: string; name: string; lastNotified?: number | null }> = {
  id: string;
  referrals: TReferral[];
  nowMs?: number;
};

export function notifyReferral<TReferral extends { id: string; name: string; lastNotified?: number | null }>(params: NotifyReferralParams<TReferral>) {
  const { id, referrals, nowMs = Date.now() } = params;
  const updated = referrals.map((referral) =>
    referral.id === id ? { ...referral, lastNotified: nowMs } : referral
  );
  const matched = referrals.find((referral) => referral.id === id);

  return {
    referrals: updated,
    message: matched ? `Reminder sent to ${matched.name} to activate mining!` : 'Referral not found.',
  };
}

export async function copyReferralCode(params: { referralCode: string }): Promise<void> {
  const { referralCode } = params;
  await Clipboard.setStringAsync(referralCode);
}

export async function shareInvite(params: { referralCode: string }) {
  const { referralCode } = params;
  try {
    await Share.share({
      message: buildInviteMessage(referralCode),
    });
    return { success: true } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not share invite.';
    return { success: false, error: message } as const;
  }
}
