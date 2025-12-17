import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    G,
    Line,
    Path,
    Rect,
    Stop,
    LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

type Theme = {
  accent: string;
  accentDark: string;
};

export function HomeCircuitBackground(props: {
  width: number;
  height: number;
  powerOn: boolean;
  spineTop: number;
  spineBottom: number;
  dynamicScale: (size: number) => number;
  dynamicVerticalScale: (size: number) => number;
  theme: Theme;
  circuitStroke: string;
}): React.JSX.Element {
  const {
    width,
    height,
    powerOn,
    spineTop,
    spineBottom,
    dynamicScale,
    dynamicVerticalScale,
    theme,
    circuitStroke,
  } = props;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgLinearGradient id="circuitGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.accent} stopOpacity="0.3" />
            <Stop offset="0.5" stopColor={theme.accent} stopOpacity="0.8" />
            <Stop offset="1" stopColor={theme.accentDark} stopOpacity="0.3" />
          </SvgLinearGradient>
        </Defs>

        {/* Motherboard Circuit Design (Left & Right) */}
        <G stroke={circuitStroke} strokeWidth={dynamicScale(1)} fill="none" opacity="0.25">
          {/* Left Side Complex Traces */}
          <Path
            d={`M ${width / 2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(60)} H ${width / 2 - dynamicScale(80)} L ${width / 2 - dynamicScale(100)} ${spineTop + dynamicVerticalScale(40)} H ${dynamicScale(20)}`}
          />
          <Rect
            x={width / 2 - dynamicScale(85)}
            y={spineTop + dynamicVerticalScale(55)}
            width={10}
            height={10}
            fill={theme.accent}
            opacity="0.5"
            stroke="none"
          />

          <Path
            d={`M ${width / 2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(120)} H ${width / 2 - dynamicScale(50)} V ${spineTop + dynamicVerticalScale(160)} H ${dynamicScale(10)}`}
          />
          <Circle
            cx={width / 2 - dynamicScale(50)}
            cy={spineTop + dynamicVerticalScale(120)}
            r={3}
            fill={theme.accent}
            stroke="none"
          />

          <Path
            d={`M ${width / 2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(200)} H ${width / 2 - dynamicScale(120)} L ${width / 2 - dynamicScale(140)} ${spineTop + dynamicVerticalScale(220)} H ${dynamicScale(30)}`}
          />

          <Path
            d={`M ${width / 2 - dynamicScale(20)} ${spineTop + dynamicVerticalScale(280)} H ${width / 2 - dynamicScale(60)} L ${width / 2 - dynamicScale(90)} ${spineTop + dynamicVerticalScale(310)} H ${dynamicScale(10)}`}
          />
          <Rect
            x={width / 2 - dynamicScale(65)}
            y={spineTop + dynamicVerticalScale(275)}
            width={8}
            height={8}
            fill={theme.accent}
            opacity="0.5"
            stroke="none"
          />

          {/* Right Side Complex Traces */}
          <Path
            d={`M ${width / 2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(60)} H ${width / 2 + dynamicScale(80)} L ${width / 2 + dynamicScale(100)} ${spineTop + dynamicVerticalScale(40)} H ${width - dynamicScale(20)}`}
          />
          <Rect
            x={width / 2 + dynamicScale(75)}
            y={spineTop + dynamicVerticalScale(55)}
            width={10}
            height={10}
            fill={theme.accent}
            opacity="0.5"
            stroke="none"
          />

          <Path
            d={`M ${width / 2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(120)} H ${width / 2 + dynamicScale(50)} V ${spineTop + dynamicVerticalScale(160)} H ${width - dynamicScale(10)}`}
          />
          <Circle
            cx={width / 2 + dynamicScale(50)}
            cy={spineTop + dynamicVerticalScale(120)}
            r={3}
            fill={theme.accent}
            stroke="none"
          />

          <Path
            d={`M ${width / 2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(200)} H ${width / 2 + dynamicScale(120)} L ${width / 2 + dynamicScale(140)} ${spineTop + dynamicVerticalScale(220)} H ${width - dynamicScale(30)}`}
          />

          <Path
            d={`M ${width / 2 + dynamicScale(20)} ${spineTop + dynamicVerticalScale(280)} H ${width / 2 + dynamicScale(60)} L ${width / 2 + dynamicScale(90)} ${spineTop + dynamicVerticalScale(310)} H ${width - dynamicScale(10)}`}
          />
          <Rect
            x={width / 2 + dynamicScale(57)}
            y={spineTop + dynamicVerticalScale(275)}
            width={8}
            height={8}
            fill={theme.accent}
            opacity="0.5"
            stroke="none"
          />
        </G>

        {/* Group for all traces */}
        <G stroke={circuitStroke} strokeWidth={dynamicScale(2)} fill="none" strokeLinecap="round">
          {/* --- 7 VERTICAL SPINES (Data Bus) --- */}
          {/* Only show side spines when power is ON */}
          {powerOn && (
            <>
              {/* Far Left Spine */}
              <Line
                x1={width / 2 - dynamicScale(15)}
                y1={spineTop}
                x2={width / 2 - dynamicScale(15)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1)}
                opacity="0.4"
              />
              {/* Mid Left Spine */}
              <Line
                x1={width / 2 - dynamicScale(10)}
                y1={spineTop}
                x2={width / 2 - dynamicScale(10)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1.2)}
                opacity="0.5"
              />
              {/* Near Left Spine */}
              <Line
                x1={width / 2 - dynamicScale(5)}
                y1={spineTop}
                x2={width / 2 - dynamicScale(5)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1.5)}
                opacity="0.6"
              />

              {/* Near Right Spine */}
              <Line
                x1={width / 2 + dynamicScale(5)}
                y1={spineTop}
                x2={width / 2 + dynamicScale(5)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1.5)}
                opacity="0.6"
              />
              {/* Mid Right Spine */}
              <Line
                x1={width / 2 + dynamicScale(10)}
                y1={spineTop}
                x2={width / 2 + dynamicScale(10)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1.2)}
                opacity="0.5"
              />
              {/* Far Right Spine */}
              <Line
                x1={width / 2 + dynamicScale(15)}
                y1={spineTop}
                x2={width / 2 + dynamicScale(15)}
                y2={spineBottom}
                strokeWidth={dynamicScale(1)}
                opacity="0.4"
              />
            </>
          )}

          {/* Center Spine (Thickest) - Always visible but detached when inactive */}
          <Line
            x1={width / 2}
            y1={powerOn ? spineTop : spineTop + dynamicVerticalScale(50)}
            x2={width / 2}
            y2={powerOn ? spineBottom : spineBottom - dynamicVerticalScale(50)}
            strokeWidth={dynamicScale(2.5)}
          />

          {/* Circuit Nodes for Inactive State */}
          {!powerOn && (
            <>
              {/* Top Node: Semi-circle pointing UP (into gap) */}
              <Path
                d={`M ${width / 2 - dynamicScale(4)} ${spineTop + dynamicVerticalScale(50)} A ${dynamicScale(4)} ${dynamicScale(4)} 0 0 0 ${width / 2 + dynamicScale(4)} ${spineTop + dynamicVerticalScale(50)}`}
                fill={theme.accent}
              />
              {/* Bottom Node: Semi-circle pointing DOWN (into gap) */}
              <Path
                d={`M ${width / 2 - dynamicScale(4)} ${spineBottom - dynamicVerticalScale(50)} A ${dynamicScale(4)} ${dynamicScale(4)} 0 0 1 ${width / 2 + dynamicScale(4)} ${spineBottom - dynamicVerticalScale(50)}`}
                fill={theme.accent}
              />
            </>
          )}
        </G>
      </Svg>
    </View>
  );
}
