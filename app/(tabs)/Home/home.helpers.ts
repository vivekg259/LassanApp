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

export function tickHmsCountdown(timeLeft: string): { next: string; finished: boolean } {
  const [h, m, s] = timeLeft.split(':').map(Number);
  if (h === 0 && m === 0 && s === 0) {
    return { next: '23:59:59', finished: true };
  }

  let newS = s - 1;
  let newM = m;
  let newH = h;

  if (newS < 0) {
    newS = 59;
    newM -= 1;
  }
  if (newM < 0) {
    newM = 59;
    newH -= 1;
  }

  const next = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`;
  return { next, finished: false };
}

export function diffDaysUtc(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffTime = Math.abs(b.getTime() - a.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function buildInviteMessage(referralCode: string): string {
  return `Join me on Lassan App! Use my referral code ${referralCode} to get a bonus. Download now!`;
}
