import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const scaleWidth = isTablet ? width * 0.6 : width;
export const scale = (size: number): number => (scaleWidth / 375) * size;
export const verticalScale = (size: number): number => (height / 812) * size;

// Aliases for compatibility
export const dynamicScale = scale;
export const dynamicVerticalScale = verticalScale;

export const THEME = {
  bg: '#f5ede1',
  text: '#5a4a3a',
  textSecondary: '#8b7355',
  shadowLight: '#ffffff',
  shadowDark: '#c4b5a0',
  accent: '#d4af37',
  accentDark: '#a68c1c',
  overlay: 'rgba(255, 255, 255, 0.5)',
  overlayDark: 'rgba(90, 74, 58, 0.08)'
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default {
  scale,
  verticalScale,
  THEME,
};
