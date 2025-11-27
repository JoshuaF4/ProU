# Employee Task Tracker - Backend API

Backend REST API for the Employee Task Tracker application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start server
npm start

# Or start with auto-reload (development)
npm run dev
```

Server will start on **http://localhost:5000**

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # SQLite database configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── employees.js         # Employee CRUD endpoints
│   ├── tasks.js             # Task CRUD endpoints
│   └── dashboard.js         # Dashboard statistics
├── scripts/
│   └── initDb.js            # Database initialization
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js                # Main server file
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
DB_PATH=../database/tasks.db
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `GET /api/employees/:id/tasks` - Get employee with tasks
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `DELETE /api/employees/:id` - Delete employee (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Health Check
- `GET /api/health` - Server health check

## 🔐 Demo Credentials

```
Admin: john@company.com / password123
User:  jane@company.com / password123
```

## 🛠️ Tech Stack

- Node.js + Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## 🐛 Troubleshooting

### Database Error (SQLITE_CANTOPEN)

**Windows:**
```powershell
# Run as Administrator
icacls ..\database /grant Everyone:F /T
npm run init-db
```

**Linux/Mac:**
```bash
chmod 755 ../database
npm run init-db
```

### Port Already in Use

Change `PORT` in `.env` file:
```bash
PORT=5001
```

## 📝 Notes

- Database file will be created at `../database/tasks.db`
- All passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
- Admin users have full CRUD access
- Regular users can only update their task status
