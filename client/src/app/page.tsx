'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingCart, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import LoginModal from '@/components/ui/LoginModal';
import SignupModal from '@/components/ui/SignupModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  return (
    <div className="flex min-h-screen flex-col font-sans text-white bg-gradient-to-br from-gray-900 to-black">
      {/* nav */}
      <header className="sticky top-0 z-50 bg-gray-800/90 backdrop-blur border-b border-gray-700">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-orange-500">
            CaterVegas
          </Link>

          <nav className="flex gap-6 text-sm font-medium items-center">
            <Link href="/order" className="text-white transition hover:text-orange-400">Order</Link>
            <Link href="/schedule" className="text-white transition hover:text-orange-400">Schedule</Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-white transition hover:text-orange-400">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-white transition hover:text-orange-400 cursor-pointer"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setShowSignup(true)} className="text-white transition hover:text-orange-400 cursor-pointer bg-transparent border-none p-0">
                  <span>Sign Up</span>
                </button>
                <button onClick={() => setShowLogin(true)} className="text-white transition hover:text-orange-400 cursor-pointer">
                  <span>Login</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1">
        <section className="relative isolate flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20" />

          <div className="container relative z-10 mx-auto py-24 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-4xl font-extrabold sm:text-6xl"
            >
              Feeding Las Vegas one <span className="text-orange-500">office</span> at a time
            </motion.h1>

            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-300">
              Fast, reliable catering from the Strip’s favourite spots — delivered when you need it.
            </p>

            <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none">
              <Link href="/order">Start an order</Link>
            </Button>
          </div>
        </section>

        {/* features */}
        <section className="container mx-auto py-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Why CaterVegas?</h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <Feature icon={ShoppingCart} title="Easy Ordering"
              desc="Build, duplicate or recall orders in seconds." />
            <Feature icon={Calendar} title="Built-in Scheduling"
              desc="Plan weeks in advance with a calendar view of upcoming events." />
            <Feature icon={User} title="Seamless Account"
              desc="One login handles invoices, dietary notes and favorites." />
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="border-t border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CaterVegas. All rights reserved.
        </div>
      </footer>

      {/* modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
}

/* helper */
interface FeatureProps { icon: React.FC<any>; title: string; desc: string; }
function Feature({ icon: Icon, title, desc }: FeatureProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Icon className="h-10 w-10 text-orange-500" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 max-w-xs">{desc}</p>
    </div>
  );
}
