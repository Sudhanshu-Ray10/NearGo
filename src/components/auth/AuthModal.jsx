import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { X, Phone, ArrowRight, CheckCircle2, Loader2, Quote, LogIn, Code } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';

const QUOTES = [
  "Turn your clutter into currency.",
  "Find hidden treasures near you.",
  "Sustainable shopping starts here.",
  "Connect with your neighborhood."
];

const AuthModal = () => {
  const { isOpen, closeModal } = useAuthModal();
  const { auth, devLogin } = useAuth();
  
  const [step, setStep] = useState('PHONE'); // PHONE | OTP | SUCCESS
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
        setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
        setStep('PHONE');
        setPhoneNumber('');
        setOtp('');
        setLoading(false);
        setConfirmationResult(null);
    }
  }, [isOpen]);

  // Recaptcha Cleanup
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch(e) { /* ignore */ }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-ui-container', {
        'size': 'invisible', // Invisible for better UX if possible, or 'normal' inside modal
        'callback': (response) => {
           console.log("Recaptcha verified");
        },
        'expired-callback': () => {
           console.log("Recaptcha expired");
           if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
        }
      });
    }
  };

  const strToPhone = (str) => {
    let phone = str.trim();
    if (!phone.startsWith('+')) phone = '+91' + phone;
    return phone;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
        alert("Please enter a valid phone number");
        return;
    }

    setLoading(true);
    // Slight delay to allow modal animation to settle if needed, but mainly for UX
    try {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const phone = strToPhone(phoneNumber);
        
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        setStep('OTP');
    } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await confirmationResult.confirm(otp);
        // Success
        setStep('SUCCESS');
        setTimeout(() => {
            closeModal();
        }, 1500);
    } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Invalid OTP. Please check properly.");
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        setStep('SUCCESS');
        setTimeout(() => {
            closeModal();
        }, 1500);
    } catch (error) {
        console.error("Error with Google Login:", error);
        alert("Google Login Failed: " + error.message);
        setLoading(false);
    }
  };

  const handleDevLogin = () => {
      devLogin();
      setStep('SUCCESS');
      setTimeout(() => {
          closeModal();
      }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
          >
            
            {/* Close Button */}
            <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-gray-100/20 md:bg-gray-100 hover:md:bg-gray-200 rounded-full transition-colors text-white md:text-gray-500"
            >
                <X size={20} />
            </button>


            {/* LEFT SIDE - Branding */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">NearBuy</h1>
                    <p className="text-blue-100 text-sm opacity-90">The smart way to buy & sell locally.</p>
                </div>

                <div className="relative z-10 my-12">
                    <Quote className="text-blue-300 mb-4 opacity-50" size={48} />
                    <div className="h-24"> {/* Fixed height for quote rotation */}
                        <AnimatePresence mode='wait'>
                            <motion.p 
                                key={quoteIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl font-medium leading-relaxed"
                            >
                                "{QUOTES[quoteIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex gap-2 relative z-10">
                    {QUOTES.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-300 ${i === quoteIndex ? "w-8 bg-white" : "w-2 bg-white/30"}`}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE - Form */}
            <div className="w-full md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
                
                {step === 'SUCCESS' ? (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center text-center space-y-4"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                        <p className="text-gray-500">You successfully logged in.</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {step === 'PHONE' ? "Get Started" : "Verify OTP"}
                            </h2>
                            <p className="text-gray-500">
                                {step === 'PHONE' 
                                    ? "Enter your mobile number to sign up or log in." 
                                    : `We sent a code to ${phoneNumber}`
                                }
                            </p>
                        </div>

                        <form onSubmit={step === 'PHONE' ? handleSendOtp : handleVerifyOtp} className="space-y-6">
                            
                            {step === 'PHONE' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold">+91</span>
                                            <div className="h-4 w-px bg-gray-300 mx-3"></div>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setPhoneNumber(val);
                                            }}
                                            className="block w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                            placeholder="Mobile Number"
                                            autoFocus
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Phone size={20} />
                                        </div>
                                    </div>
                                    <div id="recaptcha-ui-container"></div>
                                </motion.div>
                            )}

                            {step === 'OTP' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-bold tracking-[0.5em] text-center outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setStep('PHONE')}
                                        className="text-sm text-blue-600 font-semibold hover:underline w-full text-center"
                                    >
                                        Change Phone Number?
                                    </button>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (step === 'PHONE' && phoneNumber.length < 10) || (step === 'OTP' && otp.length < 6)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        {step === 'PHONE' ? "Send OTP" : "Verify"}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* ALTERNATIVE LOGIN OPTIONS */}
                        {step === 'PHONE' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8 pt-6 border-t border-gray-100 space-y-4"
                            >
                                <div className="text-center">
                                    <span className="text-xs text-gray-400 font-medium bg-white px-2 -mt-9 relative uppercase tracking-wider">
                                        Or continue with
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button 
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-medium text-sm"
                                    >
                                        {/* Simple Google G Icon */}
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google
                                    </button>

                                    <button 
                                        onClick={handleDevLogin}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all text-gray-600 font-medium text-sm group"
                                    >
                                        <Code size={18} className="text-gray-400 group-hover:text-gray-600" />
                                        Dev Login
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
