import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const addNotification = async (userId, notification) => {
  try {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      userId,
      ...notification,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

export const subscribeToNotifications = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId)
    // orderBy('createdAt', 'desc') // Requires index, commenting out for now
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(notifications);
  }, (error) => {
      console.error("Error fetching notifications:", error);
  });
};
// Update a notification (e.g., mark as read or action taken)
export const updateNotification = async (notificationId, updates) => {
    try {
        const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating notification:", error);
    }
};

export const markAllNotificationsAsRead = async (notifications) => {
    const batchPromises = notifications
        .filter(n => !n.read)
        .map(n => updateNotification(n.id, { read: true }));
    await Promise.all(batchPromises);
};
