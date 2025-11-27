const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database/tasks.db');
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('Initializing database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  // Create employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating employees table:', err);
    } else {
      console.log('✅ Employees table created successfully');
    }
  });

  // Create tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      employee_id INTEGER NOT NULL,
      due_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err);
    } else {
      console.log('✅ Tasks table created successfully');
    }
  });

  // Insert sample employees
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  const employees = [
    ['John Doe', 'john@company.com', hashedPassword, 'admin', 'Engineering'],
    ['Jane Smith', 'jane@company.com', hashedPassword, 'user', 'Marketing'],
    ['Mike Johnson', 'mike@company.com', hashedPassword, 'user', 'Sales'],
    ['Sarah Williams', 'sarah@company.com', hashedPassword, 'user', 'HR'],
    ['Tom Brown', 'tom@company.com', hashedPassword, 'user', 'Engineering']
  ];

  const insertEmployee = db.prepare(`
    INSERT OR IGNORE INTO employees (name, email, password, role, department) 
    VALUES (?, ?, ?, ?, ?)
  `);

  employees.forEach(emp => {
    insertEmployee.run(emp);
  });

  insertEmployee.finalize(() => {
    console.log('✅ Sample employees inserted');
  });

  // Insert sample tasks
  const tasks = [
    ['Complete API Documentation', 'Write comprehensive API documentation for all endpoints', 'in-progress', 'high', 1, '2025-12-15'],
    ['Design Database Schema', 'Create ERD and database schema for new features', 'completed', 'high', 1, '2025-11-20'],
    ['Marketing Campaign Planning', 'Plan Q1 2026 marketing campaign', 'pending', 'medium', 2, '2025-12-30'],
    ['Social Media Strategy', 'Develop social media content calendar', 'in-progress', 'medium', 2, '2025-12-10'],
    ['Sales Presentation', 'Prepare presentation for potential clients', 'pending', 'high', 3, '2025-12-05'],
    ['Lead Follow-up', 'Follow up with leads from last week', 'in-progress', 'low', 3, '2025-12-01'],
    ['Employee Onboarding', 'Create onboarding process for new hires', 'completed', 'high', 4, '2025-11-25'],
    ['Policy Review', 'Review and update company policies', 'pending', 'medium', 4, '2026-01-15'],
    ['Code Review', 'Review pull requests from team members', 'in-progress', 'high', 5, '2025-11-28'],
    ['Bug Fixes', 'Fix reported bugs in production', 'pending', 'high', 5, '2025-12-02']
  ];

  setTimeout(() => {
    const insertTask = db.prepare(`
      INSERT OR IGNORE INTO tasks (title, description, status, priority, employee_id, due_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    tasks.forEach(task => {
      insertTask.run(task);
    });

    insertTask.finalize(() => {
      console.log('✅ Sample tasks inserted');
      console.log('\n🎉 Database initialization complete!');
      console.log('\nDemo Credentials:');
      console.log('Admin: john@company.com / password123');
      console.log('User:  jane@company.com / password123\n');
      db.close();
    });
  }, 500);
});
