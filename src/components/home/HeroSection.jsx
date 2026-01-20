import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useAuthModal();

  const handleSellClick = () => {
    if (!user) {
        openModal();
    } else {
        navigate('/sell');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white min-h-[600px] flex items-center">
      {/* ... (background shapes remain same) ... */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-500/20 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                    ✨ The Marketplace for Everyone
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                    Buy Locally. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Sell Instantly.
                    </span>
                </h1>
            </motion.div>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto md:mx-0 leading-relaxed"
            >
                Connect with neighbors to buy and sell pre-loved items correctly. 
                Experience the safest and fastest way to declutter your home.
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
                <Link
                    to="/items"
                    className="group px-8 py-4 bg-white text-blue-900 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <ShoppingBag size={20} />
                    Explore Items
                </Link>
                <button
                    onClick={handleSellClick}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <PlusCircle size={20} />
                    Start Selling
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="pt-4 flex items-center justify-center md:justify-start gap-8"
            >
                <div>
                    <p className="text-3xl font-bold">10k+</p>
                    <p className="text-sm text-gray-400">Active Users</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div>
                    <p className="text-3xl font-bold">5k+</p>
                    <p className="text-sm text-gray-400">Items Listed</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div>
                    <p className="text-3xl font-bold">4.8</p>
                    <p className="text-sm text-gray-400">User Rating</p>
                </div>
            </motion.div>
        </div>

        {/* Right Content - Visual */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative"
        >
            <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-xl transform hover:scale-105 transition-all">
                        <div className="h-40 bg-gray-200/20 rounded-xl mb-3 overflow-hidden">
                             {/* Placeholder for item image */}
                             <div className="w-full h-full flex items-center justify-center text-4xl">🎸</div>
                        </div>
                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-xl transform hover:scale-105 transition-all">
                        <div className="h-48 bg-gray-200/20 rounded-xl mb-3 overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center text-4xl">🚲</div>
                        </div>
                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-xl transform hover:scale-105 transition-all">
                        <div className="h-48 bg-gray-200/20 rounded-xl mb-3 overflow-hidden">
                             <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>
                        </div>
                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-xl transform hover:scale-105 transition-all">
                        <div className="h-40 bg-gray-200/20 rounded-xl mb-3 overflow-hidden">
                             <div className="w-full h-full flex items-center justify-center text-4xl">🛋️</div>
                        </div>
                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
