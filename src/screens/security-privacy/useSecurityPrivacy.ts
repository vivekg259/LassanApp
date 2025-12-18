/**
 * Hook for SecurityPrivacyScreen
 * Contains all state, validation logic, and handlers
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    if (value) {
        showConfirmAlert(
            "Enable 2FA",
            "We will send a verification code to your registered email/phone to enable Two-Factor Authentication.",
            () => {
                // Simulate sending code
                // We need to close the current alert first, then show the next one.
                // Since closeAlert is async in terms of React state, we might need a small timeout or just set the new state directly.
                // However, setting state directly overwrites the previous one, which is fine.
                setTimeout(() => {
                    showConfirmAlert("Code Sent", "Please enter the code sent to your device (Simulated).", () => {
                        setIs2FAEnabled(true);
                    }, "Verify", "Cancel");
                }, 300);
            },
            "Send Code",
            "Cancel"
        );
    } else {
        showConfirmAlert(
            "Disable 2FA",
            "Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.",
            () => setIs2FAEnabled(false),
            "Disable",
            "Cancel"
        );
    }
  };

  const handleToggleBiometric = (value: boolean) => {
    if (value) {
        // Simulate biometric prompt
        showConfirmAlert("Biometric Setup", "Please authenticate to enable biometric login.", () => {
            // Simulate success
            setIsBiometricEnabled(true);
            setTimeout(() => {
                showInfoAlert("Success", "Biometric login enabled.");
            }, 300);
        }, "Authenticate", "Cancel");
    } else {
        setIsBiometricEnabled(false);
    }
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        showInfoAlert('Error', 'Please fill in all password fields.');
        return;
    }
    if (newPassword !== confirmPassword) {
        showInfoAlert('Error', 'New passwords do not match.');
        return;
    }
    
    // Password Validation Logic
    // Length: 8-14 chars
    if (newPassword.length < 8 || newPassword.length > 14) {
        showInfoAlert('Invalid Password', 'Password must be between 8 and 14 characters long.');
        return;
    }

    // One lowercase letter
    if (!/[a-z]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one lowercase letter.');
        return;
    }

    // One uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one uppercase letter.');
        return;
    }

    // One number
    if (!/[0-9]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one number.');
        return;
    }

    // One special character (only !,@,#,$,*)
    if (!/[!@#$*]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password must contain at least one special character (!, @, #, $, *).');
        return;
    }

    // Check for forbidden characters (anything that is NOT alphanumeric OR allowed special chars)
    if (/[^a-zA-Z0-9!@#$*]/.test(newPassword)) {
        showInfoAlert('Invalid Password', 'Password contains invalid characters. Only letters, numbers, and !, @, #, $, * are allowed.');
        return;
    }
    
    // Simulate API call
    showInfoAlert('Success', 'Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    router.push('/delete-account');
  };

  return {
    // Router & Insets
    router,
    insets,
    
    // State
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
    
    // Alert State
    customAlert,
    closeAlert,
    
    // Handlers
    handleToggle2FA,
    handleToggleBiometric,
    handlePasswordUpdate,
    handleDeleteAccount,
    
    // Utils
    scale,
  };
}
