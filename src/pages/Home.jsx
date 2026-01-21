import React from 'react';
import { useNearbyItems } from '../hooks/useNearbyItems';
import ItemGrid from '../components/items/ItemGrid';
import HeroSection from '../components/home/HeroSection';
import CategoriesGrid from '../components/home/CategoriesGrid';
import FeaturesSection from '../components/home/FeaturesSection';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';

const Home = () => {
  const { items, loading, error } = useNearbyItems();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useAuthModal();

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Categories Grid */}
      <CategoriesGrid />

      {/* 3. Trending / Nearby Items (Distinct Background) */}
      <section className="py-20 bg-slate-100 relative">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2 uppercase tracking-wider text-sm">
                        <Sparkles size={16} />
                        <span>Fresh Recommendations</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Trending Nearby</h2>
                </div>
                
                <Link to="/items" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all hover:underline">
                    View All Items <ArrowRight size={20} />
                </Link>
            </div>

            {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
            ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
                <h3 className="text-red-700 font-bold mb-2 text-lg">Unable to load items</h3>
                <p className="text-gray-600">{typeof error === 'string' ? error : 'Please enable location access to see items near you.'}</p>
            </div>
            ) : (
            <>
                <ItemGrid items={items.slice(0, 10)} /> {/* Display 10 Items */}
                
                {/* Mobile View All Button */}
                <div className="mt-10 text-center md:hidden">
                    <Link to="/items" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                        View All Items <ArrowRight size={18} />
                    </Link>
                </div>
            </>
            )}
        </div>
      </section>

      {/* 4. Features / Trust Indicators */}
      <FeaturesSection />

      {/* 5. Quick CTA (Floating Card Style) */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to declutter?</h2>
                    <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of neighbors selling their pre-loved items correctly and safely. turn your unused items into cash today.
                    </p>
                    <button 
                        onClick={() => {
                            if (!user) openModal();
                            else navigate('/sell');
                        }} 
                        className="inline-block bg-white text-blue-700 px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all"
                    >
                        Start Selling Now
                    </button>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
