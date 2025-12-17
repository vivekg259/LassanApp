/**
 * HOME SCREEN STYLES
 * Extracted from index.tsx to keep main component file clean and maintainable.
 */
import { THEME } from '@/constants/theme';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Responsive utility to scale sizes based on screen width
const scaleWidth = isTablet ? width * 0.6 : width;
export const scale = (size: number): number => (scaleWidth / 375) * size;
export const verticalScale = (size: number): number => (height / 812) * size;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingHorizontal: scale(12),
    justifyContent: 'space-between', 
    paddingBottom: 10
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    marginTop: verticalScale(2),
    zIndex: 100,
    position: 'relative',
  },
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(12),
    zIndex: 101,
  },
  balanceDisplay: {
    backgroundColor: THEME.bg,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 102,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
        shadowColor: '#5a4a3a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
      }
    }),
  },
  balanceActive: {
    borderWidth: 2,
    borderColor: '#e5c27a',
    shadowColor: '#e5c27a',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    ...Platform.select({
      android: {
        elevation: 8,
      }
    }),
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // Stage (Main Area)
  stage: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    zIndex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    gap: scale(8),
    zIndex: 50,
    elevation: 50,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: 0.8,
  },
  centerHub: {
    width: scale(240),
    height: scale(240),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLogoButton: {
    backgroundColor: THEME.bg,
  },
  mainLogoActive: {
    shadowColor: '#e5c27a',
    shadowOpacity: 0.85,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 10 },
    ...Platform.select({
      android: {
        elevation: 24,
      }
    }),
  },
  onionImage: {
    width: scale(100),
    height: scale(100),
  },
  onionImageFull: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
  },

  // Bottom Nav
  bottomNavContainer: {
    paddingVertical: verticalScale(5),
    paddingBottom: verticalScale(10),
    backgroundColor: THEME.bg,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.bg,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: 30,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
        shadowColor: '#5a4a3a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
      }
    }),
  },
  bottomFabWrap: {
    position: 'absolute',
    top: -verticalScale(55),
    alignSelf: 'center',
  },
  powerButtonTransparent: {
    backgroundColor: THEME.bg,
    borderWidth: 1.5,
    borderColor: THEME.text,
    ...Platform.select({
      android: {
        elevation: 0,
      }
    }),
  },
  powerButtonActive: {
    borderColor: '#e5c27a',
    borderWidth: 3,
    ...Platform.select({
      android: {
        elevation: 0,
      }
    }),
  },
  activeDot: {
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    backgroundColor: THEME.text,
    opacity: 0.85
  },

  // Language Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: THEME.bg,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  languageOptionActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    color: THEME.text,
    flex: 1,
  },
  languageNameActive: {
    fontWeight: 'bold',
    color: THEME.accentDark,
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.accent,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: THEME.text,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: THEME.bg,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
