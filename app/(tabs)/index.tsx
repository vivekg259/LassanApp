/**
 * Screen Type: Route
 * Owns: Main mining interface with circuit animation, multi-tab content switcher (Home, Explore, Referrals, Rewards, User)
 * Scope: Container
 * Reuse: Not reusable outside routing
 *
 * UI DESIGN FINAL LOCKED - DO NOT MODIFY VISUAL ELEMENTS WITHOUT EXPLICIT INSTRUCTION
 * Locked State: Motherboard Circuit Design (Responsive), 7 Vertical Spines, Animated Transitions,
 * Neumorphic Buttons, Layering (z-index), and specific Color Theme.
 * Referral Tab: LOCKED (UI, Realtime Logic, Notify System, Responsive Scaling).
 * Validated on: iOS (iPhone 12), Android, Web (Pixel 7), Tablets.
 */
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BottomNavigation, type TabKey } from '@/src/components/BottomNav';
import { ExploreTab } from '@/src/components/ExploreTab';
import { AppHeader } from '@/src/components/Header';
import { HomeBottomActions } from '@/src/components/HomeBottomActions';
import { HomeCenterHub } from '@/src/components/HomeCenterHub';
import { HomeCircuitBackground } from '@/src/components/HomeCircuitBackground';
import { HomeTopActions } from '@/src/components/HomeTopActions';
import { BonusModal } from '@/src/components/modals/BonusModal';
import { BoostModal } from '@/src/components/modals/BoostModal';
import { CustomAlertModal } from '@/src/components/modals/CustomAlertModal';
import { LanguageSelectionModal } from '@/src/components/modals/LanguageSelectionModal';
import { ReferralTab } from '@/src/components/ReferralTab';
import { RewardsTab } from '@/src/components/RewardsTab';
import { UserTab } from '@/src/components/UserTab';
import { THEME } from '@/src/constants/theme';

import { formatNumber } from '@/src/hooks/useHomeScreen';
import { useHomeContainer } from '@/src/screens/home/useHomeContainer';
import { scale, homeStyles as styles, verticalScale } from '@/src/styles/home.styles';

// Web compatibility: Gradients via url(#id) can be flaky on some web renderers
const circuitStroke = Platform.OS === 'web' ? THEME.accent : "url(#circuitGrad)";
const hubStroke = Platform.OS === 'web' ? THEME.accent : "url(#hubGrad)";

export default function HomeScreen() {
  const {
    // Context
    t,
    setLanguage,
    language,
    insets,
    
    // Dimensions
    width,
    height,
    dynamicScale,
    dynamicVerticalScale,
    
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
  } = useHomeContainer();

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
            t={(key) => t(key as Parameters<typeof t>[0])}
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
