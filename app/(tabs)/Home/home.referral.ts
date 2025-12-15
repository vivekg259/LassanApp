import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

import { buildInviteMessage } from './home.helpers';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type ShowInfoAlert = (title: string, message: string) => void;

export function claimReferralMilestoneReward<TMilestone extends { id: string; status: string }>(params: {
  id: string;
  minReward: number;
  maxReward: number;
  setReferralMilestones: SetState<TMilestone[]>;
  setBalance: SetState<number>;
  showInfoAlert: ShowInfoAlert;
}): void {
  const { id, minReward, maxReward, setReferralMilestones, setBalance, showInfoAlert } = params;

  const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
  setReferralMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'completed' } : m)));
  setBalance((prev) => prev + reward);
  showInfoAlert('Milestone Unlocked!', `You received +${reward} LSN for your referrals!`);
}

export async function copyReferralCode(params: { referralCode: string; showInfoAlert: ShowInfoAlert }): Promise<void> {
  const { referralCode, showInfoAlert } = params;
  await Clipboard.setStringAsync(referralCode);
  showInfoAlert('Copied', 'Referral code copied to clipboard!');
}

export function notifyReferral<
  TReferral extends { id: string; name: string; lastNotified?: number | null }
>(params: {
  id: string;
  setReferrals: SetState<TReferral[]>;
  showInfoAlert: ShowInfoAlert;
  nowMs?: number;
}): void {
  const { id, setReferrals, showInfoAlert, nowMs = Date.now() } = params;

  setReferrals((prev) =>
    prev.map((r) => {
      if (r.id === id) {
        showInfoAlert('Notification Sent', `Reminder sent to ${r.name} to activate mining!`);
        return { ...r, lastNotified: nowMs };
      }
      return r;
    })
  );
}

export async function shareInvite(params: { referralCode: string; showInfoAlert: ShowInfoAlert }): Promise<void> {
  const { referralCode, showInfoAlert } = params;
  try {
    await Share.share({
      message: buildInviteMessage(referralCode),
    });
  } catch {
    showInfoAlert('Error', 'Could not share invite.');
  }
}
