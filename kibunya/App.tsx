// キブンヤ エントリーポイント
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { colors } from './src/config/colors';
import { db } from './src/config/firebase';
import { useAuth } from './src/hooks/useAuth';
import { useNotifications } from './src/hooks/useNotifications';
import {
  registerForPushNotifications,
  setupNotificationHandlers,
} from './src/utils/pushNotifications';
import { handleInviteLink } from './src/utils/inviteLink';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import FriendsScreen from './src/screens/FriendsScreen';

const Tab = createBottomTabNavigator();

const linking = {
  prefixes: [Linking.createURL('/'), 'kibunya://'],
  config: {
    screens: {
      Home: 'home',
      Notifications: 'notifications',
      Friends: 'friends',
    },
  },
};

function MainTabs() {
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications(currentUser?.uid);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,249,236,0.92)',
          borderTopColor: 'rgba(26,26,26,0.07)',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.shu,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '気分',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>🍺</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'アラート',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>🔔</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: 'フレンド',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>👥</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Root() {
  const { currentUser, loading } = useAuth();

  // 通知ハンドラーをセットアップ
  useEffect(() => {
    setupNotificationHandlers();
  }, []);

  // ログイン後: プッシュトークン登録 + ディープリンク処理
  useEffect(() => {
    if (!currentUser) return;

    registerForPushNotifications(currentUser.uid);

    // 初回起動時の招待リンク
    Linking.getInitialURL().then((url) => {
      if (url) handleInviteLink(url, currentUser.uid);
    });
    // 起動中の招待リンク
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleInviteLink(url, currentUser.uid);
    });
    return () => sub.remove();
  }, [currentUser]);

  // lastSeen の定期更新(オンライン状態検知用)
  useEffect(() => {
    if (!currentUser) return;
    const updateLastSeen = () => {
      setDoc(
        doc(db, 'users', currentUser.uid),
        { lastSeen: serverTimestamp() },
        { merge: true },
      ).catch((e) => console.warn('lastSeen update error', e));
    };
    updateLastSeen();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') updateLastSeen();
    });
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);
    return () => {
      sub.remove();
      clearInterval(interval);
    };
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.shu} />
      </View>
    );
  }

  if (!currentUser) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <MainTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Root />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.narumi,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
