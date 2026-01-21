import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { CartProvider } from './context/CartContext';
import { ItemProvider } from './context/ItemContext';
import { WishlistProvider } from './context/WishlistContext';
import AuthModal from './components/auth/AuthModal';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <AuthModalProvider>
            <CartProvider>
              <ItemProvider>
                <WishlistProvider>
                  <AppRoutes />
                  <AuthModal />
                </WishlistProvider>
              </ItemProvider>
            </CartProvider>
          </AuthModalProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
