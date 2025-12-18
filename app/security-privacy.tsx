/**
 * Screen Type: Route
 * Owns: Security settings (2FA toggle, biometric login, password change)
 * Scope: Self-contained
 * Reuse: Not reusable outside routing
 */
import { Stack } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

import { useSecurityPrivacy } from '@/src/screens/security-privacy/useSecurityPrivacy';

// --- THEME CONSTANTS ---
const THEME = {
  bg: '#f5ede1',
  text: '#5a4a3a',
  textSecondary: '#8b7355',
  shadowLight: '#ffffff',
  shadowDark: '#c4b5a0', 
  accent: '#d4af37',
  accentDark: '#a68c1c',
  danger: '#D32F2F',
  success: '#4CAF50',
  overlay: 'rgba(255, 255, 255, 0.5)',
  overlayDark: 'rgba(90, 74, 58, 0.08)'
};

export default function SecurityPrivacyScreen() {
  const {
    router,
    insets,
    is2FAEnabled,
    setIs2FAEnabled,
    isBiometricEnabled,
    setIsBiometricEnabled,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    customAlert,
    closeAlert,
    handleToggle2FA,
    handleToggleBiometric,
    handlePasswordUpdate,
    handleDeleteAccount,
    scale,
  } = useSecurityPrivacy();

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
        <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text }}>Security & Privacy</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ padding: scale(20), paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          
          {/* Security Settings Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.text, marginBottom: 15 }}>Security Settings</Text>
            
            {/* 2FA Toggle */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: scale(16),
                borderRadius: 16,
                marginBottom: 10,
                ...Platform.select({
                    ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                    android: { elevation: 2 }
                })
            }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text }}>Two-Factor Authentication</Text>
                    <Text style={{ fontSize: scale(12), color: THEME.textSecondary, marginTop: 4 }}>Add an extra layer of security to your account.</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(212, 175, 55, 0.5)" }}
                    thumbColor={is2FAEnabled ? THEME.accent : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleToggle2FA}
                    value={is2FAEnabled}
                />
            </View>

            {/* Biometric Toggle */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: scale(16),
                borderRadius: 16,
                ...Platform.select({
                    ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                    android: { elevation: 2 }
                })
            }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '600', color: THEME.text }}>Biometric Login</Text>
                    <Text style={{ fontSize: scale(12), color: THEME.textSecondary, marginTop: 4 }}>Use FaceID or Fingerprint to log in.</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(212, 175, 55, 0.5)" }}
                    thumbColor={isBiometricEnabled ? THEME.accent : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleToggleBiometric}
                    value={isBiometricEnabled}
                />
            </View>
          </View>

          {/* Change Password Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.text, marginBottom: 15 }}>Change Password</Text>
            
            <View style={{ marginBottom: 15, padding: scale(12), backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                <Text style={{ fontSize: scale(12), color: THEME.text, fontWeight: '600', marginBottom: 4 }}>Password Requirements:</Text>
                <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>• 8-14 characters long</Text>
                <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>• At least one uppercase & lowercase letter</Text>
                <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>• At least one number</Text>
                <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>• At least one special character (!, @, #, $, *)</Text>
            </View>

            <View style={{ gap: 15 }}>
                <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                    secureTextEntry
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)'
                    }}
                />
                <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    secureTextEntry
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)'
                    }}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)'
                    }}
                />
                
                <TouchableOpacity
                    onPress={handlePasswordUpdate}
                    style={{
                        backgroundColor: THEME.accent,
                        borderRadius: 16,
                        padding: scale(16),
                        alignItems: 'center',
                        marginTop: 5,
                        ...Platform.select({
                            ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width:0, height:3} },
                            android: { elevation: 3 }
                        })
                    }}
                >
                    <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: '#fff' }}>Update Password</Text>
                </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View>
            <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.danger, marginBottom: 15 }}>Danger Zone</Text>
            
            <TouchableOpacity
                onPress={handleDeleteAccount}
                style={{
                    backgroundColor: 'rgba(211, 47, 47, 0.05)',
                    borderRadius: 16,
                    padding: scale(16),
                    borderWidth: 1,
                    borderColor: 'rgba(211, 47, 47, 0.2)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10
                }}
            >
                <Svg width={scale(20)} height={scale(20)} stroke={THEME.danger} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                    <Path d="M3 6h18" />
                    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </Svg>
                <Text style={{ fontSize: scale(16), fontWeight: 'bold', color: THEME.danger }}>Delete Account</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: scale(12), color: THEME.textSecondary, marginTop: 8, textAlign: 'center' }}>
                This action is irreversible. All data will be lost.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert Modal */}
      <Modal
        visible={customAlert.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '80%', padding: 25 }]}>
            <Text style={[styles.modalTitle, { marginBottom: 10, textAlign: 'center' }]}>{customAlert.title}</Text>
            <Text style={{ fontSize: 16, color: THEME.text, textAlign: 'center', marginBottom: 25, lineHeight: 22 }}>
              {customAlert.message}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, width: '100%' }}>
              {customAlert.type === 'confirm' && (
                <TouchableOpacity
                  style={[styles.modalCloseButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: THEME.textSecondary, flex: 1, marginTop: 0 }]}
                  onPress={closeAlert}
                >
                  <Text style={[styles.modalCloseText, { color: THEME.textSecondary }]}>{customAlert.cancelText || 'Cancel'}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.modalCloseButton, { flex: 1, marginTop: 0, backgroundColor: THEME.accent, alignItems: 'center', justifyContent: 'center' }]}
                onPress={() => {
                  if (customAlert.onConfirm) customAlert.onConfirm();
                  closeAlert();
                }}
              >
                <Text style={[styles.modalCloseText, { color: '#FFF' }]}>
                  {customAlert.type === 'confirm' ? (customAlert.confirmText || 'Yes') : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME.bg,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: THEME.text,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: THEME.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
