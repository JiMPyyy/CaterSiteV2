'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: Props) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="mb-5 text-center text-2xl font-bold text-gray-900">
              Create Your CaterVegas Account&nbsp;✨
            </h2>

            <form className="space-y-5">
              {/* username */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Username</span>
                <input
                  type="text"
                  required
                  placeholder="Choose a username"
                  className="mt-1 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* email */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* phone */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <input
                  type="tel"
                  placeholder="(702) 555‑5555"
                  className="mt-1 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* password */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  className="mt-1 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* confirm password */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  className="mt-1 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-2 font-semibold text-white shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
