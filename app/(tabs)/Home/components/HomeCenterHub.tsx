import React from 'react';
import { Animated, ImageSourcePropType, View } from 'react-native';

import { HomeHubTraces } from '@/app/(tabs)/Home/components/HomeHubTraces';
import { NeuButton } from '@/app/(tabs)/Home/components/NeuButton';
import { THEME } from '@/constants/theme';

type AnyRef = React.RefObject<any>;

type Props = {
  styles: any;
  scale: (size: number) => number;
  dynamicScale: (size: number) => number;
  theme: typeof THEME;
  hubStroke: string;
  hubStrokeFallbackColor?: string;
  powerOn: boolean;
  breatheAnim: any;

  leftBundleX: number;
  leftBundleXNudged: number;
  rightBundleXNudged: number;
  topBundleY: number;
  leftBundleYDisplay: number;
  rightBundleYDisplay: number;
  screenLeftEdgeSVG: number;
  screenRightEdgeSVG: number;

  hubRef: AnyRef;
  hubOriginRef: AnyRef;
  onMeasure: () => void;

  activeImageSource: ImageSourcePropType;
  inactiveImageSource: ImageSourcePropType;
};

export function HomeCenterHub(props: Props): React.JSX.Element {
  const {
    styles,
    scale,
    dynamicScale,
    theme,
    hubStroke,
    powerOn,
    breatheAnim,
    leftBundleX,
    leftBundleXNudged,
    rightBundleXNudged,
    topBundleY,
    leftBundleYDisplay,
    rightBundleYDisplay,
    screenLeftEdgeSVG,
    screenRightEdgeSVG,
    hubRef,
    hubOriginRef,
    onMeasure,
    activeImageSource,
    inactiveImageSource,
  } = props;

  return (
    <View style={[styles.centerHub, { overflow: 'visible' }]}>
      {/* Circuit Traces attached to Hub */}
      <HomeHubTraces
        dynamicScale={dynamicScale}
        theme={theme}
        hubStroke={hubStroke}
        powerOn={powerOn}
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
        onMeasure={onMeasure}
      />

      {/* 2. The Main Floating Button */}
      <View>
        <NeuButton
          size={scale(140)}
          rounded
          style={[styles.mainLogoButton, powerOn ? styles.mainLogoActive : undefined]}
        >
          <Animated.Image
            source={powerOn ? activeImageSource : inactiveImageSource}
            style={[styles.onionImageFull, { transform: [{ scale: breatheAnim }] }]}
            resizeMode="contain"
          />
        </NeuButton>
      </View>
    </View>
  );
}
