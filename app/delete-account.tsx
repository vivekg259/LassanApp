/**
 * Screen Type: Route
 * Owns: Account deletion confirmation flow with warnings and final approval
 * Scope: Self-contained
 * Reuse: Not reusable outside routing
 */
import { Stack } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { useDeleteAccount } from '@/src/screens/delete-account/useDeleteAccount';

// --- THEME CONSTANTS ---
const THEME = {
  bg: '#f5ede1',
  text: '#5a4a3a',
  textSecondary: '#8b7355',
  accent: '#d4af37',
  accentDark: '#a68c1c',
  danger: '#D32F2F',
};

export default function DeleteAccountScreen() {
  const {
    router,
    insets,
    handleFinalDelete,
    scale,
  } = useDeleteAccount();

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top + 10, 
        paddingBottom: 20, 
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(15)
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            width: scale(40),
            height: scale(40),
            borderRadius: 20,
            backgroundColor: THEME.bg,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: {width:0, height:2} },
              android: { elevation: 3 }
            })
          }}
        >
          <Svg width={scale(24)} height={scale(24)} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24">
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </TouchableOpacity>
        <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text }}>Delete Account</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: scale(20), paddingBottom: 100, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={{ 
            width: scale(100), 
            height: scale(100), 
            borderRadius: scale(50), 
            backgroundColor: 'rgba(211, 47, 47, 0.1)', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 20
        }}>
            <Svg width={scale(50)} height={scale(50)} stroke={THEME.danger} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <Path d="M12 9v4" />
                <Path d="M12 17h.01" />
            </Svg>
        </View>

        <Text style={{ fontSize: scale(24), fontWeight: 'bold', color: THEME.text, textAlign: 'center', marginBottom: 10 }}>
            Are you sure you want to leave?
        </Text>

        <Text style={{ fontSize: scale(16), color: THEME.textSecondary, textAlign: 'center', marginBottom: 30, lineHeight: 24 }}>
            Deleting your account is permanent. You will lose access to the Lassan Network and all your accumulated benefits.
        </Text>

        <View style={{ width: '100%', gap: 15, marginBottom: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fff', padding: 15, borderRadius: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(212, 175, 55, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={20} height={20} stroke={THEME.accentDark} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                        <Circle cx="12" cy="12" r="10" />
                        <Polyline points="12 6 12 12 16 14" />
                    </Svg>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: THEME.text, fontSize: 16 }}>Mining Progress</Text>
                    <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>You will lose all your mined LSN tokens and streak.</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fff', padding: 15, borderRadius: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(212, 175, 55, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={20} height={20} stroke={THEME.accentDark} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <Circle cx="9" cy="7" r="4" />
                        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </Svg>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: THEME.text, fontSize: 16 }}>Community Status</Text>
                    <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>Your unique username and network position will be released.</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fff', padding: 15, borderRadius: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(212, 175, 55, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={20} height={20} stroke={THEME.accentDark} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                        <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </Svg>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: THEME.text, fontSize: 16 }}>Future Airdrops</Text>
                    <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>You will be ineligible for all upcoming Lassan airdrops.</Text>
                </View>
            </View>
        </View>

        <TouchableOpacity
            onPress={() => router.back()}
            style={{
                width: '100%',
                backgroundColor: THEME.accent,
                borderRadius: 16,
                padding: scale(16),
                alignItems: 'center',
                marginBottom: 15,
                ...Platform.select({
                    ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width:0, height:3} },
                    android: { elevation: 3 }
                })
            }}
        >
            <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: '#fff' }}>Keep My Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleFinalDelete}
            style={{
                padding: scale(16),
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.danger }}>I understand, delete my account</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
