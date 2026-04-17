// 「いきますかー」送信成功時のオーバーレイ
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { colors } from '../config/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SendOverlay({ visible, onClose }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.6);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const handleClose = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
          <Text style={styles.emoji}>🍺</Text>
          <Text style={styles.title}>気分、置いておきました</Text>
          <Text style={styles.sub}>友達に通知が届きました</Text>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>とじる</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(255,249,236,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  closeBtn: {
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(26,26,26,0.06)',
  },
  closeText: {
    fontSize: 14,
    color: colors.text,
  },
});
