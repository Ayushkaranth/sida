'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo', projectId: '' });
  const [file, setFile] = useState<File | null>(null);

  const getHeaders = (isFormData = false): HeadersInit => {
    const token = localStorage.getItem('token');
    return isFormData 
      ? { 'Authorization': `Bearer ${token}` }
      : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/tasks?page=${page}`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    const res = await fetch('http://localhost:5000/api/projects?limit=100', { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
      if (data.projects.length > 0) {
         setFormData(prev => ({ ...prev, projectId: data.projects[0]._id }));
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    let attachmentUrl = '';
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const resUpload = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: getHeaders(true),
        body: formDataUpload,
      });
      if (resUpload.ok) {
        const dataUpload = await resUpload.json();
        attachmentUrl = `http://localhost:5000${dataUpload.url}`;
      }
    }

    await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...formData, attachmentUrl }),
    });
    
    setIsCreateOpen(false);
    setFormData({ title: '', description: '', status: 'todo', projectId: projects[0]?._id || '' });
    setFile(null);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: getHeaders() 
      });
      fetchTasks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button>Create Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value || '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p: any) => (
                      <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value || 'todo' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Attachment (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No tasks found.</TableCell>
              </TableRow>
            ) : (
              tasks.map((task: any) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.projectId?.title || 'Unknown'}</TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {task.attachmentUrl ? (
                      <a href={task.attachmentUrl} target="_blank" className="text-blue-500 hover:underline">View</a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(task._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
