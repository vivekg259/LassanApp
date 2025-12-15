import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import { NeuButton } from '@/app/(tabs)/Home/components/NeuButton';
import { THEME } from '@/constants/theme';

export type TabKey = 'home' | 'rewards' | 'referral' | 'explore' | 'user';

type Props = {
  styles: any;
  scale: (size: number) => number;
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  inactiveButtonStyle?: StyleProp<ViewStyle>;
};

export function BottomNavigation(props: Props): React.JSX.Element {
  const { styles, scale, activeTab, onSelectTab, inactiveButtonStyle } = props;

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNavContent}>
        <View style={styles.bottomBar}>
          {/* 1. Home UI Icon */}
          <NeuButton
            size={scale(44)}
            rounded
            onPress={() => onSelectTab('home')}
            style={activeTab !== 'home' ? inactiveButtonStyle : undefined}
          >
            <Svg
              width={22}
              height={22}
              stroke={activeTab === 'home' ? THEME.accent : THEME.text}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <Polyline points="9 22 9 12 15 12 15 22" />
            </Svg>
          </NeuButton>

          {/* 2. Rewards UI Icon (Gift) */}
          <NeuButton
            size={scale(44)}
            rounded
            onPress={() => onSelectTab('rewards')}
            style={activeTab !== 'rewards' ? inactiveButtonStyle : undefined}
          >
            <Svg
              width={22}
              height={22}
              stroke={activeTab === 'rewards' ? THEME.accent : THEME.text}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
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
            onPress={() => onSelectTab('referral')}
            style={activeTab !== 'referral' ? inactiveButtonStyle : undefined}
          >
            <Svg
              width={22}
              height={22}
              stroke={activeTab === 'referral' ? THEME.accent : THEME.text}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
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
            onPress={() => onSelectTab('explore')}
            style={activeTab !== 'explore' ? inactiveButtonStyle : undefined}
          >
            <Svg
              width={22}
              height={22}
              stroke={activeTab === 'explore' ? THEME.accent : THEME.text}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <Circle cx="12" cy="12" r="10" />
              <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </Svg>
          </NeuButton>

          {/* 5. User UI Icon (Person) */}
          <NeuButton
            size={scale(44)}
            rounded
            onPress={() => onSelectTab('user')}
            style={activeTab !== 'user' ? inactiveButtonStyle : undefined}
          >
            <Svg
              width={22}
              height={22}
              stroke={activeTab === 'user' ? THEME.accent : THEME.text}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <Circle cx="12" cy="7" r="4" />
            </Svg>
          </NeuButton>
        </View>
      </View>
    </View>
  );
}
