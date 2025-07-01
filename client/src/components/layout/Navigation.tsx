'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-gray-900 font-medium' : 'transition hover:text-primary';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary">
          CaterVegas
        </Link>

        <nav className="flex gap-6 text-sm font-medium items-center">
          <Link href="/order" className={isActive('/order')}>
            Order
          </Link>
          <Link href="/schedule" className={isActive('/schedule')}>
            Schedule
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className={`flex items-center gap-1 ${isActive('/profile')}`}>
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={logout}
                className="transition hover:text-primary cursor-pointer"
              >
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Please log in to access all features</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
