/**
 * useHomeScreen - Custom hook containing all HomeScreen state, effects, and handlers
 * Extracted from index.tsx to keep the main component clean and focused on JSX.
 */
import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { runBundleSnapAnimation, runFadeInOnTabChange, runModalScaleOnOpen, setupBreathingAnimation, setupDualAnimatedValueMirrors } from '@/src/animations/home.animations';
import { THEME } from '@/src/constants/theme';
import { setupNetworkStatsSimulation, setupReferralNowInterval } from '@/src/effects/home.effects';
import { applyAdReward, startAdSimulation, type AdAction } from '@/src/engines/ads/home.ad';
import { activateBoostSession, handleBoostPressAction, setupBoostCountdown } from '@/src/engines/boost/home.boost';
import { handlePowerPressAction, setupMiningSessionInterval } from '@/src/engines/mining/home.mining';
import { updateMiningStreakAction } from '@/src/engines/mining/home.streak';
import {
    claimReferralMilestoneReward,
    copyReferralCode,
    notifyReferral,
    shareInvite,
    type ReferralMilestone,
} from '@/src/engines/referral/home.referral';
import { updateDailyBonusAvailability } from '@/src/engines/rewards/home.bonus';
import { handleSocialTaskAction, type SocialTaskStatus } from '@/src/engines/social/home.social';
import { closeAlertAction, showConfirmAlertAction, showInfoAlertAction, type CustomAlertState } from '@/src/hooks/alertActions';
import { confirmLogout, handleMenuPressAction } from '@/src/hooks/userActions';
import { calculateMiningRates, formatNumber, generateReferralCode, getReferralCounts } from '@/src/utils/home.helpers';
import { measureHomeAnchorsAction, scheduleInitialMeasurements, setupResizeMeasurementObserver } from '@/src/utils/home.measure';
import { computeStageLayout } from '@/src/utils/layout';

// Re-export formatNumber for components that need it
export { formatNumber };

// Layout type for measured elements
type LayoutRect = { x: number; y: number; width: number; height: number } | null;

// Initial referrals data
const initialReferrals = [
  { id: '1', name: 'SAURABH SONI', email: 'sonysaurabh3690@gmail.com', status: 'active' as const, consecutiveDays: 5, lastNotified: null as number | null },
  { id: '2', name: 'RAHUL KUMAR', email: 'rahul.k@example.com', status: 'active' as const, consecutiveDays: 4, lastNotified: null as number | null },
  { id: '3', name: 'VIKRAM MALHOTRA', email: 'vikram.m@example.com', status: 'active' as const, consecutiveDays: 1, lastNotified: null as number | null },
  { id: '4', name: 'AMIT PATEL', email: 'amit.patel@example.com', status: 'active' as const, consecutiveDays: 7, lastNotified: null as number | null },
  { id: '5', name: 'NEHA GUPTA', email: 'neha.gupta@test.com', status: 'active' as const, consecutiveDays: 2, lastNotified: null as number | null },
  { id: '6', name: 'ROHIT SHARMA', email: 'rohit.sharma@example.com', status: 'active' as const, consecutiveDays: 10, lastNotified: null as number | null },
  { id: '7', name: 'SNEHA VERMA', email: 'sneha.verma@test.com', status: 'active' as const, consecutiveDays: 3, lastNotified: null as number | null },
  { id: '8', name: 'ARJUN SINGH', email: 'arjun.singh@example.com', status: 'active' as const, consecutiveDays: 0, lastNotified: null as number | null },
  { id: '9', name: 'KAVITA REDDY', email: 'kavita.reddy@test.com', status: 'active' as const, consecutiveDays: 6, lastNotified: null as number | null },
  { id: '10', name: 'MANISH TIWARI', email: 'manish.tiwari@example.com', status: 'active' as const, consecutiveDays: 8, lastNotified: null as number | null },
  { id: '11', name: 'POOJA MEHTA', email: 'pooja.mehta@test.com', status: 'active' as const, consecutiveDays: 1, lastNotified: null as number | null },
  { id: '12', name: 'PRIYA SINGH', email: 'priya.singh99@test.com', status: 'inactive' as const, consecutiveDays: 0, lastNotified: null as number | null },
  { id: '13', name: 'ANJALI SHARMA', email: 'anjali.s@test.com', status: 'inactive' as const, consecutiveDays: 0, lastNotified: null as number | null },
  { id: '14', name: 'RAJESH KUMAR', email: 'rajesh.kumar@example.com', status: 'inactive' as const, consecutiveDays: 0, lastNotified: null as number | null },
  { id: '15', name: 'SIMRAN KAUR', email: 'simran.kaur@test.com', status: 'inactive' as const, consecutiveDays: 0, lastNotified: null as number | null },
];

// Initial social tasks data
const initialSocialTasks = [
  { id: '1', title: 'Join Telegram Channel', reward: 30, icon: 'Send' as const, status: 'pending' as const, url: 'https://t.me/lassancoin' },
  { id: '2', title: 'Follow on X (Twitter)', reward: 30, icon: 'Twitter' as const, status: 'pending' as const, url: 'https://x.com/lassancoin' },
  { id: '3', title: 'Subscribe to YouTube', reward: 30, icon: 'Youtube' as const, status: 'pending' as const, url: 'https://youtube.com/@lassancoin' },
  { id: '4', title: 'Join Discord Server', reward: 30, icon: 'MessageCircle' as const, status: 'pending' as const, url: 'https://discord.gg/lassan' },
];

// Initial referral milestones data
const initialReferralMilestones: ReferralMilestone[] = [
  { id: 'ref_3', target: 3, title: 'Invite 3 Friends', rewardDisplay: '300~900', minReward: 350, maxReward: 450, status: 'pending' },
  { id: 'ref_9', target: 9, title: 'Invite 9 Friends', rewardDisplay: '900~2700', minReward: 1000, maxReward: 1200, status: 'pending' },
  { id: 'ref_27', target: 27, title: 'Invite 27 Friends', rewardDisplay: '8100', minReward: 8100, maxReward: 8100, status: 'pending' },
];

// Optional callbacks for domain wiring (passed from container)
export type HomeScreenCallbacks = {
  onPowerPress?: (params: { powerOn: boolean }) => { shouldTriggerAd: boolean; shouldStop: boolean };
  onTick?: (params: { timeLeft: string; finalMiningRate: number }) => { rewardDelta: number; nextTimeLeft: string; shouldStop: boolean };
  onClaimDaily?: (params: { lastClaimedDate: string | null }) => { canClaim: boolean; shouldTriggerAd: boolean; action: AdAction | null };
  onGrantReward?: (
    params:
      | { type: 'ad'; action: AdAction; balance: number; miningStreak: number; lastClaimedDate: string | null; t: (key: 'success' | 'bonus_claimed_msg') => string }
      | { type: 'referral_milestone'; balance: number; id: string; minReward: number; maxReward: number }
  ) => {
    decisions: Array<
      | { type: 'setPowerOn'; value: boolean }
      | { type: 'updateMiningStreak' }
      | { type: 'balanceDelta'; delta: number; nextBalance: number }
      | { type: 'setLastClaimedDate'; value: string }
      | { type: 'setActiveModal'; value: string | null }
      | { type: 'setMiningStreak'; value: number }
      | { type: 'activateBoost' }
      | { type: 'setPendingAction'; value: AdAction | null }
      | { type: 'showInfoAlert'; title: string; message: string }
      | { type: 'referralMilestone'; reward: number; updatedMilestones: ReferralMilestone[] }
    >;
    nextBalance: number;
    nextMiningStreak?: number;
    nextLastClaimedDate?: string | null;
    reward?: number;
    updatedMilestones?: ReferralMilestone[];
  };
};

export function useHomeScreen(callbacks?: HomeScreenCallbacks) {
  const router = useRouter();
  const { t, setLanguage, language } = useLanguage();
  const insets = useSafeAreaInsets();
  
  // --- DYNAMIC DIMENSIONS FOR RESPONSIVENESS ---
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  
  // Dynamic Scaling Functions
  const dynamicScaleWidth = isTablet ? width * 0.6 : width;
  const dynamicScale = (size: number): number => (dynamicScaleWidth / 375) * size;
  const dynamicVerticalScale = (size: number): number => (height / 812) * size;

  // Static scale functions (for consistent styling)
  const staticWidth = Dimensions.get('window').width;
  const staticHeight = Dimensions.get('window').height;
  const staticIsTablet = staticWidth >= 768;
  const staticScaleWidth = staticIsTablet ? staticWidth * 0.6 : staticWidth;
  const scale = (size: number): number => (staticScaleWidth / 375) * size;
  const verticalScale = (size: number): number => (staticHeight / 812) * size;

  // --- CORE STATE ---
  const [balance, setBalance] = useState(10.00);
  const [powerOn, setPowerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Network Stats State
  const [totalMiners, setTotalMiners] = useState(1500);
  const [lsnMined, setLsnMined] = useState(90000);

  // Ad Simulation State
  const [isAdWatching, setIsAdWatching] = useState(false);
  const [, setPendingAction] = useState<string | null>(null);

  // Boost State
  const [boostActive, setBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [boostsUsedToday, setBoostsUsedToday] = useState(0);
  const [lastBoostTime, setLastBoostTime] = useState<number | null>(null);

  // Daily Bonus State
  const [lastClaimedDate, setLastClaimedDate] = useState<string | null>(null);
  const [isDailyBonusAvailable, setIsDailyBonusAvailable] = useState(true);

  // Weekly Bonus State
  const [miningStreak, setMiningStreak] = useState(0);
  const [lastMiningDate, setLastMiningDate] = useState<string | null>(null);

  // Referral State
  const [referralCode] = useState(() => generateReferralCode(6));
  const [referrals, setReferrals] = useState(initialReferrals);
  const [now, setNow] = useState(Date.now());

  // Rewards State
  const [socialTasks, setSocialTasks] = useState(initialSocialTasks);
  const [referralMilestones, setReferralMilestones] = useState(initialReferralMilestones);

  // --- LAYOUT REFS ---
  const leftBtnRef = useRef<any>(null);
  const rightBtnRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const hubRef = useRef<any>(null);
  const hubOriginRef = useRef<any>(null);
  const headerInnerRef = useRef<any>(null);
  const powerBtnRef = useRef<any>(null);

  // --- LAYOUT STATE ---
  const [leftBtnLayout, setLeftBtnLayout] = useState<LayoutRect>(null);
  const [rightBtnLayout, setRightBtnLayout] = useState<LayoutRect>(null);
  const [headerLayout, setHeaderLayout] = useState<LayoutRect>(null);
  const [hubLayout, setHubLayout] = useState<LayoutRect>(null);
  const [powerLayout, setPowerLayout] = useState<LayoutRect>(null);
  const [hubOriginLayout, setHubOriginLayout] = useState<LayoutRect>(null);
  const [, setHeaderInnerLayout] = useState<LayoutRect>(null);

  // --- CUSTOM ALERT STATE ---
  const [customAlert, setCustomAlert] = useState<CustomAlertState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  // --- ANIMATION STATE ---
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // Animated bundle Y values
  const {
    topBundleY,
    bottomBundleY,
    leftBtnBundleYSvg,
    rightBtnBundleYSvg,
    leftBundleX,
    rightBundleX,
    screenLeftEdgeSVG,
    screenRightEdgeSVG,
    spineTop,
    spineBottom,
  } = computeStageLayout({
    headerLayout,
    hubLayout,
    hubOriginLayout,
    leftBtnLayout,
    rightBtnLayout,
    powerLayout,
    insetsTop: insets.top,
    insetsBottom: insets.bottom,
    width,
    height,
    dynamicScale,
    dynamicVerticalScale,
  });

  const leftBundleXNudged = leftBundleX;
  const rightBundleXNudged = rightBundleX;

  const leftBundleYAnim = useRef(new Animated.Value(leftBtnBundleYSvg)).current;
  const rightBundleYAnim = useRef(new Animated.Value(rightBtnBundleYSvg)).current;
  const [leftBundleYDisplay, setLeftBundleYDisplay] = useState<number>(leftBtnBundleYSvg);
  const [rightBundleYDisplay, setRightBundleYDisplay] = useState<number>(rightBtnBundleYSvg);

  // --- ALERT HANDLERS ---
  const showInfoAlert = (title: string, message: string) => {
    showInfoAlertAction({ setCustomAlert, title, message });
  };

  const showConfirmAlert = (title: string, message: string, onConfirm: () => void, confirmText = 'Yes', cancelText = 'No') => {
    showConfirmAlertAction({
      setCustomAlert,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const closeAlert = () => {
    closeAlertAction({ setCustomAlert });
  };

  // --- REFERRAL LOGIC ---
  const baseRate = 3.15;
  const { activeReferralsCount, validReferralsCount } = getReferralCounts(referrals);
  const { referralBoostPercentage, activeMiningRate, finalMiningRate } = calculateMiningRates({
    baseRate,
    activeReferralsCount,
    boostActive,
  });

  const handleCopyCode = async () => {
    await copyReferralCode({ referralCode });
    showInfoAlert('Copied', 'Referral code copied to clipboard!');
  };

  const handleNotify = (id: string) => {
    const { referrals: updated, message } = notifyReferral({ id, referrals });
    setReferrals(updated);
    showInfoAlert('Notification Sent', message);
  };

  const handleShareInvite = async () => {
    const result = await shareInvite({ referralCode });
    if (!result.success) {
      showInfoAlert('Error', result.error ?? 'Could not share invite.');
    }
  };

  // --- MINING STREAK ---
  const updateMiningStreak = () => {
    updateMiningStreakAction({
      lastMiningDate,
      setMiningStreak,
      setLastMiningDate: (value) => setLastMiningDate(value),
    });
  };

  // --- AD SIMULATION ---
  const triggerAd = (action: AdAction) => {
    // For daily bonus, re-evaluate availability via domain if wired
    if (action === 'daily_bonus' && callbacks?.onClaimDaily) {
      const daily = callbacks.onClaimDaily({ lastClaimedDate });
      setIsDailyBonusAvailable(daily.canClaim);
      if (!daily.canClaim || !daily.shouldTriggerAd || !daily.action) {
        return;
      }
    }

    startAdSimulation({
      action,
      setPendingAction,
      setIsAdWatching,
      onReward: handleAdReward,
    });
  };

  const handleAdReward = (action: AdAction) => {
    if (callbacks?.onGrantReward) {
      const result = callbacks.onGrantReward({
        type: 'ad',
        action,
        balance,
        miningStreak,
        lastClaimedDate,
        t,
      });

      applyRewardDecisions(result.decisions);

      if (result.nextMiningStreak !== undefined) {
        setMiningStreak(result.nextMiningStreak);
      }

      if (result.nextLastClaimedDate !== undefined) {
        setLastClaimedDate(result.nextLastClaimedDate);
      }

      return;
    }

    applyAdReward({
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
    });
  };

  // --- USER HANDLERS ---
  const handleLogout = () => {
    confirmLogout({ showConfirmAlert });
  };

  const handleMenuPress = (item: string) => {
    handleMenuPressAction({
      item,
      t,
      push: (path) => router.push(path as any),
      setShowLanguageModal,
      showInfoAlert,
    });
  };

  // --- SOCIAL TASK HANDLER ---
  const handleSocialTask = async (id: string, reward: number, url: string, status: string) => {
    await handleSocialTaskAction({
      id,
      reward,
      url,
      status: status as SocialTaskStatus,
      setSocialTasks,
      setBalance,
      showInfoAlert,
    });
  };

  // --- REFERRAL MILESTONE HANDLER ---
  const handleClaimReferralMilestone = (id: string, minReward: number, maxReward: number) => {
    if (callbacks?.onGrantReward) {
      const result = callbacks.onGrantReward({
        type: 'referral_milestone',
        balance,
        id,
        minReward,
        maxReward,
      });

      applyRewardDecisions(result.decisions);

      if (result.reward !== undefined) {
        showInfoAlert('Milestone Unlocked!', `You received +${result.reward} LSN for your referrals!`);
      }

      return;
    }

    const { reward, updatedMilestones } = claimReferralMilestoneReward({
      id,
      minReward,
      maxReward,
    });
    setReferralMilestones(updatedMilestones);
    setBalance((prev) => prev + reward);
    showInfoAlert('Milestone Unlocked!', `You received +${reward} LSN for your referrals!`);
  };

  // --- BOOST LOGIC ---
  const activateBoost = () => {
    activateBoostSession({
      setBoostActive,
      setBoostTimeLeft,
      setBoostsUsedToday,
      setLastBoostTime,
    });
  };

  const handlePowerPress = () => {
    if (callbacks?.onPowerPress) {
      const result = callbacks.onPowerPress({ powerOn });

      if (result.shouldStop) {
        setPowerOn(false);
        return;
      }

      if (result.shouldTriggerAd) {
        triggerAd('mining');
      }
    } else {
      // Fallback to original engine logic
      handlePowerPressAction({
        powerOn,
        setPowerOn,
        triggerAd,
      });
    }
  };

  const handleBoostPress = () => {
    handleBoostPressAction({
      powerOn,
      boostActive,
      boostsUsedToday,
      lastBoostTime,
      setActiveModal,
      showInfoAlert,
    });
  };

  // --- MEASURE BUTTONS ---
  const measureButtons = () => {
    measureHomeAnchorsAction({
      leftBtnRef,
      rightBtnRef,
      headerRef,
      hubRef,
      hubOriginRef,
      headerInnerRef,
      powerBtnRef,
      setLeftBtnLayout,
      setRightBtnLayout,
      setHeaderLayout,
      setHubLayout,
      setHubOriginLayout,
      setHeaderInnerLayout,
      setPowerLayout,
    });
  };

  // --- EFFECTS ---
  
  // Network stats simulation
  useEffect(() => {
    return setupNetworkStatsSimulation({
      setTotalMiners,
      setLsnMined,
      intervalMs: 3000,
    });
  }, []);

  // Referral now interval
  useEffect(() => {
    return setupReferralNowInterval({
      activeTab,
      setNow,
    });
  }, [activeTab]);

  // Daily bonus availability
  useEffect(() => {
    if (callbacks?.onClaimDaily) {
      const daily = callbacks.onClaimDaily({ lastClaimedDate });
      setIsDailyBonusAvailable(daily.canClaim);
    } else {
      updateDailyBonusAvailability({
        lastClaimedDate,
        setIsDailyBonusAvailable,
      });
    }
  }, [lastClaimedDate, activeModal, callbacks]);

  // Tab change fade animation
  useEffect(() => {
    runFadeInOnTabChange({
      fadeAnim,
      activeTab,
    });
  }, [activeTab, fadeAnim]);

  // Modal scale animation
  useEffect(() => {
    runModalScaleOnOpen({
      modalScaleAnim,
      activeModal,
    });
  }, [activeModal, modalScaleAnim]);

  // Boost countdown
  useEffect(() => {
    return setupBoostCountdown({
      boostActive,
      boostTimeLeft,
      setBoostTimeLeft,
      setBoostActive,
    });
  }, [boostActive, boostTimeLeft]);

  // Mining session interval
  useEffect(() => {
    if (callbacks?.onTick) {
      // Use callback from container
      let timer: ReturnType<typeof setInterval> | undefined;

      if (powerOn) {
        timer = setInterval(() => {
          const { rewardDelta, nextTimeLeft, shouldStop } = callbacks.onTick!({
            timeLeft,
            finalMiningRate,
          });

          setTimeLeft(nextTimeLeft);
          setBalance((prev) => prev + rewardDelta);

          if (shouldStop) {
            setPowerOn(false);
          }
        }, 1000);
      }

      return () => {
        if (timer) clearInterval(timer);
      };
    } else {
      // Fallback to original engine logic
      return setupMiningSessionInterval({
        powerOn,
        finalMiningRate,
        setTimeLeft,
        setPowerOn,
        setBalance,
      });
    }
  }, [powerOn, boostActive, finalMiningRate, timeLeft, callbacks]);

  // Breathing animation
  useEffect(() => {
    setupBreathingAnimation({
      breatheAnim,
      powerOn,
    });
  }, [powerOn, breatheAnim]);

  // Animated value mirrors
  useEffect(() => {
    return setupDualAnimatedValueMirrors({
      leftAnim: leftBundleYAnim,
      rightAnim: rightBundleYAnim,
      setLeft: setLeftBundleYDisplay,
      setRight: setRightBundleYDisplay,
    });
  }, [leftBundleYAnim, rightBundleYAnim]);

  // Bundle snap animation
  useEffect(() => {
    const targetLeft = leftBtnBundleYSvg || bottomBundleY;
    const targetRight = rightBtnBundleYSvg || bottomBundleY;

    runBundleSnapAnimation({
      leftAnim: leftBundleYAnim,
      rightAnim: rightBundleYAnim,
      targetLeft,
      targetRight,
      durationMs: 32,
    });
  }, [leftBtnBundleYSvg, rightBtnBundleYSvg, bottomBundleY, leftBundleYAnim, rightBundleYAnim]);

  // Initial measurements
  useEffect(() => {
    return scheduleInitialMeasurements(measureButtons, 80, 220);
  }, [width, height, activeTab]);

  // Resize observer
  useEffect(() => {
    return setupResizeMeasurementObserver(measureButtons);
  }, []);

  // --- COMPUTED VALUES ---
  const powerColor = powerOn ? '#e5c27a' : THEME.text;
  const currentRate = `${finalMiningRate.toFixed(2)}/hr`;

  const flatStyle = {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
    backgroundColor: 'transparent'
  };

  return {
    // Context
    router,
    t,
    setLanguage,
    language,
    insets,
    
    // Dimensions
    width,
    height,
    isTablet,
    dynamicScale,
    dynamicVerticalScale,
    scale,
    verticalScale,
    
    // Core State
    balance,
    powerOn,
    timeLeft,
    activeTab,
    setActiveTab,
    activeModal,
    setActiveModal,
    showLanguageModal,
    setShowLanguageModal,
    
    // Network Stats
    totalMiners,
    lsnMined,
    
    // Ad State
    isAdWatching,
    
    // Boost State
    boostActive,
    boostTimeLeft,
    boostsUsedToday,
    
    // Daily Bonus State
    isDailyBonusAvailable,
    
    // Streak State
    miningStreak,
    
    // Referral State
    referralCode,
    referrals,
    now,
    baseRate,
    activeReferralsCount,
    validReferralsCount,
    referralBoostPercentage,
    activeMiningRate,
    finalMiningRate,
    
    // Rewards State
    socialTasks,
    referralMilestones,
    
    // Alert State
    customAlert,
    closeAlert,
    showInfoAlert,
    
    // Animation State
    fadeAnim,
    modalScaleAnim,
    breatheAnim,
    
    // Layout
    topBundleY,
    bottomBundleY,
    leftBundleX,
    leftBundleXNudged,
    rightBundleXNudged,
    leftBundleYDisplay,
    rightBundleYDisplay,
    screenLeftEdgeSVG,
    screenRightEdgeSVG,
    spineTop,
    spineBottom,
    
    // Refs
    leftBtnRef,
    rightBtnRef,
    headerRef,
    hubRef,
    hubOriginRef,
    headerInnerRef,
    powerBtnRef,
    
    // Computed
    powerColor,
    currentRate,
    flatStyle,
    
    // Handlers
    handleCopyCode,
    handleNotify,
    handleShareInvite,
    handleLogout,
    handleMenuPress,
    handleSocialTask,
    handleClaimReferralMilestone,
    handlePowerPress,
    handleBoostPress,
    triggerAd,
    measureButtons,
  };

  // Reward decision applier (kept private to hook)
  function applyRewardDecisions(decisions: NonNullable<HomeScreenCallbacks['onGrantReward']> extends (...args: any[]) => infer R
    ? R extends { decisions: infer D }
      ? D
      : never
    : never) {
    decisions.forEach((decision) => {
      switch (decision.type) {
        case 'setPowerOn':
          setPowerOn(decision.value);
          break;
        case 'updateMiningStreak':
          updateMiningStreak();
          break;
        case 'balanceDelta':
          setBalance(decision.nextBalance);
          break;
        case 'setLastClaimedDate':
          setLastClaimedDate(decision.value);
          break;
        case 'setActiveModal':
          setActiveModal(decision.value);
          break;
        case 'setMiningStreak':
          setMiningStreak(decision.value);
          break;
        case 'activateBoost':
          activateBoost();
          break;
        case 'setPendingAction':
          setPendingAction(decision.value);
          break;
        case 'showInfoAlert':
          showInfoAlert(decision.title, decision.message);
          break;
        case 'referralMilestone':
          setReferralMilestones(decision.updatedMilestones);
          break;
        default:
          break;
      }
    });
  }
}
