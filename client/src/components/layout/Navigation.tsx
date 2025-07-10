'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '@/components/ui/LoginModal';
import SignupModal from '@/components/ui/SignupModal';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'font-medium' : 'transition';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderBottom: '1px solid rgb(113, 113, 122)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative'
      }}>
        <div className="flex h-16 items-center" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <Link href="/" className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 15, 15)' }}>
              CaterLV
            </Link>
          </div>

          <nav className="flex gap-6 text-sm font-medium items-center" style={{ marginLeft: 'auto' }}>
          <Link
            href="/order"
            className={isActive('/order')}
            style={{ color: 'rgb(15, 15, 15)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
          >
            Order
          </Link>
          <Link
            href="/schedule"
            className={isActive('/schedule')}
            style={{ color: 'rgb(15, 15, 15)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
          >
            Schedule
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 ${isActive('/admin')}`}
                  style={{ color: 'rgb(113, 113, 122)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(82, 82, 91)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className={`flex items-center gap-1 ${isActive('/profile')}`}
                style={{ color: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={logout}
                className="transition cursor-pointer"
                style={{ color: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
              >
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSignup(true)}
                className="transition cursor-pointer bg-transparent border-none p-0"
                style={{ color: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
              >
                <span>Sign Up</span>
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="transition cursor-pointer"
                style={{ color: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(15, 15, 15)'}
              >
                <span>Login</span>
              </button>
            </div>
          )}
        </nav>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </header>
  );
}
