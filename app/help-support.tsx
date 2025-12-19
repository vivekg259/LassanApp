/**
 * Screen Type: Route
 * Owns: FAQ accordion, contact support links (email, Telegram)
 * Scope: Self-contained
 * Reuse: Not reusable outside routing
 */
import { useLanguage } from '@/src/context/LanguageContext';
import { Stack } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { useHelpSupport } from '@/src/screens/help-support/useHelpSupport';

// Enable LayoutAnimation on Android (silent for new architecture)
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    try {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    } catch (e) {
      // Silently handle - not needed in new architecture
    }
  }
}

// --- THEME CONSTANTS ---
const THEME = {
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

export default function HelpSupportScreen() {
  const { t } = useLanguage();
  const { state, actions } = useHelpSupport();

  // Destructure for convenience
  const { router, insets, expandedFaq, scale } = state;
  const { toggleFaq, handleContact } = actions;

  const faqs = [
    { id: '1', question: t('faq_mining_q'), answer: t('faq_mining_a') },
    { id: '2', question: t('faq_kyc_q'), answer: t('faq_kyc_a') },
    { id: '3', question: t('faq_referral_q'), answer: t('faq_referral_a') },
    { id: '4', question: t('faq_wallet_q'), answer: t('faq_wallet_a') },
    { id: '5', question: t('faq_privacy_q'), answer: t('faq_privacy_a') },
    { id: '6', question: t('faq_register_q'), answer: t('faq_register_a') },
    { id: '7', question: t('faq_value_q'), answer: t('faq_value_a') },
    { id: '8', question: t('faq_multiple_q'), answer: t('faq_multiple_a') },
  ];

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
        backgroundColor: THEME.bg,
        zIndex: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
            android: { elevation: 2 }
        })
      }}>
        <TouchableOpacity 
            onPress={() => router.back()}
            style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: THEME.bg,
                alignItems: 'center', 
                justifyContent: 'center',
                ...Platform.select({
                    ios: { shadowColor: '#A68C1C', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: {width:2, height:2} },
                    android: { elevation: 4 }
                })
            }}
        >
            <Svg width={24} height={24} stroke={THEME.text} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <Polyline points="15 18 9 12 15 6" />
            </Svg>
        </TouchableOpacity>
        <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text, marginLeft: scale(15) }}>
            {t('menu_help')}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: scale(20), paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Support Section */}
        <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: 15 }}>
            {t('contact_support')}
        </Text>
        
        <View style={{ flexDirection: 'row', gap: 15, marginBottom: 30 }}>
            <TouchableOpacity 
                onPress={() => handleContact('email')}
                style={{ 
                    flex: 1, 
                    backgroundColor: THEME.bg, 
                    padding: 20, 
                    borderRadius: 16, 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.5)',
                    ...Platform.select({
                        ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:4, height:4} },
                        android: { elevation: 4 }
                    })
                }}
            >
                <Svg width={32} height={32} stroke={THEME.accent} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <Polyline points="4 7 12 13 20 7" />
                    <Polyline points="22 4 22 20 2 20 2 4 22 4" />
                </Svg>
                <Text style={{ marginTop: 10, fontWeight: '600', color: THEME.text }}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handleContact('telegram')}
                style={{ 
                    flex: 1, 
                    backgroundColor: THEME.bg, 
                    padding: 20, 
                    borderRadius: 16, 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.5)',
                    ...Platform.select({
                        ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:4, height:4} },
                        android: { elevation: 4 }
                    })
                }}
            >
                <Svg width={32} height={32} stroke={THEME.accent} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <Polyline points="22 2 11 13" />
                    <Polyline points="22 2 15 22 11 13 2 9 22 2" />
                </Svg>
                <Text style={{ marginTop: 10, fontWeight: '600', color: THEME.text }}>Telegram</Text>
            </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: THEME.text, marginBottom: 15 }}>
            {t('faq_title')}
        </Text>

        <View style={{ gap: 15 }}>
            {faqs.map((faq) => (
                <TouchableOpacity 
                    key={faq.id}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.8}
                    style={{ 
                        backgroundColor: THEME.bg, 
                        borderRadius: 16, 
                        padding: 16,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.5)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: {width:2, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: THEME.text, flex: 1, marginRight: 10 }}>
                            {faq.question}
                        </Text>
                        <Svg width={20} height={20} stroke={THEME.textSecondary} strokeWidth={2} fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            {expandedFaq === faq.id ? (
                                <Polyline points="18 15 12 9 6 15" />
                            ) : (
                                <Polyline points="6 9 12 15 18 9" />
                            )}
                        </Svg>
                    </View>
                    {expandedFaq === faq.id && (
                        <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
                            <Text style={{ fontSize: scale(13), color: THEME.textSecondary, lineHeight: 20 }}>
                                {faq.answer}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>

      </ScrollView>
    </View>
  );
}
