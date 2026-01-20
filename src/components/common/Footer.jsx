import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">
              Near<span className="text-blue-500">Buy</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              The most trusted local marketplace for buying and selling pre-loved items. sustainable shopping starts here.
            </p>
            <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/items" className="hover:text-blue-400 transition-colors">Browse Items</Link></li>
                <li><Link to="/sell" className="hover:text-blue-400 transition-colors">Sell Item</Link></li>
                <li><Link to="/categories" className="hover:text-blue-400 transition-colors">All Categories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
                <li><Link to="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link to="/safety" className="hover:text-blue-400 transition-colors">Safety Tips</Link></li>
                <li><Link to="/rules" className="hover:text-blue-400 transition-colors">Community Guidelines</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <div className="relative">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-700"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors">
                    <Send size={16} />
                </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} NearBuy. All rights reserved.</p>
            <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart size={14} className="text-red-500 fill-red-500" />
                <span>in India</span>
            </div>
            <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
