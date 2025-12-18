/**
 * Screen Type: Route
 * Owns: User profile editor (name, username, email, phone, address, referrer code)
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
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { THEME } from '@/src/constants/theme';
import { usePersonalInfo } from '@/src/screens/personal-info/usePersonalInfo';

export default function PersonalInfoScreen() {
  const {
    router,
    insets,
    name,
    setName,
    nameChangeCount,
    username,
    setUsername,
    referrerCode,
    setReferrerCode,
    isReferrerLocked,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    customAlert,
    closeAlert,
    handleUpdate,
    scale,
  } = usePersonalInfo();

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
        <Text style={{ fontSize: scale(20), fontWeight: 'bold', color: THEME.text }}>Personal Information</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ padding: scale(20), paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{ 
                width: scale(100), 
                height: scale(100), 
                borderRadius: scale(50), 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: THEME.accent,
                marginBottom: 10
            }}>
                <Text style={{ fontSize: scale(40), fontWeight: 'bold', color: THEME.accentDark }}>V</Text>
            </View>
            
            {/* KYC Status Section */}
            <View style={{ 
                marginTop: 10,
                paddingHorizontal: scale(16),
                paddingVertical: scale(8),
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#FFC107',
                alignItems: 'center'
            }}>
                <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: '#FFC107', marginBottom: 2 }}>KYC Status: Pending</Text>
                <Text style={{ fontSize: scale(11), color: THEME.textSecondary }}>KYC verification will open soon</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 20 }}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginLeft: 4 }}>
                    <Text style={{ fontSize: scale(14), color: THEME.textSecondary }}>Full Name (as per document)</Text>
                    <Text style={{ fontSize: scale(10), color: nameChangeCount >= 2 ? '#D32F2F' : THEME.accentDark }}>
                        {nameChangeCount >= 2 ? 'Locked' : `${2 - nameChangeCount} changes left`}
                    </Text>
                </View>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    editable={nameChangeCount < 2}
                    style={{
                        backgroundColor: nameChangeCount >= 2 ? '#f0f0f0' : '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: nameChangeCount >= 2 ? '#999' : THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
                {nameChangeCount < 2 && (
                    <Text style={{ fontSize: scale(10), color: '#D32F2F', marginTop: 4, marginLeft: 4 }}>
                        Warning: You can only change your full name twice.
                    </Text>
                )}
            </View>

            <View>
                <Text style={{ fontSize: scale(14), color: THEME.textSecondary, marginBottom: 8, marginLeft: 4 }}>Username</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter unique username"
                    autoCapitalize="none"
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
                <Text style={{ fontSize: scale(10), color: THEME.textSecondary, marginTop: 4, marginLeft: 4 }}>
                    Alphanumeric only. Must be unique across the lassan network community.
                </Text>
            </View>

            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginLeft: 4 }}>
                    <Text style={{ fontSize: scale(14), color: THEME.textSecondary }}>Referrer Code</Text>
                    {isReferrerLocked && <Text style={{ fontSize: scale(10), color: '#4CAF50' }}>Applied</Text>}
                </View>
                <TextInput
                    value={referrerCode}
                    onChangeText={setReferrerCode}
                    editable={!isReferrerLocked}
                    placeholder={isReferrerLocked ? "Code Applied" : "Enter code if you have one"}
                    autoCapitalize="characters"
                    style={{
                        backgroundColor: isReferrerLocked ? '#f0f0f0' : '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: isReferrerLocked ? '#4CAF50' : THEME.text,
                        borderWidth: 1,
                        borderColor: isReferrerLocked ? '#4CAF50' : 'rgba(0,0,0,0.05)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
                {!isReferrerLocked && (
                    <Text style={{ fontSize: scale(10), color: THEME.accentDark, marginTop: 4, marginLeft: 4 }}>
                        Enter code to get +10% boost in LSN/hr rate. Cannot be changed later.
                    </Text>
                )}
            </View>

            <View>
                <Text style={{ fontSize: scale(14), color: THEME.textSecondary, marginBottom: 8, marginLeft: 4 }}>Email Address</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
            </View>

            <View>
                <Text style={{ fontSize: scale(14), color: THEME.textSecondary, marginBottom: 8, marginLeft: 4 }}>Phone Number</Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
            </View>

            <View>
                <Text style={{ fontSize: scale(14), color: THEME.textSecondary, marginBottom: 8, marginLeft: 4 }}>Address</Text>
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: scale(16),
                        fontSize: scale(16),
                        color: THEME.text,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.05)',
                        minHeight: scale(80),
                        textAlignVertical: 'top',
                        ...Platform.select({
                            ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2} },
                            android: { elevation: 2 }
                        })
                    }}
                />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdate}
            style={{
                marginTop: 40,
                backgroundColor: THEME.accent,
                borderRadius: 20,
                padding: scale(18),
                alignItems: 'center',
                ...Platform.select({
                    ios: { shadowColor: THEME.accent, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width:0, height:5} },
                    android: { elevation: 5 }
                })
            }}
          >
            <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: '#fff' }}>Update Profile</Text>
          </TouchableOpacity>

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
