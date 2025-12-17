import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';

import { THEME } from '@/src/constants/theme';

type SocialTaskRecord = {
  id: string;
  title: string;
  reward: number;
  icon: 'Send' | 'Twitter' | 'Youtube' | 'MessageCircle';
  status: 'pending' | 'verifying' | 'completed';
  url: string;
};

type ReferralMilestone = {
  id: string;
  target: number;
  title: string;
  rewardDisplay: string;
  minReward: number;
  maxReward: number;
  status: 'pending' | 'completed';
};

type RewardsTabProps = {
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  miningStreak: number;
  socialTasks: SocialTaskRecord[];
  handleSocialTask: (id: string, reward: number, url: string, status: string) => void;
  referralMilestones: ReferralMilestone[];
  validReferralsCount: number;
  handleClaimReferralMilestone: (id: string, minReward: number, maxReward: number) => void;
  t: (
    key:
      | 'daily_streak'
      | 'streak_desc'
      | 'day'
      | 'social_tasks'
      | 'airdrop_eligibility'
      | 'airdrop_desc'
  ) => string;
};

export function RewardsTab(props: RewardsTabProps): React.JSX.Element {
  const {
    scale,
    verticalScale,
    miningStreak,
    socialTasks,
    handleSocialTask,
    referralMilestones,
    validReferralsCount,
    handleClaimReferralMilestone,
    t,
  } = props;

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingHorizontal: scale(4), paddingBottom: verticalScale(80), paddingTop: verticalScale(10) }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Daily Streak Card */}
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(15) }}>
          <View>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>{t('daily_streak')}</Text>
            <Text style={{ fontSize: scale(12), color: THEME.textSecondary }}>{t('streak_desc')}</Text>
          </View>
          <View
            style={{
              paddingHorizontal: scale(12),
              paddingVertical: verticalScale(6),
              borderRadius: 12,
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              borderWidth: 1,
              borderColor: THEME.accent,
            }}
          >
            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: THEME.accentDark }}>{miningStreak}/7 {t('day')}s</Text>
          </View>
        </View>

        {/* Streak Visualizer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day <= miningStreak;
            const isToday = day === miningStreak + 1;

            return (
              <View key={day} style={{ alignItems: 'center', gap: verticalScale(6) }}>
                <View
                  style={{
                    width: scale(32),
                    height: scale(32),
                    borderRadius: scale(16),
                    backgroundColor: isCompleted ? THEME.accent : isToday ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.05)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: isToday ? 1 : 0,
                    borderColor: THEME.accent,
                  }}
                >
                  {isCompleted ? (
                    <Svg width={scale(16)} height={scale(16)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  ) : (
                    <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: isToday ? THEME.accentDark : THEME.textSecondary }}>{day}</Text>
                  )}
                </View>
                <Text style={{ fontSize: scale(10), color: THEME.textSecondary }}>{t('day')} {day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Social Tasks */}
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
        <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: verticalScale(15) }}>{t('social_tasks')}</Text>

        <View style={{ gap: verticalScale(12) }}>
          {socialTasks.map((task) => (
            <View
              key={task.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: scale(12),
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
                <View
                  style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(10),
                    backgroundColor: THEME.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...Platform.select({
                      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
                      android: { elevation: 2 },
                    }),
                  }}
                >
                  <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                    {task.icon === 'Send' && <Line x1="22" y1="2" x2="11" y2="13" />}
                    {task.icon === 'Send' && <Polygon points="22 2 15 22 11 13 2 9 22 2" />}

                    {task.icon === 'Twitter' && (
                      <Path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    )}

                    {task.icon === 'Youtube' && (
                      <>
                        <Path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                        <Polygon points="10 15 15 12 10 9" fill={THEME.text} stroke="none" />
                      </>
                    )}

                    {task.icon === 'MessageCircle' && (
                      <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    )}
                  </Svg>
                </View>
                <View>
                  <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{task.title}</Text>
                  <Text style={{ fontSize: scale(12), color: THEME.accentDark, fontWeight: 'bold' }}>+{task.reward} LSN</Text>
                </View>
              </View>

              {task.status === 'completed' ? (
                <View
                  style={{
                    width: scale(24),
                    height: scale(24),
                    borderRadius: scale(12),
                    backgroundColor: THEME.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#e5c27a',
                    ...Platform.select({
                      ios: { shadowColor: '#e5c27a', shadowOpacity: 0.6, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
                      android: { elevation: 6, shadowColor: '#e5c27a' },
                    }),
                  }}
                >
                  <Svg width={scale(14)} height={scale(14)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                    <Polyline points="20 6 9 17 4 12" />
                  </Svg>
                </View>
              ) : task.status === 'verifying' ? (
                <TouchableOpacity
                  onPress={() => handleSocialTask(task.id, task.reward, task.url, task.status)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(6),
                    borderRadius: 12,
                    backgroundColor: THEME.accent,
                    borderWidth: 1,
                    borderColor: THEME.accentDark,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${task.title} Verify`}
                >
                  <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: '#FFF' }}>VERIFY</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleSocialTask(task.id, task.reward, task.url, task.status)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(6),
                    borderRadius: 12,
                    backgroundColor: THEME.text,
                    borderWidth: 1,
                    borderColor: THEME.textSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: THEME.bg }}>GO</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 3. Referral Milestones */}
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
        <View style={{ marginBottom: verticalScale(15) }}>
          <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text }}>Referral Milestones</Text>
          <Text style={{ fontSize: scale(11), color: THEME.textSecondary, marginTop: 4 }}>* Valid referral: Active for 3+ consecutive days</Text>
        </View>

        <View style={{ gap: verticalScale(12) }}>
          {referralMilestones.map((milestone) => {
            const progress = Math.min(validReferralsCount, milestone.target);
            const isUnlocked = validReferralsCount >= milestone.target;
            const isClaimed = milestone.status === 'completed';

            return (
              <View
                key={milestone.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: scale(12),
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12), flex: 1 }}>
                  <View
                    style={{
                      width: scale(40),
                      height: scale(40),
                      borderRadius: scale(10),
                      backgroundColor: THEME.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...Platform.select({
                        ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
                        android: { elevation: 2 },
                      }),
                    }}
                  >
                    <Svg width={scale(20)} height={scale(20)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <Circle cx="9" cy="7" r="4" />
                      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </Svg>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text }}>{milestone.title}</Text>
                    <Text style={{ fontSize: scale(12), color: THEME.accentDark, fontWeight: 'bold' }}>+{milestone.rewardDisplay} LSN</Text>
                    <View style={{ marginTop: verticalScale(4), height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, width: '80%' }}>
                      <View
                        style={{
                          height: '100%',
                          width: `${(progress / milestone.target) * 100}%`,
                          backgroundColor: THEME.accent,
                          borderRadius: 2,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: scale(10), color: THEME.textSecondary, marginTop: 2 }}>{progress}/{milestone.target}</Text>
                  </View>
                </View>

                {isClaimed ? (
                  <View
                    style={{
                      width: scale(24),
                      height: scale(24),
                      borderRadius: scale(12),
                      backgroundColor: THEME.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#e5c27a',
                    }}
                  >
                    <Svg width={scale(14)} height={scale(14)} stroke="#FFF" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleClaimReferralMilestone(milestone.id, milestone.minReward, milestone.maxReward)}
                    disabled={!isUnlocked}
                    style={{
                      paddingHorizontal: scale(12),
                      paddingVertical: verticalScale(6),
                      borderRadius: 12,
                      backgroundColor: isUnlocked ? THEME.accent : 'rgba(0,0,0,0.05)',
                      borderWidth: 1,
                      borderColor: isUnlocked ? THEME.accentDark : 'rgba(0,0,0,0.1)',
                    }}
                  >
                    <Text style={{ fontSize: scale(10), fontWeight: 'bold', color: isUnlocked ? '#FFF' : THEME.textSecondary }}>
                      {isUnlocked ? 'CLAIM' : 'LOCKED'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 4. Airdrop Info */}
      <View
        style={{
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderRadius: 20,
          padding: scale(20),
          borderWidth: 1,
          borderColor: THEME.accent,
          borderStyle: 'dashed',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(10) }}>
          <Svg width={scale(24)} height={scale(24)} stroke={THEME.accentDark} strokeWidth={2} fill="none" viewBox="0 0 24 24">
            <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <Polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <Line x1="12" y1="22.08" x2="12" y2="12" />
          </Svg>
          <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.accentDark }}>{t('airdrop_eligibility')}</Text>
        </View>
        <Text style={{ fontSize: scale(13), color: THEME.text, lineHeight: scale(20) }}>{t('airdrop_desc')}</Text>
      </View>
    </ScrollView>
  );
}