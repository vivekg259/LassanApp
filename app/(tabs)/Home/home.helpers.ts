export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
}

export function getISTDate(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const istMs = utcMs + 5.5 * 60 * 60 * 1_000;
  return new Date(istMs).toISOString().split('T')[0];
}

export function generateReferralCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getReferralCounts(
  referrals: { status: string; consecutiveDays?: number }[]
): { activeReferralsCount: number; validReferralsCount: number } {
  const activeReferralsCount = referrals.filter((r) => r.status === 'active').length;
  const validReferralsCount = referrals.filter(
    (r) => r.status === 'active' && (r.consecutiveDays ?? 0) >= 3
  ).length;
  return { activeReferralsCount, validReferralsCount };
}

export function calculateMiningRates(params: {
  baseRate: number;
  activeReferralsCount: number;
  boostActive: boolean;
}): {
  referralBoostPercentage: number;
  referralBoostAmount: number;
  activeMiningRate: number;
  finalMiningRate: number;
} {
  const { baseRate, activeReferralsCount, boostActive } = params;
  const referralBoostPercentage = activeReferralsCount * 10;
  const referralBoostAmount = baseRate * (referralBoostPercentage / 100);
  const activeMiningRate = baseRate + referralBoostAmount;
  const finalMiningRate = activeMiningRate + (boostActive ? baseRate : 0);
  return { referralBoostPercentage, referralBoostAmount, activeMiningRate, finalMiningRate };
}

export function buildInviteMessage(referralCode: string): string {
  return `Join me on Lassan App! Use my referral code ${referralCode} to get a bonus. Download now!`;
}
