import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
                <ShoppingBag size={48} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 max-w-sm">Looks like you haven't added anything to your cart yet. Discover great deals nearby!</p>
            <button 
                onClick={() => navigate('/items')}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
            >
                Start Shopping
            </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="text-blue-600" />
        Shopping Cart ({cartItems.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <img 
                        src={item.image || "https://via.placeholder.com/150"} 
                        alt={item.title} 
                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-bold text-blue-600">₹{item.price?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            ))}
            
            <button 
                onClick={clearCart}
                className="text-red-500 text-sm font-medium hover:underline px-2"
            >
                Clear Cart
            </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Platform Fee</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                    Safe and secure payments. 100% money back guarantee.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
