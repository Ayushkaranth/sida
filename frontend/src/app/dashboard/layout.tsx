'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, FolderGit2, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">Loading...</div>;

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass hidden md:flex flex-col rounded-r-3xl my-4 ml-4 z-20">
        <div className="h-20 flex items-center px-8">
          <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            ModernDash
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6">
          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 glass m-4 mb-0 rounded-2xl flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="md:hidden">
            <Link href="/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
               <div className="bg-primary/10 p-2 rounded-xl">
                 <LayoutDashboard className="h-5 w-5 text-primary" />
               </div>
            </Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
               <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
