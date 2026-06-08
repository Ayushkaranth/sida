'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      document.cookie = `token=${data.token}; path=/`;
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-mesh">
      {/* Left side abstract visual */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-12 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-slate-800 dark:text-white"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Welcome Back to ModernDash.</h1>
          <p className="text-xl opacity-80 max-w-md leading-relaxed">
            Manage your projects, organize your tasks, and stay productive with our premium dashboard experience.
          </p>
        </motion.div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md glass rounded-2xl p-8 sm:p-10"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Sign in</h2>
            <p className="text-muted-foreground">Enter your email and password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
                {error}
              </motion.div>
            )}
            
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
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
              {loading ? 'Signing in...' : 'Sign in to account'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
