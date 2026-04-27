import React, { useRef } from 'react';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import ItemCard from '../items/ItemCard';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const RecentlyViewed = () => {
    const { recentItems } = useRecentlyViewed();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!recentItems || recentItems.length === 0) return null;

    return (
        <section className="py-12 bg-white border-b border-gray-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="container mx-auto px-4">
                 <div className="flex items-center gap-2 text-gray-400 font-bold mb-2 uppercase tracking-wider text-xs dark:text-gray-500">
                    <Clock size={14} />
                    <span>Pick up where you left off</span>
                </div>
                
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} aria-label="Scroll Left" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 transition-colors active:scale-95">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} aria-label="Scroll Right" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 transition-colors active:scale-95">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                
                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x custom-scrollbar scroll-smooth"
                >
                    {recentItems.map(item => (
                        <div key={item.id} className="w-[280px] md:w-[300px] flex-shrink-0 snap-center">
                            <ItemCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;
