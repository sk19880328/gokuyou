// ホーム画面: 「いきますかー」を送る中心画面
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { colors } from '../config/colors';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import { db } from '../config/firebase';
import { sendPushNotification } from '../utils/pushNotifications';
import SendOverlay from '../components/SendOverlay';
import FriendPill from '../components/FriendPill';

export default function HomeScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const { friends } = useFriends(currentUser?.uid);
  const [overlay, setOverlay] = useState(false);
  const [sending, setSending] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleSend = useCallback(async () => {
    if (!currentUser || sending) return;
    setSending(true);
    try {
      // 自分の名前を取得
      const meSnap = await getDoc(doc(db, 'users', currentUser.uid));
      const myName = meSnap.data()?.name ?? 'フレンド';

      // 各友達宛の notification を作成 + FCM通知
      const tokens: string[] = [];
      for (const f of friends) {
        await addDoc(collection(db, 'notifications'), {
          senderId: currentUser.uid,
          senderName: myName,
          receiverId: f.id,
          type: 'kibun',
          createdAt: serverTimestamp(),
          isRead: false,
          reactedBy: null,
        });
        if (f.fcmToken) tokens.push(f.fcmToken);
      }
      if (tokens.length > 0) {
        await sendPushNotification(
          tokens,
          'KIBUNYA',
          `${myName}さんがちょい飲みの気分🍺`,
        );
      }
      setOverlay(true);
    } catch (e: any) {
      console.error('handleSend error', e);
      Alert.alert('送信失敗', 'もう一度お試しください');
    } finally {
      setSending(false);
    }
  }, [currentUser, friends, sending]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.glow} pointerEvents="none" />

      <View style={styles.header}>
        <Text style={styles.logo}>KIBUNYA</Text>
        <Pressable
          onPress={() => navigation?.navigate?.('Friends')}
          style={({ pressed }) => [
            styles.friendsBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.friendsIcon}>👥</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>🍺</Text>
        </View>
        <Text style={styles.title}>ちょい飲みの気分？</Text>
        <Text style={styles.caption}>
          誘ってないから大丈夫。気分を置いておくだけ。
        </Text>

        <Animated.View style={{ transform: [{ scale }], width: '100%', maxWidth: 320 }}>
          <Pressable
            onPressIn={pressIn}
            onPressOut={pressOut}
            onPress={handleSend}
            disabled={sending}
            style={({ pressed }) => [
              styles.cta,
              pressed && { opacity: 0.95 },
              sending && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.ctaText}>
              {sending ? '送信中...' : 'いきますかー'}
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.hint}>友達に通知が届きます</Text>
      </View>

      <View style={styles.pillRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {friends.length === 0 ? (
            <Text style={styles.noFriends}>
              まだ友達がいません。フレンドタブから招待してね
            </Text>
          ) : (
            friends.map((f) => (
              <FriendPill key={f.id} name={f.name} online={f.isOnline} />
            ))
          )}
        </ScrollView>
      </View>

      <SendOverlay visible={overlay} onClose={() => setOverlay(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.narumi,
  },
  glow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.yamabuki,
    opacity: 0.08,
    top: -100,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  logo: {
    fontSize: 12,
    letterSpacing: 5,
    color: colors.textLight,
    fontWeight: '600',
  },
  friendsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(27,58,107,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsIcon: {
    fontSize: 18,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 14,
  },
  emojiBox: {
    width: 140,
    height: 140,
    borderRadius: 34,
    backgroundColor: colors.yamabuki,
    borderWidth: 3,
    borderColor: colors.shu,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 72,
  },
  title: {
    fontSize: 22,
    color: colors.ai,
    fontWeight: '500',
  },
  caption: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  cta: {
    backgroundColor: colors.shu,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.narumi,
    fontSize: 18,
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 8,
  },
  pillRow: {
    paddingVertical: 14,
  },
  noFriends: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
