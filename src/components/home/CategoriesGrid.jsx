import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Smartphone, 
    Sofa, 
    Bike, 
    Book, 
    Music, 
    Camera, 
    Shirt, 
    Gamepad2,
    Briefcase,
    Watch,
    Dumbbell,
    Monitor
} from 'lucide-react';

const CategoriesGrid = () => {
    const navigate = useNavigate();

    const categories = [
        { id: 'mobiles', name: 'Mobiles', icon: Smartphone, gradient: 'from-blue-400 to-cyan-300' },
        { id: 'furniture', name: 'Furniture', icon: Sofa, gradient: 'from-orange-400 to-amber-300' },
        { id: 'bikes', name: 'Bikes', icon: Bike, gradient: 'from-green-400 to-emerald-300' },
        { id: 'electronics', name: 'Electronics', icon: Camera, gradient: 'from-purple-500 to-violet-400' },
        { id: 'books', name: 'Books', icon: Book, gradient: 'from-yellow-400 to-amber-300' },
        { id: 'fashion', name: 'Fashion', icon: Shirt, gradient: 'from-pink-500 to-rose-400' },
        { id: 'sports', name: 'Sports', icon: Dumbbell, gradient: 'from-teal-400 to-cyan-400' },
        { id: 'computers', name: 'Computers', icon: Monitor, gradient: 'from-blue-600 to-indigo-500' },
    ];

    const handleCategoryClick = (category) => {
        navigate(`/items?search=${category}`);
    };

    return (
        <section className="py-16 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
                        <p className="text-gray-500 mt-2">Explore top categories in your city</p>
                    </div>
                    <button onClick={() => navigate('/categories')} className="hidden md:block text-blue-600 font-semibold hover:underline">
                        View All
                    </button>
                </div>

                {/* Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="flex md:grid md:grid-cols-8 gap-8 overflow-x-auto pb-6 md:pb-0 px-2 md:px-0 scrollbar-hide">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group"
                        >
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr ${cat.gradient} p-0.5 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-white/50 transition-all">
                                    <cat.icon size={32} className="text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesGrid;
