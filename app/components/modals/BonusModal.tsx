import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { NeuButton } from '@/app/(tabs)/Home/components/NeuButton';
import { THEME } from '@/constants/theme';

type Props = {
  styles: any;
  visible: boolean;
  onClose: () => void;
  modalScaleAnim: any;
  scale: (size: number) => number;
  isDailyBonusAvailable: boolean;
  miningStreak: number;
  triggerAd: (action: 'daily_bonus' | 'weekly_bonus') => void;
  showInfoAlert: (title: string, message: string) => void;
  t: (
    key:
      | 'daily_bonus'
      | 'already_claimed_msg'
      | 'claim_daily_bonus'
      | 'claimed'
      | 'boost_desc'
  ) => string;
};

export function BonusModal(props: Props): React.JSX.Element {
  const {
    styles,
    visible,
    onClose,
    modalScaleAnim,
    scale,
    isDailyBonusAvailable,
    miningStreak,
    triggerAd,
    showInfoAlert,
    t,
  } = props;

  if (!visible) return <></>;

  return (
    <TouchableOpacity
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, justifyContent: 'center', alignItems: 'center' },
      ]}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableWithoutFeedback>
        <Animated.View
          style={{
            width: '85%',
            backgroundColor: THEME.bg,
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            elevation: 10,
            transform: [
              { scale: modalScaleAnim },
              {
                translateY: modalScaleAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }),
              },
            ],
            borderWidth: 2,
            borderColor: '#e5c27a',
            shadowColor: '#e5c27a',
            shadowOpacity: 0.35,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <TouchableOpacity
            style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}
            onPress={onClose}
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
                showInfoAlert('Weekly Bonus', `Keep mining daily! Current Streak: ${miningStreak}/7 days`);
              }
            }}
            size={scale(50)}
            width={scale(200)}
            rounded
            style={miningStreak >= 7 ? styles.balanceActive : undefined}
          >
            <Text style={{ fontWeight: 'bold', color: THEME.text }}>
              {miningStreak >= 7 ? 'Claim Weekly Bonus' : `Locked (${miningStreak}/7)`}
            </Text>
          </NeuButton>

          <Text
            style={{
              color: THEME.textSecondary,
              fontSize: 11,
              textAlign: 'center',
              marginTop: 15,
              paddingHorizontal: 10,
              opacity: 0.8,
              lineHeight: 16,
            }}
          >
            * Maintain a 7-day mining streak to unlock the Weekly Bonus. Missing a day resets your streak!
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
}
