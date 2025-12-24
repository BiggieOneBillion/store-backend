# Default Admin User Setup

## Overview

The server automatically creates a default admin user on first startup if no admin exists in the database. This ensures you always have administrative access to the system.

## How It Works

1. **On Server Startup**: After connecting to MongoDB, the system checks if any admin user exists
2. **If No Admin Found**: Creates a default admin user with credentials from environment variables
3. **Logs Credentials**: Displays the admin credentials in the server logs
4. **Security Warning**: Reminds you to change the password immediately

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Default Admin User (Optional)
DEFAULT_ADMIN_EMAIL=admin@yourstore.com
DEFAULT_ADMIN_PASSWORD=SecurePassword@123
DEFAULT_ADMIN_NAME=System Administrator
```

### Default Values

If environment variables are not set, these defaults are used:

- **Email**: `admin@example.com`
- **Password**: `Admin@123456`
- **Name**: `System Administrator`

## Example Output

When the server starts and creates an admin user, you'll see:

```
info: Connected to MongoDB
info: Initializing database...
warn: ═══════════════════════════════════════════════════════
warn: DEFAULT ADMIN USER CREATED
warn: ═══════════════════════════════════════════════════════
warn: Email: admin@yourstore.com
warn: Password: SecurePassword@123
warn: Name: System Administrator
warn: ═══════════════════════════════════════════════════════
warn: ⚠️  IMPORTANT: Please change the admin password immediately!
warn: ═══════════════════════════════════════════════════════
info: Database initialization completed
info: Audit log archival scheduled: Daily at 2 AM
info: Alert checks scheduled: Every 15 minutes
info: Audit cron jobs initialized
info: Listening to port 3000
```

If an admin already exists:

```
info: Connected to MongoDB
info: Initializing database...
info: Admin user already exists
info: Database initialization completed
```

## First-Time Setup

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Check the logs** for admin credentials

3. **Login** with the displayed credentials:
   ```bash
   POST /v1/auth/login
   {
     "email": "admin@yourstore.com",
     "password": "SecurePassword@123"
   }
   ```

4. **Change the password immediately**:
   ```bash
   POST /v1/auth/reset-password
   ```

## Security Best Practices

### 1. Use Strong Passwords

Set a strong password in your `.env` file:

```env
DEFAULT_ADMIN_PASSWORD=MyVerySecureP@ssw0rd!2024
```

### 2. Change Password After First Login

Immediately change the default password after logging in for the first time.

### 3. Use Environment Variables

Never hardcode credentials in the code. Always use environment variables.

### 4. Restrict Access

In production, ensure your `.env` file is:
- Not committed to version control
- Has restricted file permissions (chmod 600)
- Only accessible by the application user

### 5. Monitor Admin Activity

Check audit logs regularly for admin actions:

```bash
GET /v1/audit/category/admin
```

## Production Deployment

### Step 1: Set Environment Variables

On your production server:

```bash
export DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
export DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
export DEFAULT_ADMIN_NAME="Production Administrator"
```

Or add to your `.env` file:

```env
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
DEFAULT_ADMIN_NAME=Production Administrator
```

### Step 2: Start the Server

```bash
npm start
```

### Step 3: Verify Admin Creation

Check the logs to confirm the admin user was created.

### Step 4: Secure the Account

1. Login with the default credentials
2. Change the password immediately
3. Enable two-factor authentication (if available)
4. Review and update admin permissions

## Troubleshooting

### Admin User Not Created

**Problem**: Server starts but no admin user is created

**Possible Causes**:
1. An admin user already exists
2. Database connection failed
3. User model validation error

**Solution**:
- Check logs for error messages
- Verify MongoDB connection
- Check if admin user exists: `db.users.findOne({ role: 'admin' })`

### Cannot Login with Default Credentials

**Problem**: Login fails with default credentials

**Possible Causes**:
1. Admin user was created with different credentials
2. Password was already changed
3. Email verification required

**Solution**:
- Check server logs for actual credentials used
- Try password reset flow
- Check user in database: `db.users.findOne({ email: 'admin@example.com' })`

### Multiple Admin Users

**Problem**: Want to create additional admin users

**Solution**:
Use the user management API:

```bash
POST /v1/users
Authorization: Bearer {admin_token}
{
  "name": "Second Admin",
  "email": "admin2@yourstore.com",
  "password": "SecurePassword123!",
  "role": "admin"
}
```

## Implementation Details

### Database Initialization Service

**File**: `src/utils/dbInit.js`

**Functions**:
- `createDefaultAdmin()` - Creates admin if none exists
- `initializeDatabase()` - Main initialization function

**Process**:
1. Query database for admin users
2. If none found, create with environment variables
3. Log credentials to console
4. Return created user

### Integration Point

**File**: `src/index.js`

The initialization runs after MongoDB connection:

```javascript
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  
  // Initialize database (create default admin if needed)
  initializeDatabase().then(() => {
    // Initialize audit cron jobs after database is ready
    initializeAuditCronJobs();
  });
  
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});
```

## Files Modified

1. ✅ `src/utils/dbInit.js` - Database initialization service (new)
2. ✅ `src/config/config.js` - Added defaultAdmin configuration
3. ✅ `src/index.js` - Integrated initialization on startup

## Summary

The default admin user feature ensures:

- ✅ Always have admin access on first deployment
- ✅ Configurable via environment variables
- ✅ Secure defaults with warnings
- ✅ Clear logging of credentials
- ✅ Only creates if no admin exists
- ✅ Automatic on server startup

This feature is production-ready and follows security best practices!
