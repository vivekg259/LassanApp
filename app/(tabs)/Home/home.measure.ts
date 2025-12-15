import { Dimensions, Platform } from 'react-native';

type LayoutRect = { x: number; y: number; width: number; height: number };

type MeasureableRef = { current: any | null };

type SetLayout = (layout: LayoutRect) => void;

type MeasureHomeAnchorsArgs = {
  leftBtnRef: MeasureableRef;
  rightBtnRef: MeasureableRef;
  headerRef: MeasureableRef;
  hubRef: MeasureableRef;
  hubOriginRef: MeasureableRef;
  headerInnerRef: MeasureableRef;
  powerBtnRef: MeasureableRef;
  setLeftBtnLayout: SetLayout;
  setRightBtnLayout: SetLayout;
  setHeaderLayout: SetLayout;
  setHubLayout: SetLayout;
  setHubOriginLayout: SetLayout;
  setHeaderInnerLayout: SetLayout;
  setPowerLayout: SetLayout;
};

const tryMeasure = (ref: MeasureableRef, setLayout: SetLayout) => {
  if (ref?.current && typeof ref.current.measure === 'function') {
    ref.current.measure((fx: number, fy: number, w: number, h: number, px: number, py: number) => {
      setLayout({ x: px, y: py, width: w, height: h });
    });
  }
};

export const measureHomeAnchorsAction = (args: MeasureHomeAnchorsArgs) => {
  try {
    tryMeasure(args.leftBtnRef, args.setLeftBtnLayout);
    tryMeasure(args.rightBtnRef, args.setRightBtnLayout);
    tryMeasure(args.headerRef, args.setHeaderLayout);
    tryMeasure(args.hubRef, args.setHubLayout);
    tryMeasure(args.hubOriginRef, args.setHubOriginLayout);
    tryMeasure(args.headerInnerRef, args.setHeaderInnerLayout);
    tryMeasure(args.powerBtnRef, args.setPowerLayout);
  } catch {
    // ignore measurement errors on web or unsupported platforms
  }
};

export const scheduleInitialMeasurements = (measure: () => void, firstMs = 80, secondMs = 220) => {
  const t1 = setTimeout(measure, firstMs);
  const t2 = setTimeout(measure, secondMs);
  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };
};

export const setupResizeMeasurementObserver = (measure: () => void) => {
  const runMeasure = () => {
    // use rAF on web if available for smoother reflow
    if (typeof window !== 'undefined' && (window as any).requestAnimationFrame) {
      (window as any).requestAnimationFrame(() => measure());
    } else {
      setTimeout(measure, 50);
    }
  };

  // RN Dimensions subscription
  let dimSub: any = null;
  try {
    if (Dimensions && (Dimensions as any).addEventListener) {
      // newer RN returns an EmitterSubscription
      dimSub = Dimensions.addEventListener('change', runMeasure as any);
    }
  } catch {
    // ignore
  }

  // Web fallback
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.addEventListener('resize', runMeasure);
  }

  return () => {
    try {
      if (dimSub && typeof dimSub.remove === 'function') dimSub.remove();
      // older RN might return a function
      if (typeof dimSub === 'function') dimSub();
    } catch {}

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.removeEventListener('resize', runMeasure);
    }
  };
};
