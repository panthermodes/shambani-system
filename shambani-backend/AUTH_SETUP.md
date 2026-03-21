# Shambani Authentication System - Setup Guide

## 🚀 Quick Setup

### 1. Environment Configuration

Copy the environment file:
```bash
cp .env.example .env
```

Update your `.env` file with your database credentials:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/shambani_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# App
NODE_ENV="development"
PORT=3001

# CORS
FRONTEND_URL="http://localhost:3000"
```

### 2. Database Setup

Generate Prisma client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma db push
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## 🧪 Test the Authentication

Run the test script:
```bash
node test-auth.js
```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/phone/username |
| POST | `/api/auth/login-phone` | Login with phone only |
| POST | `/api/auth/otp/request` | Request OTP |
| POST | `/api/auth/otp/verify` | Verify OTP |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Logout user |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get current user profile | ✅ |
| PATCH | `/api/users/profile` | Update current user profile | ✅ |
| PATCH | `/api/users/password` | Update current user password | ✅ |
| GET | `/api/users` | List all users | Admin ✅ |
| POST | `/api/users` | Create user (Admin) | Admin ✅ |
| GET | `/api/users/:id` | Get user by ID | Admin ✅ |
| PATCH | `/api/users/:id` | Update user (Admin) | Admin ✅ |
| DELETE | `/api/users/:id` | Deactivate user | Admin ✅ |

## 🔌 Frontend Integration

### Registration Request
```javascript
// Farmer Registration
const farmerData = {
  phone: '+255712345678',
  password: 'Shambani@2025',
  names: {
    first: 'John',
    last: 'Mkapa'
  },
  role: 'FARMER',
  farmName: 'Mkapa Farm',
  location: 'Arusha',
  region: 'Arusha',
  district: 'Arusha'
};

fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(farmerData)
})
```

### Login Request
```javascript
// Login with phone
const loginData = {
  phone: '+255712345678',
  password: 'Shambani@2025'
};

fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
})
```

### Authenticated Request
```javascript
// Get current user
fetch('/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
```

## 👥 User Roles

The system supports the following user roles:

- `FARMER` - Farmers who register their farms
- `CASUAL_LABOURER` - Workers offering casual labor
- `EXTENSION_OFFICER` - Agricultural advisors
- `LOGISTICS_PROVIDER` - Transportation services
- `AGROVET_OWNER` - Agricultural shop owners
- `MACHINERY_DEALER` - Equipment sellers/renters
- `BUYER_AGGREGATOR` - Bulk buyers from farmers
- `SUPER_ADMIN` - System administrators

## 🔒 Security Features

- **Password Hashing** - bcrypt with 12 salt rounds
- **JWT Authentication** - Access and refresh tokens
- **Role-Based Access Control** - Protected routes by role
- **Input Validation** - Comprehensive DTO validation
- **Rate Limiting** - OTP attempt limits
- **CORS Protection** - Configured for frontend domain

## 📱 Phone-Based Registration

The system is optimized for phone-based registration common in Tanzania:

1. **Phone Registration** - Users register with phone + password
2. **Auto-Email Generation** - Email created from phone number
3. **OTP Verification** - SMS verification via Beem API
4. **Flexible Login** - Login with phone, email, or username

## 🛠️ Development Notes

### Database Schema
- Uses PostgreSQL with Prisma ORM
- User model with all Shambani-specific fields
- Relationships for orders, services, and products
- Soft delete implementation (isActive flag)

### Error Handling
- Structured error responses
- Comprehensive logging
- Proper HTTP status codes
- Validation error messages

### Testing
- Test script included (`test-auth.js`)
- Covers all major authentication flows
- Easy to run and verify functionality

## 📝 Next Steps

1. **Beem SMS Integration** - Configure Beem API for real OTP sending
2. **Email Service** - Add email notifications
3. **Password Reset** - Implement forgot password flow
4. **Rate Limiting** - Add API rate limiting
5. **Audit Logs** - Track user actions for compliance

## 🆘 Troubleshooting

### Common Issues

**Server won't start:**
- Check database connection in `.env`
- Ensure PostgreSQL is running
- Run `npx prisma generate`

**Registration fails:**
- Check password requirements (8+ chars, uppercase, lowercase, number, special)
- Verify phone number format (+255...)
- Check for duplicate phone numbers

**Login fails:**
- Verify user is active (`isActive: true`)
- Check password is correct
- Ensure user exists in database

**JWT errors:**
- Check JWT_SECRET in `.env`
- Verify token is not expired
- Ensure proper Authorization header format

### Database Issues

```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio

# Check migrations
npx prisma migrate status
```

## 📞 Support

For technical support:
1. Check the logs in the console
2. Verify all environment variables
3. Run the test script to isolate issues
4. Check the database connection and schema
