/**
 * Hook for DeleteAccountScreen
 * Contains all state and handlers
 */
import { useRouter } from 'expo-router';
import { Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const scaleWidth = isTablet ? width * 0.6 : width;
const scale = (size: number): number => (scaleWidth / 375) * size;

export function useDeleteAccount() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleFinalDelete = () => {
    Alert.alert(
        'Final Confirmation',
        'This is your last chance. Are you absolutely sure?',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Yes, Delete Everything', 
                style: 'destructive',
                onPress: () => {
                    // Simulate deletion
                    Alert.alert('Account Deleted', 'We are sad to see you go. Your account has been deleted.');
                    router.replace('/'); // Navigate to login/home
                }
            }
        ]
    );
  };

  return {
    // Router & Insets
    router,
    insets,
    
    // Handlers
    handleFinalDelete,
    
    // Utils
    scale,
  };
}
