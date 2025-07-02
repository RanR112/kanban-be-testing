# 🚀 Auth System Upgrade Guide

## Overview
Sistem auth telah diupgrade dengan fitur-fitur keamanan enhanced meliputi:
- Database-based token management
- Enhanced OTP system dengan rate limiting
- Email verification untuk signup
- Audit logging untuk security events
- Background cleanup service
- Session management
- Password strength validation

## 📋 Prerequisites

### 1. Environment Variables
Pastikan `.env` file memiliki variabel berikut:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
ACCESS_TOKEN_EXPIRY="30m"
REFRESH_TOKEN_EXPIRY="7d"

# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Application
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:3000"

# Optional: API Key for external integrations
API_KEY="your-api-key"
```

### 2. Database Migration
Jalankan migrasi database untuk schema baru:

```bash
npx prisma generate
npx prisma db push
# atau jika menggunakan migration files:
npx prisma migrate dev
```

### 3. Install Dependencies Tambahan
```bash
npm install node-cron compression helmet express-rate-limit
```

## 🔄 Migration Steps

### Step 1: Update File Structure
Pastikan struktur file sesuai dengan upgrade:

```
src/
├── controllers/
│   └── AuthController.js          # ✅ Updated
├── middleware/
│   └── AuthMiddleware.js          # ✅ Updated  
├── models/
│   └── User.js                    # ✅ Updated
├── routes/
│   └── authRouter.js              # ✅ Updated
└── services/
    ├── authService.js             # ✅ Updated
    ├── OTPService.js              # ✅ Updated
    ├── emailService.js            # ✅ Updated
    └── CleanupService.js          # 🆕 New
```

### Step 2: Update Existing Code

#### 2.1 Replace AuthController.js
- Ganti file lama dengan versi baru
- Menambah endpoints: `verifyEmail`, `resendEmailVerification`, `changePassword`, `getUserSessions`, `revokeSession`

#### 2.2 Replace AuthMiddleware.js  
- Update untuk database token verification
- Menambah middleware: `optionalAuth`, `authenticateRefreshToken`, `requireEmailVerification`, dll

#### 2.3 Replace User.js Model
- Enhanced validation dan security features
- Menambah methods untuk statistics dan bulk operations

#### 2.4 Update authRouter.js
- Menambah routes baru untuk email verification dan session management
- Menambah rate limiting per route

### Step 3: Update App.js
Replace file `app.js` dengan versi baru yang include:
- Cleanup service initialization
- Enhanced error handling
- Health check endpoint
- Admin cleanup endpoints

## 🆕 New Features

### 1. Email Verification
```javascript
// Signup flow baru
POST /api/v2/auth/signup
POST /api/v2/auth/verify-email
POST /api/v2/auth/resend-email-verification
```

### 2. Enhanced Password Reset
```javascript
// Flow dengan rate limiting dan security
POST /api/v2/auth/forgot-password
POST /api/v2/auth/verify-otp  
POST /api/v2/auth/reset-password
POST /api/v2/auth/resend-otp
```

### 3. Session Management
```javascript
// Manage user sessions
GET /api/v2/auth/sessions
DELETE /api/v2/auth/sessions/:sessionId
POST /api/v2/auth/change-password
```

### 4. Token Refresh
```javascript
// Refresh expired access tokens
POST /api/v2/auth/refresh-token
```

## 🔧 Configuration

### 1. Email Service Setup
Setup Gmail App Password:
1. Enable 2FA di Gmail
2. Generate App Password
3. Use di EMAIL_PASS environment variable

### 2. Cleanup Service
Automatic cleanup berjalan:
- Every hour: cleanup expired tokens & OTPs
- Daily 2 AM: cleanup old audit logs

Manual cleanup:
```javascript
POST /api/v2/admin/cleanup/manual
GET /api/v2/admin/cleanup/stats
```

### 3. Rate Limiting Configuration
```javascript
// Per route rate limits
- Login: 5 attempts / 15 minutes
- Signup: 3 attempts / 1 hour  
- Password reset: 3 attempts / 15 minutes
- OTP verification: 5 attempts / 10 minutes
```

## 🚨 Breaking Changes

### 1. Authentication Response
**Old:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {...}
}
```

**New:**
```json
{
  "success": true,
  "accessToken": "access-token",
  "refreshToken": "refresh-token", 
  "expiresAt": "2024-...",
  "user": {...}
}
```

### 2. Token Storage
- Tokens sekarang disimpan di database
- Old sessions akan invalid setelah upgrade
- Client harus handle refresh token

### 3. Email Verification Required
- New users harus verify email sebelum login
- Existing users tetap bisa login tanpa verification

## 🧪 Testing

### 1. Test Authentication Flow
```bash
# Test signup dengan email verification
curl -X POST http://localhost:3000/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "id_department": 2,
    "name": "Test User", 
    "email": "test@example.com",
    "no_hp": "08123456789",
    "password": "StrongPass123!"
  }'

# Test verify email
curl -X POST http://localhost:3000/api/v2/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'

# Test login
curl -X POST http://localhost:3000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPass123!"
  }'
```

### 2. Test Health Check
```bash
curl http://localhost:3000/health
```

## 📊 Monitoring

### 1. Cleanup Service Stats
```javascript
GET /api/v2/admin/cleanup/stats
```

### 2. Health Check
```javascript
GET /health
```

### 3. User Sessions
```javascript
GET /api/v2/auth/sessions
```

## 🔒 Security Improvements

1. **Database Token Storage**: Tokens disimpan di database untuk better control
2. **Rate Limiting**: Protection dari brute force attacks  
3. **Email Verification**: Prevent fake account creation
4. **Audit Logging**: Track semua security events
5. **Password Strength**: Enforced strong password requirements
6. **Session Management**: User bisa manage active sessions
7. **Background Cleanup**: Automatic cleanup expired data

## 🚀 Deployment

### 1. Production Environment
```env
NODE_ENV="production"
JWT_SECRET="production-secret-min-32-chars"
DATABASE_URL="production-database-url"
```

### 2. Process Manager (PM2)
```json
{
  "name": "kanban-api",
  "script": "app.js", 
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

## 🆘 Troubleshooting

### 1. Email Service Issues
```bash
# Test email configuration
node -e "
const EmailService = require('./src/services/emailService');
EmailService.testConnection().then(console.log);
"
```

### 2. Database Connection Issues
```bash
# Test database connection
npx prisma db push --preview-feature
```

### 3. Cleanup Service Issues
```bash
# Manual cleanup
curl -X POST http://localhost:3000/api/v2/admin/cleanup/manual \
  -H "Content-Type: application/json" \
  -d '{"type": "emergency"}'
```

## 📝 Migration Checklist

- [ ] Update environment variables
- [ ] Run database migrations  
- [ ] Replace AuthController.js
- [ ] Replace AuthMiddleware.js
- [ ] Replace User.js model
- [ ] Update authRouter.js
- [ ] Add CleanupService.js
- [ ] Update emailService.js
- [ ] Update app.js
- [ ] Test authentication flow
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test session management
- [ ] Verify cleanup service running
- [ ] Check health endpoint
- [ ] Update frontend integration
- [ ] Deploy to production

## 🔄 Frontend Integration Changes

### 1. Update Login Handler
```javascript
// Old frontend code
const login = async (email, password) => {
  const response = await fetch('/api/v2/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token); // OLD
  }
};

// New frontend code
const login = async (email, password) => {
  const response = await fetch('/api/v2/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);     // NEW
    localStorage.setItem('refreshToken', data.refreshToken);   // NEW
    localStorage.setItem('tokenExpiry', data.expiresAt);       // NEW
  }
};
```

### 2. Add Token Refresh Logic
```javascript
// Token refresh utility
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/api/v2/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('tokenExpiry', data.expiresAt);
    return data.accessToken;
  }
  
  // Refresh failed, redirect to login
  localStorage.clear();
  window.location.href = '/login';
  return null;
};

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      const newToken = await refreshToken();
      if (newToken) {
        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Add Email Verification Flow
```javascript
// Signup with email verification
const signup = async (userData) => {
  const response = await fetch('/api/v2/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  if (data.success && data.requiresEmailVerification) {
    // Redirect to email verification page
    window.location.href = `/verify-email?email=${encodeURIComponent(userData.email)}`;
  }
};

// Email verification
const verifyEmail = async (email, otp) => {
  const response = await fetch('/api/v2/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  const data = await response.json();
  if (data.success) {
    // Redirect to login page
    window.location.href = '/login?verified=true';
  }
  return data;
};
```

## 📱 Mobile App Integration

### 1. Token Storage (React Native)
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store tokens securely
const storeTokens = async (accessToken, refreshToken, expiresAt) => {
  try {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['tokenExpiry', expiresAt]
    ]);
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

// Auto refresh token on app startup
const initializeApp = async () => {
  const expiry = await AsyncStorage.getItem('tokenExpiry');
  if (expiry && new Date(expiry) < new Date()) {
    await refreshToken();
  }
};
```

## 🔧 Advanced Configuration

### 1. Custom Rate Limiting
```javascript
// Custom rate limiter untuk specific endpoints
const createCustomRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      code: "RATE_LIMIT_EXCEEDED"
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Apply ke routes
app.use('/api/v2/auth/login', createCustomRateLimit(15 * 60 * 1000, 5, 'Too many login attempts'));
```

### 2. Custom Email Templates
```javascript
// Override email templates di emailService.js
class CustomEmailService extends EmailService {
  generateOTPEmailTemplate(otp, userName) {
    // Your custom template here
    return `<html>Custom OTP template for ${userName}: ${otp}</html>`;
  }
}
```

### 3. Custom Cleanup Schedule
```javascript
// Modify cleanup schedule di CleanupService.js
startScheduler() {
  // Custom schedules
  cron.schedule("*/30 * * * *", () => this.performCleanup()); // Every 30 minutes
  cron.schedule("0 1 * * 0", () => this.performDeepCleanup()); // Weekly
}
```

## 🔍 Monitoring & Analytics

### 1. Custom Metrics
```javascript
// Add custom metrics collection
const collectMetrics = () => {
  return {
    activeUsers: await User.count({ where: { last_login: { gte: oneDayAgo } } }),
    totalSessions: await Token.count({ where: { type: 'ACCESS_TOKEN', is_revoked: false } }),
    pendingVerifications: await User.count({ where: { email_verified: false } }),
    otpRequestsToday: await OtpCode.count({ where: { created_at: { gte: todayStart } } })
  };
};
```

### 2. Performance Monitoring
```javascript
// Add response time tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests
      console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  next();
});
```

## 🚨 Emergency Procedures

### 1. Mass Token Revocation
```javascript
// Revoke all tokens for security incident
const emergencyTokenRevocation = async () => {
  await prisma.token.updateMany({
    data: { is_revoked: true }
  });
  console.log('All tokens revoked for security incident');
};
```

### 2. Disable User Registration
```javascript
// Add feature flag untuk disable registration
const REGISTRATION_ENABLED = process.env.REGISTRATION_ENABLED !== 'false';

app.use('/api/v2/auth/signup', (req, res, next) => {
  if (!REGISTRATION_ENABLED) {
    return res.status(503).json({
      success: false,
      message: 'Registration is temporarily disabled',
      code: 'REGISTRATION_DISABLED'
    });
  }
  next();
});
```

## 📚 API Documentation Update

### New Endpoints:

#### Email Verification
- `POST /api/v2/auth/verify-email` - Verify email with OTP
- `POST /api/v2/auth/resend-email-verification` - Resend verification email

#### Session Management  
- `GET /api/v2/auth/sessions` - Get user sessions
- `DELETE /api/v2/auth/sessions/:id` - Revoke specific session
- `POST /api/v2/auth/refresh-token` - Refresh access token

#### Password Management
- `POST /api/v2/auth/change-password` - Change password (authenticated)

#### Admin Endpoints
- `GET /api/v2/admin/cleanup/stats` - Get cleanup statistics
- `POST /api/v2/admin/cleanup/manual` - Trigger manual cleanup

### Updated Response Formats:

#### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-01-01T12:00:00.000Z",
  "user": {
    "id_users": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "id_department": 2,
    "department": {
      "id_department": 2,
      "name": "Sales"
    }
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "message": "Token has expired. Please login again.",
  "code": "TOKEN_EXPIRED"
}
```

## 🎯 Performance Optimizations

1. **Database Indexing**: Added indexes pada token dan OTP tables
2. **Connection Pooling**: Email service menggunakan connection pooling  
3. **Compression**: Response compression untuk reduce bandwidth
4. **Rate Limiting**: Prevent abuse dan improve stability
5. **Background Cleanup**: Maintain optimal database performance

## 🔐 Security Checklist

- [x] JWT secrets properly configured
- [x] Password strength enforcement
- [x] Rate limiting implemented  
- [x] Email verification required
- [x] Audit logging enabled
- [x] Session management implemented
- [x] Input validation enhanced
- [x] SQL injection prevention
- [x] XSS protection headers
- [x] CORS properly configured

---

## 📞 Support

Jika ada masalah during upgrade:

1. Check logs di console untuk error messages
2. Verify semua environment variables set correctly  
3. Test database connection dengan `npx prisma db push`
4. Test email service dengan health endpoint
5. Check rate limiting settings jika requests failed

**Happy upgrading! 🚀**