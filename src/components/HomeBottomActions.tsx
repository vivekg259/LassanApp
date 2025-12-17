import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { NeuButton } from '@/src/components/NeuButton';

type AnyRef = React.RefObject<any>;

type Props = {
  styles: any;
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  powerOn: boolean;
  t: (key: 'btn_bonus' | 'btn_boost') => string;
  powerColor: string;
  leftBtnRef: AnyRef;
  rightBtnRef: AnyRef;
  powerBtnRef: AnyRef;
  onMeasure: () => void;
  onPressBonus: () => void;
  onPressPower: () => void;
  onPressBoost: () => void;
};

export function HomeBottomActions(props: Props): React.JSX.Element {
  const {
    styles,
    scale,
    verticalScale,
    powerOn,
    t,
    powerColor,
    leftBtnRef,
    rightBtnRef,
    powerBtnRef,
    onMeasure,
    onPressBonus,
    onPressPower,
    onPressBoost,
  } = props;

  return (
    <View style={styles.actionRow} onLayout={() => onMeasure()}>
      <TouchableOpacity ref={leftBtnRef} onPress={onPressBonus} activeOpacity={0.8}>
        <View
          style={[
            styles.balanceDisplay,
            { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) },
            powerOn && styles.balanceActive,
          ]}
        >
          <Text style={styles.btnText}>{t('btn_bonus')}</Text>
        </View>
      </TouchableOpacity>

      {/* Power Button moved here */}
      <View ref={powerBtnRef} onLayout={() => onMeasure()}>
        <NeuButton
          size={scale(68)}
          rounded
          style={[
            styles.powerButtonTransparent,
            powerOn ? styles.powerButtonActive : undefined,
            { transform: [{ translateY: verticalScale(30) }] },
          ]}
          onPress={onPressPower}
        >
          <Svg
            width={30}
            height={30}
            stroke={powerColor}
            strokeWidth={powerOn ? 3.4 : 2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <Path d="M12 5v7" />
            <Path d="M8.5 7.5a6.5 6.5 0 1 0 7 0" />
          </Svg>
        </NeuButton>
      </View>

      <TouchableOpacity ref={rightBtnRef} onPress={onPressBoost} activeOpacity={0.8}>
        <View
          style={[
            styles.balanceDisplay,
            { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) },
            powerOn && styles.balanceActive,
          ]}
        >
          <Text style={styles.btnText}>{t('btn_boost')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
