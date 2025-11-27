# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EMPLOYEE TASK TRACKER                     │
│                     Fullstack Web Application                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│   WEB BROWSER        │◄───────►│   FRONTEND (React)   │
│   (User Interface)   │  HTTP   │   Port: 3000         │
│                      │         │                      │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                            │ HTTP/AJAX
                                            │ REST API
                                            │ (Axios)
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │                      │
                                 │  BACKEND (Express)   │
                                 │  Port: 5000          │
                                 │                      │
                                 │  ┌────────────────┐  │
                                 │  │ Authentication │  │
                                 │  │  Middleware    │  │
                                 │  │    (JWT)       │  │
                                 │  └────────────────┘  │
                                 │                      │
                                 │  ┌────────────────┐  │
                                 │  │  API Routes    │  │
                                 │  │  - Auth        │  │
                                 │  │  - Employees   │  │
                                 │  │  - Tasks       │  │
                                 │  │  - Dashboard   │  │
                                 │  └────────────────┘  │
                                 │                      │
                                 └──────────┬───────────┘
                                            │
                                            │ SQL Queries
                                            │ (SQLite3)
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │                      │
                                 │  DATABASE (SQLite)   │
                                 │  tasks.db            │
                                 │                      │
                                 │  ┌────────────────┐  │
                                 │  │   Employees    │  │
                                 │  │   Table        │  │
                                 │  └────────┬───────┘  │
                                 │           │          │
                                 │           │ 1:N      │
                                 │           │          │
                                 │  ┌────────▼───────┐  │
                                 │  │    Tasks       │  │
                                 │  │    Table       │  │
                                 │  └────────────────┘  │
                                 │                      │
                                 └──────────────────────┘
```

## Component Architecture

### Frontend Components
```
App.jsx (Router)
│
├── AuthContext (Global State)
│   ├── User State
│   ├── Login/Logout
│   └── Token Management
│
├── Pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   └── Employees.jsx
│
├── Components
│   ├── Navigation.jsx
│   ├── ProtectedRoute.jsx
│   ├── TaskModal.jsx
│   └── EmployeeModal.jsx
│
└── Services
    └── api.js (Axios HTTP Client)
```

### Backend Structure
```
server.js (Express App)
│
├── Middleware
│   ├── CORS
│   ├── JSON Parser
│   ├── Authentication (JWT)
│   └── Authorization (Role-based)
│
├── Routes
│   ├── /api/auth
│   │   ├── POST /login
│   │   ├── POST /register
│   │   └── GET /me
│   │
│   ├── /api/employees
│   │   ├── GET /
│   │   ├── GET /:id
│   │   ├── GET /:id/tasks
│   │   ├── POST /
│   │   ├── PUT /:id
│   │   └── DELETE /:id
│   │
│   ├── /api/tasks
│   │   ├── GET /?status&employee_id&priority
│   │   ├── GET /:id
│   │   ├── POST /
│   │   ├── PUT /:id
│   │   └── DELETE /:id
│   │
│   └── /api/dashboard
│       └── GET /
│
└── Config
    └── database.js (SQLite Connection)
```

## Data Flow Diagrams

### User Login Flow
```
User → Login Page → API /auth/login → Database
                         ↓
                    JWT Token Generated
                         ↓
                    Store in localStorage
                         ↓
                    Redirect to Dashboard
```

### Task Creation Flow (Admin)
```
Admin → Tasks Page → Click "Create Task"
                         ↓
                    Task Modal Opens
                         ↓
                    Fill Form & Submit
                         ↓
                    POST /api/tasks
                         ↓
                    Validate Data
                         ↓
                    Insert into Database
                         ↓
                    Return Created Task
                         ↓
                    Update UI & Close Modal
```

### Task Status Update Flow (User)
```
User → Tasks Page → Click "Update Status"
                         ↓
                    Task Modal Opens
                         ↓
                    Change Status & Submit
                         ↓
                    PUT /api/tasks/:id
                         ↓
                    Check Permissions
                         ↓
                    Update Database
                         ↓
                    Return Updated Task
                         ↓
                    Update UI & Close Modal
```

## Security Architecture

```
┌────────────────────────────────────────────────┐
│             Security Layers                    │
├────────────────────────────────────────────────┤
│                                                │
│  1. Frontend Protection                        │
│     - ProtectedRoute Component                 │
│     - Token Validation                         │
│     - Role-based UI Rendering                  │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  2. Network Security                           │
│     - CORS Configuration                       │
│     - HTTPS Ready                              │
│     - Token in Authorization Header            │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  3. Backend Authentication                     │
│     - JWT Token Verification                   │
│     - Token Expiration (24h)                   │
│     - authMiddleware                           │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  4. Backend Authorization                      │
│     - Role-based Access Control                │
│     - adminMiddleware                          │
│     - Resource Ownership Check                 │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  5. Data Security                              │
│     - Password Hashing (bcrypt)                │
│     - Input Validation (express-validator)     │
│     - Parameterized Queries (SQL Injection)    │
│     - Environment Variables                    │
│                                                │
└────────────────────────────────────────────────┘
```

## Database Schema Diagram

```
┌─────────────────────────────────┐
│         EMPLOYEES               │
├─────────────────────────────────┤
│ id (PK)          INTEGER        │
│ name             TEXT            │
│ email (UNIQUE)   TEXT            │
│ password         TEXT            │
│ role             TEXT            │
│ department       TEXT            │
│ created_at       DATETIME        │
└───────────────┬─────────────────┘
                │
                │ 1:N
                │
                │
┌───────────────▼─────────────────┐
│           TASKS                 │
├─────────────────────────────────┤
│ id (PK)          INTEGER        │
│ title            TEXT            │
│ description      TEXT            │
│ status           TEXT            │
│ priority         TEXT            │
│ employee_id (FK) INTEGER        │
│ due_date         DATE            │
│ created_at       DATETIME        │
│ updated_at       DATETIME        │
└─────────────────────────────────┘

Relationships:
- One Employee can have Many Tasks (1:N)
- Tasks.employee_id references Employees.id
- Foreign Key with ON DELETE CASCADE
```

## Request/Response Flow

### Example: Get All Tasks
```
1. User clicks "Tasks" in navigation
   ↓
2. React Router navigates to /tasks
   ↓
3. Tasks.jsx component mounts
   ↓
4. useEffect calls tasksAPI.getAll()
   ↓
5. Axios GET request to /api/tasks
   Headers: { Authorization: "Bearer <token>" }
   ↓
6. Express receives request
   ↓
7. authMiddleware verifies JWT token
   ↓
8. Route handler executes
   ↓
9. Database query with filters
   SQL: SELECT * FROM tasks WHERE ...
   ↓
10. Database returns results
   ↓
11. Express sends JSON response
   ↓
12. Axios receives response
   ↓
13. React updates state
   ↓
14. UI re-renders with tasks
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  React 18 + TailwindCSS + React Router     │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│           Application Layer                 │
│  Express.js + JWT + bcryptjs               │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│           Data Layer                        │
│  SQLite3 + SQL                             │
└─────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────┐
│          Production Environment             │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend: Netlify / Vercel                │
│  - Static React build                       │
│  - CDN distribution                         │
│  - HTTPS                                    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Backend: Heroku / Railway / Render        │
│  - Node.js Express server                   │
│  - Environment variables                    │
│  - HTTPS                                    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Database: PostgreSQL / MySQL               │
│  - Managed database service                 │
│  - Automated backups                        │
│  - SSL connection                           │
│                                             │
└─────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Testability
