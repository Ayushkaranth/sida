'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://sida-smoky.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/`;

      router.push('/dashboard');
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-mesh flex-row-reverse">
      {/* Left side abstract visual (now on right for register) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-12 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-slate-800 dark:text-white"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Start your journey.</h1>
          <p className="text-xl opacity-80 max-w-md leading-relaxed">
            Create an account to unlock powerful tools and beautiful interfaces that make work feel like play.
          </p>
        </motion.div>
      </div>

      {/* Right side form (now on left for register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md glass rounded-2xl p-8 sm:p-10"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create account</h2>
            <p className="text-muted-foreground">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-colors h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-colors h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-colors h-12"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium transition-transform active:scale-[0.98]" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
