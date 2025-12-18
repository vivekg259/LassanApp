/**
 * Hook for HelpSupportScreen
 * Contains all state and handlers (logic only)
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, LayoutAnimation, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const scaleWidth = isTablet ? width * 0.6 : width;
const scale = (size: number): number => (scaleWidth / 375) * size;

export function useHelpSupport() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContact = (type: 'email' | 'telegram') => {
    if (type === 'email') {
      Linking.openURL('mailto:support@lassan.network');
    } else {
      Linking.openURL('https://t.me/LassanSupport');
    }
  };

  return {
    // Router & Insets
    router,
    insets,
    
    // State
    expandedFaq,
    
    // Handlers
    toggleFaq,
    handleContact,
    
    // Utils
    scale,
  };
}
