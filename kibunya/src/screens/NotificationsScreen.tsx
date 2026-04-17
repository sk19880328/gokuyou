// 通知一覧画面
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '../config/colors';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { db } from '../config/firebase';
import NotificationCard from '../components/NotificationCard';

export default function NotificationsScreen() {
  const { currentUser } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    reactToNotification,
  } = useNotifications(currentUser?.uid);

  const handleReact = useCallback(
    async (notifId: string, senderId: string) => {
      if (!currentUser) return;
      try {
        const meSnap = await getDoc(doc(db, 'users', currentUser.uid));
        const myName = meSnap.data()?.name ?? 'フレンド';
        const senderSnap = await getDoc(doc(db, 'users', senderId));
        const senderFcm = senderSnap.data()?.fcmToken;
        await reactToNotification(notifId, senderId, senderFcm, myName);
      } catch (e) {
        console.error('handleReact error', e);
      }
    },
    [currentUser, reactToNotification],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>気分アラート</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>新着 {unreadCount}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.shu} />
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍻</Text>
          <Text style={styles.emptyText}>まだアラートはありません</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onReact={() => handleReact(item.id, item.senderId)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.narumi,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    backgroundColor: 'rgba(232,57,31,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.shu,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
