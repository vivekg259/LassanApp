import React, { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import { THEME } from '@/src/constants/theme';

type UserTabProps = {
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  t: (
    key: | 'menu_personal_info'
         | 'menu_personal_info_sub'
         | 'menu_security'
         | 'menu_security_sub'
         | 'menu_wallet'
         | 'menu_wallet_sub'
         | 'menu_help'
         | 'menu_help_sub'
         | 'menu_language'
         | 'menu_language_sub'
         | 'logout'
         | 'version'
  ) => string;
  handleMenuPress: (item: string) => void;
  handleLogout: () => void;
};

type MenuItemIcon = 'User' | 'Shield' | 'CreditCard' | 'HelpCircle' | 'Globe';

export function UserTab({ scale, verticalScale, t, handleMenuPress, handleLogout }: UserTabProps): React.JSX.Element {
  const [showEarlyPhaseInfo, setShowEarlyPhaseInfo] = useState(false);

  const menuItems: { icon: MenuItemIcon; label: string; sub: string }[] = [
    { icon: 'User', label: t('menu_personal_info'), sub: t('menu_personal_info_sub') },
    { icon: 'Shield', label: t('menu_security'), sub: t('menu_security_sub') },
    { icon: 'CreditCard', label: t('menu_wallet'), sub: t('menu_wallet_sub') },
    { icon: 'HelpCircle', label: t('menu_help'), sub: t('menu_help_sub') },
    { icon: 'Globe', label: t('menu_language'), sub: t('menu_language_sub') },
  ];

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Profile Header */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 24,
          padding: scale(16),
          marginBottom: verticalScale(10),
          alignItems: 'center',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <View style={{ position: 'relative', marginBottom: verticalScale(10) }}>
          <View
            style={{
              width: scale(80),
              height: scale(80),
              borderRadius: scale(40),
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: THEME.accent,
            }}
          >
            <Text style={{ fontSize: scale(32), fontWeight: 'bold', color: THEME.accentDark }}>V</Text>
          </View>
        </View>

        <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(2) }}>Vivek Gupta</Text>
        <Text style={{ fontSize: scale(13), color: THEME.textSecondary, marginBottom: verticalScale(12) }}>vivek.gupta@example.com</Text>

        <View style={{ flexDirection: 'row', gap: scale(10), flexWrap: 'wrap', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => setShowEarlyPhaseInfo(!showEarlyPhaseInfo)}
            style={{
              paddingHorizontal: scale(12),
              paddingVertical: verticalScale(6),
              borderRadius: 20,
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderWidth: 1,
              borderColor: THEME.accent,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24" fill={THEME.accent} stroke={THEME.accent} strokeWidth={2}>
              <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </Svg>
            <Text style={{ fontSize: scale(12), fontWeight: '700', color: THEME.accentDark }}>Early Phase Member</Text>
          </TouchableOpacity>
        </View>

        {showEarlyPhaseInfo && (
          <View
            style={{
              marginTop: verticalScale(15),
              padding: scale(12),
              backgroundColor: 'rgba(229, 194, 122, 0.1)',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(229, 194, 122, 0.3)',
              width: '100%',
            }}
          >
            <Text style={{ fontSize: scale(12), color: THEME.textSecondary, textAlign: 'center', lineHeight: scale(18) }}>
              <Text style={{ fontWeight: 'bold', color: THEME.accentDark }}>Early Phase Bonus:</Text> All early members will receive exclusive LSN airdrops during the LSN distribution phase. Keep mining! 🚀
            </Text>
          </View>
        )}
      </View>

      {/* 2. Menu Options */}
      <View style={{ gap: verticalScale(15) }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleMenuPress(item.label)}
            style={{
              backgroundColor: THEME.bg,
              borderRadius: 16,
              padding: scale(16),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
                android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
              }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
              <View
                style={{
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(12),
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                  {item.icon === 'User' && <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />}
                  {item.icon === 'User' && <Circle cx="12" cy="7" r="4" />}

                  {item.icon === 'Shield' && <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}

                  {item.icon === 'CreditCard' && <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />}
                  {item.icon === 'CreditCard' && <Line x1="1" y1="10" x2="23" y2="10" />}

                  {item.icon === 'Globe' && <Circle cx="12" cy="12" r="10" />}
                  {item.icon === 'Globe' && <Line x1="2" y1="12" x2="22" y2="12" />}

                  {item.icon === 'HelpCircle' && <Circle cx="12" cy="12" r="10" />}
                  {item.icon === 'HelpCircle' && <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />}
                  {item.icon === 'HelpCircle' && <Line x1="12" y1="17" x2="12.01" y2="17" />}
                </Svg>
              </View>
              <View>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{item.label}</Text>
                <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{item.sub}</Text>
              </View>
            </View>
            <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
              <Polyline points="9 18 15 12 9 6" />
            </Svg>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. Logout CTA */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: verticalScale(30),
          backgroundColor: 'rgba(255, 0, 0, 0.05)',
          borderRadius: 16,
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: scale(10),
          borderWidth: 1,
          borderColor: 'rgba(255, 0, 0, 0.1)',
        }}
      >
        <Svg width={scale(20)} height={scale(20)} stroke="#D32F2F" strokeWidth={2} fill="none" viewBox="0 0 24 24">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Polyline points="16 17 21 12 16 7" />
          <Line x1="21" y1="12" x2="9" y2="12" />
        </Svg>
        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: '#D32F2F' }}>{t('logout')}</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: verticalScale(20), color: THEME.textSecondary, fontSize: scale(12) }}>
        {t('version')} 1.0.0 (Build 2025.12.10)
      </Text>
    </ScrollView>
  );
}