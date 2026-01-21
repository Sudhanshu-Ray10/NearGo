import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const ItemContext = createContext();

export const useItems = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('postedDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching items:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (item) => {
    try {
        await addDoc(collection(db, 'items'), item);
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
  };

  const deleteItem = async (itemId) => {
    try {
        await deleteDoc(doc(db, 'items', itemId));
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
  };

  return (
    <ItemContext.Provider value={{ items, addItem, deleteItem, loading }}>
      {children}
    </ItemContext.Provider>
  );
};
