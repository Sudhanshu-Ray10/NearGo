import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import ItemPage from '../pages/ItemPage';
import SellItem from '../pages/SellItem';
import Requests from '../pages/Requests';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart'; // New
import Orders from '../pages/Orders'; // New
import Notifications from '../pages/Notifications'; // New
import Categories from '../pages/Categories'; // New Page
import Wishlist from '../pages/Wishlist'; // New Page
import ItemDetails from '../components/items/ItemDetails'; // Or page wrapper

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
