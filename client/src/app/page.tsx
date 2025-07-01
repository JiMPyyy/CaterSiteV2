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
    <div className="flex min-h-screen flex-col font-sans text-gray-900 bg-white">
      {/* nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary">
            CaterVegas
          </Link>

          <nav className="flex gap-6 text-sm font-medium items-center">
            <Link href="/order" className="transition hover:text-primary">Order</Link>
            <Link href="/schedule" className="transition hover:text-primary">Schedule</Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="transition hover:text-primary">
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
              <>
                <button onClick={() => setShowSignup(true)} className="transition hover:text-primary cursor-pointer bg-transparent border-none p-0">
                  <span>Sign Up</span>
                </button>
                <button onClick={() => setShowLogin(true)} className="transition hover:text-primary cursor-pointer">
                  <span>Login</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1">
        <section className="relative isolate flex items-center justify-center overflow-hidden bg-[url('/bg-hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply" />

          <div className="container relative z-10 mx-auto py-24 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-4xl font-extrabold sm:text-6xl"
            >
              Feeding Las Vegas one office at a time
            </motion.h1>

            <p className="mx-auto mb-8 max-w-xl text-lg">
              Fast, reliable catering from the Strip’s favourite spots — delivered when you need it.
            </p>

            <Button asChild size="lg">
              <Link href="/order">Start an order</Link>
            </Button>
          </div>
        </section>

        {/* features */}
        <section className="container mx-auto py-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Why CaterVegas?</h2>

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
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
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
      <Icon className="h-10 w-10 text-primary" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-xs">{desc}</p>
    </div>
  );
}
