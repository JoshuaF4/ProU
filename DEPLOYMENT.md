# Deployment Guide

This guide explains how to deploy the Employee Task Tracker to production environments.

## Table of Contents
- [Deployment Options](#deployment-options)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Migration](#database-migration)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Deployment Options

### Recommended Stack
- **Frontend:** Vercel or Netlify
- **Backend:** Railway, Render, or Heroku
- **Database:** PostgreSQL or MySQL (via Railway, Supabase, or PlanetScale)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Install Vercel CLI:**
```bash
npm install -g vercel
```

3. **Deploy:**
```bash
vercel
```

4. **Set environment variables in Vercel:**
- `VITE_API_URL`: Your backend API URL (e.g., https://your-api.railway.app/api)

### Option 2: Netlify

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

5. **Set environment variables in Netlify:**
- `VITE_API_URL`: Your backend API URL

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create account at railway.app**

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

3. **Login and initialize:**
```bash
railway login
railway init
```

4. **Deploy:**
```bash
cd backend
railway up
```

5. **Add PostgreSQL database:**
```bash
railway add postgresql
```

6. **Set environment variables:**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=[generate-strong-secret]
DATABASE_URL=[provided-by-railway]
```

7. **Update database configuration for PostgreSQL:**

Create `backend/config/database-pg.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
```

### Option 2: Render

1. **Create account at render.com**

2. **Connect your GitHub repository**

3. **Create new Web Service:**
- Build Command: `npm install`
- Start Command: `npm start`

4. **Add PostgreSQL database:**
- Create new PostgreSQL instance
- Link to your web service

5. **Set environment variables:**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=[generate-strong-secret]
DATABASE_URL=[provided-by-render]
```

### Option 3: Heroku

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login and create app:**
```bash
heroku login
cd backend
heroku create your-app-name
```

3. **Add PostgreSQL:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

5. **Deploy:**
```bash
git push heroku main
```

---

## Database Migration

### Migrating from SQLite to PostgreSQL

1. **Create migration script (backend/scripts/migrate-to-pg.js):**
```javascript
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

// PostgreSQL schema
const pgSchema = `
  CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    employee_id INTEGER NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
  );

  CREATE INDEX idx_tasks_employee_id ON tasks(employee_id);
  CREATE INDEX idx_tasks_status ON tasks(status);
  CREATE INDEX idx_tasks_priority ON tasks(priority);
`;

// Run migration
async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Create tables
    await pool.query(pgSchema);
    console.log('PostgreSQL schema created');

    // You can add data migration logic here if needed

    await pool.end();
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrate();
```

2. **Run migration:**
```bash
node backend/scripts/migrate-to-pg.js
```

---

## Environment Variables

### Production Environment Variables

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=generate-a-very-strong-random-secret-key-here
JWT_EXPIRES_IN=24h

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# CORS (Frontend URL)
FRONTEND_URL=https://your-frontend-url.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generating Secure JWT Secret

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Using online generator
# Visit: https://www.grc.com/passwords.htm
```

---

## CORS Configuration for Production

Update `backend/server.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## Database Configuration for Production

### PostgreSQL Connection (backend/config/database.js)

```javascript
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();

let db;

if (process.env.NODE_ENV === 'production') {
  // PostgreSQL for production
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  db = {
    query: async (text, params) => {
      const result = await pool.query(text, params);
      return result.rows;
    },
    get: async (text, params) => {
      const result = await pool.query(text, params);
      return result.rows[0];
    },
    run: async (text, params) => {
      const result = await pool.query(text, params);
      return { id: result.rows[0]?.id, changes: result.rowCount };
    }
  };
} else {
  // SQLite for development
  const sqliteDb = new sqlite3.Database('./database/tasks.db');
  
  db = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    // ... rest of SQLite implementation
  };
}

module.exports = db;
```

---

## SSL/HTTPS Configuration

### Frontend
- Vercel and Netlify automatically provide SSL
- No additional configuration needed

### Backend
- Railway, Render, and Heroku automatically provide SSL
- Update frontend to use `https://` URLs

---

## Post-Deployment Checklist

### Deployment Verification
- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Database connected and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL/HTTPS working

### Functionality Testing
- [ ] Can access login page
- [ ] Can login with admin credentials
- [ ] Can login with user credentials
- [ ] Dashboard loads and shows data
- [ ] Can create/edit/delete tasks (admin)
- [ ] Can update task status (user)
- [ ] Can manage employees (admin)
- [ ] Filters work correctly
- [ ] API responds correctly

### Performance Testing
- [ ] Page load times acceptable (<3s)
- [ ] API response times acceptable (<1s)
- [ ] No memory leaks
- [ ] Database queries optimized

### Security Testing
- [ ] HTTPS enforced
- [ ] JWT tokens secure
- [ ] Passwords properly hashed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional)
- [ ] SQL injection protection working
- [ ] XSS protection working

### Monitoring Setup
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Database backups scheduled
- [ ] Uptime monitoring enabled

---

## Monitoring and Logging

### Recommended Tools
- **Error Tracking:** Sentry
- **Performance Monitoring:** New Relic or Datadog
- **Log Management:** Papertrail or Loggly
- **Uptime Monitoring:** UptimeRobot or Pingdom

### Setting up Sentry for Error Tracking

1. **Install Sentry:**
```bash
npm install @sentry/node @sentry/tracing
```

2. **Configure in backend/server.js:**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Request handler must be first
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Your routes here...

// Error handler must be last
app.use(Sentry.Handlers.errorHandler());
```

---

## Scaling Considerations

### Database Scaling
- Use connection pooling
- Implement caching (Redis)
- Add database indexes
- Consider read replicas for high traffic

### Backend Scaling
- Enable horizontal scaling (multiple instances)
- Implement load balancing
- Use CDN for static assets
- Implement rate limiting

### Frontend Optimization
- Enable compression
- Implement lazy loading
- Optimize bundle size
- Use CDN for assets

---

## Backup Strategy

### Database Backups
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Automated daily backups (cron job)
0 2 * * * pg_dump $DATABASE_URL > /backups/db_$(date +\%Y\%m\%d).sql
```

### Application Backups
- Use Git for code versioning
- Tag releases
- Keep environment variable backups
- Document configuration changes

---

## Rollback Procedure

### If deployment fails:

1. **Revert frontend:**
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

2. **Revert backend:**
```bash
# Railway
railway rollback

# Heroku
heroku rollback
```

3. **Restore database:**
```bash
psql $DATABASE_URL < backup.sql
```

---

## Cost Estimates

### Free Tier Options
- **Vercel:** Free for hobby projects
- **Netlify:** Free for personal projects
- **Railway:** $5/month (500 hours)
- **Render:** Free tier available
- **Supabase:** Free tier available

### Paid Tier (Recommended for Production)
- **Vercel Pro:** $20/month
- **Railway Pro:** $20/month
- **Render Standard:** $7/month per service
- **Database:** $7-15/month

**Estimated Total:** $25-50/month for small to medium traffic

---

## Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Review and rotate logs
- [ ] Update documentation

### Security Updates
- [ ] Keep Node.js updated
- [ ] Update npm packages
- [ ] Rotate JWT secrets periodically
- [ ] Review access logs
- [ ] Audit user permissions

---

## Troubleshooting Common Issues

### Issue: CORS errors in production
**Solution:** Ensure `FRONTEND_URL` environment variable is set correctly

### Issue: Database connection timeout
**Solution:** Check database URL and SSL settings

### Issue: JWT token not working
**Solution:** Ensure `JWT_SECRET` is set and matches across instances

### Issue: Build fails
**Solution:** Check Node version compatibility and build logs

### Issue: 502 Bad Gateway
**Solution:** Check if backend is running and PORT is configured

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)

---

**Deployment Complete! 🚀**

For support or questions about deployment, please refer to the platform-specific documentation or contact your system administrator.
