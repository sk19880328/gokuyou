// 通知カード
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../config/colors';
import type { Notification } from '../hooks/useNotifications';

type Props = {
  notification: Notification;
  onReact?: () => Promise<void> | void;
};

function formatTime(ts: any): string {
  try {
    const ms = ts?.toMillis?.() ?? 0;
    if (!ms) return '';
    const date = new Date(ms);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return '';
  }
}

export default function NotificationCard({ notification, onReact }: Props) {
  const [busy, setBusy] = useState(false);
  const isReaction = notification.type === 'reaction';
  const unread = !notification.isRead && !notification.reactedBy && !isReaction;

  const handlePress = async () => {
    if (busy || !onReact) return;
    setBusy(true);
    try {
      await onReact();
    } finally {
      setBusy(false);
    }
  };

  const message = isReaction
    ? `${notification.senderName}さんが「かー」しました🍺`
    : `${notification.senderName}さんがちょい飲みの気分`;

  return (
    <View style={[styles.card, unread ? styles.cardUnread : styles.cardRead]}>
      {unread && <View style={styles.bar} />}
      <View
        style={[
          styles.avatar,
          { backgroundColor: isReaction ? colors.shu : colors.yamabuki },
        ]}
      >
        <Text style={styles.avatarText}>
          {notification.senderName?.slice(0, 1) ?? '?'}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{notification.senderName}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
      </View>
      {unread && (
        <Pressable
          onPress={handlePress}
          disabled={busy || !!notification.reactedBy}
          style={({ pressed }) => [
            styles.reactBtn,
            pressed && { opacity: 0.7 },
            !!notification.reactedBy && { opacity: 0.4 },
          ]}
        >
          {busy ? (
            <ActivityIndicator color={colors.narumi} />
          ) : (
            <Text style={styles.reactText}>かー🙋</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: 'rgba(245,197,24,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.3)',
  },
  cardRead: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.yamabuki,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.narumi,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  message: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  reactBtn: {
    backgroundColor: colors.shu,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  reactText: {
    color: colors.narumi,
    fontSize: 13,
    fontWeight: '600',
  },
});
