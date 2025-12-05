# KUMSS ERP - Authentication System Setup

## Overview

A complete authentication system has been implemented for the KUMSS ERP frontend application. The system includes:

- Modern, responsive login page
- Protected routes with authentication guards
- Session-based authentication using Django REST Framework
- Type-safe API configuration with all endpoints
- Auth context and custom hooks for state management

## Project Structure

```
src/
├── config/
│   └── api.config.ts           # API configuration with all endpoints
├── types/
│   └── auth.types.ts           # TypeScript types for authentication
├── services/
│   └── auth.service.ts         # Authentication service functions
├── contexts/
│   ├── AuthContext.tsx         # Auth state management
│   └── ThemeContext.tsx        # Existing theme context
├── hooks/
│   └── useLogin.ts             # Custom hook for login logic
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Protected route wrapper
│   └── layout/
│       └── Header.tsx          # Updated with logout functionality
└── pages/
    └── Login.tsx               # Modern login page
```

## Features Implemented

### 1. API Configuration (`src/config/api.config.ts`)
- Complete endpoint configuration for all KUMSS ERP modules
- Includes all Core module endpoints:
  - Colleges
  - Academic Years
  - Academic Sessions
  - Holidays
  - Weekends
  - System Settings
  - Notification Settings
  - Activity Logs
- Default headers with tenant ID support
- Helper functions for building API URLs

### 2. Authentication Types (`src/types/auth.types.ts`)
- `User` - User data interface
- `LoginCredentials` - Login form data
- `LoginResponse` - API response format
- `AuthState` - Authentication state
- `AuthContextType` - Context interface
- `ApiError` - Error handling

### 3. Authentication Service (`src/services/auth.service.ts`)
- `loginUser()` - Login with credentials
- `logoutUser()` - Logout and clear session
- `checkAuthentication()` - Verify user session
- `getCurrentUser()` - Get user from localStorage
- `clearAuthData()` - Clear stored auth data
- `isAuthenticated()` - Check auth status

### 4. Auth Context (`src/contexts/AuthContext.tsx`)
- Global authentication state management
- `useAuth()` hook for accessing auth state
- Automatic authentication check on app load
- Login/logout functionality
- Loading and error states

### 5. Login Hook (`src/hooks/useLogin.ts`)
- Custom hook for login form handling
- Loading state management
- Error handling with user-friendly messages
- Automatic navigation after login

### 6. Login Page (`src/pages/Login.tsx`)
Modern, responsive login interface with:
- Gradient background
- Input validation
- Loading states
- Error display
- Remember me option
- Forgot password link
- Dark mode support
- Fully accessible

### 7. Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- Route protection wrapper
- Automatic redirect to login for unauthenticated users
- Loading spinner during auth check
- Seamless user experience

### 8. Updated Header (`src/components/layout/Header.tsx`)
- User display in header
- Logout button
- Integrated with auth context

## Usage

### Starting the Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3030`

### Login Flow

1. Navigate to `http://localhost:3030`
2. If not authenticated, automatically redirected to `/login`
3. Enter credentials:
   - Username: Your Django username
   - Password: Your Django password
4. On successful login, redirected to `/dashboard`
5. All routes are now accessible

### API Configuration

Update the API base URL in `src/config/api.config.ts`:

```typescript
export const API_BASE_URL = 'http://127.0.0.1:8000'; // Your Django backend
export const TENANT_ID = 'tenant_001'; // Your tenant ID
```

### Using Auth in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.username}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Routes wrapped in `<ProtectedRoute />` are automatically protected:

```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/settings" element={<Settings />} />
</Route>
```

## Authentication Flow

```
1. User visits app
   ↓
2. AuthProvider checks authentication
   ↓
3. If not authenticated → Redirect to /login
   ↓
4. User enters credentials
   ↓
5. Login service sends POST to /api-auth/login/
   ↓
6. Django validates and creates session
   ↓
7. Frontend stores user data in localStorage
   ↓
8. User redirected to /dashboard
   ↓
9. All subsequent requests include session cookie
```

## Session Management

- Django session cookies are automatically handled by the browser
- `credentials: 'include'` ensures cookies are sent with requests
- User data cached in localStorage for quick access
- Session verified on app reload

## Security Features

- Protected routes require authentication
- Session-based authentication (secure cookies)
- CSRF token support ready
- Multi-tenant architecture with X-Tenant-ID header
- Automatic logout on session expiry
- Secure password input fields
- No sensitive data in localStorage (only user info)

## API Endpoints Available

All endpoints are configured in `src/config/api.config.ts`:

### Authentication
- POST `/api-auth/login/` - Login
- POST `/api-auth/logout/` - Logout

### Core Module
- Colleges: Full CRUD + active list, bulk delete
- Academic Years: Full CRUD + current year
- Academic Sessions: Full CRUD
- Holidays: Full CRUD
- Weekends: Full CRUD
- System Settings: Full CRUD
- Notification Settings: Full CRUD
- Activity Logs: Read-only

## Next Steps

1. **Test the login** with your Django backend
2. **Configure CORS** in Django to allow frontend origin
3. **Add user profile page** (optional)
4. **Implement forgot password** (optional)
5. **Add role-based access control** (optional)
6. **Integrate remaining API endpoints** as needed

## Django Backend Requirements

Ensure your Django backend has:

1. CORS configured to allow frontend origin:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3030",
]
CORS_ALLOW_CREDENTIALS = True
```

2. Session authentication enabled in DRF settings
3. CSRF token handling (if needed)
4. X-Tenant-ID middleware configured

## Troubleshooting

### Login fails with network error
- Check if Django backend is running on port 8000
- Verify CORS is configured correctly
- Check browser console for errors

### Redirected to login after successful authentication
- Check browser cookies are enabled
- Verify session cookie is being set by Django
- Check localStorage for user data

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

## Testing

Test the authentication system:

1. Visit `http://localhost:3030`
2. Should redirect to `/login`
3. Enter valid credentials
4. Should redirect to `/dashboard`
5. Try accessing `/settings` - should work
6. Click logout - should return to `/login`
7. Try accessing `/dashboard` - should redirect to `/login`

## Support

For issues or questions, refer to:
- API Documentation: `http://localhost:8000/api/docs/`
- Project README
- Django admin: `http://localhost:8000/admin/`

---

**Built with:** React, TypeScript, React Router, Tailwind CSS
**Authentication:** Django Session Auth
**State Management:** React Context API
