import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserLocation } from "../../context/LocationContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useCart } from "../../context/CartContext";
import { INDIAN_CITIES } from "../../data/indianCities";
import { searchTerms } from "../../data/searchTerms";
import {
  MapPin,
  Search,
  Heart,
  Plus,
  User,
  LogOut,
  Navigation,
  Check,
  Loader2,
  ShoppingBag, // New
  Package, // New
  Bell // New
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getLocation, location: userCoords } = useUserLocation();
  const { openModal } = useAuthModal();
  const { totalItems } = useCart();

  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("India");
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(INDIAN_CITIES.slice(0, 8));
  const [isSearchingPincode, setIsSearchingPincode] = useState(false);

  const [searchFocus, setSearchFocus] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Search");
  
  // Search Suggestion Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setActiveSuggestionIndex(-1); // Reset on input change

    if (query.trim()) {
      const suggestions = searchTerms.filter(term => 
        term.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 6);
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSearchSubmit = (term) => {
    const queryToSearch = term || searchQuery;
    if (queryToSearch.trim()) {
       navigate(`/items?search=${encodeURIComponent(queryToSearch.trim())}`);
       setSearchFocus(false);
       setFilteredSuggestions([]);
       setSearchQuery(queryToSearch);
       setActiveSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
            handleSearchSubmit(filteredSuggestions[activeSuggestionIndex]);
        } else {
            handleSearchSubmit();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
        setSearchFocus(false);
    }
  };
  
  // Search Animation Logic
  useEffect(() => {
    if (searchFocus) return;
    const terms = ["bikes", "furniture", "mobiles", "laptops", "books"];
    let termIndex = 0; let charIndex = 0; let isDeleting = false; let timeoutId;
    const type = () => {
      const currentTerm = terms[termIndex];
      const speed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentTerm.length) {
        timeoutId = setTimeout(() => { isDeleting = true; type(); }, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false; termIndex = (termIndex + 1) % terms.length; timeoutId = setTimeout(type, 300);
      } else {
        setPlaceholderText(`Search "${currentTerm.substring(0, charIndex + (isDeleting ? -1 : 1))}"`);
        charIndex += isDeleting ? -1 : 1; timeoutId = setTimeout(type, speed);
      }
    };
    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, [searchFocus]);

  // Filter Locations Logic (Hybrid: Static + API)
  useEffect(() => {
    const fetchPincode = async (pincode) => {
        setIsSearchingPincode(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data && data[0].Status === "Success") {
                const cities = data[0].PostOffice.map(po => `${po.Name}, ${po.State}`);
                // Remove duplicates
                setFilteredLocations([...new Set(cities)]);
            } else {
                setFilteredLocations([]);
            }
        } catch (error) {
            console.error("Error fetching pincode:", error);
            setFilteredLocations([]);
        } finally {
            setIsSearchingPincode(false);
        }
    };

    if (!locationQuery) {
        setFilteredLocations(INDIAN_CITIES.slice(0, 8));
        setIsSearchingPincode(false);
    } else {
        const query = locationQuery.trim();
        
        // Pincode Logic: If 6 digits, hit API
        if (/^\d{6}$/.test(query)) {
            fetchPincode(query);
        } 
        // Partial Pincode: Wait
        else if (/^\d{1,5}$/.test(query)) {
             setFilteredLocations([]); // Clear helpful hints or show nothing until 6 chars
        }
        // Text Search
        else {
            const lowerQuery = query.toLowerCase();
            const filtered = INDIAN_CITIES.filter(loc => 
                loc.toLowerCase().includes(lowerQuery)
            );
            setFilteredLocations(filtered.slice(0, 20)); // Show up to 20 text matches
            setIsSearchingPincode(false);
        }
    }
  }, [locationQuery]);

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationOpen(false);
    setLocationQuery(""); // Reset
  };

  const handleDetectLocation = () => {
    setIsSearchingPincode(true); // Reuse loading state for spinner
    getLocation(); 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
             const { latitude, longitude } = position.coords;
             try {
                 // Free Reverse Geocoding API
                 const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                 const data = await response.json();
                 
                 if (data) {
                     // Prioritize City > Locality
                     const city = data.city || data.locality || data.principalSubdivision || "Current Location";
                     const state = data.principalSubdivision || "";
                     const formatted = state ? `${city}, ${state}` : city;
                     setSelectedLocation(formatted);
                 } else {
                     setSelectedLocation("Current Location");
                 }
             } catch (error) {
                 console.error("Reverse geocode failed:", error);
                 setSelectedLocation("Current Location");
             } finally {
                 setIsSearchingPincode(false);
                 setLocationOpen(false);
             }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Location access denied. Please enable it.");
            setIsSearchingPincode(false);
        });
    } else {
        alert("Geolocation not supported");
        setIsSearchingPincode(false);
    }
  };

  const requireAuth = (path) => {
    if (!user) {
        openModal();
    } else {
        navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-gray-200">
      <div className="w-full px-6 h-20 flex items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            NearBuy
          </Link>

          {/* Location Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:shadow-md transition-shadow min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                  <MapPin size={18} className="text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700 truncate">{selectedLocation}</span>
              </div>
              <span className="text-gray-400 flex-shrink-0">▼</span>
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl rounded-2xl p-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3">
                
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Enter city or pincode"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    />
                </div>

                {/* Detect Button */}
                <button
                  onClick={handleDetectLocation}
                  disabled={isSearchingPincode}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-blue-50 text-blue-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSearchingPincode && !locationQuery ? <Loader2 className="animate-spin" size={18}/> : <Navigation size={18} />}
                  {isSearchingPincode && !locationQuery ? "Locating..." : "Use my current location"}
                </button>

                <div className="h-px bg-gray-100"></div>

                {/* List of Locations */}
                <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
                        {isSearchingPincode ? "Searching online..." : (locationQuery ? "Search Results" : "Top Cities")}
                    </p>
                    {isSearchingPincode ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin text-blue-500" size={24} />
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {filteredLocations.map((loc, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleSelectLocation(loc)}
                                        className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg group transition-colors"
                                    >
                                        <span className="text-sm text-gray-700 group-hover:text-blue-700">{loc}</span>
                                        {selectedLocation === loc && <Check size={14} className="text-blue-600"/>}
                                    </button>
                                </li>
                            ))}
                            {filteredLocations.length === 0 && locationQuery.length > 0 && (
                                <li className="text-sm text-gray-400 px-3 text-center py-4">
                                    {/^\d{1,5}$/.test(locationQuery) ? "Enter full 6-digit pincode" : "No cities found"}
                                </li>
                            )}
                        </ul>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <button 
                onClick={() => handleSearchSubmit()}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10"
            >
                <Search 
                    className={`transition-colors duration-300 ${searchFocus ? 'text-blue-600' : 'text-gray-400'}`} 
                    size={20} 
                />
            </button>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={searchFocus ? "Search for bikes, mobiles, furniture and more..." : placeholderText}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => {
                // Delay hiding locally to allow click, but also clear index
                setTimeout(() => {
                    setSearchFocus(false);
                    setActiveSuggestionIndex(-1);
                }, 200);
              }}
              className="w-full pl-14 pr-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md focus:shadow-lg focus:border-blue-500 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            
            {/* Search Suggestions Dropdown */}
            {searchFocus && searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="py-2">
                  {filteredSuggestions.map((term, index) => (
                    <li key={index}>
                      <button
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleSearchSubmit(term);
                        }}
                        className={`w-full text-left px-6 py-2.5 flex items-center gap-3 transition-colors group ${
                            index === activeSuggestionIndex ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <Search size={16} className={`group-hover:text-blue-500 ${index === activeSuggestionIndex ? "text-blue-500" : "text-gray-400"}`} />
                        <span className={`font-medium group-hover:text-blue-700 ${index === activeSuggestionIndex ? "text-blue-700" : "text-gray-700"}`}>
                          {/* Highlight matching part */}
                          <span className="font-bold text-gray-900">{term.substring(0, searchQuery.length)}</span>
                          {term.substring(searchQuery.length)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* Cart (Replaces Wishlist) */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {totalItems}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide">Cart</span>
          </Link>

          {/* Sell Button */}
          <button
            onClick={() => requireAuth("/sell")}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-200 hover:shadow-lg active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Sell
          </button>

          {/* Profile / Login */}
          {!user ? (
            <button
              onClick={openModal}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Login
            </button>
          ) : (
            <div className="relative group z-50">
                {/* Header: User Name + Icon */}
               <div className="flex items-center gap-3 cursor-pointer py-1 pr-2 rounded-full hover:bg-white/80 border border-transparent hover:border-gray-100 transition-all">
                  <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-full shadow-md">
                    <User size={20} />
                  </div>
                  <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold text-gray-800 leading-tight">
                          {user.displayName || "User"}
                      </p>
                      <p className="text-[10px] font-medium text-gray-500">My Account</p>
                  </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-2xl p-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform origin-top-right transition-all duration-200">
                <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.phoneNumber || user.email}</p>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors group/item"
                >
                  <User size={18} className="text-gray-400 group-hover/item:text-blue-600"/>
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors group/item"
                >
                  <Package size={18} className="text-gray-400 group-hover/item:text-blue-600"/>
                  My Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-pink-50 rounded-xl text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors group/item"
                >
                  <Heart size={18} className="text-gray-400 group-hover/item:text-pink-500"/>
                  Wishlist
                </Link>
                
                <Link
                  to="/notifications"
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yellow-50 rounded-xl text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors group/item"
                >
                  <Bell size={18} className="text-gray-400 group-hover/item:text-yellow-500"/>
                  Notifications
                </Link>

                <div className="h-px bg-gray-100 my-1"></div>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl text-sm font-medium transition-colors group/item"
                >
                  <LogOut size={18} className="group-hover/item:text-red-500"/>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
