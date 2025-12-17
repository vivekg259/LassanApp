import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { THEME } from '@/src/constants/theme';

type ReferralRecord = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  consecutiveDays: number;
  lastNotified: number | null;
};

type ReferralTabProps = {
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  referralCode: string;
  handleCopyCode: () => Promise<void>;
  handleShareInvite: () => Promise<void>;
  handleNotify: (id: string) => void;
  baseRate: number;
  activeReferralsCount: number;
  referralBoostPercentage: number;
  activeMiningRate: number;
  referrals: ReferralRecord[];
  now: number;
  t: (
    key:
      | 'your_referral_code'
      | 'base_rate'
      | 'referral_boost'
      | 'active'
      | 'mining_active'
      | 'mining_rate'
      | 'referrer_family'
      | 'referral'
      | 'no_referrals'
      | 'notify'
  ) => string;
};

const COOLDOWN = 30 * 60 * 1000;

export function ReferralTab(props: ReferralTabProps): React.JSX.Element {
  const {
    scale,
    verticalScale,
    referralCode,
    handleCopyCode,
    handleShareInvite,
    handleNotify,
    baseRate,
    activeReferralsCount,
    referralBoostPercentage,
    activeMiningRate,
    referrals,
    now,
    t,
  } = props;

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
      showsVerticalScrollIndicator={false}
    >
      {/* 0. Referral Code Card */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 16,
          padding: scale(12),
          marginBottom: verticalScale(20),
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(8) }}>{t('your_referral_code')}</Text>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            padding: scale(10),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
          }}
        >
          <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.textSecondary, letterSpacing: 1 }}>{referralCode}</Text>
          <View style={{ flexDirection: 'row', gap: scale(12) }}>
            <TouchableOpacity onPress={handleCopyCode}>
              <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShareInvite}>
              <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="18" cy="5" r="3" />
                <Circle cx="6" cy="12" r="3" />
                <Circle cx="18" cy="19" r="3" />
                <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 1. Stats Card */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 16,
          padding: scale(12),
          marginBottom: verticalScale(20),
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(8) }}>
          <Text style={{ color: THEME.textSecondary, fontSize: scale(12), fontWeight: '600' }}>{t('base_rate')}</Text>
          <Text style={{ color: THEME.text, fontSize: scale(14), fontWeight: 'bold' }}>{baseRate.toFixed(2)} LSN/hr</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(8) }}>
          <View>
            <Text style={{ color: THEME.textSecondary, fontSize: scale(12), fontWeight: '600' }}>{t('referral_boost')}</Text>
            <Text style={{ color: THEME.textSecondary, fontSize: scale(9), marginTop: verticalScale(1) }}>({activeReferralsCount} {t('active')} x 10%)</Text>
          </View>
          <Text style={{ color: THEME.accent, fontSize: scale(14), fontWeight: 'bold' }}>+{referralBoostPercentage}%</Text>
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: verticalScale(8) }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: THEME.text, fontSize: scale(13), fontWeight: '600', lineHeight: scale(16) }}>{t('mining_active')}</Text>
            <Text style={{ color: THEME.text, fontSize: scale(13), fontWeight: '600', lineHeight: scale(16) }}>{t('mining_rate')}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              paddingHorizontal: scale(12),
              paddingVertical: verticalScale(6),
              borderRadius: 8,
              borderWidth: 1,
              borderColor: THEME.accent,
              flexDirection: 'row',
              alignItems: 'baseline',
              ...Platform.select({
                ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } },
                android: { elevation: 0 },
              }),
            }}
          >
            <Text style={{ color: THEME.text, fontSize: scale(14), fontWeight: 'bold', backgroundColor: 'transparent' }}>{activeMiningRate.toFixed(2)}</Text>
            <Text style={{ color: THEME.text, fontSize: scale(10), fontWeight: '700', marginLeft: scale(3), backgroundColor: 'transparent' }}>LSN/hr</Text>
          </View>
        </View>
      </View>

      {/* 2. My Referrer Family Card */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 20,
          padding: scale(20),
          marginBottom: verticalScale(20),
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text, marginBottom: verticalScale(15) }}>{t('referrer_family')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
            <View
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
                backgroundColor: 'rgba(0,0,0,0.05)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={scale(20)} height={scale(20)} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </Svg>
            </View>
            <View>
              <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.text }}>LASSAN ADMIN</Text>
              <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>admin@lassan.app</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: scale(12),
              paddingVertical: verticalScale(6),
              borderRadius: 8,
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderWidth: 1,
              borderColor: THEME.accent,
            }}
          >
            <Text style={{ fontSize: scale(12), fontWeight: '600', color: THEME.accentDark }}>{t('active')}</Text>
          </View>
        </View>
      </View>

      {/* 3. Referrals List Card */}
      <View
        style={{
          backgroundColor: THEME.bg,
          borderRadius: 20,
          padding: scale(20),
          minHeight: verticalScale(200),
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
            android: { elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
          }),
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20) }}>
          <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text }}>{t('referral')}</Text>
          <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.accent }}>{referrals.length} people</Text>
        </View>

        <View style={{ gap: verticalScale(15) }}>
          {referrals.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5, paddingVertical: verticalScale(20) }}>
              <Svg width={scale(40)} height={scale(40)} stroke={THEME.textSecondary} strokeWidth={1.5} fill="none" viewBox="0 0 24 24" style={{ marginBottom: verticalScale(10) }}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <Line x1="9" y1="9" x2="9.01" y2="9" />
                <Line x1="15" y1="9" x2="15.01" y2="9" />
              </Svg>
              <Text style={{ color: THEME.textSecondary, fontSize: scale(14) }}>{t('no_referrals')}</Text>
            </View>
          ) : (
            referrals.map((referral) => {
              const atIndex = referral.email.indexOf('@');
              const prefix = referral.email.substring(0, 3);
              const suffix = atIndex > 3 ? referral.email.substring(atIndex - 3, atIndex) : '';
              const maskedEmail = `${prefix}...${suffix}@test.com`;

              const timeSinceLastNotify = referral.lastNotified ? now - referral.lastNotified : Infinity;
              const canNotify = !referral.lastNotified || timeSinceLastNotify > COOLDOWN;

              let buttonText = t('notify');
              if (!canNotify) {
                const remaining = COOLDOWN - timeSinceLastNotify;
                const m = Math.floor(remaining / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                buttonText = `${m}:${s.toString().padStart(2, '0')}`;
              }

              return (
                <View key={referral.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12), flex: 1, marginRight: scale(10) }}>
                    <View
                      style={{
                        width: scale(36),
                        height: scale(36),
                        borderRadius: scale(18),
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.textSecondary }}>{referral.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: THEME.text, flexWrap: 'wrap' }}>{referral.name}</Text>
                      <Text style={{ fontSize: scale(11), color: THEME.textSecondary, flexWrap: 'wrap' }}>{maskedEmail}</Text>
                    </View>
                  </View>

                  {referral.status === 'active' ? (
                    <View
                      style={{
                        flexShrink: 0,
                        paddingHorizontal: scale(10),
                        paddingVertical: verticalScale(4),
                        borderRadius: 6,
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderWidth: 1,
                        borderColor: THEME.accent,
                      }}
                    >
                      <Text style={{ fontSize: scale(10), fontWeight: '600', color: THEME.accentDark }}>{t('active')}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => canNotify && handleNotify(referral.id)}
                      disabled={!canNotify}
                      style={[
                        {
                          flexShrink: 0,
                          paddingHorizontal: scale(12),
                          paddingVertical: verticalScale(6),
                          borderRadius: 6,
                          backgroundColor: canNotify ? THEME.accent : 'rgba(0,0,0,0.05)',
                          borderWidth: 1,
                          borderColor: canNotify ? THEME.accentDark : 'rgba(0,0,0,0.1)',
                          minWidth: scale(70),
                          alignItems: 'center',
                        },
                        canNotify &&
                          Platform.select({
                            ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
                            android: { elevation: 2 },
                          }),
                      ]}
                    >
                      <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: canNotify ? '#FFF' : THEME.textSecondary }}>{buttonText}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}