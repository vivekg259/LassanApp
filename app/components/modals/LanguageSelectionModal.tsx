import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { LANGUAGES } from '@/constants/languageOptions';

type Props = {
  styles: any;
  visible: boolean;
  language: string;
  setLanguage: (code: any) => void;
  onClose: () => void;
  t: (key: 'select_language' | 'cancel') => string;
};

export function LanguageSelectionModal(props: Props): React.JSX.Element {
  const { styles, visible, language, setLanguage, onClose, t } = props;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('select_language')}</Text>
          <ScrollView style={{ maxHeight: 300, width: '100%' }} showsVerticalScrollIndicator={false}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.languageOption, language === lang.code && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage(lang.code as any);
                  onClose();
                }}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, language === lang.code && styles.languageNameActive]}>
                  {lang.name}
                </Text>
                {language === lang.code && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
