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
    Car,
    Home,
    Monitor,
    Coffee
} from 'lucide-react';

const Categories = () => {
    const navigate = useNavigate();

    // Expanded category list
    const categories = [
        { id: 'mobiles', name: 'Mobiles', icon: Smartphone, gradient: 'from-blue-400 to-cyan-300', count: '1.2k' },
        { id: 'furniture', name: 'Furniture', icon: Sofa, gradient: 'from-orange-400 to-amber-300', count: '850' },
        { id: 'bikes', name: 'Bikes', icon: Bike, gradient: 'from-green-400 to-emerald-300', count: '420' },
        { id: 'electronics', name: 'Electronics', icon: Camera, gradient: 'from-purple-500 to-violet-400', count: '2.5k' },
        { id: 'books', name: 'Books', icon: Book, gradient: 'from-yellow-400 to-amber-300', count: '500+' },
        { id: 'fashion', name: 'Fashion', icon: Shirt, gradient: 'from-pink-500 to-rose-400', count: '3.1k' },
        { id: 'gaming', name: 'Gaming', icon: Gamepad2, gradient: 'from-red-500 to-red-400', count: '800' },
        { id: 'services', name: 'Services', icon: Briefcase, gradient: 'from-indigo-500 to-blue-500', count: '150' },
        
        { id: 'sports', name: 'Sports', icon: Dumbbell, gradient: 'from-teal-400 to-cyan-400', count: '320' },
        { id: 'cars', name: 'Cars', icon: Car, gradient: 'from-slate-600 to-slate-400', count: '120' },
        { id: 'properties', name: 'Properties', icon: Home, gradient: 'from-emerald-600 to-teal-500', count: '50' },
        { id: 'computers', name: 'Computers', icon: Monitor, gradient: 'from-blue-600 to-indigo-500', count: '900' },
        { id: 'appliances', name: 'Appliances', icon: Coffee, gradient: 'from-orange-600 to-red-500', count: '600' },
    ];

    const handleCategoryClick = (category) => {
        navigate(`/items?search=${category}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our extensive range of categories. From electronics to real estate, find everything you need in your local area.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center gap-4 group"
                        >
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${cat.gradient} p-0.5 shadow-md group-hover:shadow-lg transition-all`}>
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <cat.icon size={32} className={`text-gray-700 group-hover:scale-110 transition-transform duration-300`} />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{cat.count} listings</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
