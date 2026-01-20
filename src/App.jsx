import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { CartProvider } from './context/CartContext'; // Import
import AuthModal from './components/auth/AuthModal';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <AuthModalProvider>
            <CartProvider>
                <AppRoutes />
                <AuthModal />
            </CartProvider>
          </AuthModalProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
