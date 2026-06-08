# ModernDash 🚀

A premium full-stack dashboard application built with **Next.js**, **Node.js/Express**, and **MongoDB**. ModernDash features a beautiful, glassmorphic UI with micro-animations, role-based authentication, and full CRUD capabilities for Projects and Tasks.

---

## 🏗️ Architecture

The project is split into a decoupled two-tier architecture:

- **Frontend (`/frontend`)**: A pure Next.js 14 (App Router) application. Uses TailwindCSS, Framer Motion, and Shadcn UI for premium aesthetics.
- **Backend (`/backend`)**: A standalone Node.js Express server. Connects to MongoDB via Mongoose, handles JWT authentication, and processes file uploads with Multer.

---

## ✨ Features

- **Authentication**: Custom JWT-based Login and Registration.
- **Role-Based Access Control**: Admins and Users have distinct capabilities.
- **Premium UI**: Glassmorphism, mesh gradients, and Framer Motion animations.
- **Project & Task Management**: Full CRUD (Create, Read, Update, Delete) operations.
- **Dashboard Analytics**: Real-time aggregation of your pending and completed tasks.
- **File Uploads**: Attach files to tasks via Multer endpoints.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017` or an Atlas URI)

### 1. Start the Backend
```bash
cd backend
npm install
# Create a .env file with JWT_SECRET and MONGODB_URI if needed
npm run dev
```
*The backend API will run on `http://localhost:5000`*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The UI will run on `http://localhost:3000`*


