'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderGit2, CheckSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Total Projects', value: 0, icon: FolderGit2, color: 'bg-blue-500', trend: 'All registered projects' },
    { title: 'Total Tasks', value: 0, icon: CheckSquare, color: 'bg-emerald-500', trend: 'All registered tasks' },
    { title: 'Pending Tasks', value: 0, icon: Clock, color: 'bg-amber-500', trend: 'To do or In progress' },
    { title: 'Completed Tasks', value: 0, icon: CheckCircle2, color: 'bg-purple-500', trend: 'Marked as done' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const pRes = await fetch('http://localhost:5000/api/projects?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tRes = await fetch('http://localhost:5000/api/tasks?limit=1000', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (pRes.ok && tRes.ok) {
        const pData = await pRes.json();
        const tData = await tRes.json();

        const allTasks = tData.tasks || [];
        const pending = allTasks.filter((t: any) => t.status === 'todo' || t.status === 'in-progress').length;
        const completed = allTasks.filter((t: any) => t.status === 'done').length;

        setStats([
          { title: 'Total Projects', value: pData.total || 0, icon: FolderGit2, color: 'bg-blue-500', trend: 'All registered projects' },
          { title: 'Total Tasks', value: tData.total || 0, icon: CheckSquare, color: 'bg-emerald-500', trend: 'All registered tasks' },
          { title: 'Pending Tasks', value: pending, icon: Clock, color: 'bg-amber-500', trend: 'To do or In progress' },
          { title: 'Completed Tasks', value: completed, icon: CheckCircle2, color: 'bg-purple-500', trend: 'Marked as done' },
        ]);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Overview</h1>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-xl ${stat.color} bg-opacity-10 text-white`}>
                    <Icon className="h-4 w-4" style={{ color: 'inherit' }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{stat.trend}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
