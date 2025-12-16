import { Animated, Easing } from 'react-native';

export function runFadeInOnTabChange(params: {
  fadeAnim: Animated.Value;
  activeTab: string;
}): void {
  const { fadeAnim } = params;

  fadeAnim.setValue(0);
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 400,
    useNativeDriver: true,
    easing: Easing.out(Easing.cubic),
  }).start();
}

export function runModalScaleOnOpen(params: {
  modalScaleAnim: Animated.Value;
  activeModal: string | null;
}): void {
  const { modalScaleAnim, activeModal } = params;
  if (!activeModal) return;

  modalScaleAnim.setValue(0.8);
  Animated.spring(modalScaleAnim, {
    toValue: 1,
    useNativeDriver: true,
    speed: 20,
    bounciness: 12,
  }).start();
}

export function setupBreathingAnimation(params: {
  breatheAnim: Animated.Value;
  powerOn: boolean;
}): void {
  const { breatheAnim, powerOn } = params;

  if (powerOn) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  } else {
    breatheAnim.setValue(1);
  }
}

export function setupDualAnimatedValueMirrors(params: {
  leftAnim: Animated.Value;
  rightAnim: Animated.Value;
  setLeft: (value: number) => void;
  setRight: (value: number) => void;
}): () => void {
  const { leftAnim, rightAnim, setLeft, setRight } = params;

  const leftId = leftAnim.addListener(({ value }) => setLeft(value));
  const rightId = rightAnim.addListener(({ value }) => setRight(value));

  return () => {
    try {
      leftAnim.removeListener(leftId);
    } catch {}
    try {
      rightAnim.removeListener(rightId);
    } catch {}
  };
}

export function runBundleSnapAnimation(params: {
  leftAnim: Animated.Value;
  rightAnim: Animated.Value;
  targetLeft: number;
  targetRight: number;
  durationMs?: number;
}): void {
  const { leftAnim, rightAnim, targetLeft, targetRight, durationMs = 32 } = params;

  Animated.timing(leftAnim, {
    toValue: targetLeft,
    duration: durationMs,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();

  Animated.timing(rightAnim, {
    toValue: targetRight,
    duration: durationMs,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
}
