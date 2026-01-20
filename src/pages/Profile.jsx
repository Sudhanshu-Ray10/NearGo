import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, User, Mail, Save, Loader2, RotateCw } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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
    </div>
  );
};

export default Profile;
