import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc, 
    getDoc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { addNotification } from './notificationService';

// Send a buy request
export const sendRequest = async (item, buyer, sellerId) => {
    try {
        // Prevent duplicate requests
        const q = query(
            collection(db, 'requests'), 
            where('itemId', '==', item.id),
            where('buyerId', '==', buyer.uid)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            throw new Error("You have already requested this item.");
        }

        const requestData = {
            itemId: item.id,
            itemTitle: item.title,
            itemPrice: item.price,
            itemImage: item.image || '',
            buyerId: buyer.uid,
            buyerName: buyer.displayName || buyer.email || "Anonymous",
            sellerId: sellerId,
            status: 'pending', // pending, accepted, rejected
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'requests'), requestData);
        
        // Notify Seller
        await addNotification(sellerId, {
            type: 'REQUEST_RECEIVED',
            message: `${requestData.buyerName} wants to buy "${item.title}"`,
            itemId: item.id,
            requestId: docRef.id
        });

        return docRef.id;
    } catch (error) {
        console.error("Error sending request:", error);
        throw error;
    }
};

// Get requests for a seller
export const getSellerRequests = async (sellerId) => {
    try {
        const q = query(
            collection(db, 'requests'),
            where('sellerId', '==', sellerId)
            // orderBy('createdAt', 'desc') // Requires index
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching requests:", error);
        return [];
    }
};

// Check if user has already requested an item
export const checkRequestStatus = async (itemId, buyerId) => {
    try {
        const q = query(
            collection(db, 'requests'), 
            where('itemId', '==', itemId),
            where('buyerId', '==', buyerId)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error("Error checking request status:", error);
        return false;
    }
};

// Update request status (Accept/Reject)
// Update request status (Accept/Reject)
// Get requests for a buyer (My Orders)
export const getBuyerRequests = async (buyerId) => {
    try {
        const q = query(
            collection(db, 'requests'),
            where('buyerId', '==', buyerId)
            // orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching buyer orders:", error);
        return [];
    }
};

// Mark request as Delivered (Buyer confirms receipt)
export const markRequestDelivered = async (requestId) => {
    try {
        const requestRef = doc(db, 'requests', requestId);
        const requestSnap = await getDoc(requestRef);
        
        if (!requestSnap.exists()) throw new Error("Order not found");
        
        const data = requestSnap.data();

        // Update Request Status
        await updateDoc(requestRef, { status: 'delivered' });
        
        // Notify Seller
        await addNotification(data.sellerId, {
            type: 'ORDER_DELIVERED',
            message: `Buyer confirmed delivery for "${data.itemTitle}"`,
            itemId: data.itemId,
            requestId: requestId
        });

        return true;
    } catch (error) {
        console.error("Error marking delivered:", error);
        throw error;
    }
};

export const updateRequestStatus = async (requestId, newStatus) => {
    try {
        const requestRef = doc(db, 'requests', requestId);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
            throw new Error("Request not found");
        }

        const currentData = requestSnap.data();

        // 1. If Accepting: Enforce Exclusive Logic
        if (newStatus === 'accepted') {
            const itemRef = doc(db, 'items', currentData.itemId);
            
            // Mark item as SOLD
            await updateDoc(itemRef, { isSold: true });

            // Mark this request as ACCEPTED
            await updateDoc(requestRef, { status: 'accepted' });

            // Notify Winner
            await addNotification(currentData.buyerId, {
                type: 'REQUEST_ACCEPTED',
                message: `Congratulations! Your request for "${currentData.itemTitle}" was accepted!`,
                itemId: currentData.itemId
            });

            // Reject all OTHER pending requests for this item
            const q = query(
                collection(db, 'requests'),
                where('itemId', '==', currentData.itemId),
                where('status', '==', 'pending')
                // Note: Ensure Firestore Rules allow this, or do it client side cautiously
            );
            
            const otherRequestsSnap = await getDocs(q);
            const batchPromises = otherRequestsSnap.docs
                .filter(doc => doc.id !== requestId)
                .map(async (otherDoc) => {
                    const otherData = otherDoc.data();
                    
                    // Update Status to Rejected
                    await updateDoc(doc(db, 'requests', otherDoc.id), { status: 'rejected' });
                    
                    // Notify Loser
                    await addNotification(otherData.buyerId, {
                        type: 'REQUEST_REJECTED',
                        message: `Item Sold: Your request for "${currentData.itemTitle}" was declined because it was sold to another buyer.`,
                        itemId: currentData.itemId
                    });
                });

            await Promise.all(batchPromises);

        } else {
            // 2. Just Rejecting (Simple)
            await updateDoc(requestRef, { status: newStatus });

            if (newStatus === 'rejected') {
                 await addNotification(currentData.buyerId, {
                    type: 'REQUEST_REJECTED',
                    message: `Your request for "${currentData.itemTitle}" was declined.`,
                    itemId: currentData.itemId
                });
            }
        }

        return true;
    } catch (error) {
        console.error("Error updating request:", error);
        throw error;
    }
};
