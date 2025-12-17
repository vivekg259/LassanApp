import React from 'react';
import { View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    G,
    Path,
    Stop,
    LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

type Theme = {
  accent: string;
  accentDark: string;
};

type AnyRef = React.RefObject<any>;

type Props = {
  dynamicScale: (size: number) => number;
  theme: Theme;
  hubStroke: string;
  powerOn: boolean;
  leftBundleX: number;
  rightBundleXNudged: number;
  leftBundleXNudged: number;
  topBundleY: number;
  leftBundleYDisplay: number;
  rightBundleYDisplay: number;
  screenLeftEdgeSVG: number;
  screenRightEdgeSVG: number;
  hubRef: AnyRef;
  hubOriginRef: AnyRef;
  onMeasure: () => void;
};

export function HomeHubTraces(props: Props): React.JSX.Element {
  const {
    dynamicScale,
    theme,
    hubStroke,
    powerOn,
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
  } = props;

  return (
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
      onLayout={() => onMeasure()}
      pointerEvents="none"
    >
      {/* Invisible origin marker (measured) for pixel-perfect SVG binding */}
      <View
        ref={hubOriginRef}
        onLayout={() => onMeasure()}
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 2,
          height: 2,
          marginLeft: -1,
          marginTop: -1,
          backgroundColor: 'transparent',
        }}
      />
      <Svg height="100%" width="100%" viewBox="0 0 1200 1200">
        <Defs>
          <SvgLinearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.accent} stopOpacity="0.3" />
            <Stop offset="0.5" stopColor={theme.accent} stopOpacity="0.8" />
            <Stop offset="1" stopColor={theme.accentDark} stopOpacity="0.3" />
          </SvgLinearGradient>
        </Defs>
        <G transform="translate(480, 480)">
          <G stroke={hubStroke} strokeWidth="2" fill="none" strokeLinecap="round">
            {/* --- LEFT SIDE --- */}

            {/* Top Left Bundle */}
            {powerOn && (
              <>
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(-15, 0)"
                />
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(-10, 0)"
                />
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(-5, 0)"
                />
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(5, 0)"
                />
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(10, 0)"
                />
                <Path
                  d={`M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(15, 0)"
                />
              </>
            )}
            <Path
              d={powerOn ? `M 75 75 L 75 35 L ${leftBundleX} 4 L ${leftBundleX} ${topBundleY}` : 'M 60 60 L 40 40 L 0 40'}
              strokeWidth={powerOn ? 2.5 : 2}
            />
            {!powerOn && (
              <>
                <Circle cx="0" cy="40" r="3" fill={theme.accent} stroke="none" />
                <Circle cx="60" cy="60" r="2" fill={theme.accent} stroke="none" />
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
            <Path d={powerOn ? `M 120 120 L ${screenLeftEdgeSVG} 120` : 'M 30 120 L -50 120'} strokeWidth={powerOn ? 2.5 : 2.5} />
            {!powerOn && <Circle cx="-50" cy="120" r="3" fill={theme.accent} stroke="none" />}

            {/* Bottom Left Bundle */}
            {powerOn && (
              <>
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(-15, 0)"
                />
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(-10, 0)"
                />
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(-5, 0)"
                />
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(5, 0)"
                />
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(10, 0)"
                />
                <Path
                  d={`M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(15, 0)"
                />
              </>
            )}
            <Path
              d={
                powerOn
                  ? `M 75 165 L 75 205 L ${leftBundleXNudged} 236 L ${leftBundleXNudged} ${leftBundleYDisplay}`
                  : 'M 60 180 L 40 200 L 0 200'
              }
              strokeWidth={powerOn ? 2.5 : 2}
            />
            {!powerOn && (
              <>
                <Circle cx="0" cy="200" r="3" fill={theme.accent} stroke="none" />
                <Circle cx="60" cy="180" r="2" fill={theme.accent} stroke="none" />
              </>
            )}

            {/* --- RIGHT SIDE --- */}

            {/* Top Right Bundle */}
            {powerOn && (
              <>
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(-15, 0)"
                />
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(-10, 0)"
                />
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(-5, 0)"
                />
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(5, 0)"
                />
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(10, 0)"
                />
                <Path
                  d={`M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(15, 0)"
                />
              </>
            )}
            <Path
              d={
                powerOn
                  ? `M 165 75 L 165 35 L ${rightBundleXNudged} 4 L ${rightBundleXNudged} ${topBundleY}`
                  : 'M 180 60 L 200 40 L 240 40'
              }
              strokeWidth={powerOn ? 2.5 : 2}
            />
            {!powerOn && (
              <>
                <Circle cx="240" cy="40" r="3" fill={theme.accent} stroke="none" />
                <Circle cx="180" cy="60" r="2" fill={theme.accent} stroke="none" />
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
            <Path d={powerOn ? `M 120 120 L ${screenRightEdgeSVG} 120` : 'M 210 120 L 290 120'} strokeWidth={powerOn ? 2.5 : 2.5} />
            {!powerOn && <Circle cx="290" cy="120" r="3" fill={theme.accent} stroke="none" />}

            {/* Bottom Right Bundle */}
            {powerOn && (
              <>
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(-15, 0)"
                />
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(-10, 0)"
                />
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(-5, 0)"
                />
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1.5"
                  opacity="0.6"
                  transform="translate(5, 0)"
                />
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1.2"
                  opacity="0.5"
                  transform="translate(10, 0)"
                />
                <Path
                  d={`M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`}
                  strokeWidth="1"
                  opacity="0.4"
                  transform="translate(15, 0)"
                />
              </>
            )}
            <Path
              d={
                powerOn
                  ? `M 165 165 L 165 205 L ${rightBundleXNudged} 236 L ${rightBundleXNudged} ${rightBundleYDisplay}`
                  : 'M 180 180 L 200 200 L 240 200'
              }
              strokeWidth={powerOn ? 2.5 : 2}
            />
            {!powerOn && (
              <>
                <Circle cx="240" cy="200" r="3" fill={theme.accent} stroke="none" />
                <Circle cx="180" cy="180" r="2" fill={theme.accent} stroke="none" />
              </>
            )}
          </G>
        </G>
      </Svg>
    </View>
  );
}
