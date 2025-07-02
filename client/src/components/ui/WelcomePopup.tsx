'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomePopup() {
  const { user, showWelcome, clearWelcome } = useAuth();

  // Auto-hide welcome popup after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        clearWelcome();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome, clearWelcome]);

  return (
    <AnimatePresence>
      {showWelcome && user && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            duration: 0.6
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-auto"
        >
          <div
            onClick={clearWelcome}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-400/20 backdrop-blur-sm cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="font-bold text-lg">Welcome back, {user.username}!</h3>
                <p className="text-green-100 text-sm">Ready to order some delicious food?</p>
              </div>
              <div className="text-green-200 text-xs ml-2">
                ✕
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
