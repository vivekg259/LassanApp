import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { NeuButton } from '@/app/(tabs)/Home/components/NeuButton';
import { THEME } from '@/constants/theme';

type Props = {
  styles: any;
  visible: boolean;
  onClose: () => void;

  modalScaleAnim: any;

  t: (key: 'boost_mining' | 'boost_desc') => string;

  boostsUsedToday: number;
  boostActive: boolean;
  boostTimeLeft: number;

  scale: (size: number) => number;
  triggerAd: (action: 'boost') => void;
};

export function BoostModal(props: Props): React.JSX.Element {
  const {
    styles,
    visible,
    onClose,
    modalScaleAnim,
    t,
    boostsUsedToday,
    boostActive,
    boostTimeLeft,
    scale,
    triggerAd,
  } = props;

  if (!visible) return <></>;

  return (
    <TouchableOpacity
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          justifyContent: 'center',
          alignItems: 'center',
        },
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
                translateY: modalScaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            // Active Border Style
            borderWidth: 2,
            borderColor: '#e5c27a',
            shadowColor: '#e5c27a',
            shadowOpacity: 0.35,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          {/* Close Icon */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke={THEME.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1="18" y1="6" x2="6" y2="18" />
              <Line x1="6" y1="6" x2="18" y2="18" />
            </Svg>
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: THEME.text, marginBottom: 10 }}>
            {t('boost_mining')}
          </Text>

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
            style={[{ marginBottom: 10 }, boostActive && styles.balanceActive]}
          >
            <Text style={{ fontWeight: 'bold', color: THEME.text }}>
              {boostActive
                ? `${String(Math.floor(boostTimeLeft / 60)).padStart(2, '0')}:${String(boostTimeLeft % 60).padStart(2, '0')}`
                : 'BOOST 2X'}
            </Text>
          </NeuButton>

          <Text style={{ color: THEME.textSecondary, textAlign: 'center', marginTop: 15, fontSize: 12 }}>
            {t('boost_desc')}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
}
