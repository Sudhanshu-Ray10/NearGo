import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    serverTimestamp, 
    doc, 
    updateDoc, 
    getDoc,
    setDoc,
    getDocs
} from 'firebase/firestore';

const CHATS_COLLECTION = 'chats';

// Create a new chat or return existing one
export const createChat = async (participants, itemId, itemTitle) => {
    try {
        // Check for existing chat between these participants for this item
        const q = query(
            collection(db, CHATS_COLLECTION),
            where('itemId', '==', itemId),
            where('participants', 'array-contains', participants[0]) 
            // Note: complex array-contains logic is tricky in simple queries, 
            // usually better to store a unique composite key or check client side if volume is low.
            // For now, we'll assign a deterministic ID: itemId_buyerId_sellerId
        );
        
        // Let's use a deterministic ID to prevent duplicates easily
        const chatId = `${itemId}_${participants[0]}_${participants[1]}`;
        const chatRef = doc(db, CHATS_COLLECTION, chatId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
            return chatId;
        }

        // Create new chat
        await setDoc(chatRef, {
            participants,
            itemId,
            itemTitle,
            lastMessage: null,
            lastMessageTime: serverTimestamp(),
            createdAt: serverTimestamp()
        });

        return chatId;
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

// Send a message
export const sendMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, CHATS_COLLECTION, chatId, 'messages');
        const newMessage = {
            text,
            senderId,
            timestamp: serverTimestamp(),
            status: 'sent' // sent, delivered, read
        };

        await addDoc(messagesRef, newMessage);

        // Update last message in chat doc
        const chatRef = doc(db, CHATS_COLLECTION, chatId);
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp(),
            [`unreadCount.${senderId === participants[0] ? participants[1] : participants[0]}`]: 1 // increment logic needed theoretically, or just flat set for now
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// Subscribe to a specific chat's messages
export const subscribeToChat = (chatId, callback) => {
    const q = query(
        collection(db, CHATS_COLLECTION, chatId, 'messages'),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamp to date for UI
            timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
        }));
        callback(messages);
    });
};

// Subscribe to user's chat list
export const subscribeToUserChats = (userId, callback) => {
    const q = query(
        collection(db, CHATS_COLLECTION),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(chats);
    });
};

// Mark messages as read
export const markMessagesAsRead = async (chatId, userId) => {
    // We want to mark all messages NOT sent by user as read
    const q = query(
        collection(db, CHATS_COLLECTION, chatId, 'messages'),
        where('senderId', '!=', userId),
        where('status', '==', 'sent')
    );

    const snapshot = await getDocs(q);
    const batchPromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { status: 'read' })
    );

    await Promise.all(batchPromises);
};
