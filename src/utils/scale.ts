/**
 * Scale utilities for responsive sizing
 */
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const scaleWidth = isTablet ? width * 0.6 : width;
export const scale = (size: number): number => (scaleWidth / 375) * size;
export const verticalScale = (size: number): number => (height / 812) * size;

// Aliases for compatibility
export const dynamicScale = scale;
export const dynamicVerticalScale = verticalScale;
