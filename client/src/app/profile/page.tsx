'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Update form data when user changes
  useState(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone || ''
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      // Error is handled by the auth context
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone || ''
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        <div className="text-center p-8 rounded-lg shadow-lg max-w-md" style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '2px solid rgb(113, 113, 122)'
        }}>
          <User className="mx-auto mb-4" style={{ color: 'rgb(113, 113, 122)' }} size={64} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Authentication Required</h2>
          <p style={{ color: 'rgb(15, 15, 15)' }}>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-lg shadow-lg overflow-hidden" style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '2px solid rgb(113, 113, 122)'
          }}>
            {/* Header */}
            <div className="px-6 py-8 text-white" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <User size={32} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                    <User size={16} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                    style={{
                      border: '1px solid rgb(113, 113, 122)',
                      backgroundColor: isEditing ? 'rgb(255, 255, 255)' : 'rgba(113, 113, 122, 0.1)',
                      color: 'rgb(15, 15, 15)'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                    style={{
                      border: '1px solid rgb(113, 113, 122)',
                      backgroundColor: isEditing ? 'rgb(255, 255, 255)' : 'rgba(113, 113, 122, 0.1)',
                      color: 'rgb(15, 15, 15)'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                    <Phone size={16} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="(702) 555-5555"
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                    style={{
                      border: '1px solid rgb(113, 113, 122)',
                      backgroundColor: isEditing ? 'rgb(255, 255, 255)' : 'rgba(113, 113, 122, 0.1)',
                      color: 'rgb(15, 15, 15)'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-3 rounded-lg transition flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: 'rgb(113, 113, 122)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: 'rgb(15, 15, 15)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)')}
                      onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)')}
                    >
                      <Save size={16} />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Info */}
            <div className="px-6 py-4" style={{
              borderTop: '1px solid rgb(113, 113, 122)',
              backgroundColor: 'rgba(15, 15, 15, 0.05)'
            }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'rgb(15, 15, 15)' }}>Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: 'rgb(15, 15, 15)' }}>Account Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs`} style={{
                    backgroundColor: user.isActive ? 'rgba(15, 15, 15, 0.1)' : 'rgba(113, 113, 122, 0.1)',
                    color: user.isActive ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'rgb(15, 15, 15)' }}>Role:</span>
                  <span className="ml-2 px-2 py-1 rounded text-xs capitalize" style={{
                    backgroundColor: 'rgba(113, 113, 122, 0.1)',
                    color: 'rgb(113, 113, 122)'
                  }}>
                    {user.role}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'rgb(15, 15, 15)' }}>Member Since:</span>
                  <span className="ml-2" style={{ color: 'rgb(15, 15, 15)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'rgb(15, 15, 15)' }}>Last Updated:</span>
                  <span className="ml-2" style={{ color: 'rgb(15, 15, 15)' }}>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
