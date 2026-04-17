// 通知一覧を管理するフック
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { sendPushNotification } from '../utils/pushNotifications';

export type Notification = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  type: 'kibun' | 'reaction';
  createdAt: any;
  isRead: boolean;
  reactedBy: string | null;
};

export function useNotifications(currentUserId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'notifications'),
      where('receiverId', '==', currentUserId),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Notification[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Notification, 'id'>),
        }));
        setNotifications(list);
        setLoading(false);
      },
      (err) => {
        console.error('useNotifications onSnapshot error', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [currentUserId]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
      });
    } catch (e) {
      console.error('markAsRead error', e);
    }
  }, []);

  // 「かー」リアクション
  const reactToNotification = useCallback(
    async (
      notificationId: string,
      senderId: string,
      senderFcmToken: string | undefined,
      myName: string,
    ) => {
      if (!currentUserId) return;
      try {
        await updateDoc(doc(db, 'notifications', notificationId), {
          reactedBy: currentUserId,
          isRead: true,
        });
        // 相手にお礼通知
        await addDoc(collection(db, 'notifications'), {
          senderId: currentUserId,
          senderName: myName,
          receiverId: senderId,
          type: 'reaction',
          createdAt: serverTimestamp(),
          isRead: false,
          reactedBy: null,
        });
        if (senderFcmToken) {
          await sendPushNotification(
            [senderFcmToken],
            'KIBUNYA',
            `${myName}さんが「かー」しました🍺`,
          );
        }
      } catch (e) {
        console.error('reactToNotification error', e);
      }
    },
    [currentUserId],
  );

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    reactToNotification,
  };
}
