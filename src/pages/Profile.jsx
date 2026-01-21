import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, User, Mail, Save, Loader2, RotateCw, Trash2, Tag, X } from 'lucide-react';
import { useItems } from '../context/ItemContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, deleteItem } = useItems();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'listings'
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    gender: '',
    photoURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch User Data (Auth + Firestore)
  useEffect(() => {
    const fetchUserData = async () => {
        if (!user) return;
        
        try {
            // 1. Auth Data
            const authData = {
                displayName: user.displayName || '',
                email: user.email || '',
                photoURL: user.photoURL || ''
            };

            // 2. Firestore Data (for Gender, etc.)
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            let firestoreData = {};
            if (userDoc.exists()) {
                firestoreData = userDoc.data();
            }

            setFormData(prev => ({
                ...prev,
                ...authData,
                ...firestoreData, // Firestore overwrites if duplicates, ensuring sync
                // If email/name missing in Auth (e.g. phone auth), use Firestore or empty
                email: user.email || firestoreData.email || '', 
            }));
            
            setPreviewUrl(user.photoURL || '');
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
  }, [user]);

  // Filter My Listings
  const myListings = items.filter(item => user && item.sellerId === user.uid);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteItem = async (itemId, itemTitle) => {
      if (window.confirm(`Are you sure you want to delete "${itemTitle}"? This cannot be undone.`)) {
          try {
              await deleteItem(itemId);
              alert("Item deleted successfully.");
          } catch (error) {
              alert("Failed to delete item.");
          }
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
        let photoURL = formData.photoURL;

        // 1. Upload Image if changed
        if (imageFile) {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, imageFile);
            photoURL = await getDownloadURL(storageRef);
        }

        // 2. Update Auth Profile
        await updateProfile(user, {
            displayName: formData.displayName,
            photoURL: photoURL
        });

        // 3. Update Email (if changed and supported)
        if (user.email !== formData.email && formData.email) {
            try {
                await updateEmail(user, formData.email);
            } catch (emailError) {
                console.warn("Could not update email (requires fresh login usually):", emailError);
                alert("Email update failed. You may need to re-login.");
            }
        }

        // 4. Update Firestore (Gender + Sync)
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            displayName: formData.displayName,
            email: formData.email,
            gender: formData.gender,
            photoURL: photoURL,
            updatedAt: new Date()
        }, { merge: true });

        // Update local state
        setFormData(prev => ({ ...prev, photoURL }));
        
        alert("Profile updated successfully!");

    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile: " + error.message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <X size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Edit Profile
                {activeTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('listings')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'listings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                My Listings ({myListings.length})
                {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
            </button>
        </div>

        {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                {/* Top Banner / Avatar Section */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-32">
                    <div className="absolute -bottom-16 left-8 flex items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-400" />
                                )}
                            </div>
                            {/* Camera Icon Overlay */}
                            <label className="absolute bottom-0 right-0 p-2 bg-white text-gray-600 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100">
                                <Camera size={18} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8 space-y-6">
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <div className="flex gap-4">
                            {['Male', 'Female', 'Other'].map((g) => (
                                <label key={g} className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={formData.gender === g}
                                        onChange={handleChange}
                                        className="peer hidden"
                                    />
                                    <div className="text-center py-3 rounded-xl border-2 border-transparent bg-gray-50 text-gray-500 font-medium transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-100">
                                        {g}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        )}

        {activeTab === 'listings' && (
            <div className="space-y-4">
                {myListings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                        <Tag className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">You haven't listed any items yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myListings.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 transition-all hover:shadow-md">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                                        <p className="text-xs text-gray-400 mt-1">Listed on {new Date(item.postedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => handleDeleteItem(item.id, item.title)}
                                            className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

    </div>
  );
};

export default Profile;
