import React, { useEffect, useRef, useState } from 'react';
/**
 * UI DESIGN FINAL LOCKED - DO NOT MODIFY VISUAL ELEMENTS WITHOUT EXPLICIT INSTRUCTION
 * Locked State: Motherboard Circuit Design (Responsive), 7 Vertical Spines, Animated Transitions,
 * Neumorphic Buttons, Layering (z-index), and specific Color Theme.
 * Referral Tab: LOCKED (UI, Realtime Logic, Notify System, Responsive Scaling).
 * Validated on: iOS (iPhone 12), Android, Web (Pixel 7), Tablets.
 */
import { AppHeader } from '@/app/(tabs)/Home/components/AppHeader';
import { ExploreTab } from '@/app/(tabs)/Home/components/ExploreTab';
import { HomeBottomActions } from '@/app/(tabs)/Home/components/HomeBottomActions';
import { HomeCenterHub } from '@/app/(tabs)/Home/components/HomeCenterHub';
import { HomeCircuitBackground } from '@/app/(tabs)/Home/components/HomeCircuitBackground';
import { HomeTopActions } from '@/app/(tabs)/Home/components/HomeTopActions';
import { ReferralTab } from '@/app/(tabs)/Home/components/ReferralTab';
import { RewardsTab } from '@/app/(tabs)/Home/components/RewardsTab';
import { UserTab } from '@/app/(tabs)/Home/components/UserTab';
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
import { BonusModal } from '@/app/components/modals/BonusModal';
import { BoostModal } from '@/app/components/modals/BoostModal';
import { CustomAlertModal } from '@/app/components/modals/CustomAlertModal';
import { LanguageSelectionModal } from '@/app/components/modals/LanguageSelectionModal';
import { BottomNavigation, type TabKey } from '@/app/components/tabs/BottomNavigation';
import { THEME } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;


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
        <HomeCircuitBackground
          width={width}
          height={height}
          powerOn={powerOn}
          spineTop={spineTop}
          spineBottom={spineBottom}
          dynamicScale={dynamicScale}
          dynamicVerticalScale={dynamicVerticalScale}
          theme={THEME}
          circuitStroke={circuitStroke}
        />
      )}

      {/* --- HEADER --- */}
      <AppHeader
        styles={styles}
        verticalScale={verticalScale}
        powerOn={powerOn}
        activeTab={activeTab as 'home' | 'referral' | 'explore' | 'user' | 'rewards'}
        balance={balance}
        t={t}
        headerRef={headerRef}
        headerInnerRef={headerInnerRef}
        onMeasure={measureButtons}
      />

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
            <HomeTopActions
              styles={styles}
              scale={scale}
              verticalScale={verticalScale}
              powerOn={powerOn}
              currentRate={currentRate}
              timeLeft={timeLeft}
            />

            {/* CENTER HUB */}
            <HomeCenterHub
              styles={styles}
              scale={scale}
              dynamicScale={dynamicScale}
              theme={THEME}
              hubStroke={hubStroke}
              powerOn={powerOn}
              breatheAnim={breatheAnim}
              leftBundleX={leftBundleX}
              leftBundleXNudged={leftBundleXNudged}
              rightBundleXNudged={rightBundleXNudged}
              topBundleY={topBundleY}
              leftBundleYDisplay={leftBundleYDisplay}
              rightBundleYDisplay={rightBundleYDisplay}
              screenLeftEdgeSVG={screenLeftEdgeSVG}
              screenRightEdgeSVG={screenRightEdgeSVG}
              hubRef={hubRef}
              hubOriginRef={hubOriginRef}
              onMeasure={measureButtons}
              activeImageSource={require('@/assets/images/onion-icon.png')}
              inactiveImageSource={require('@/assets/images/onion-inactive.png')}
            />

            {/* Bottom Actions */}
            <HomeBottomActions
              styles={styles}
              scale={scale}
              verticalScale={verticalScale}
              powerOn={powerOn}
              t={t}
              powerColor={powerColor}
              leftBtnRef={leftBtnRef}
              rightBtnRef={rightBtnRef}
              powerBtnRef={powerBtnRef}
              onMeasure={measureButtons}
              onPressBonus={() => {
                if (!powerOn) {
                  showInfoAlert("Mining Inactive", "Please activate the mining session first to access Bonus Rewards.");
                  return;
                }
                setActiveModal('bonus');
              }}
              onPressPower={handlePowerPress}
              onPressBoost={handleBoostPress}
            />
          </>
        ) : activeTab === 'referral' ? (
          <ReferralTab
          scale={scale}
          verticalScale={verticalScale}
          referralCode={referralCode}
          handleCopyCode={handleCopyCode}
          handleShareInvite={handleShareInvite}
          handleNotify={handleNotify}
          baseRate={baseRate}
          activeReferralsCount={activeReferralsCount}
          referralBoostPercentage={referralBoostPercentage}
          activeMiningRate={activeMiningRate}
          referrals={referrals}
          now={now}
          t={t}
          />
        ) : activeTab === 'rewards' ? (
          <RewardsTab
            scale={scale}
            verticalScale={verticalScale}
            miningStreak={miningStreak}
            socialTasks={socialTasks}
            handleSocialTask={handleSocialTask}
            referralMilestones={referralMilestones}
            validReferralsCount={validReferralsCount}
            handleClaimReferralMilestone={handleClaimReferralMilestone}
            t={t}
          />
        ) : activeTab === 'user' ? (
          <UserTab
          scale={scale}
          verticalScale={verticalScale}
          t={t}
          handleMenuPress={handleMenuPress}
          handleLogout={handleLogout}
          />
        ) : activeTab === 'explore' ? (
          <ExploreTab
          scale={scale}
          verticalScale={verticalScale}
          totalMiners={totalMiners}
          lsnMined={lsnMined}
          formatNumber={formatNumber}
          t={t}
          />
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

      <BonusModal
        styles={styles}
        visible={activeModal === 'bonus'}
        onClose={() => setActiveModal(null)}
        modalScaleAnim={modalScaleAnim}
        scale={scale}
        isDailyBonusAvailable={isDailyBonusAvailable}
        miningStreak={miningStreak}
        triggerAd={triggerAd}
        showInfoAlert={showInfoAlert}
        t={t}
      />

      <BoostModal
        styles={styles}
        visible={activeModal === 'boost'}
        onClose={() => setActiveModal(null)}
        modalScaleAnim={modalScaleAnim}
        t={t}
        boostsUsedToday={boostsUsedToday}
        boostActive={boostActive}
        boostTimeLeft={boostTimeLeft}
        scale={scale}
        triggerAd={triggerAd}
      />

      {/* --- BOTTOM NAVIGATION --- */}
      <BottomNavigation
        styles={styles}
        scale={scale}
        activeTab={activeTab as TabKey}
        onSelectTab={(tab) => setActiveTab(tab)}
        inactiveButtonStyle={flatStyle}
      />

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        styles={styles}
        visible={showLanguageModal}
        language={language}
        setLanguage={setLanguage}
        onClose={() => setShowLanguageModal(false)}
        t={t}
      />

      {/* Custom Alert Modal */}
      <CustomAlertModal
        styles={styles}
        visible={customAlert.visible}
        title={customAlert.title}
        message={customAlert.message}
        type={customAlert.type}
        confirmText={customAlert.confirmText}
        cancelText={customAlert.cancelText}
        onConfirm={customAlert.onConfirm}
        onClose={closeAlert}
      />

    </View>
  );
}

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