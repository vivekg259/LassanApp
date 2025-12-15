import React from 'react';
import { Text, View } from 'react-native';

export function HomeTopActions(props: {
  styles: any;
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  powerOn: boolean;
  currentRate: string;
  timeLeft: string;
}): React.JSX.Element {
  const { styles, scale, verticalScale, powerOn, currentRate, timeLeft } = props;

  return (
    <View style={styles.actionRow}>
      <View
        style={[
          styles.balanceDisplay,
          { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) },
          powerOn && styles.balanceActive,
        ]}
      >
        <Text style={styles.btnText}>{powerOn ? currentRate : '0.00/hr'}</Text>
      </View>
      <View
        style={[
          styles.balanceDisplay,
          { width: scale(100), height: verticalScale(56), paddingHorizontal: scale(5) },
          powerOn && styles.balanceActive,
        ]}
      >
        <Text style={styles.btnText}>{powerOn ? timeLeft : 'Inactive'}</Text>
      </View>
    </View>
  );
}
