# Employee Task Tracker - Fullstack Web Application

A complete internal tool for managing tasks within a company, featuring employee management, task tracking, role-based access control, and real-time dashboard analytics.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Assumptions & Limitations](#assumptions--limitations)

## ✨ Features

### Core Features
- ✅ View all employees and their tasks
- ✅ Add, update, and delete tasks
- ✅ Filter tasks by status, employee, and priority
- ✅ Dashboard with comprehensive analytics and completion rates
- ✅ Real-time task status updates
- ✅ Responsive design for all screen sizes

### Bonus Features (Authentication & Authorization)
- 🔐 User authentication with JWT tokens
- 👥 Role-based access control (Admin & User roles)
- 🔒 Admin can manage employees and tasks
- 📊 Regular users can only view and update their assigned tasks

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight SQL database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Database
- **SQLite** - Embedded relational database
- Foreign key relationships between Employees ↔ Tasks
- Proper indexes for query optimization

## 🏗 Architecture Overview

```
employee-task-tracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context for state management
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express backend API
│   ├── config/              # Database configuration
│   ├── middleware/          # Authentication middleware
│   ├── routes/              # API route handlers
│   ├── scripts/             # Database initialization
│   ├── server.js            # Main server file
│   └── package.json
│
└── database/                 # Database files
    ├── schema.sql           # Database schema
    └── tasks.db             # SQLite database (generated)
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd employee-task-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Initialize the database with sample data
npm run init-db

# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

The backend server will start on **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on **http://localhost:3000**

### 4. Access the Application

Open your browser and navigate to **http://localhost:3000**

#### Demo Credentials:

**Admin Account:**
- Email: `john@company.com`
- Password: `password123`

**Regular User Accounts:**
- Email: `jane@company.com` / Password: `password123`
- Email: `mike@company.com` / Password: `password123`
- Email: `sarah@company.com` / Password: `password123`
- Email: `tom@company.com` / Password: `password123`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/login
Login to get JWT token
```json
Request Body:
{
  "email": "john@company.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@company.com",
    "role": "admin",
    "department": "Engineering"
  }
}
```

#### POST /auth/register
Register a new user
```json
Request Body:
{
  "name": "New User",
  "email": "newuser@company.com",
  "password": "password123",
  "department": "Sales"
}
```

#### GET /auth/me
Get current user profile (requires authentication)

### Employee Endpoints

All employee endpoints require authentication. Admin-only endpoints are marked with 🔒.

#### GET /employees
Get all employees
```
Headers: Authorization: Bearer <token>
Response: Array of employee objects
```

#### GET /employees/:id
Get single employee by ID

#### GET /employees/:id/tasks
Get employee with their tasks

#### POST /employees 🔒
Create new employee (Admin only)
```json
Request Body:
{
  "name": "New Employee",
  "email": "employee@company.com",
  "password": "password123",
  "role": "user",
  "department": "Marketing"
}
```

#### PUT /employees/:id 🔒
Update employee (Admin only)

#### DELETE /employees/:id 🔒
Delete employee (Admin only)

### Task Endpoints

#### GET /tasks
Get all tasks with optional filters
```
Query Parameters:
- status: pending | in-progress | completed
- employee_id: integer
- priority: low | medium | high

Headers: Authorization: Bearer <token>
```

#### GET /tasks/:id
Get single task by ID

#### POST /tasks 🔒
Create new task (Admin only)
```json
Request Body:
{
  "title": "Complete Documentation",
  "description": "Write comprehensive API docs",
  "employee_id": 1,
  "status": "pending",
  "priority": "high",
  "due_date": "2025-12-31"
}
```

#### PUT /tasks/:id
Update task
- Admins can update all fields
- Regular users can only update status
```json
Request Body (Admin):
{
  "title": "Updated Title",
  "status": "in-progress",
  "priority": "high"
}

Request Body (User):
{
  "status": "completed"
}
```

#### DELETE /tasks/:id 🔒
Delete task (Admin only)

### Dashboard Endpoint

#### GET /dashboard
Get dashboard statistics
```
Headers: Authorization: Bearer <token>

Response:
{
  "totalTasks": 10,
  "completionRate": 30.0,
  "overdueTasks": 2,
  "tasksByStatus": {
    "pending": 3,
    "in-progress": 4,
    "completed": 3
  },
  "tasksByPriority": {
    "low": 2,
    "medium": 5,
    "high": 3
  },
  "recentTasks": [...],
  "employeeStats": [...] // Admin only
}
```

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
- Clean, professional login interface
- Demo credentials displayed for easy testing
- Registration link for new users

### Dashboard
![Dashboard](screenshots/dashboard.png)
- Real-time statistics cards
- Task distribution by status and priority
- Recent tasks overview
- Employee performance metrics (Admin only)

### Tasks Page
![Tasks Page](screenshots/tasks.png)
- Comprehensive task listing
- Advanced filtering by status, employee, and priority
- Create, edit, and delete tasks (Admin)
- Status updates (All users)

### Employees Page (Admin)
![Employees Page](screenshots/employees.png)
- Employee management interface
- Add, edit, and delete employees
- Role and department assignment

## 🗂 Project Structure

### Frontend Structure
```
frontend/src/
├── components/
│   ├── EmployeeModal.jsx      # Employee create/edit modal
│   ├── Navigation.jsx          # Top navigation bar
│   ├── ProtectedRoute.jsx     # Route protection wrapper
│   └── TaskModal.jsx           # Task create/edit modal
├── context/
│   └── AuthContext.jsx         # Authentication state management
├── pages/
│   ├── Dashboard.jsx           # Dashboard with statistics
│   ├── Employees.jsx           # Employee management (Admin)
│   ├── Login.jsx               # Login page
│   ├── Register.jsx            # Registration page
│   └── Tasks.jsx               # Task management
├── services/
│   └── api.js                  # Axios API client configuration
├── App.jsx                     # Main app with routing
├── index.css                   # Global styles with Tailwind
└── main.jsx                    # React entry point
```

### Backend Structure
```
backend/
├── config/
│   └── database.js             # SQLite database configuration
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── dashboard.js            # Dashboard statistics routes
│   ├── employees.js            # Employee CRUD routes
│   └── tasks.js                # Task CRUD routes
├── scripts/
│   └── initDb.js               # Database initialization script
├── .env                        # Environment variables
└── server.js                   # Express server configuration
```

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication with 24-hour expiration
3. **Role-Based Access Control**: Admin and User roles with different permissions
4. **Input Validation**: Server-side validation using express-validator
5. **SQL Injection Prevention**: Parameterized queries throughout
6. **CORS Configuration**: Proper CORS setup for API security

## 📝 Assumptions & Limitations

### Assumptions
1. **Single Organization**: The system is designed for a single organization
2. **Department Structure**: Simple flat department structure (no hierarchies)
3. **Task Assignment**: Tasks are assigned to one employee at a time
4. **Demo Environment**: Uses simplified authentication for demonstration purposes
5. **Local Development**: Configured for local development environment

### Known Limitations
1. **File Uploads**: No file attachment support for tasks
2. **Notifications**: No email or push notification system
3. **Task Comments**: No commenting system on tasks
4. **Task History**: No audit trail for task changes
5. **Advanced Filters**: Limited to basic status, priority, and employee filters
6. **Pagination**: No pagination implemented (suitable for small to medium datasets)
7. **Database**: SQLite is used (not suitable for high-concurrency production environments)

### Future Enhancements
- Task comments and activity logs
- File attachments for tasks
- Email notifications for task assignments and updates
- Advanced reporting and analytics
- Task dependencies and subtasks
- Calendar view for due dates
- PostgreSQL/MySQL support for production
- Docker containerization
- Deployment configurations (Heroku, Netlify, Railway)

## 🧪 Testing the Application

### Test Scenarios

1. **As Admin User (john@company.com)**
   - View dashboard with all statistics
   - Create, edit, and delete employees
   - Create, edit, and delete tasks
   - Assign tasks to any employee
   - Filter tasks by status, employee, and priority

2. **As Regular User (jane@company.com)**
   - View personal dashboard
   - View only assigned tasks
   - Update task status (pending → in-progress → completed)
   - Cannot access employee management
   - Cannot create or delete tasks

## 🤝 Contributing

This project was created as part of the ProU Technology internship coding challenge. For questions or feedback, please contact the development team.

## 📄 License

This project is created for educational and evaluation purposes.

---

**Developed for ProU Technology Internship Assignment**
*Fullstack Web Application - Track 3*
