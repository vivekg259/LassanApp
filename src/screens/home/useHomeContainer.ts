/**
 * Screen-level hook for HomeScreen container
 * Wraps useHomeScreen for screen ownership indirection
 * Returns normalized { state, actions, flags } shape
 */
import { useHomeScreen } from '@/src/hooks/useHomeScreen';
import { miningDomain } from '../../domains/mining';
import { rewardsDomain } from '../../domains/rewards';

export function useHomeContainer() {
  const home = useHomeScreen({
    onPowerPress: (params) => miningDomain.start(params),
    onTick: (params) => miningDomain.claimTick(params),
    onClaimDaily: (params) => rewardsDomain.claimDaily(params),
    onGrantReward: (params) => rewardsDomain.grantReward(params),
  });

  return {
    state: {
      // Context
      router: home.router,
      t: home.t,
      language: home.language,
      setLanguage: home.setLanguage,
      insets: home.insets,

      // Dimensions
      width: home.width,
      height: home.height,
      dynamicScale: home.dynamicScale,
      dynamicVerticalScale: home.dynamicVerticalScale,
      scale: home.scale,
      verticalScale: home.verticalScale,

      // Core State
      balance: home.balance,
      powerOn: home.powerOn,
      timeLeft: home.timeLeft,
      activeTab: home.activeTab,
      setActiveTab: home.setActiveTab,
      activeModal: home.activeModal,
      setActiveModal: home.setActiveModal,
      showLanguageModal: home.showLanguageModal,
      setShowLanguageModal: home.setShowLanguageModal,

      // Network Stats
      totalMiners: home.totalMiners,
      lsnMined: home.lsnMined,

      // Boost State
      boostActive: home.boostActive,
      boostTimeLeft: home.boostTimeLeft,
      boostsUsedToday: home.boostsUsedToday,

      // Streak State
      miningStreak: home.miningStreak,

      // Referral State
      referralCode: home.referralCode,
      referrals: home.referrals,
      now: home.now,
      baseRate: home.baseRate,
      activeReferralsCount: home.activeReferralsCount,
      validReferralsCount: home.validReferralsCount,
      referralBoostPercentage: home.referralBoostPercentage,
      activeMiningRate: home.activeMiningRate,
      finalMiningRate: home.finalMiningRate,

      // Rewards State
      socialTasks: home.socialTasks,
      referralMilestones: home.referralMilestones,

      // Alert State
      customAlert: home.customAlert,

      // Animation State
      fadeAnim: home.fadeAnim,
      modalScaleAnim: home.modalScaleAnim,
      breatheAnim: home.breatheAnim,

      // Layout
      topBundleY: home.topBundleY,
      bottomBundleY: home.bottomBundleY,
      leftBundleX: home.leftBundleX,
      leftBundleXNudged: home.leftBundleXNudged,
      rightBundleXNudged: home.rightBundleXNudged,
      leftBundleYDisplay: home.leftBundleYDisplay,
      rightBundleYDisplay: home.rightBundleYDisplay,
      screenLeftEdgeSVG: home.screenLeftEdgeSVG,
      screenRightEdgeSVG: home.screenRightEdgeSVG,
      spineTop: home.spineTop,
      spineBottom: home.spineBottom,

      // Refs
      leftBtnRef: home.leftBtnRef,
      rightBtnRef: home.rightBtnRef,
      headerRef: home.headerRef,
      hubRef: home.hubRef,
      hubOriginRef: home.hubOriginRef,
      headerInnerRef: home.headerInnerRef,
      powerBtnRef: home.powerBtnRef,

      // Computed (displayed values)
      powerColor: home.powerColor,
      currentRate: home.currentRate,
      flatStyle: home.flatStyle,
    },

    actions: {
      handleCopyCode: home.handleCopyCode,
      handleNotify: home.handleNotify,
      handleShareInvite: home.handleShareInvite,
      handleLogout: home.handleLogout,
      handleMenuPress: home.handleMenuPress,
      handleSocialTask: home.handleSocialTask,
      handleClaimReferralMilestone: home.handleClaimReferralMilestone,
      handlePowerPress: home.handlePowerPress,
      handleBoostPress: home.handleBoostPress,
      triggerAd: home.triggerAd,
      measureButtons: home.measureButtons,
      closeAlert: home.closeAlert,
      showInfoAlert: home.showInfoAlert,
    },

    flags: {
      isTablet: home.isTablet,
      isAdWatching: home.isAdWatching,
      isDailyBonusAvailable: home.isDailyBonusAvailable,
    },
  };
}
