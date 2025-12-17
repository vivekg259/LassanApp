import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { THEME } from '@/src/constants/theme';

type Props = {
  styles: any;
  visible: boolean;
  title: string;
  message: string;
  type: 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (() => void) | null;
  onClose: () => void;
};

export function CustomAlertModal(props: Props): React.JSX.Element {
  const {
    styles,
    visible,
    title,
    message,
    type,
    confirmText,
    cancelText,
    onConfirm,
    onClose,
  } = props;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: '80%', padding: 25 }]}>
          <Text style={[styles.modalTitle, { marginBottom: 10, textAlign: 'center' }]}>{title}</Text>
          <Text
            style={{
              fontSize: 16,
              color: THEME.text,
              textAlign: 'center',
              marginBottom: 25,
              lineHeight: 22,
            }}
          >
            {message}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, width: '100%' }}>
            {type === 'confirm' && (
              <TouchableOpacity
                style={[
                  styles.modalCloseButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: THEME.textSecondary,
                    flex: 1,
                    marginTop: 0,
                  },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.modalCloseText, { color: THEME.textSecondary }]}>
                  {cancelText || 'Cancel'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalCloseButton, { flex: 1, marginTop: 0, backgroundColor: THEME.accent }]}
              onPress={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              <Text style={[styles.modalCloseText, { color: '#FFF' }]}>
                {type === 'confirm' ? confirmText || 'Yes' : 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
