import React from 'react';
import { ShieldCheck, Zap, MapPin } from 'lucide-react';

const FeaturesSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                 <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Local Convenience</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Find items within your neighborhood. Save on shipping and meet trusted sellers right in your community.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Verified</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We verify users via phone to ensure a safe community. Buy with confidence from real people.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Transactions</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Chat instantly with sellers, negotiate the best price, and close the deal in minutes, not days.
                        </p>
                    </div>
                 </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
