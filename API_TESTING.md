# API Testing Guide

## Using cURL or Postman

### 1. Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@company.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@company.com",
    "role": "admin",
    "department": "Engineering"
  }
}
```

**Save the token for subsequent requests!**

---

### 2. Get All Employees

```bash
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Get All Tasks

```bash
# All tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by employee
curl "http://localhost:5000/api/tasks?employee_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Multiple filters
curl "http://localhost:5000/api/tasks?status=in-progress&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Create New Task (Admin Only)

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task via API",
    "description": "Testing API endpoint",
    "employee_id": 2,
    "status": "pending",
    "priority": "high",
    "due_date": "2025-12-31"
  }'
```

---

### 5. Update Task

```bash
# Admin - can update any field
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "medium"
  }'

# Regular User - can only update status
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress"
  }'
```

---

### 6. Get Dashboard Statistics

```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
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
  "employeeStats": [...]
}
```

---

### 7. Create New Employee (Admin Only)

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "password": "password123",
    "role": "user",
    "department": "Design"
  }'
```

---

### 8. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Wilson",
    "email": "bob@company.com",
    "password": "password123",
    "department": "Operations"
  }'
```

---

### 9. Delete Task (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 10. Delete Employee (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/employees/5 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Postman Collection

### Import these requests into Postman:

1. Create new collection: "Employee Task Tracker API"
2. Set collection variable: `baseUrl` = `http://localhost:5000/api`
3. Set collection variable: `token` = (paste token after login)
4. Add requests as shown above
5. Use `{{baseUrl}}` and `{{token}}` in your requests

### Example Postman Request:
```
Method: GET
URL: {{baseUrl}}/tasks?status=pending
Headers:
  Authorization: Bearer {{token}}
```

---

## Testing Checklist

### Authentication
- [ ] Login with admin credentials
- [ ] Login with user credentials
- [ ] Register new user
- [ ] Access protected route without token (should fail)

### Tasks (Admin)
- [ ] Get all tasks
- [ ] Filter tasks by status
- [ ] Filter tasks by employee
- [ ] Create new task
- [ ] Update task
- [ ] Delete task

### Tasks (User)
- [ ] Get only assigned tasks
- [ ] Update task status
- [ ] Cannot create task (should fail)
- [ ] Cannot delete task (should fail)

### Employees (Admin)
- [ ] Get all employees
- [ ] Get single employee
- [ ] Get employee with tasks
- [ ] Create employee
- [ ] Update employee
- [ ] Delete employee

### Employees (User)
- [ ] Can view employees
- [ ] Cannot create employee (should fail)
- [ ] Cannot delete employee (should fail)

### Dashboard
- [ ] Admin sees all statistics
- [ ] User sees only personal statistics
- [ ] Completion rate calculated correctly
- [ ] Task counts accurate

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

---

**Happy Testing! 🧪**
