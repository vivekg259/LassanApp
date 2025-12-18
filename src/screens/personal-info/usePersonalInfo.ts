/**
 * Hook for PersonalInfoScreen
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

export function usePersonalInfo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('Vivek Gupta');
  const [nameChangeCount, setNameChangeCount] = useState(0);
  const [username, setUsername] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [isReferrerLocked, setIsReferrerLocked] = useState(false);
  const [email, setEmail] = useState('vivek.gupta@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Mumbai, India');

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

  const closeAlert = () => {
    setCustomAlert(prev => ({ ...prev, visible: false }));
  };

  // Mock existing usernames for validation
  const EXISTING_USERNAMES = ['admin', 'lassan', 'vivek', 'testuser'];

  const handleUpdate = () => {
    // Validate Username
    if (username.trim().length > 0) {
        const cleanUsername = username.trim();
        const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(cleanUsername);
        
        if (!isAlphanumeric) {
            showInfoAlert('Invalid Username', 'Username must contain only alphanumeric characters.');
            return;
        }

        if (EXISTING_USERNAMES.includes(cleanUsername.toLowerCase())) {
            showInfoAlert('Username Taken', 'This username is already taken. Please choose a unique one.');
            return;
        }
    }

    // Handle Name Change Limit
    if (name !== 'Vivek Gupta') { // Assuming 'Vivek Gupta' was the initial name
        if (nameChangeCount >= 2) {
            showInfoAlert('Limit Reached', 'You have reached the maximum limit of 2 name changes.');
            return;
        }
        setNameChangeCount(prev => prev + 1);
    }

    // Handle Referral Code
    if (referrerCode.trim().length > 0 && !isReferrerLocked) {
        // Simulate referral validation
        setIsReferrerLocked(true);
        showInfoAlert('Referral Success', 'Referral code applied! Your base mining rate has increased by 10%.');
    }

    // In a real app, this would make an API call
    showInfoAlert('Success', 'Profile updated successfully!', () => {
        router.back();
    });
  };

  return {
    // Router & Insets
    router,
    insets,
    
    // State
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
    
    // Alert State
    customAlert,
    closeAlert,
    
    // Handlers
    handleUpdate,
    
    // Utils
    scale,
  };
}
