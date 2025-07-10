'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col font-sans" style={{
      color: 'rgb(15, 15, 15)',
      backgroundColor: 'rgb(255, 255, 255)'
    }}>
      <Navigation />

      {/* hero */}
      <main className="flex-1">
        <section className="relative isolate flex items-center justify-center overflow-hidden" style={{
          backgroundColor: 'rgb(255, 255, 255)'
        }}>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(15, 15, 15, 0.05), rgba(113, 113, 122, 0.05))'
          }} />

          <div className="container relative z-10 mx-auto py-24 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-4xl font-extrabold sm:text-6xl"
              style={{ color: 'rgb(15, 15, 15)' }}
            >
              Feeding Las Vegas one <span style={{ color: 'rgb(113, 113, 122)' }}>office</span> at a time
            </motion.h1>

            <p className="mx-auto mb-8 max-w-xl text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
              Fast, reliable catering from the Strip’s favourite spots — delivered when you need it.
            </p>

            <Button asChild size="lg" className="text-white border-none" style={{
              backgroundColor: 'rgb(15, 15, 15)'
            }}>
              <Link href="/order">Start an order</Link>
            </Button>
          </div>
        </section>

        {/* features */}
        <section className="container mx-auto py-16">
          <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Why CaterLV?</h2>

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
      <footer style={{
        borderTop: '1px solid rgb(113, 113, 122)',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <div className="container mx-auto px-4 py-6 text-center text-sm" style={{ color: 'rgb(15, 15, 15)' }}>
          © {new Date().getFullYear()} CaterLV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* helper */
interface FeatureProps { icon: React.FC<any>; title: string; desc: string; }
function Feature({ icon: Icon, title, desc }: FeatureProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Icon className="h-10 w-10" style={{ color: 'rgb(113, 113, 122)' }} />
      <h3 className="text-xl font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>{title}</h3>
      <p className="max-w-xs" style={{ color: 'rgb(15, 15, 15)' }}>{desc}</p>
    </div>
  );
}
