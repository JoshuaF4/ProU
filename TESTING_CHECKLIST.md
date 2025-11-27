# Testing Checklist

## Pre-Testing Setup

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Database initialized with sample data
- [ ] Browser opened to http://localhost:3000

---

## 1. Authentication Testing

### Login Tests
- [ ] Login with admin credentials (john@company.com / password123)
- [ ] Login with user credentials (jane@company.com / password123)
- [ ] Login with invalid credentials (should show error)
- [ ] Login with empty fields (should show validation error)
- [ ] Verify JWT token stored in localStorage
- [ ] Verify user info stored in localStorage

### Registration Tests
- [ ] Register new user with valid data
- [ ] Register with existing email (should show error)
- [ ] Register with short password (<6 chars, should show error)
- [ ] Register with empty required fields (should show error)
- [ ] Verify new user can login immediately
- [ ] Verify new user has 'user' role by default

### Logout Tests
- [ ] Click logout button
- [ ] Verify redirected to login page
- [ ] Verify token removed from localStorage
- [ ] Verify cannot access protected routes after logout

---

## 2. Dashboard Testing

### Admin Dashboard
- [ ] See total tasks count
- [ ] See completion rate percentage
- [ ] See overdue tasks count
- [ ] See tasks breakdown by status
- [ ] See tasks breakdown by priority
- [ ] See recent tasks table
- [ ] See employee performance statistics table
- [ ] All statistics match actual data

### User Dashboard
- [ ] See only personal task statistics
- [ ] See only assigned tasks in recent tasks
- [ ] Cannot see employee performance table
- [ ] Statistics accurate for user's tasks only

---

## 3. Task Management Testing

### Viewing Tasks (Admin)
- [ ] See all tasks from all employees
- [ ] Tasks display with correct information:
  - [ ] Title
  - [ ] Description
  - [ ] Employee name
  - [ ] Department
  - [ ] Status badge (with correct color)
  - [ ] Priority badge (with correct color)
  - [ ] Due date

### Viewing Tasks (User)
- [ ] See only assigned tasks
- [ ] Cannot see other employees' tasks
- [ ] Task information displays correctly

### Filtering Tasks
- [ ] Filter by status = "pending"
- [ ] Filter by status = "in-progress"
- [ ] Filter by status = "completed"
- [ ] Filter by priority = "low"
- [ ] Filter by priority = "medium"
- [ ] Filter by priority = "high"
- [ ] Filter by employee (admin only)
- [ ] Combine multiple filters
- [ ] Clear filters shows all tasks
- [ ] Filter results update immediately

### Creating Tasks (Admin Only)
- [ ] Click "Create New Task" button
- [ ] Modal opens with empty form
- [ ] Fill all required fields
- [ ] Select employee from dropdown
- [ ] Select status
- [ ] Select priority
- [ ] Set due date
- [ ] Submit form
- [ ] Task appears in task list
- [ ] Verify task saved in database
- [ ] Try creating task with missing required fields (should show error)

### Editing Tasks (Admin)
- [ ] Click "Edit" on a task
- [ ] Modal opens with pre-filled data
- [ ] Modify title
- [ ] Modify description
- [ ] Change status
- [ ] Change priority
- [ ] Change assigned employee
- [ ] Change due date
- [ ] Submit changes
- [ ] Verify changes reflected in task list
- [ ] Verify changes saved in database

### Updating Task Status (User)
- [ ] Click "Update Status" on assigned task
- [ ] Modal opens with status dropdown only
- [ ] Cannot edit other fields
- [ ] Change status from pending to in-progress
- [ ] Submit change
- [ ] Verify status updated in task list
- [ ] Try changing status on unassigned task (should fail)

### Deleting Tasks (Admin Only)
- [ ] Click "Delete" on a task
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Task removed from list
- [ ] Verify task deleted from database
- [ ] Cancel deletion (task should remain)

---

## 4. Employee Management Testing (Admin Only)

### Viewing Employees
- [ ] Navigate to "Employees" page
- [ ] See all employees in table
- [ ] Employee information displays:
  - [ ] Name
  - [ ] Email
  - [ ] Department
  - [ ] Role badge
  - [ ] Action buttons

### Creating Employees
- [ ] Click "Add New Employee" button
- [ ] Modal opens with empty form
- [ ] Fill required fields:
  - [ ] Name
  - [ ] Email
  - [ ] Password (min 6 chars)
  - [ ] Department (optional)
  - [ ] Role (user/admin)
- [ ] Submit form
- [ ] Employee appears in list
- [ ] Try duplicate email (should show error)
- [ ] Try short password (should show error)

### Editing Employees
- [ ] Click "Edit" on an employee
- [ ] Modal opens with pre-filled data
- [ ] Modify name
- [ ] Modify email
- [ ] Modify department
- [ ] Change role
- [ ] Submit changes
- [ ] Verify changes in employee list

### Deleting Employees
- [ ] Click "Delete" on an employee
- [ ] Confirmation dialog shows warning about tasks
- [ ] Confirm deletion
- [ ] Employee removed from list
- [ ] Verify employee's tasks also deleted (cascade)
- [ ] Cancel deletion (employee should remain)

### Access Control
- [ ] Login as regular user
- [ ] Verify "Employees" not in navigation
- [ ] Try accessing /employees directly (should redirect)

---

## 5. Navigation Testing

### Admin Navigation
- [ ] "Dashboard" link works
- [ ] "Tasks" link works
- [ ] "Employees" link works
- [ ] Active page highlighted in navigation
- [ ] User name displayed in header
- [ ] "Admin" badge displayed
- [ ] Logout button works

### User Navigation
- [ ] "Dashboard" link works
- [ ] "Tasks" link works
- [ ] "Employees" link NOT visible
- [ ] Active page highlighted in navigation
- [ ] User name displayed in header
- [ ] No admin badge
- [ ] Logout button works

---

## 6. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements visible
- [ ] Navigation works
- [ ] Tables readable
- [ ] Modals centered

### Tablet (768x1024)
- [ ] Layout adapts properly
- [ ] Navigation still accessible
- [ ] Tables scrollable if needed
- [ ] Modals fit screen
- [ ] Buttons clickable

### Mobile (375x667)
- [ ] Layout stacks vertically
- [ ] Navigation accessible
- [ ] Tables scroll horizontally
- [ ] Modals fill screen appropriately
- [ ] Forms still usable
- [ ] Buttons large enough to tap

---

## 7. API Testing (Backend)

### Health Check
- [ ] GET /api/health returns 200 OK

### Auth Endpoints
- [ ] POST /api/auth/login works
- [ ] POST /api/auth/register works
- [ ] GET /api/auth/me returns current user

### Employee Endpoints
- [ ] GET /api/employees returns all employees
- [ ] GET /api/employees/:id returns specific employee
- [ ] GET /api/employees/:id/tasks returns employee with tasks
- [ ] POST /api/employees creates new employee (admin only)
- [ ] PUT /api/employees/:id updates employee (admin only)
- [ ] DELETE /api/employees/:id deletes employee (admin only)

### Task Endpoints
- [ ] GET /api/tasks returns tasks (all for admin, assigned for user)
- [ ] GET /api/tasks?status=pending filters by status
- [ ] GET /api/tasks?employee_id=1 filters by employee
- [ ] GET /api/tasks?priority=high filters by priority
- [ ] POST /api/tasks creates new task (admin only)
- [ ] PUT /api/tasks/:id updates task (admin: all fields, user: status only)
- [ ] DELETE /api/tasks/:id deletes task (admin only)

### Dashboard Endpoint
- [ ] GET /api/dashboard returns statistics
- [ ] Admin sees all employee stats
- [ ] User sees only personal stats

---

## 8. Security Testing

### Authentication
- [ ] Cannot access /dashboard without token
- [ ] Cannot access /tasks without token
- [ ] Cannot access /employees without token
- [ ] Invalid token returns 401
- [ ] Expired token returns 401

### Authorization
- [ ] User cannot create tasks
- [ ] User cannot delete tasks
- [ ] User cannot edit task (except status)
- [ ] User cannot access /employees page
- [ ] User cannot create/edit/delete employees
- [ ] User can only see assigned tasks
- [ ] Admin can do everything

### Data Security
- [ ] Passwords not visible in API responses
- [ ] Passwords hashed in database
- [ ] SQL injection attempts fail
- [ ] XSS attempts sanitized

---

## 9. Error Handling Testing

### Frontend Errors
- [ ] Network error shows user-friendly message
- [ ] 401 error redirects to login
- [ ] 403 error shows access denied message
- [ ] 404 error shows not found message
- [ ] Validation errors display inline
- [ ] Loading states show spinners

### Backend Errors
- [ ] Invalid input returns 400 with error message
- [ ] Missing auth returns 401
- [ ] Insufficient permissions returns 403
- [ ] Not found returns 404
- [ ] Server errors return 500 with generic message

---

## 10. Data Integrity Testing

### Database Relationships
- [ ] Deleting employee cascades to tasks
- [ ] Cannot create task with invalid employee_id
- [ ] Foreign key constraints enforced
- [ ] Unique email constraint enforced

### Data Validation
- [ ] Cannot create employee with duplicate email
- [ ] Cannot create task with empty title
- [ ] Status must be: pending, in-progress, or completed
- [ ] Priority must be: low, medium, or high
- [ ] Role must be: user or admin

---

## 11. Performance Testing

### Page Load Times
- [ ] Dashboard loads in <2 seconds
- [ ] Tasks page loads in <2 seconds
- [ ] Employees page loads in <2 seconds

### API Response Times
- [ ] GET requests respond in <500ms
- [ ] POST requests complete in <1s
- [ ] PUT requests complete in <1s
- [ ] DELETE requests complete in <500ms

### UI Responsiveness
- [ ] Forms submit without lag
- [ ] Modals open instantly
- [ ] Filters apply immediately
- [ ] No UI freezing

---

## 12. User Experience Testing

### Ease of Use
- [ ] Navigation intuitive
- [ ] Buttons clearly labeled
- [ ] Forms easy to fill
- [ ] Error messages helpful
- [ ] Success feedback clear

### Visual Design
- [ ] Consistent color scheme
- [ ] Proper spacing
- [ ] Readable fonts
- [ ] Clear visual hierarchy
- [ ] Professional appearance

### Accessibility
- [ ] Forms have labels
- [ ] Buttons have clear text
- [ ] Color contrast sufficient
- [ ] Tab navigation works
- [ ] Keyboard shortcuts work

---

## Final Checklist

- [ ] All core features work
- [ ] All bonus features work
- [ ] No console errors
- [ ] No broken links
- [ ] Database persists data
- [ ] API documented
- [ ] README complete
- [ ] Code commented where needed
- [ ] Git repository clean
- [ ] Ready for submission

---

## Bug Report Template

If you find any issues during testing:

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- OS: 
- Node version: 

**Screenshots:**
[If applicable]

**Priority:** [Low/Medium/High/Critical]
```

---

**Testing Complete! ✅**
