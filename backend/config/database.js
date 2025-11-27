const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH || '../database/tasks.db');

console.log('=== SQLite Connection Debug ===');
console.log('Database path:', dbPath);

// Check directory exists and is writable
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

// Check write permissions
try {
  const testFile = path.join(dbDir, '.write-test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Directory is writable');
} catch (err) {
  console.error('❌ Directory is NOT writable:', err.message);
  console.error('\nOn Windows, run as Administrator:');
  console.error(`icacls "${dbDir}" /grant Everyone:F /T`);
  process.exit(1);
}

// Create database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('\nTroubleshooting:');
    console.error('1. Run: npm run init-db');
    console.error('2. Check file permissions');
    console.error('3. Ensure no other process is using the database');
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database');
    console.log('Database location:', dbPath);
  }
});

class Database {
  constructor() {
    this.db = db;
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();
