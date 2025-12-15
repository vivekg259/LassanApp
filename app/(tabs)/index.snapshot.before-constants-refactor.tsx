import React, { useEffect, useRef, useState } from 'react';
/**
 * UI DESIGN FINAL LOCKED - DO NOT MODIFY VISUAL ELEMENTS WITHOUT EXPLICIT INSTRUCTION
 * Locked State: Motherboard Circuit Design (Responsive), 7 Vertical Spines, Animated Transitions,
 * Neumorphic Buttons, Layering (z-index), and specific Color Theme.
 * Referral Tab: LOCKED (UI, Realtime Logic, Notify System, Responsive Scaling).
 * Validated on: iOS (iPhone 12), Android, Web (Pixel 7), Tablets.
 */
import { applyAdReward, startAdSimulation, type AdAction } from '@/app/(tabs)/Home/home.ad';
import { closeAlertAction, showConfirmAlertAction, showInfoAlertAction, type CustomAlertState } from '@/app/(tabs)/Home/home.alert';
import { runBundleSnapAnimation, runFadeInOnTabChange, runModalScaleOnOpen, setupBreathingAnimation, setupDualAnimatedValueMirrors } from '@/app/(tabs)/Home/home.animations';
import { updateDailyBonusAvailability } from '@/app/(tabs)/Home/home.bonus';
import { activateBoostSession, handleBoostPressAction, setupBoostCountdown } from '@/app/(tabs)/Home/home.boost';
import { setupNetworkStatsSimulation, setupReferralNowInterval } from '@/app/(tabs)/Home/home.effects';
import { calculateMiningRates, formatNumber, generateReferralCode, getReferralCounts } from '@/app/(tabs)/Home/home.helpers';
import { computeStageLayout } from '@/app/(tabs)/Home/home.layout';
import { measureHomeAnchorsAction, scheduleInitialMeasurements, setupResizeMeasurementObserver } from '@/app/(tabs)/Home/home.measure';
import { handlePowerPressAction, setupMiningSessionInterval } from '@/app/(tabs)/Home/home.mining';
import { claimReferralMilestoneReward, copyReferralCode, notifyReferral, shareInvite } from '@/app/(tabs)/Home/home.referral';
import { handleSocialTaskAction, type SocialTaskStatus } from '@/app/(tabs)/Home/home.social';
import { updateMiningStreakAction } from '@/app/(tabs)/Home/home.streak';
import { confirmLogout, handleMenuPressAction } from '@/app/(tabs)/Home/home.user';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, Polygon, Polyline, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

// --- THEME CONSTANTS ---
const THEME = {
  bg: '#f5ede1',
  text: '#5a4a3a',
  textSecondary: '#8b7355',
  shadowLight: '#ffffff',
  shadowDark: '#c4b5a0', 
  accent: '#d4af37',
  accentDark: '#a68c1c',
  overlay: 'rgba(255, 255, 255, 0.5)',
  overlayDark: 'rgba(90, 74, 58, 0.08)'
};

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

// Responsive utility to scale sizes based on screen width
// On tablets, we constrain the scaling width to prevent elements from becoming too large
const scaleWidth = isTablet ? width * 0.6 : width;
const scale = (size: number): number => (scaleWidth / 375) * size;
const verticalScale = (size: number): number => (height / 812) * size;

export default function HomeScreen() {
  const router = useRouter();
  const { t, setLanguage, language } = useLanguage();
  const insets = useSafeAreaInsets();
  
  // --- DYNAMIC DIMENSIONS FOR RESPONSIVENESS ---
  // We use useWindowDimensions to ensure layout updates on rotation/resize
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  
  // Dynamic Scaling Functions (override static ones for SVG layout)
  // On tablets, we constrain the scaling width to prevent elements from becoming too large
  const dynamicScaleWidth = isTablet ? width * 0.6 : width;
  const dynamicScale = (size: number): number => (dynamicScaleWidth / 375) * size;
  const dynamicVerticalScale = (size: number): number => (height / 812) * size;

  const [balance, setBalance] = useState(10.00);
  const [powerOn, setPowerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'bonus' | 'boost' | null
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEarlyPhaseInfo, setShowEarlyPhaseInfo] = useState(false);
  
  // Network Stats State
  const [totalMiners, setTotalMiners] = useState(1500);
  const [lsnMined, setLsnMined] = useState(90000);

  // Simulate live user growth and mining
  useEffect(() => {
    return setupNetworkStatsSimulation({
      setTotalMiners,
      setLsnMined,
      intervalMs: 3000,
    });
  }, []);

  // Ad Simulation State
  const [isAdWatching, setIsAdWatching] = useState(false);
  const [, setPendingAction] = useState<string | null>(null); // 'mining' | 'daily_bonus' | 'weekly_bonus' | 'boost'

  // Boost State
  const [boostActive, setBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0); // in seconds
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
  const [referrals, setReferrals] = useState([
    { id: '1', name: 'SAURABH SONI', email: 'sonysaurabh3690@gmail.com', status: 'active', consecutiveDays: 5, lastNotified: null as number | null },
    { id: '2', name: 'RAHUL KUMAR', email: 'rahul.k@example.com', status: 'active', consecutiveDays: 4, lastNotified: null as number | null },
    { id: '3', name: 'VIKRAM MALHOTRA', email: 'vikram.m@example.com', status: 'active', consecutiveDays: 1, lastNotified: null as number | null },
    { id: '4', name: 'AMIT PATEL', email: 'amit.patel@example.com', status: 'active', consecutiveDays: 7, lastNotified: null as number | null },
    { id: '5', name: 'NEHA GUPTA', email: 'neha.gupta@test.com', status: 'active', consecutiveDays: 2, lastNotified: null as number | null },
    { id: '6', name: 'ROHIT SHARMA', email: 'rohit.sharma@example.com', status: 'active', consecutiveDays: 10, lastNotified: null as number | null },
    { id: '7', name: 'SNEHA VERMA', email: 'sneha.verma@test.com', status: 'active', consecutiveDays: 3, lastNotified: null as number | null },
    { id: '8', name: 'ARJUN SINGH', email: 'arjun.singh@example.com', status: 'active', consecutiveDays: 0, lastNotified: null as number | null },
    { id: '9', name: 'KAVITA REDDY', email: 'kavita.reddy@test.com', status: 'active', consecutiveDays: 6, lastNotified: null as number | null },
    { id: '10', name: 'MANISH TIWARI', email: 'manish.tiwari@example.com', status: 'active', consecutiveDays: 8, lastNotified: null as number | null },
    { id: '11', name: 'POOJA MEHTA', email: 'pooja.mehta@test.com', status: 'active', consecutiveDays: 1, lastNotified: null as number | null },
    { id: '12', name: 'PRIYA SINGH', email: 'priya.singh99@test.com', status: 'inactive', consecutiveDays: 0, lastNotified: null as number | null },
    { id: '13', name: 'ANJALI SHARMA', email: 'anjali.s@test.com', status: 'inactive', consecutiveDays: 0, lastNotified: null as number | null },
    { id: '14', name: 'RAJESH KUMAR', email: 'rajesh.kumar@example.com', status: 'inactive', consecutiveDays: 0, lastNotified: null as number | null },
    { id: '15', name: 'SIMRAN KAUR', email: 'simran.kaur@test.com', status: 'inactive', consecutiveDays: 0, lastNotified: null as number | null },
  ]);

  // Timer for Referral Cooldowns
  const [now, setNow] = useState(Date.now());

  // Rewards State
  const [socialTasks, setSocialTasks] = useState([
    { id: '1', title: 'Join Telegram Channel', reward: 30, icon: 'Send', status: 'pending', url: 'https://t.me/lassancoin' }, 
    { id: '2', title: 'Follow on X (Twitter)', reward: 30, icon: 'Twitter', status: 'pending', url: 'https://x.com/lassancoin' },
    { id: '3', title: 'Subscribe to YouTube', reward: 30, icon: 'Youtube', status: 'pending', url: 'https://youtube.com/@lassancoin' },
    { id: '4', title: 'Join Discord Server', reward: 30, icon: 'MessageCircle', status: 'pending', url: 'https://discord.gg/lassan' },
  ]);

  // Referral Milestones State
  const [referralMilestones, setReferralMilestones] = useState([
    { id: 'ref_3', target: 3, title: 'Invite 3 Friends', rewardDisplay: '300~900', minReward: 350, maxReward: 450, status: 'pending' },
    { id: 'ref_9', target: 9, title: 'Invite 9 Friends', rewardDisplay: '900~2700', minReward: 1000, maxReward: 1200, status: 'pending' },
    { id: 'ref_27', target: 27, title: 'Invite 27 Friends', rewardDisplay: '8100', minReward: 8100, maxReward: 8100, status: 'pending' },
  ]);
  
  // Measured layout for action buttons (for precise SVG binding)
  const leftBtnRef = useRef<any>(null);
  const rightBtnRef = useRef<any>(null);
  const [leftBtnLayout, setLeftBtnLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  const [rightBtnLayout, setRightBtnLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  
  // Measured layout for header, hub and power button for pixel-perfect alignment
  const headerRef = useRef<any>(null);
  const hubRef = useRef<any>(null);
  const hubOriginRef = useRef<any>(null);
  const headerInnerRef = useRef<any>(null);
  const powerBtnRef = useRef<any>(null);
  const [headerLayout, setHeaderLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  const [hubLayout, setHubLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  const [powerLayout, setPowerLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  const [hubOriginLayout, setHubOriginLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);
  const [, setHeaderInnerLayout] = useState<{x:number,y:number,width:number,height:number} | null>(null);

  // Custom Alert State
  const [customAlert, setCustomAlert] = useState<CustomAlertState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

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

  useEffect(() => {
    return setupReferralNowInterval({
      activeTab,
      setNow,
    });
  }, [activeTab]);

  // Referral Logic
  const baseRate = 3.15;
  const { activeReferralsCount, validReferralsCount } = getReferralCounts(referrals);
  const { referralBoostPercentage, activeMiningRate, finalMiningRate } = calculateMiningRates({
    baseRate,
    activeReferralsCount,
    boostActive,
  });

  const handleCopyCode = async () => {
    await copyReferralCode({ referralCode, showInfoAlert });
  };

  const handleNotify = (id: string) => {
    notifyReferral({
      id,
      setReferrals,
      showInfoAlert,
    });
  };

  const handleShareInvite = async () => {
    await shareInvite({ referralCode, showInfoAlert });
  };

  useEffect(() => {
    updateDailyBonusAvailability({
      lastClaimedDate,
      setIsDailyBonusAvailable,
    });
  }, [lastClaimedDate, activeModal]);

  // Animation State
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    runFadeInOnTabChange({
      fadeAnim,
      activeTab,
    });
  }, [activeTab, fadeAnim]);

  useEffect(() => {
    runModalScaleOnOpen({
      modalScaleAnim,
      activeModal,
    });
  }, [activeModal, modalScaleAnim]);

  const updateMiningStreak = () => {
    updateMiningStreakAction({
      lastMiningDate,
      setMiningStreak,
      setLastMiningDate: (value) => setLastMiningDate(value),
    });
  };

  // --- AD SIMULATION LOGIC ---
  const triggerAd = (action: AdAction) => {
    startAdSimulation({
      action,
      setPendingAction,
      setIsAdWatching,
      onReward: handleAdReward,
    });
  };

  const handleAdReward = (action: AdAction) => {
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

  // --- USER TAB HANDLERS ---
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

  const handleClaimReferralMilestone = (id: string, minReward: number, maxReward: number) => {
    claimReferralMilestoneReward({
      id,
      minReward,
      maxReward,
      setReferralMilestones,
      setBalance,
      showInfoAlert,
    });
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

  useEffect(() => {
    return setupBoostCountdown({
      boostActive,
      boostTimeLeft,
      setBoostTimeLeft,
      setBoostActive,
    });
  }, [boostActive, boostTimeLeft]);

  const handlePowerPress = () => {
    handlePowerPressAction({
      powerOn,
      setPowerOn,
      triggerAd,
    });
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

  useEffect(() => {
    return setupMiningSessionInterval({
      powerOn,
      finalMiningRate,
      setTimeLeft,
      setPowerOn,
      setBalance,
    });
  }, [powerOn, boostActive, finalMiningRate]);
  
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setupBreathingAnimation({
      breatheAnim,
      powerOn,
    });
  }, [powerOn, breatheAnim]);

  const powerColor = powerOn ? '#e5c27a' : THEME.text;
  
  // --- DYNAMIC LAYOUT CALCULATION (Responsive Fix) ---
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

  // Keep legacy names used in locked SVG JSX
  const leftBundleXNudged = leftBundleX;
  const rightBundleXNudged = rightBundleX;

  // Animated snap for trace ends — small 1-2 frame ease when measurements update
  const leftBundleYAnim = useRef(new Animated.Value(leftBtnBundleYSvg)).current;
  const rightBundleYAnim = useRef(new Animated.Value(rightBtnBundleYSvg)).current;
  const [leftBundleYDisplay, setLeftBundleYDisplay] = useState<number>(leftBtnBundleYSvg);
  const [rightBundleYDisplay, setRightBundleYDisplay] = useState<number>(rightBtnBundleYSvg);

  useEffect(() => {
    // Keep Animated.Value listeners in sync with display state
    return setupDualAnimatedValueMirrors({
      leftAnim: leftBundleYAnim,
      rightAnim: rightBundleYAnim,
      setLeft: setLeftBundleYDisplay,
      setRight: setRightBundleYDisplay,
    });
  }, [leftBundleYAnim, rightBundleYAnim]);

  useEffect(() => {
    // Target values when measurements change; very short duration -> 1-2 frames.
    const targetLeft = leftBtnBundleYSvg || bottomBundleY;
    const targetRight = rightBtnBundleYSvg || bottomBundleY;

    // Slightly longer snap to improve stability on high-DPI/web (≈2 frames)
    runBundleSnapAnimation({
      leftAnim: leftBundleYAnim,
      rightAnim: rightBundleYAnim,
      targetLeft,
      targetRight,
      durationMs: 32,
    });
  }, [leftBtnBundleYSvg, rightBtnBundleYSvg, bottomBundleY, leftBundleYAnim, rightBundleYAnim]);

  const currentRate = `${finalMiningRate.toFixed(2)}/hr`;

  // Measure button positions after layout so we can bind SVG lines precisely
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

  useEffect(() => {
    // Initial measurement shortly after layout, plus a second pass
    // to catch delayed reflows on web / high-DPI devices.
    return scheduleInitialMeasurements(measureButtons, 80, 220);
  }, [width, height, activeTab]);

  // Aggressive resize/rotation observer: re-run measurements on native dimension changes and on web window resize
  useEffect(() => {
    return setupResizeMeasurementObserver(measureButtons);
  }, []);

  const flatStyle = {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
    backgroundColor: 'transparent'
  };

  // Web compatibility: Gradients via url(#id) can be flaky on some web renderers or if the URL path is complex.
  // Fallback to solid color for web to ensure visibility.
  const circuitStroke = Platform.OS === 'web' ? THEME.accent : "url(#circuitGrad)";
  const hubStroke = Platform.OS === 'web' ? THEME.accent : "url(#hubGrad)";

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      
      {/* Circuit Lines Background - Full Screen Coverage */}
      {activeTab === 'home' && (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <SvgLinearGradient id="circuitGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={THEME.accent} stopOpacity="0.3"/>
                  <Stop offset="0.5" stopColor={THEME.accent} stopOpacity="0.8"/>
                  <Stop offset="1" stopColor={THEME.accentDark} stopOpacity="0.3"/>
              </SvgLinearGradient>
            </Defs>

            {/* Motherboard Circuit Design (Left & Right) */}
            <G stroke={circuitStroke} strokeWidth={dynamicScale(1)} fill="none" opacity="0.25">
                {/* Left Side Complex Traces */}
                <Path d={`M ${width/2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(60)} H ${width/2 - dynamicScale(80)} L ${width/2 - dynamicScale(100)} ${spineTop + dynamicVerticalScale(40)} H ${dynamicScale(20)}`} />
                <Rect x={width/2 - dynamicScale(85)} y={spineTop + dynamicVerticalScale(55)} width={10} height={10} fill={THEME.accent} opacity="0.5" stroke="none" />
                
                <Path d={`M ${width/2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(120)} H ${width/2 - dynamicScale(50)} V ${spineTop + dynamicVerticalScale(160)} H ${dynamicScale(10)}`} />
                <Circle cx={width/2 - dynamicScale(50)} cy={spineTop + dynamicVerticalScale(120)} r={3} fill={THEME.accent} stroke="none" />

                <Path d={`M ${width/2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(200)} H ${width/2 - dynamicScale(120)} L ${width/2 - dynamicScale(140)} ${spineTop + dynamicVerticalScale(220)} H ${dynamicScale(30)}`} />
                
                <Path d={`M ${width/2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(280)} H ${width/2 - dynamicScale(60)} L ${width/2 - dynamicScale(90)} ${spineTop + dynamicVerticalScale(310)} H ${dynamicScale(10)}`} />
                <Rect x={width/2 - dynamicScale(65)} y={spineTop + dynamicVerticalScale(275)} width={8} height={8} fill={THEME.accent} opacity="0.5" stroke="none" />

                {/* Right Side Complex Traces */}
                <Path d={`M ${width/2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(60)} H ${width/2 + dynamicScale(80)} L ${width/2 + dynamicScale(100)} ${spineTop + dynamicVerticalScale(40)} H ${width - dynamicScale(20)}`} />
                <Rect x={width/2 + dynamicScale(75)} y={spineTop + dynamicVerticalScale(55)} width={10} height={10} fill={THEME.accent} opacity="0.5" stroke="none" />

                <Path d={`M ${width/2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(120)} H ${width/2 + dynamicScale(50)} V ${spineTop + dynamicVerticalScale(160)} H ${width - dynamicScale(10)}`} />
                <Circle cx={width/2 + dynamicScale(50)} cy={spineTop + dynamicVerticalScale(120)} r={3} fill={THEME.accent} stroke="none" />

                <Path d={`M ${width/2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(200)} H ${width/2 + dynamicScale(120)} L ${width/2 + dynamicScale(140)} ${spineTop + dynamicVerticalScale(220)} H ${width - dynamicScale(30)}`} />

                <Path d={`M ${width/2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(280)} H ${width/2 + dynamicScale(60)} L ${width/2 + dynamicScale(90)} ${spineTop + dynamicVerticalScale(310)} H ${width - dynamicScale(10)}`} />
                <Rect x={width/2 + dynamicScale(57)} y={spineTop + dynamicVerticalScale(275)} width={8} height={8} fill={THEME.accent} opacity="0.5" stroke="none" />
            </G>

            {/* Group for all traces */}
            <G stroke={circuitStroke} strokeWidth={dynamicScale(2)} fill="none" strokeLinecap="round">
                {/* --- 7 VERTICAL SPINES (Data Bus) --- */}
                {/* Only show side spines when power is ON */}
                {powerOn && (
                  <>
                    {/* Far Left Spine */}
                    <Line x1={width/2 - dynamicScale(15)} y1={spineTop} x2={width/2 - dynamicScale(15)} y2={spineBottom} strokeWidth={dynamicScale(1)} opacity="0.4" />
                    {/* Mid Left Spine */}
                    <Line x1={width/2 - dynamicScale(10)} y1={spineTop} x2={width/2 - dynamicScale(10)} y2={spineBottom} strokeWidth={dynamicScale(1.2)} opacity="0.5" />
                    {/* Near Left Spine */}
                    <Line x1={width/2 - dynamicScale(5)} y1={spineTop} x2={width/2 - dynamicScale(5)} y2={spineBottom} strokeWidth={dynamicScale(1.5)} opacity="0.6" />
                    
                    {/* Near Right Spine */}
                    <Line x1={width/2 + dynamicScale(5)} y1={spineTop} x2={width/2 + dynamicScale(5)} y2={spineBottom} strokeWidth={dynamicScale(1.5)} opacity="0.6" />
                    {/* Mid Right Spine */}
                    <Line x1={width/2 + dynamicScale(10)} y1={spineTop} x2={width/2 + dynamicScale(10)} y2={spineBottom} strokeWidth={dynamicScale(1.2)} opacity="0.5" />
                    {/* Far Right Spine */}
                    <Line x1={width/2 + dynamicScale(15)} y1={spineTop} x2={width/2 + dynamicScale(15)} y2={spineBottom} strokeWidth={dynamicScale(1)} opacity="0.4" />
                  </>
                )}
                
                {/* Center Spine (Thickest) - Always visible but detached when inactive */}
                <Line 
                  x1={width/2} 
                  y1={powerOn ? spineTop : spineTop + dynamicVerticalScale(50)} 
                  x2={width/2} 
                  y2={powerOn ? spineBottom : spineBottom - dynamicVerticalScale(50)} 
                  strokeWidth={dynamicScale(2.5)} 
                />

                {/* Circuit Nodes for Inactive State */}
                {!powerOn && (
                  <>
                    {/* Top Node: Semi-circle pointing UP (into gap) */}
                    <Path 
                        d={`M ${width/2 - dynamicScale(4)} ${spineTop + dynamicVerticalScale(50)} A ${dynamicScale(4)} ${dynamicScale(4)} 0 0 0 ${width/2 + dynamicScale(4)} ${spineTop + dynamicVerticalScale(50)}`} 
                        fill={THEME.accent} 
                    />
                    {/* Bottom Node: Semi-circle pointing DOWN (into gap) */}
                    <Path 
                        d={`M ${width/2 - dynamicScale(4)} ${spineBottom - dynamicVerticalScale(50)} A ${dynamicScale(4)} ${dynamicScale(4)} 0 0 1 ${width/2 + dynamicScale(4)} ${spineBottom - dynamicVerticalScale(50)}`} 
                        fill={THEME.accent} 
                    />
                  </>
                )}
            </G>
          </Svg>
      </View>
      )}

      {/* --- HEADER --- */}
      <View style={styles.header} ref={headerRef} onLayout={() => measureButtons()}>
        <View style={styles.balanceContainer}>
          <View ref={headerInnerRef} onLayout={() => measureButtons()} style={[styles.balanceDisplay, { width: '100%' }, powerOn && styles.balanceActive, activeTab !== 'home' && { paddingVertical: verticalScale(8) }]}>
            {activeTab === 'referral' ? (
              <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_referral')}</Text>
            ) : activeTab === 'explore' ? (
              <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_explore')}</Text>
            ) : activeTab === 'user' ? (
              <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('user_settings')}</Text>
            ) : activeTab === 'rewards' ? (
              <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_rewards')}</Text>
            ) : (
              <Text style={styles.balanceText}>{balance.toFixed(4)} LSN</Text>
            )}
          </View>
        </View>
      </View>

      {/* --- MAIN CONTENT STAGE --- */}
      <View style={styles.stage}>
        <Animated.View 
          needsOffscreenAlphaCompositing={true}
          renderToHardwareTextureAndroid={true}
          style={{ 
            flex: 1, 
            width: '100%', 
            alignItems: 'center', 
            justifyContent: activeTab === 'home' ? 'space-around' : 'flex-start', 
            opacity: fadeAnim,
            transform: [
              { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
              { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }
            ] 
        }}>
        {activeTab === 'home' ? (
          <>
            {/* Top Actions */}
            <View style={styles.actionRow}>
              <View style={[styles.balanceDisplay, { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) }, powerOn && styles.balanceActive]}>
                <Text style={styles.btnText}>{powerOn ? currentRate : "0.00/hr"}</Text>
              </View>
              <View style={[styles.balanceDisplay, { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) }, powerOn && styles.balanceActive]}>
                <Text style={styles.btnText}>{powerOn ? timeLeft : "Inactive"}</Text>
              </View>
            </View>

            {/* CENTER HUB */}
            <View style={[styles.centerHub, { overflow: 'visible' }]}>
              {/* Circuit Traces attached to Hub */}
                <View 
                style={{ 
                  position: 'absolute', 
                  width: dynamicScale(1200), 
                  height: dynamicScale(1200), 
                  left: (dynamicScale(240) - dynamicScale(1200)) / 2, 
                  top: (dynamicScale(240) - dynamicScale(1200)) / 2,
                  zIndex: -1, // Push behind other elements
                }} 
                ref={hubRef}
                onLayout={() => measureButtons()}
                pointerEvents="none"
              >
                      {/* Invisible origin marker (measured) for pixel-perfect SVG binding */}
                      <View ref={hubOriginRef} onLayout={() => measureButtons()} pointerEvents="none" style={{ position: 'absolute', left: '50%', top: '50%', width: 2, height: 2, marginLeft: -1, marginTop: -1, backgroundColor: 'transparent' }} />
                <Svg height="100%" width="100%" viewBox="0 0 1200 1200">
                  <Defs>
                    <SvgLinearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={THEME.accent} stopOpacity="0.3"/>
                        <Stop offset="0.5" stopColor={THEME.accent} stopOpacity="0.8"/>
                        <Stop offset="1" stopColor={THEME.accentDark} stopOpacity="0.3"/>
                    </SvgLinearGradient>
                  </Defs>
                  <G transform="translate(480, 480)">
                  <G stroke={hubStroke} strokeWidth="2" fill="none" strokeLinecap="round">
                    {/* --- LEFT SIDE --- */}
                    
                    {/* Top Left Bundle */}
                    {powerOn && (
                      <>
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1" opacity="0.4" transform="translate(-15, 0)" />
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1.2" opacity="0.5" transform="translate(-10, 0)" />
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1.5" opacity="0.6" transform="translate(-5, 0)" />
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1.5" opacity="0.6" transform="translate(5, 0)" />
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1.2" opacity="0.5" transform="translate(10, 0)" />
                        <Path d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`} strokeWidth="1" opacity="0.4" transform="translate(15, 0)" />
                      </>
                    )}
                    <Path 
                      d={powerOn 
                        ? `M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}` 
                        : "M 60 60 L 40 40 L 0 40"
                      } 
                      strokeWidth={powerOn ? 2.5 : 2}
                    />
                    {!powerOn && (
                      <>
                        <Circle cx="0" cy="40" r="3" fill={THEME.accent} stroke="none" />
                        <Circle cx="60" cy="60" r="2" fill={THEME.accent} stroke="none" />
                      </>
                    )}

                    {/* Mid Left Trace - Active Path: Horizontal Left to Screen Edge */}
                    {powerOn && (
                      <>
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1" opacity="0.4" transform="translate(0, -15)" />
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1.2" opacity="0.5" transform="translate(0, -10)" />
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1.5" opacity="0.6" transform="translate(0, -5)" />
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1.5" opacity="0.6" transform="translate(0, 5)" />
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1.2" opacity="0.5" transform="translate(0, 10)" />
                        <Path d={`M 120 120 L ${screenLeftEdgeSVG} 120`} strokeWidth="1" opacity="0.4" transform="translate(0, 15)" />
                      </>
                    )}
                    <Path 
                        d={powerOn ? `M 120 120 L ${screenLeftEdgeSVG} 120` : "M 30 120 L -50 120"} 
                        strokeWidth={powerOn ? 2.5 : 2.5}
                    />
                    {!powerOn && <Circle cx="-50" cy="120" r="3" fill={THEME.accent} stroke="none" />}

                    {/* Bottom Left Bundle */}
                    {powerOn && (
                      <>
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1" opacity="0.4" transform="translate(-15, 0)" />
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1.2" opacity="0.5" transform="translate(-10, 0)" />
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1.5" opacity="0.6" transform="translate(-5, 0)" />
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1.5" opacity="0.6" transform="translate(5, 0)" />
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1.2" opacity="0.5" transform="translate(10, 0)" />
                        <Path d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`} strokeWidth="1" opacity="0.4" transform="translate(15, 0)" />
                      </>
                    )}
                    <Path 
                      d={powerOn 
                        ? `M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}` 
                        : "M 60 180 L 40 200 L 0 200"
                      } 
                      strokeWidth={powerOn ? 2.5 : 2}
                    />
                    {!powerOn && (
                      <>
                        <Circle cx="0" cy="200" r="3" fill={THEME.accent} stroke="none" />
                        <Circle cx="60" cy="180" r="2" fill={THEME.accent} stroke="none" />
                      </>
                    )}

                    {/* --- RIGHT SIDE --- */}
                    
                    {/* Top Right Bundle */}
                    {powerOn && (
                      <>
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1" opacity="0.4" transform="translate(-15, 0)" />
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1.2" opacity="0.5" transform="translate(-10, 0)" />
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1.5" opacity="0.6" transform="translate(-5, 0)" />
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1.5" opacity="0.6" transform="translate(5, 0)" />
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1.2" opacity="0.5" transform="translate(10, 0)" />
                        <Path d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`} strokeWidth="1" opacity="0.4" transform="translate(15, 0)" />
                      </>
                    )}
                    <Path 
                      d={powerOn 
                        ? `M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}` 
                        : "M 180 60 L 200 40 L 240 40"
                      } 
                      strokeWidth={powerOn ? 2.5 : 2}
                    />
                    {!powerOn && (
                      <>
                        <Circle cx="240" cy="40" r="3" fill={THEME.accent} stroke="none" />
                        <Circle cx="180" cy="60" r="2" fill={THEME.accent} stroke="none" />
                      </>
                    )}

                    {/* Mid Right Trace - Active Path: Horizontal Right to Screen Edge */}
                    {powerOn && (
                      <>
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1" opacity="0.4" transform="translate(0, -15)" />
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1.2" opacity="0.5" transform="translate(0, -10)" />
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1.5" opacity="0.6" transform="translate(0, -5)" />
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1.5" opacity="0.6" transform="translate(0, 5)" />
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1.2" opacity="0.5" transform="translate(0, 10)" />
                        <Path d={`M 120 120 L ${screenRightEdgeSVG} 120`} strokeWidth="1" opacity="0.4" transform="translate(0, 15)" />
                      </>
                    )}
                    <Path 
                        d={powerOn ? `M 120 120 L ${screenRightEdgeSVG} 120` : "M 210 120 L 290 120"} 
                        strokeWidth={powerOn ? 2.5 : 2.5}
                    />
                    {!powerOn && <Circle cx="290" cy="120" r="3" fill={THEME.accent} stroke="none" />}

                    {/* Bottom Right Bundle */}
                    {powerOn && (
                      <>
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1" opacity="0.4" transform="translate(-15, 0)" />
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1.2" opacity="0.5" transform="translate(-10, 0)" />
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1.5" opacity="0.6" transform="translate(-5, 0)" />
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1.5" opacity="0.6" transform="translate(5, 0)" />
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1.2" opacity="0.5" transform="translate(10, 0)" />
                        <Path d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`} strokeWidth="1" opacity="0.4" transform="translate(15, 0)" />
                      </>
                    )}
                    <Path 
                      d={powerOn 
                        ? `M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}` 
                        : "M 180 180 L 200 200 L 240 200"
                      } 
                      strokeWidth={powerOn ? 2.5 : 2}
                    />
                    {!powerOn && (
                      <>
                        <Circle cx="240" cy="200" r="3" fill={THEME.accent} stroke="none" />
                        <Circle cx="180" cy="180" r="2" fill={THEME.accent} stroke="none" />
                      </>
                    )}
                  </G>
                  </G>
                </Svg>
              </View>

              {/* 2. The Main Floating Button */}
              <View>
                <NeuButton size={scale(140)} rounded style={[styles.mainLogoButton, powerOn ? styles.mainLogoActive : undefined]}>
                    <Animated.Image
                      source={powerOn ? require('@/assets/images/onion-icon.png') : require('@/assets/images/onion-inactive.png')}
                      style={[styles.onionImageFull, { transform: [{ scale: breatheAnim }] }]}
                      resizeMode="contain"
                    />
                </NeuButton>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.actionRow} onLayout={() => measureButtons()}>
              <TouchableOpacity 
                ref={leftBtnRef}
                onPress={() => {
                  if (!powerOn) {
                    showInfoAlert("Mining Inactive", "Please activate the mining session first to access Bonus Rewards.");
                    return;
                  }
                  setActiveModal('bonus');
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.balanceDisplay, { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) }, powerOn && styles.balanceActive]}>
                  <Text style={styles.btnText}>{t('btn_bonus')}</Text>
                </View>
              </TouchableOpacity>

              {/* Power Button moved here */}
              <View ref={powerBtnRef} onLayout={() => measureButtons()}>
                <NeuButton
                  size={scale(68)}
                  rounded
                  style={[
                    styles.powerButtonTransparent, 
                    powerOn ? styles.powerButtonActive : undefined,
                    { transform: [{ translateY: verticalScale(30) }] }
                  ]}
                  onPress={handlePowerPress}
                >
                  <Svg width={30} height={30} stroke={powerColor} strokeWidth={powerOn ? 3.4 : 2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <Path d="M12 5v7" />
                    <Path d="M8.5 7.5a6.5 6.5 0 1 0 7 0" />
                  </Svg>
                </NeuButton>
              </View>

              <TouchableOpacity 
                ref={rightBtnRef}
                onPress={handleBoostPress}
                activeOpacity={0.8}
              >
                <View style={[styles.balanceDisplay, { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) }, powerOn && styles.balanceActive]}>
                  <Text style={styles.btnText}>{t('btn_boost')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : activeTab === 'referral' ? (
          <ScrollView 
            style={{ flex: 1, width: '100%' }} 
            contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
            showsVerticalScrollIndicator={false}
          >
             {/* 0. Referral Code Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 16, 
               padding: scale(12),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(8) }}>{t('your_referral_code')}</Text>
                <View style={{ 
                    backgroundColor: 'rgba(0,0,0,0.03)', 
                    borderRadius: 12, 
                    padding: scale(10), 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.05)'
                }}>
                    <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.textSecondary, letterSpacing: 1 }}>{referralCode}</Text>
                    <View style={{ flexDirection: 'row', gap: scale(12) }}>
                        <TouchableOpacity onPress={handleCopyCode}>
                            <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <Rect x="9" y="9" width="13" height="13" rx="2" ry="2"></Rect>
                                <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></Path>
                            </Svg>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShareInvite}>
                            <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <Circle cx="18" cy="5" r="3"></Circle>
                                <Circle cx="6" cy="12" r="3"></Circle>
                                <Circle cx="18" cy="19" r="3"></Circle>
                                <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></Line>
                                <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></Line>
                            </Svg>
                        </TouchableOpacity>
                    </View>
                </View>
             </View>

             {/* 1. Stats Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 16, 
               padding: scale(12),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                {/* 1. Base Mining Rate */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(8) }}>
                    <Text style={{ color: THEME.textSecondary, fontSize: scale(12), fontWeight: '600' }}>{t('base_rate')}</Text>
                    <Text style={{ color: THEME.text, fontSize: scale(14), fontWeight: 'bold' }}>{baseRate.toFixed(2)} LSN/hr</Text>
                </View>

                {/* 2. Active Referral Boost */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(8) }}>
                    <View>
                        <Text style={{ color: THEME.textSecondary, fontSize: scale(12), fontWeight: '600' }}>{t('referral_boost')}</Text>
                        <Text style={{ color: THEME.textSecondary, fontSize: scale(9), marginTop: verticalScale(1) }}>({activeReferralsCount} {t('active')} x 10%)</Text>
                    </View>
                    <Text style={{ color: THEME.accent, fontSize: scale(14), fontWeight: 'bold' }}>+{referralBoostPercentage}%</Text>
                </View>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: verticalScale(8) }} />

                {/* 3. Active Mining Rate */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: THEME.text, fontSize: scale(13), fontWeight: '600', lineHeight: scale(16) }}>{t('mining_active')}</Text>
                        <Text style={{ color: THEME.text, fontSize: scale(13), fontWeight: '600', lineHeight: scale(16) }}>{t('mining_rate')}</Text>
                    </View>
                    <View style={{ 
                        backgroundColor: 'rgba(212, 175, 55, 0.15)', 
                        paddingHorizontal: scale(12), 
                        paddingVertical: verticalScale(6), 
                        borderRadius: 8, 
                        borderWidth: 1, 
                        borderColor: THEME.accent,
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        ...Platform.select({
                            ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width:0, height:0} },
                            android: { elevation: 0 } // Removed elevation to fix translucent background artifacts
                        })
                    }}>
                        <Text style={{ color: THEME.text, fontSize: scale(14), fontWeight: 'bold', backgroundColor: 'transparent' }}>{activeMiningRate.toFixed(2)}</Text>
                        <Text style={{ color: THEME.text, fontSize: scale(10), fontWeight: '700', marginLeft: scale(3), backgroundColor: 'transparent' }}>LSN/hr</Text>
                    </View>
                </View>
             </View>

             {/* 2. My Referrer Family Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               padding: scale(20),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(15) }}>{t('referrer_family')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
                        <View style={{ width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                            <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></Path>
                                <Circle cx="12" cy="7" r="4"></Circle>
                            </Svg>
                        </View>
                        <View>
                            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.text }}>LASSAN ADMIN</Text>
                            <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>admin@lassan.app</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: scale(12), paddingVertical: verticalScale(6), borderRadius: 8, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderWidth: 1, borderColor: THEME.accent }}>
                        <Text style={{ fontSize: scale(12), fontWeight: '600', color: THEME.accentDark }}>{t('active')}</Text>
                    </View>
                </View>
             </View>

             {/* 3. Referrals List Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               padding: scale(20),
               minHeight: verticalScale(200),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20) }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text }}>{t('referral')}</Text>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.accent }}>{referrals.length} people</Text>
                </View>

                {/* Referral List */}
                <View style={{ gap: verticalScale(15) }}>
                    {referrals.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5, paddingVertical: verticalScale(20) }}>
                            <Svg width={scale(40)} height={scale(40)} stroke={THEME.textSecondary} strokeWidth={1.5} fill="none" viewBox="0 0 24 24" style={{ marginBottom: verticalScale(10) }}>
                              <Circle cx="12" cy="12" r="10" />
                              <Path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                              <Line x1="9" y1="9" x2="9.01" y2="9" />
                              <Line x1="15" y1="9" x2="15.01" y2="9" />
                            </Svg>
                            <Text style={{ color: THEME.textSecondary, fontSize: scale(14) }}>{t('no_referrals')}</Text>
                        </View>
                    ) : (
                        referrals.map((referral) => {
                            const atIndex = referral.email.indexOf('@');
                            const prefix = referral.email.substring(0, 3);
                            const suffix = atIndex > 3 ? referral.email.substring(atIndex - 3, atIndex) : '';
                            const maskedEmail = `${prefix}...${suffix}@test.com`;

                            // Notify Logic
                            const COOLDOWN = 30 * 60 * 1000; // 30 minutes
                            const timeSinceLastNotify = referral.lastNotified ? now - referral.lastNotified : Infinity;
                            const canNotify = !referral.lastNotified || (timeSinceLastNotify > COOLDOWN);
                            
                            let buttonText = t('notify');
                            if (!canNotify) {
                                const remaining = COOLDOWN - timeSinceLastNotify;
                                const m = Math.floor(remaining / 60000);
                                const s = Math.floor((remaining % 60000) / 1000);
                                buttonText = `${m}:${s.toString().padStart(2, '0')}`;
                            }

                            return (
                                <View key={referral.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12), flex: 1, marginRight: scale(10) }}>
                                        <View style={{ width: scale(36), height: scale(36), borderRadius: scale(18), backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.textSecondary }}>{referral.name.charAt(0)}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: THEME.text, flexWrap: 'wrap' }}>{referral.name}</Text>
                                            <Text style={{ fontSize: scale(11), color: THEME.textSecondary, flexWrap: 'wrap' }}>{maskedEmail}</Text>
                                        </View>
                                    </View>
                                    
                                    {referral.status === 'active' ? (
                                        <View style={{ 
                                            flexShrink: 0, 
                                            paddingHorizontal: scale(10), 
                                            paddingVertical: verticalScale(4), 
                                            borderRadius: 6, 
                                            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                                            borderWidth: 1, 
                                            borderColor: THEME.accent 
                                        }}>
                                            <Text style={{ 
                                                fontSize: scale(10), 
                                                fontWeight: '600', 
                                                color: THEME.accentDark 
                                            }}>
                                                {t('active')}
                                            </Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity 
                                            onPress={() => canNotify && handleNotify(referral.id)}
                                            disabled={!canNotify}
                                            style={[
                                                { 
                                                    flexShrink: 0, 
                                                    paddingHorizontal: scale(12), 
                                                    paddingVertical: verticalScale(6), 
                                                    borderRadius: 6, 
                                                    backgroundColor: canNotify ? THEME.accent : 'rgba(0,0,0,0.05)', 
                                                    borderWidth: 1, 
                                                    borderColor: canNotify ? THEME.accentDark : 'rgba(0,0,0,0.1)',
                                                    minWidth: scale(70), // Ensure fixed width for timer stability
                                                    alignItems: 'center'
                                                },
                                                canNotify && Platform.select({
                                                    ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: {width:0, height:2} },
                                                    android: { elevation: 2 }
                                                })
                                            ]}
                                        >
                                            <Text style={{ 
                                                fontSize: scale(10), 
                                                fontWeight: 'bold', 
                                                color: canNotify ? '#FFF' : THEME.textSecondary 
                                            }}>
                                                {buttonText}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
             </View>

          </ScrollView>
        ) : activeTab === 'rewards' ? (
          <ScrollView 
            style={{ flex: 1, width: '100%' }} 
            contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
            showsVerticalScrollIndicator={false}
          >
             {/* 1. Daily Streak Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               padding: scale(20),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(15) }}>
                    <View>
                        <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>{t('daily_streak')}</Text>
                        <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{t('streak_desc')}</Text>
                    </View>
                    <View style={{ 
                        paddingHorizontal: scale(12), 
                        paddingVertical: verticalScale(6), 
                        borderRadius: 12, 
                        backgroundColor: 'rgba(212, 175, 55, 0.15)', 
                        borderWidth: 1, 
                        borderColor: THEME.accent 
                    }}>
                        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.accentDark }}>{miningStreak}/7 {t('day')}s</Text>
                    </View>
                </View>

                {/* Streak Visualizer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const isCompleted = day <= miningStreak;
                        const isToday = day === miningStreak + 1; // Next target
                        
                        return (
                            <View key={day} style={{ alignItems: 'center', gap: verticalScale(6) }}>
                                <View style={{ 
                                    width: scale(32), 
                                    height: scale(32), 
                                    borderRadius: scale(16), 
                                    backgroundColor: isCompleted ? THEME.accent : (isToday ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.05)'),
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderWidth: isToday ? 1 : 0,
                                    borderColor: THEME.accent
                                }}>
                                    {isCompleted ? (
                                        <Svg width={scale(16)} height={scale(16)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                                            <Polyline points="20 6 9 17 4 12" />
                                        </Svg>
                                    ) : (
                                        <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: isToday ? THEME.accentDark : THEME.textSecondary }}>{day}</Text>
                                    )}
                                </View>
                                <Text style={{ fontSize: scale(10), color: THEME.textSecondary }}>{t('day')} {day}</Text>
                            </View>
                        );
                    })}
                </View>
             </View>

             {/* 2. Social Tasks */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               padding: scale(20),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('social_tasks')}</Text>
                
                <View style={{ gap: verticalScale(12) }}>
                    {socialTasks.map((task) => (
                      <View 
                        key={task.id}
                        style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: scale(12),
                          borderRadius: 12,
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.05)'
                        }}
                      >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
                                <View style={{ 
                                    width: scale(40), 
                                    height: scale(40), 
                                    borderRadius: scale(10), 
                                    backgroundColor: THEME.bg, 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    ...Platform.select({
                                        ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
                                        android: { elevation: 2 }
                                    })
                                }}>
                                    {/* Simple Icon Logic */}
                                    <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                        {task.icon === 'Send' && <Line x1="22" y1="2" x2="11" y2="13" />}
                                        {task.icon === 'Send' && <Polygon points="22 2 15 22 11 13 2 9 22 2" />}
                                        
                                        {task.icon === 'Twitter' && <Path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                                        
                                        {task.icon === 'Youtube' && <Path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />}
                                        {task.icon === 'Youtube' && <Polygon points="10 15 15 12 10 9" fill={THEME.text} stroke="none" />}

                                        {task.icon === 'MessageCircle' && <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />}
                                    </Svg>
                                </View>
                                <View>
                                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{task.title}</Text>
                                    <Text style={{ fontSize: scale(12), color: THEME.accentDark, fontWeight: 'bold' }}>+{task.reward} LSN</Text>
                                </View>
                            </View>
                            
                            {task.status === 'completed' ? (
                              <View style={{ 
                                width: scale(24), 
                                height: scale(24), 
                                borderRadius: scale(12), 
                                backgroundColor: THEME.accent, 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: '#e5c27a',
                                ...Platform.select({
                                  ios: { shadowColor: '#e5c27a', shadowOpacity: 0.6, shadowRadius: 6, shadowOffset: {width:0, height:0} },
                                  android: { elevation: 6, shadowColor: '#e5c27a' }
                                })
                              }}>
                                <Svg width={scale(14)} height={scale(14)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                                  <Polyline points="20 6 9 17 4 12" />
                                </Svg>
                              </View>
                            ) : task.status === 'verifying' ? (
                              <TouchableOpacity
                                onPress={() => handleSocialTask(task.id, task.reward, task.url, task.status)}
                                activeOpacity={0.8}
                                style={{ 
                                  paddingHorizontal: scale(12), 
                                  paddingVertical: verticalScale(6), 
                                  borderRadius: 12, 
                                  backgroundColor: THEME.accent,
                                  borderWidth: 1,
                                  borderColor: THEME.accentDark,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                accessibilityRole="button"
                                accessibilityLabel={`${task.title} Verify`}
                              >
                                <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: '#FFF' }}>VERIFY</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => handleSocialTask(task.id, task.reward, task.url, task.status)}
                                activeOpacity={0.8}
                                style={{ 
                                  paddingHorizontal: scale(12), 
                                  paddingVertical: verticalScale(6), 
                                  borderRadius: 12, 
                                  backgroundColor: THEME.text,
                                  borderWidth: 1,
                                  borderColor: THEME.textSecondary,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: THEME.bg }}>GO</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                    ))}
                </View>
             </View>

             {/* 3. Referral Milestones */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               padding: scale(20),
               marginBottom: verticalScale(20),
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <View style={{ marginBottom: verticalScale(15) }}>
                    <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>Referral Milestones</Text>
                    <Text style={{ fontSize: scale(11), color: THEME.textSecondary, marginTop: 4 }}>
                        * Valid referral: Active for 3+ consecutive days
                    </Text>
                </View>
                
                <View style={{ gap: verticalScale(12) }}>
                    {referralMilestones.map((milestone) => {
                        const progress = Math.min(validReferralsCount, milestone.target);
                        const isUnlocked = validReferralsCount >= milestone.target;
                        const isClaimed = milestone.status === 'completed';

                        return (
                            <View 
                                key={milestone.id}
                                style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: scale(12),
                                    borderRadius: 12,
                                    backgroundColor: 'rgba(0,0,0,0.03)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(0,0,0,0.05)'
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12), flex: 1 }}>
                                    <View style={{ 
                                        width: scale(40), 
                                        height: scale(40), 
                                        borderRadius: scale(10), 
                                        backgroundColor: THEME.bg, 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        ...Platform.select({
                                            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
                                            android: { elevation: 2 }
                                        })
                                    }}>
                                        <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                            <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></Path>
                                            <Circle cx="9" cy="7" r="4"></Circle>
                                            <Path d="M23 21v-2a4 4 0 0 0-3-3.87"></Path>
                                            <Path d="M16 3.13a4 4 0 0 1 0 7.75"></Path>
                                        </Svg>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{milestone.title}</Text>
                                        <Text style={{ fontSize: scale(12), color: THEME.accentDark, fontWeight: 'bold' }}>+{milestone.rewardDisplay} LSN</Text>
                                        <View style={{ marginTop: verticalScale(4), height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, width: '80%' }}>
                                            <View style={{ 
                                                height: '100%', 
                                                width: `${(progress / milestone.target) * 100}%`, 
                                                backgroundColor: THEME.accent, 
                                                borderRadius: 2 
                                            }} />
                                        </View>
                                        <Text style={{ fontSize: scale(10), color: THEME.textSecondary, marginTop: 2 }}>{progress}/{milestone.target}</Text>
                                    </View>
                                </View>
                                
                                {isClaimed ? (
                                    <View style={{ 
                                        width: scale(24), 
                                        height: scale(24), 
                                        borderRadius: scale(12), 
                                        backgroundColor: THEME.accent, 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: '#e5c27a'
                                    }}>
                                        <Svg width={scale(14)} height={scale(14)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                                            <Polyline points="20 6 9 17 4 12" />
                                        </Svg>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleClaimReferralMilestone(milestone.id, milestone.minReward, milestone.maxReward)}
                                        disabled={!isUnlocked}
                                        style={{ 
                                            paddingHorizontal: scale(12), 
                                            paddingVertical: verticalScale(6), 
                                            borderRadius: 12, 
                                            backgroundColor: isUnlocked ? THEME.accent : 'rgba(0,0,0,0.05)',
                                            borderWidth: 1,
                                            borderColor: isUnlocked ? THEME.accentDark : 'rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: isUnlocked ? '#FFF' : THEME.textSecondary }}>
                                            {isUnlocked ? 'CLAIM' : 'LOCKED'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
             </View>

             {/* 4. Airdrop Info */}
             <View style={{ 
               backgroundColor: 'rgba(212, 175, 55, 0.1)', 
               borderRadius: 20, 
               padding: scale(20),
               borderWidth: 1,
               borderColor: THEME.accent,
               borderStyle: 'dashed'
             }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(10) }}>
                    <Svg width={scale(24)} height={scale(24)} stroke={THEME.accentDark} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                        <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <Polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <Line x1="12" y1="22.08" x2="12" y2="12" />
                    </Svg>
                    <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.accentDark }}>{t('airdrop_eligibility')}</Text>
                </View>
                <Text style={{ fontSize: scale(13), color: THEME.text, lineHeight: scale(20) }}>
                    {t('airdrop_desc')}
                </Text>
             </View>

          </ScrollView>
        ) : activeTab === 'user' ? (
          <ScrollView 
            style={{ flex: 1, width: '100%' }} 
            contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
            showsVerticalScrollIndicator={false}
          >
             {/* 1. Profile Header Card */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 24, 
               padding: scale(16),
               marginBottom: verticalScale(10),
               alignItems: 'center',
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <View style={{ position: 'relative', marginBottom: verticalScale(10) }}>
                    <View style={{ 
                        width: scale(80), 
                        height: scale(80), 
                        borderRadius: scale(40), 
                        backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderWidth: 3,
                        borderColor: THEME.accent
                    }}>
                        <Text style={{ fontSize: scale(32), fontWeight: 'bold', color: THEME.accentDark }}>V</Text>
                    </View>
                </View>
                
                <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(2) }}>Vivek Gupta</Text>
                <Text style={{ fontSize: scale(13), color: THEME.textSecondary, marginBottom: verticalScale(12) }}>vivek.gupta@example.com</Text>
                
                <View style={{ flexDirection: 'row', gap: scale(10), flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Early Phase Badge - Clickable */}
                    <TouchableOpacity 
                        onPress={() => setShowEarlyPhaseInfo(!showEarlyPhaseInfo)}
                        style={{ 
                            paddingHorizontal: scale(12), 
                            paddingVertical: verticalScale(6), 
                            borderRadius: 20, 
                            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                            borderWidth: 1, 
                            borderColor: THEME.accent,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4
                        }}
                    >
                        <Svg width={12} height={12} viewBox="0 0 24 24" fill={THEME.accent} stroke={THEME.accent} strokeWidth={2}>
                             <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </Svg>
                        <Text style={{ fontSize: scale(12), fontWeight: '700', color: THEME.accentDark }}>Early Phase Member</Text>
                    </TouchableOpacity>
                </View>

                {/* Early Phase Info - Conditional */}
                {showEarlyPhaseInfo && (
                    <View style={{ 
                        marginTop: verticalScale(15), 
                        padding: scale(12), 
                        backgroundColor: 'rgba(229, 194, 122, 0.1)', 
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(229, 194, 122, 0.3)',
                        width: '100%'
                    }}>
                        <Text style={{ fontSize: scale(12), color: THEME.textSecondary, textAlign: 'center', lineHeight: scale(18) }}>
                            <Text style={{ fontWeight: 'bold', color: THEME.accentDark }}>Early Phase Bonus:</Text> All early members will receive exclusive LSN airdrops during the LSN distribution phase. Keep mining! 🚀
                        </Text>
                    </View>
                )}
             </View>

             {/* 2. Menu Options */}
             <View style={{ gap: verticalScale(15) }}>
                {[
                    { icon: 'User', label: t('menu_personal_info'), sub: t('menu_personal_info_sub') },
                    { icon: 'Shield', label: t('menu_security'), sub: t('menu_security_sub') },
                    { icon: 'CreditCard', label: t('menu_wallet'), sub: t('menu_wallet_sub') },
                    { icon: 'HelpCircle', label: t('menu_help'), sub: t('menu_help_sub') },
                    { icon: 'Globe', label: t('menu_language'), sub: t('menu_language_sub') },
                ].map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => handleMenuPress(item.label)}
                        style={{ 
                        backgroundColor: THEME.bg, 
                        borderRadius: 16, 
                        padding: scale(16),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4} },
                            android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
                        })
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
                            <View style={{ 
                                width: scale(40), 
                                height: scale(40), 
                                borderRadius: scale(12), 
                                backgroundColor: 'rgba(0,0,0,0.04)', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                {/* Simple Icon Placeholder Logic */}
                                <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    {item.icon === 'User' && <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />}
                                    {item.icon === 'User' && <Circle cx="12" cy="7" r="4" />}
                                    
                                    {item.icon === 'Shield' && <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                                    
                                    {item.icon === 'CreditCard' && <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />}
                                    {item.icon === 'CreditCard' && <Line x1="1" y1="10" x2="23" y2="10" />}
                                    
                                    {item.icon === 'Globe' && <Circle cx="12" cy="12" r="10" />}
                                    {item.icon === 'Globe' && <Line x1="2" y1="12" x2="22" y2="12" />}
                                    
                                    {item.icon === 'HelpCircle' && <Circle cx="12" cy="12" r="10" />}
                                    {item.icon === 'HelpCircle' && <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />}
                                    {item.icon === 'HelpCircle' && <Line x1="12" y1="17" x2="12.01" y2="17" />}
                                </Svg>
                            </View>
                            <View>
                                <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{item.label}</Text>
                                <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{item.sub}</Text>
                            </View>
                        </View>
                        <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                            <Polyline points="9 18 15 12 9 6" />
                        </Svg>
                    </TouchableOpacity>
                ))}
             </View>

             {/* 3. Logout Button */}
             <TouchableOpacity 
                 onPress={handleLogout}
                 style={{ 
                 marginTop: verticalScale(30),
                 backgroundColor: 'rgba(255, 0, 0, 0.05)',
                 borderRadius: 16,
                 padding: scale(16),
                 flexDirection: 'row',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: scale(10),
                 borderWidth: 1,
                 borderColor: 'rgba(255, 0, 0, 0.1)'
             }}>
                 <Svg width={scale(20)} height={scale(20)} stroke="#D32F2F" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                     <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                     <Polyline points="16 17 21 12 16 7" />
                     <Line x1="21" y1="12" x2="9" y2="12" />
                 </Svg>
                 <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: '#D32F2F' }}>{t('logout')}</Text>
             </TouchableOpacity>

             <Text style={{ textAlign: 'center', marginTop: verticalScale(20), color: THEME.textSecondary, fontSize: scale(12) }}>
                 {t('version')} 1.0.0 (Build 2025.12.10)
             </Text>

          </ScrollView>
        ) : activeTab === 'explore' ? (
          <ScrollView 
            style={{ flex: 1, width: '100%' }} 
            contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
            showsVerticalScrollIndicator={false}
          >
             {/* 1. Featured News Banner */}
             <View style={{ 
               backgroundColor: THEME.bg, 
               borderRadius: 20, 
               marginBottom: verticalScale(20),
               overflow: 'hidden',
               ...Platform.select({
                  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                  android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
               })
             }}>
                <View style={{ height: verticalScale(150), backgroundColor: THEME.accent, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {/* Abstract Background Pattern */}
                    <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
                        <Defs>
                            <SvgLinearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
                                <Stop offset="0" stopColor={THEME.accent} />
                                <Stop offset="1" stopColor={THEME.accentDark} />
                            </SvgLinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#bannerGrad)" />
                        <Circle cx="10%" cy="20%" r="50" fill="rgba(255,255,255,0.1)" />
                        <Circle cx="90%" cy="80%" r="80" fill="rgba(255,255,255,0.1)" />
                        <Path d="M0 100 Q 150 50 300 100 T 600 100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                    </Svg>
                    
                    <View style={{ padding: scale(20), alignItems: 'center' }}>
                        <View style={{ paddingHorizontal: scale(10), paddingVertical: verticalScale(4), backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginBottom: verticalScale(10) }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: scale(10) }}>{t('featured_news')}</Text>
                        </View>
                        <Text style={{ color: '#FFF', fontSize: scale(20), fontWeight: 'bold', textAlign: 'center', marginBottom: verticalScale(5) }}>{t('beta_live')}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: scale(12), textAlign: 'center' }}>{t('beta_desc')}</Text>
                    </View>
                </View>
             </View>

             {/* 2. Global Network Stats */}
             <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('network_stats')}</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(12), marginBottom: verticalScale(25) }}>
                {/* Primary Stats (Large) */}
                {[
                    { label: t('total_miners'), value: formatNumber(totalMiners), icon: 'Users' },
                    { label: t('lsn_mined'), value: Math.floor(lsnMined).toLocaleString(), icon: 'Database' },
                ].map((stat, index) => (
                    <View key={`large-${index}`} style={{ 
                        width: '48%', 
                        backgroundColor: THEME.bg, 
                        borderRadius: 16, 
                        padding: scale(15),
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4} },
                            android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
                        })
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: verticalScale(8) }}>
                            <Svg width={scale(16)} height={scale(16)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                {stat.icon === 'Users' && <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                                {stat.icon === 'Users' && <Circle cx="9" cy="7" r="4" />}
                                {stat.icon === 'Users' && <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />}
                                {stat.icon === 'Users' && <Path d="M16 3.13a4 4 0 0 1 0 7.75" />}

                                {stat.icon === 'Database' && <Ellipse cx="12" cy="5" rx="9" ry="3" />}
                                {stat.icon === 'Database' && <Path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />}
                                {stat.icon === 'Database' && <Path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />}
                            </Svg>
                            <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{stat.label}</Text>
                        </View>
                        <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>{stat.value}</Text>
                    </View>
                ))}

                {/* Secondary Stats (Small) */}
                {[
                    { label: 'Read', value: 'Whitepaper', icon: 'FileText' },
                    { label: 'Legal', value: 'Privacy Policy', icon: 'Shield' },
                    { label: 'Legal', value: 'Terms of Service', icon: 'File' },
                    { label: 'About', value: 'Core Team', icon: 'Users' },
                ].map((stat, index) => (
                    <View key={`small-${index}`} style={{ 
                        width: '48%', 
                        backgroundColor: THEME.bg, 
                        borderRadius: 12, 
                        padding: scale(10),
                        justifyContent: 'center',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }
                        })
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) }}>
                            <Svg width={scale(14)} height={scale(14)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                {stat.icon === 'FileText' && <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
                                {stat.icon === 'FileText' && <Polyline points="14 2 14 8 20 8" />}
                                {stat.icon === 'FileText' && <Line x1="16" y1="13" x2="8" y2="13" />}
                                {stat.icon === 'FileText' && <Line x1="16" y1="17" x2="8" y2="17" />}
                                {stat.icon === 'FileText' && <Polyline points="10 9 9 9 8 9" />}

                                {stat.icon === 'Shield' && <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}

                                {stat.icon === 'File' && <Path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />}
                                {stat.icon === 'File' && <Polyline points="13 2 13 9 20 9" />}

                                {stat.icon === 'Users' && <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                                {stat.icon === 'Users' && <Circle cx="9" cy="7" r="4" />}
                                {stat.icon === 'Users' && <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />}
                                {stat.icon === 'Users' && <Path d="M16 3.13a4 4 0 0 1 0 7.75" />}
                            </Svg>
                            <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>{stat.label}</Text>
                        </View>
                        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.text }} numberOfLines={1} adjustsFontSizeToFit>{stat.value}</Text>
                    </View>
                ))}
             </View>

             {/* 3. Recent Updates */}
             <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('recent_updates')}</Text>
             <View style={{ 
                 backgroundColor: THEME.bg, 
                 borderRadius: 16, 
                 padding: scale(30),
                 alignItems: 'center',
                 justifyContent: 'center',
                 ...Platform.select({
                     ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4} },
                     android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
                 })
             }}>
                <Svg width={scale(48)} height={scale(48)} stroke={THEME.textSecondary} strokeWidth={1.5} fill="none" viewBox="0 0 24 24" style={{ marginBottom: verticalScale(15), opacity: 0.6 }}>
                    <Circle cx="12" cy="12" r="10" />
                    <Polyline points="12 6 12 12 16 14" />
                </Svg>
                <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(8) }}>Updates Coming Soon</Text>
                <Text style={{ fontSize: scale(13), color: THEME.textSecondary, textAlign: 'center', lineHeight: scale(18) }}>
                    We are working on some exciting new features.{'\n'}Stay tuned for announcements!
                </Text>
             </View>

          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: THEME.text, fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              {activeTab}
            </Text>
            <Text style={{ color: THEME.textSecondary, marginTop: 10, fontSize: 16 }}>Coming Soon</Text>
          </View>
        )}
        </Animated.View>
      </View>

      {/* --- MODALS --- */}
      {/* AD SIMULATION MODAL */}
      {isAdWatching && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Watching Ad...</Text>
            <Text style={{ marginBottom: 20 }}>Please wait 3 seconds</Text>
            <ActivityIndicator size="large" color={THEME.accent} />
          </View>
        </View>
      )}

      {/* BONUS MODAL - LOCKED: Logic & UI Finalized (Daily & Weekly Rewards) */}
      {activeModal === 'bonus' && (
        <TouchableOpacity 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, justifyContent: 'center', alignItems: 'center' }]}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableWithoutFeedback>
            <Animated.View style={{ 
              width: '85%', 
              backgroundColor: THEME.bg, 
              borderRadius: 20, 
              padding: 20, 
              alignItems: 'center', 
              elevation: 10,
              transform: [{ scale: modalScaleAnim }, { translateY: modalScaleAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
              // Active Border Style
              borderWidth: 2,
              borderColor: '#e5c27a',
              shadowColor: '#e5c27a',
              shadowOpacity: 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}>
              {/* Close Icon */}
              <TouchableOpacity 
                style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}
                onPress={() => setActiveModal(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={THEME.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Line x1="18" y1="6" x2="6" y2="18" />
                  <Line x1="6" y1="6" x2="18" y2="18" />
                </Svg>
              </TouchableOpacity>

              <Text style={{ fontSize: 20, fontWeight: 'bold', color: THEME.text, marginBottom: 20, marginTop: 10 }}>BONUS REWARDS</Text>
              
              <Text style={{ color: THEME.textSecondary, textAlign: 'center', marginBottom: 5 }}>Daily Reward (+10 ~ 30 LSN)</Text>
              <NeuButton 
                onPress={() => {
                  if (isDailyBonusAvailable) {
                    triggerAd('daily_bonus');
                  } else {
                    showInfoAlert(t('daily_bonus'), t('already_claimed_msg'));
                  }
                }}
                size={scale(50)} 
                width={scale(200)} 
                rounded 
                style={isDailyBonusAvailable ? styles.balanceActive : undefined}
              >
                <Text style={{ fontWeight: 'bold', color: THEME.text }}>
                  {isDailyBonusAvailable ? t('claim_daily_bonus') : t('claimed')}
                </Text>
              </NeuButton>

              <View style={{ height: 25 }} />

              <Text style={{ color: THEME.textSecondary, textAlign: 'center', marginBottom: 5 }}>Weekly Reward (+100 ~ 300 LSN)</Text>
              <NeuButton 
                onPress={() => {
                  if (miningStreak >= 7) {
                    triggerAd('weekly_bonus');
                  } else {
                    showInfoAlert("Weekly Bonus", `Keep mining daily! Current Streak: ${miningStreak}/7 days`);
                  }
                }} 
                size={scale(50)} 
                width={scale(200)} 
                rounded
                style={miningStreak >= 7 ? styles.balanceActive : undefined}
              >
                <Text style={{ fontWeight: 'bold', color: THEME.text }}>
                  {miningStreak >= 7 ? "Claim Weekly Bonus" : `Locked (${miningStreak}/7)`}
                </Text>
              </NeuButton>

              <Text style={{ 
                color: THEME.textSecondary, 
                fontSize: 11, 
                textAlign: 'center', 
                marginTop: 15, 
                paddingHorizontal: 10,
                opacity: 0.8,
                lineHeight: 16
              }}>
                * Maintain a 7-day mining streak to unlock the Weekly Bonus. Missing a day resets your streak!
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      )}

      {/* BOOST MODAL */}
      {activeModal === 'boost' && (
        <TouchableOpacity 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, justifyContent: 'center', alignItems: 'center' }]}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableWithoutFeedback>
            <Animated.View style={{ 
              width: '85%', 
              backgroundColor: THEME.bg, 
              borderRadius: 20, 
              padding: 20, 
              alignItems: 'center', 
              elevation: 10,
              transform: [{ scale: modalScaleAnim }, { translateY: modalScaleAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
              // Active Border Style
              borderWidth: 2,
              borderColor: '#e5c27a',
              shadowColor: '#e5c27a',
              shadowOpacity: 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}>
              {/* Close Icon */}
              <TouchableOpacity 
                style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}
                onPress={() => setActiveModal(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={THEME.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Line x1="18" y1="6" x2="6" y2="18" />
                  <Line x1="6" y1="6" x2="18" y2="18" />
                </Svg>
              </TouchableOpacity>

              <Text style={{ fontSize: 20, fontWeight: 'bold', color: THEME.text, marginBottom: 10 }}>{t('boost_mining')}</Text>
              
              <Text style={{ color: THEME.accent, fontWeight: 'bold', marginBottom: 20 }}>
                Boosts used today: {boostsUsedToday}/5
              </Text>
              
              <NeuButton 
                onPress={() => {
                  if (!boostActive) triggerAd('boost');
                }} 
                size={scale(50)} 
                width={scale(120)} 
                rounded 
                style={[
                  { marginBottom: 10 },
                  boostActive && styles.balanceActive
                ]}
              >
                <Text style={{ fontWeight: 'bold', color: THEME.text }}>
                  {boostActive 
                    ? `${String(Math.floor(boostTimeLeft / 60)).padStart(2, '0')}:${String(boostTimeLeft % 60).padStart(2, '0')}` 
                    : "BOOST 2X"}
                </Text>
              </NeuButton>

              <Text style={{ color: THEME.textSecondary, textAlign: 'center', marginTop: 15, fontSize: 12 }}>
                {t('boost_desc')}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNavContent}>
          <View style={styles.bottomBar}>
            {/* 1. Home UI Icon */}
            <NeuButton 
              size={scale(44)} 
              rounded 
              onPress={() => setActiveTab('home')}
              style={activeTab !== 'home' ? flatStyle : undefined}
            >
              <Svg width={22} height={22} stroke={activeTab === 'home' ? THEME.accent : THEME.text} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <Polyline points="9 22 9 12 15 12 15 22" />
              </Svg>
            </NeuButton>

            {/* 2. Rewards UI Icon (Gift) */}
            <NeuButton 
              size={scale(44)} 
              rounded 
              onPress={() => setActiveTab('rewards')}
              style={activeTab !== 'rewards' ? flatStyle : undefined}
            >
              <Svg width={22} height={22} stroke={activeTab === 'rewards' ? THEME.accent : THEME.text} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <Polyline points="20 12 20 22 4 22 4 12" />
                <Rect x="2" y="7" width="20" height="5" />
                <Line x1="12" y1="22" x2="12" y2="7" />
                <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </Svg>
            </NeuButton>

            {/* 3. Referral UI Icon (Users) */}
            <NeuButton 
              size={scale(44)} 
              rounded 
              onPress={() => setActiveTab('referral')}
              style={activeTab !== 'referral' ? flatStyle : undefined}
            >
              <Svg width={22} height={22} stroke={activeTab === 'referral' ? THEME.accent : THEME.text} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <Circle cx="9" cy="7" r="4" />
                <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </Svg>
            </NeuButton>

            {/* 4. Explore UI Icon (Compass) */}
            <NeuButton 
              size={scale(44)} 
              rounded 
              onPress={() => setActiveTab('explore')}
              style={activeTab !== 'explore' ? flatStyle : undefined}
            >
              <Svg width={22} height={22} stroke={activeTab === 'explore' ? THEME.accent : THEME.text} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="10" />
                <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </Svg>
            </NeuButton>

            {/* 5. User UI Icon (Person) */}
            <NeuButton 
              size={scale(44)} 
              rounded 
              onPress={() => setActiveTab('user')}
              style={activeTab !== 'user' ? flatStyle : undefined}
            >
              <Svg width={22} height={22} stroke={activeTab === 'user' ? THEME.accent : THEME.text} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </Svg>
            </NeuButton>
          </View>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('select_language')}</Text>
            <ScrollView style={{ maxHeight: 300, width: '100%' }} showsVerticalScrollIndicator={false}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.languageOptionActive
                  ]}
                  onPress={() => {
                    setLanguage(lang.code as any);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    language === lang.code && styles.languageNameActive
                  ]}>
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      <Modal
        visible={customAlert.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '80%', padding: 25 }]}>
            <Text style={[styles.modalTitle, { marginBottom: 10, textAlign: 'center' }]}>{customAlert.title}</Text>
            <Text style={{ fontSize: 16, color: THEME.text, textAlign: 'center', marginBottom: 25, lineHeight: 22 }}>
              {customAlert.message}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, width: '100%' }}>
              {customAlert.type === 'confirm' && (
                <TouchableOpacity
                  style={[styles.modalCloseButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: THEME.textSecondary, flex: 1, marginTop: 0 }]}
                  onPress={closeAlert}
                >
                  <Text style={[styles.modalCloseText, { color: THEME.textSecondary }]}>{customAlert.cancelText || 'Cancel'}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.modalCloseButton, { flex: 1, marginTop: 0, backgroundColor: THEME.accent }]}
                onPress={() => {
                  if (customAlert.onConfirm) customAlert.onConfirm();
                  closeAlert();
                }}
              >
                <Text style={[styles.modalCloseText, { color: '#FFF' }]}>
                  {customAlert.type === 'confirm' ? (customAlert.confirmText || 'Yes') : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// --- PROFESSIONAL NEUMORPHIC BUTTON ENGINE ---
interface NeuButtonProps {
  children?: React.ReactNode;
  size?: number;
  width?: number;
  height?: number;
  onPress?: () => void;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
}

const NeuButton = ({ children, size = 50, width, height, onPress, rounded = false, style }: NeuButtonProps) => {
  const w = width || size;
  const h = height || size;
  const r = rounded ? w / 2 : 14; 

  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8
    }).start();
  };

  const handlePressOut = () => {
    if (onPress) onPress();
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: w, height: h }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], width: w, height: h }}>
        <View style={[{
          width: w, height: h,
          borderRadius: r,
          backgroundColor: THEME.bg,
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 6, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 10, // Increased elevation
              shadowColor: '#5a4a3a', // Darker shadow color for visibility
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.5)', // Subtle highlight border
            }
          }),
        }, style]}>
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingHorizontal: scale(12),
    justifyContent: 'space-between', 
    paddingBottom: 10
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    marginTop: verticalScale(2),
    zIndex: 100, // Increased zIndex to ensure it sits above background lines
    position: 'relative', // Ensure zIndex works
  },
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(12),
    zIndex: 101, // Extra zIndex for container
  },
  balanceDisplay: {
    backgroundColor: THEME.bg,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 102, // Highest zIndex for the card itself
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
        shadowColor: '#5a4a3a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
      }
    }),
  },
  balanceActive: {
    borderWidth: 2,
    borderColor: '#e5c27a',
    shadowColor: '#e5c27a',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    ...Platform.select({
      android: {
        elevation: 8,
      }
    }),
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // Stage (Main Area)
  stage: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    zIndex: 1, // Ensure stage content (like power button) sits above bottom nav if they overlap
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical alignment
    paddingHorizontal: scale(12),
    gap: scale(8), // Reduced gap slightly to fit 3 items
    zIndex: 50, // Ensure it sits above the hub lines
    elevation: 50, // Android elevation to ensure it sits above lines
  },
  btnText: {
    fontSize: 13, // Reduced from 14 to fit BOOST
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: 0.8,
  },
  centerHub: {
    width: scale(240),
    height: scale(240),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLogoButton: {
    backgroundColor: THEME.bg,
  },
  mainLogoActive: {
    shadowColor: '#e5c27a',
    shadowOpacity: 0.85,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 10 },
    ...Platform.select({
      android: {
        elevation: 24,
      }
    }),
  },
  onionImage: {
    width: scale(100),
    height: scale(100),
  },
  onionImageFull: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
  },

  // Bottom Nav
  bottomNavContainer: {
    // keep container padding minimal so it doesn't overlap content; only inner bar height increased
    paddingVertical: verticalScale(5),
    paddingBottom: verticalScale(10),
    backgroundColor: THEME.bg,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute 5 items evenly
    backgroundColor: THEME.bg,
    // slightly taller inner bar for better touch targets and spacing (only this is increased)
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12), // Reduced padding to fit 5 items
    borderRadius: 30,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
        shadowColor: '#5a4a3a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
      }
    }),
  },
  // bottomBarLeft and bottomBarRight removed as they are no longer used
  bottomFabWrap: {
    position: 'absolute',
    // move FAB up slightly to remain visually centered with the taller inner bar
    top: -verticalScale(55),
    alignSelf: 'center',
  },
  powerButtonTransparent: {
    backgroundColor: THEME.bg, // Changed from transparent to fix Android elevation artifact
    borderWidth: 1.5,
    borderColor: THEME.text,
    // Removed shadow to keep the power button flat
    ...Platform.select({
      android: {
        elevation: 0,
      }
    }),
  },
  powerButtonActive: {
    borderColor: '#e5c27a',
    borderWidth: 3,
    // Removed active shadow to keep the power button flat even when active
    ...Platform.select({
      android: {
        elevation: 0,
      }
    }),
  },
  activeDot: {
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    backgroundColor: THEME.text,
    opacity: 0.85
  },

  // Language Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: THEME.bg,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  languageOptionActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    color: THEME.text,
    flex: 1,
  },
  languageNameActive: {
    fontWeight: 'bold',
    color: THEME.accentDark,
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.accent,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: THEME.text,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: THEME.bg,
    fontWeight: 'bold',
    fontSize: 16,
  }
});