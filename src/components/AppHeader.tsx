import React from 'react';
import { Text, View } from 'react-native';

type AnyRef = React.RefObject<any>;

type Props = {
  styles: any;
  verticalScale: (size: number) => number;
  powerOn: boolean;
  activeTab: 'home' | 'referral' | 'explore' | 'user' | 'rewards';
  balance: number;
  t: (key: 'tab_referral' | 'tab_explore' | 'user_settings' | 'tab_rewards') => string;
  headerRef: AnyRef;
  headerInnerRef: AnyRef;
  onMeasure: () => void;
};

export function AppHeader(props: Props): React.JSX.Element {
  const {
    styles,
    verticalScale,
    powerOn,
    activeTab,
    balance,
    t,
    headerRef,
    headerInnerRef,
    onMeasure,
  } = props;

  return (
    <View style={styles.header} ref={headerRef} onLayout={() => onMeasure()}>
      <View style={styles.balanceContainer}>
        <View
          ref={headerInnerRef}
          onLayout={() => onMeasure()}
          style={[
            styles.balanceDisplay,
            { width: '100%' },
            powerOn && styles.balanceActive,
            activeTab !== 'home' && { paddingVertical: verticalScale(8) },
          ]}
        >
          {activeTab === 'referral' ? (
            <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_referral')}</Text>
          ) : activeTab === 'explore' ? (
            <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_explore')}</Text>
          ) : activeTab === 'user' ? (
            <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('user_settings')}</Text>
          ) : activeTab === 'rewards' ? (
            <Text style={[styles.balanceText, { fontWeight: 'bold', fontSize: 20 }]}>{t('tab_rewards')}</Text>
          ) : (
            <Text style={styles.balanceText}>{balance.toFixed(4)} LSN</Text>
          )}
        </View>
      </View>
    </View>
  );
}