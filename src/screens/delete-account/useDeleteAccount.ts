/**
 * Hook for DeleteAccountScreen
 * Contains all state and handlers
 * Returns normalized { state, actions, flags } shape
 */
import { useRouter } from 'expo-router';
import { Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userDomain } from '../../domains/user';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const scaleWidth = isTablet ? width * 0.6 : width;
const scale = (size: number): number => (scaleWidth / 375) * size;

export function useDeleteAccount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleFinalDelete = () => {
    userDomain.deleteAccount(router, Alert);
  };

  return {
    state: {
      // Router & Insets
      router,
      insets,
      
      // Utils
      scale,
    },

    actions: {
      handleFinalDelete,
    },

    flags: {},
  };
}
