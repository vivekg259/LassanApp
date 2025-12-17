import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, Path, Polyline, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { THEME } from '@/src/constants/theme';

type ExploreTabProps = {
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  totalMiners: number;
  lsnMined: number;
  formatNumber: (value: number) => string;
  t: (
    key: | 'featured_news'
         | 'beta_live'
         | 'beta_desc'
         | 'network_stats'
         | 'total_miners'
         | 'lsn_mined'
         | 'recent_updates'
         | 'read'
         | 'legal'
         | 'about'
         | 'airdrop_eligibility'
         | 'airdrop_desc'
  ) => string;
};

export function ExploreTab({ scale, verticalScale, totalMiners, lsnMined, formatNumber, t }: ExploreTabProps): React.JSX.Element {
  const primaryStats = [
    { label: t('total_miners'), value: formatNumber(totalMiners), icon: 'Users' as const },
    { label: t('lsn_mined'), value: Math.floor(lsnMined).toLocaleString(), icon: 'Database' as const },
  ];

  const secondaryStats = [
    { label: t('read'), value: 'Whitepaper', icon: 'FileText' as const },
    { label: t('legal'), value: 'Privacy Policy', icon: 'Shield' as const },
    { label: t('legal'), value: 'Terms of Service', icon: 'File' as const },
    { label: t('about'), value: 'Core Team', icon: 'Users' as const },
  ];

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Featured News Banner */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 20,
          marginBottom: verticalScale(20),
          overflow: 'hidden',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <View style={{ height: verticalScale(150), backgroundColor: THEME.accent, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
            <Defs>
              <SvgLinearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={THEME.accent} />
                <Stop offset="1" stopColor={THEME.accentDark} />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#bannerGrad)" />
            <Circle cx="10%" cy="20%" r="50" fill="rgba(255,255,255,0.1)" />
            <Circle cx="90%" cy="80%" r="80" fill="rgba(255,255,255,0.1)" />
            <Path d="M0 100 Q 150 50 300 100 T 600 100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
          </Svg>

          <View style={{ padding: scale(20), alignItems: 'center' }}>
            <View style={{ paddingHorizontal: scale(10), paddingVertical: verticalScale(4), backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginBottom: verticalScale(10) }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: scale(10) }}>{t('featured_news')}</Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: scale(20), fontWeight: 'bold', textAlign: 'center', marginBottom: verticalScale(5) }}>{t('beta_live')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: scale(12), textAlign: 'center' }}>{t('beta_desc')}</Text>
          </View>
        </View>
      </View>

      {/* 2. Global Network Stats */}
      <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('network_stats')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(12), marginBottom: verticalScale(25) }}>
        {primaryStats.map((stat, index) => (
          <View
            key={`primary-${index}`}
            style={{
              width: '48%',
              backgroundColor: THEME.bg,
              borderRadius: 16,
              padding: scale(15),
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
                android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
              }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: verticalScale(8) }}>
              <Svg width={scale(16)} height={scale(16)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                {stat.icon === 'Users' && <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                {stat.icon === 'Users' && <Circle cx="9" cy="7" r="4" />}
                {stat.icon === 'Users' && <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />}
                {stat.icon === 'Users' && <Path d="M16 3.13a4 4 0 0 1 0 7.75" />}

                {stat.icon === 'Database' && <Ellipse cx="12" cy="5" rx="9" ry="3" />}
                {stat.icon === 'Database' && <Path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />}
                {stat.icon === 'Database' && <Path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />}
              </Svg>
              <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{stat.label}</Text>
            </View>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>{stat.value}</Text>
          </View>
        ))}

        {secondaryStats.map((stat, index) => (
          <View
            key={`secondary-${index}`}
            style={{
              width: '48%',
              backgroundColor: THEME.bg,
              borderRadius: 12,
              padding: scale(10),
              justifyContent: 'center',
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
                android: { elevation: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
              }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) }}>
              <Svg width={scale(14)} height={scale(14)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                {stat.icon === 'FileText' && <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
                {stat.icon === 'FileText' && <Polyline points="14 2 14 8 20 8" />}
                {stat.icon === 'FileText' && <Line x1="16" y1="13" x2="8" y2="13" />}
                {stat.icon === 'FileText' && <Line x1="16" y1="17" x2="8" y2="17" />}
                {stat.icon === 'FileText' && <Polyline points="10 9 9 9 8 9" />}

                {stat.icon === 'Shield' && <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}

                {stat.icon === 'File' && <Path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />}
                {stat.icon === 'File' && <Polyline points="13 2 13 9 20 9" />}

                {stat.icon === 'Users' && <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                {stat.icon === 'Users' && <Circle cx="9" cy="7" r="4" />}
                {stat.icon === 'Users' && <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />}
                {stat.icon === 'Users' && <Path d="M16 3.13a4 4 0 0 1 0 7.75" />}
              </Svg>
              <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>{stat.label}</Text>
            </View>
            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.text }} numberOfLines={1} adjustsFontSizeToFit>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      {/* 3. Recent Updates */}
      <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('recent_updates')}</Text>
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 16,
          padding: scale(30),
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
            android: { elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <Svg width={scale(48)} height={scale(48)} stroke={THEME.textSecondary} strokeWidth={1.5} fill="none" viewBox="0 0 24 24" style={{ marginBottom: verticalScale(15), opacity: 0.6 }}>
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
        <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(8) }}>Updates Coming Soon</Text>
        <Text style={{ fontSize: scale(13), color: THEME.textSecondary, textAlign: 'center', lineHeight: scale(18) }}>
          We are working on some exciting new features.
          {'\n'}Stay tuned for announcements!
        </Text>
      </View>
    </ScrollView>
  );
}