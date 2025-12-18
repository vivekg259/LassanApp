/**
 * Screen-level hook for HomeScreen container
 * Wraps useHomeScreen for screen ownership indirection
 */
import { useHomeScreen } from '@/src/hooks/useHomeScreen';

export function useHomeContainer() {
  return useHomeScreen();
}
