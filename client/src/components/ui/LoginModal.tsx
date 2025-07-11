'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Removed ESC key handler to prevent accidental closing

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      clearError();
      setFormData({ username: '', password: '' });
    }
  }, [isOpen, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling

    try {
      await login(formData);
      // Only close on successful login
      onClose();
    } catch (error) {
      // Error is handled by the auth context, don't close modal
      console.error('Login failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          /* ── backdrop ── */
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'grid',
            placeItems: 'center',
            minHeight: '100vh',
            padding: '1rem'
          }}
          onClick={(e) => {
            // Only close if clicking directly on the backdrop (not bubbled from child)
            if (e.target === e.currentTarget && !isLoading) {
              onClose();
            }
          }}
        >
          <motion.div
            /* ── modal card ── */
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '2px solid rgb(15, 15, 15)'
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading) {
                  onClose();
                }
              }}
              disabled={isLoading}
              className={`absolute top-3 right-4 text-2xl font-bold ${
                isLoading
                  ? 'cursor-not-allowed'
                  : 'transition'
              }`}
              style={{
                color: isLoading ? 'rgb(113, 113, 122)' : 'rgb(15, 15, 15)'
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.color = 'rgb(113, 113, 122)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.color = 'rgb(15, 15, 15)')}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="mb-5 text-center text-2xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
              Login to CaterLV
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg" style={{
                backgroundColor: 'rgba(15, 15, 15, 0.1)',
                border: '1px solid rgb(15, 15, 15)',
                color: 'rgb(15, 15, 15)'
              }}>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              className="space-y-5"
            >
              {/* username */}
              <label className="block">
                <span className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Username</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                  className="mt-1 w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                  style={{
                    border: '1px solid rgb(113, 113, 122)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(15, 15, 15)',
                    focusRingColor: 'rgb(15, 15, 15)'
                  }}
                  disabled={isLoading}
                />
              </label>

              {/* password */}
              <label className="block">
                <span className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                  style={{
                    border: '1px solid rgb(113, 113, 122)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(15, 15, 15)',
                    focusRingColor: 'rgb(15, 15, 15)'
                  }}
                  disabled={isLoading}
                />
              </label>

              {/* submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-2 font-semibold text-white shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)')}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}