import React from 'react';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import ItemCard from '../items/ItemCard';
import { Clock } from 'lucide-react';

const RecentlyViewed = () => {
    const { recentItems } = useRecentlyViewed();

    if (!recentItems || recentItems.length === 0) return null;

    return (
        <section className="py-12 bg-white border-b border-gray-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="container mx-auto px-4">
                 <div className="flex items-center gap-2 text-gray-400 font-bold mb-2 uppercase tracking-wider text-xs dark:text-gray-500">
                    <Clock size={14} />
                    <span>Pick up where you left off</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">Recently Viewed</h2>
                
                <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x custom-scrollbar">
                    {recentItems.map(item => (
                        <div key={item.id} className="min-w-[280px] md:min-w-[300px] snap-center">
                            <ItemCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;
