# 🚀 Quick Start Guide - Employee Task Tracker

## Get Started in 5 Minutes!

### Step 1: Install Backend Dependencies & Initialize Database
```bash
cd backend
npm install
npm run init-db
npm start
```
✅ Backend running on http://localhost:5000

### Step 2: Install Frontend Dependencies (Open New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 3: Login & Test
Open browser: **http://localhost:3000**

**Admin Login:**
- Email: `john@company.com`
- Password: `password123`

**User Login:**
- Email: `jane@company.com`
- Password: `password123`

---

## 📋 What You Can Test

### As Admin (john@company.com):
1. ✅ View complete dashboard with all employee statistics
2. ✅ Navigate to "Employees" - add/edit/delete employees
3. ✅ Navigate to "Tasks" - create/assign/edit/delete tasks
4. ✅ Filter tasks by status, employee, priority
5. ✅ View employee performance metrics

### As Regular User (jane@company.com):
1. ✅ View personal dashboard (only your tasks)
2. ✅ Navigate to "Tasks" - view your assigned tasks
3. ✅ Update task status (pending → in-progress → completed)
4. ✅ Filter your tasks by status and priority
5. ❌ Cannot access employee management
6. ❌ Cannot create or delete tasks

---

## 🎯 Key Features to Demonstrate

### Core Requirements ✅
- ✅ View all employees and their tasks
- ✅ Add and update tasks
- ✅ Filter tasks by status/employee/priority
- ✅ Dashboard with task statistics and completion rates

### Bonus Features ✅
- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Admin can manage everything
- ✅ Users can only view/update their own tasks

---

## 🏗 Technology Stack

**Frontend:** React 18 + Vite + TailwindCSS + Axios
**Backend:** Node.js + Express + SQLite3 + JWT
**Database:** SQLite with proper foreign keys

---

## 📁 Project Structure
```
employee-task-tracker/
├── frontend/          # React application
├── backend/           # Express API server
├── database/          # SQLite database & schema
└── README.md          # Full documentation
```

---

## 🐛 Troubleshooting

**Port Already in Use?**
```bash
# Change ports in:
# backend/.env → PORT=5001
# frontend/vite.config.js → port: 3001
```

**Database Not Found?**
```bash
cd backend
npm run init-db
```

**Dependencies Issue?**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Full Documentation

See **README.md** for:
- Complete API documentation
- Architecture details
- Security features
- Future enhancements

---

**Happy Testing! 🎉**
