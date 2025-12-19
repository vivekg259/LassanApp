/**
 * Hook for PersonalInfoScreen
 * Contains all state, validation logic, and handlers
 * Returns normalized { state, actions, flags } shape
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userDomain } from '../../domains/user';

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

  const handleUpdate = () => {
    userDomain.updateProfile({
      name,
      username,
      referrerCode,
      nameChangeCount,
      isReferrerLocked,
      showInfoAlert,
      setNameChangeCount,
      setIsReferrerLocked,
      router,
    });
  };

  return {
    state: {
      // Router & Insets
      router,
      insets,
      
      // Form State
      name,
      setName,
      nameChangeCount,
      username,
      setUsername,
      referrerCode,
      setReferrerCode,
      email,
      setEmail,
      phone,
      setPhone,
      address,
      setAddress,
      
      // Alert State
      customAlert,
      
      // Utils
      scale,
    },

    actions: {
      handleUpdate,
      closeAlert,
    },

    flags: {
      isReferrerLocked,
    },
  };
}
