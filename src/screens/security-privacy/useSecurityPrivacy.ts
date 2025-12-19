/**
 * Hook for SecurityPrivacyScreen
 * Contains all state, validation logic, and handlers
 * Returns normalized { state, actions, flags } shape
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { securityDomain } from '../../domains/security';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const scaleWidth = isTablet ? width * 0.6 : width;
const scale = (size: number): number => (scaleWidth / 375) * size;

export function useSecurityPrivacy() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State for toggles
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  
  // State for Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Custom Alert State
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'info' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showInfoAlert = (title: string, message: string, onConfirm?: () => void) => {
    setCustomAlert({
      visible: true,
      title,
      message,
      type: 'info',
      onConfirm
    });
  };

  const showConfirmAlert = (title: string, message: string, onConfirm: () => void, confirmText = 'Yes', cancelText = 'Cancel') => {
    setCustomAlert({
      visible: true,
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText,
      cancelText
    });
  };

  const closeAlert = () => {
    setCustomAlert(prev => ({ ...prev, visible: false }));
  };

  const handleToggle2FA = (value: boolean) => {
    securityDomain.toggle2FA({
      value,
      setIs2FAEnabled,
      showConfirmAlert,
    });
  };

  const handleToggleBiometric = (value: boolean) => {
    securityDomain.toggleBiometric({
      value,
      setIsBiometricEnabled,
      showConfirmAlert,
      showInfoAlert,
    });
  };

  const handlePasswordUpdate = () => {
    securityDomain.updatePassword({
      currentPassword,
      newPassword,
      confirmPassword,
      showInfoAlert,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    });
  };

  const handleDeleteAccount = () => {
    router.push('/delete-account');
  };

  return {
    state: {
      // Router & Insets
      router,
      insets,
      
      // Password State
      currentPassword,
      setCurrentPassword,
      newPassword,
      setNewPassword,
      confirmPassword,
      setConfirmPassword,
      
      // Alert State
      customAlert,
      
      // Utils
      scale,
    },

    actions: {
      handleToggle2FA,
      handleToggleBiometric,
      handlePasswordUpdate,
      handleDeleteAccount,
      closeAlert,
    },

    flags: {
      is2FAEnabled,
      isBiometricEnabled,
    },
  };
}
