# Backend Integration Guide

This React frontend is configured to connect to your Django backend API. Follow these steps to complete the integration.

## Prerequisites

1. Ensure your Django backend is running and accessible
2. Install frontend dependencies: `npm install`

## Configuration

### 1. Environment Variables

Create a `.env` file in the `GSSC-Frontend` directory (or copy from `.env.example`):

```env
# Django Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000

# Optional: JWT Token Refresh Endpoint (if different from default)
# VITE_REFRESH_ENDPOINT=/auth/token/refresh/
```

**Important:** Update `VITE_API_BASE_URL` to match your Django server URL and port.

### 2. Backend API Endpoints

The frontend expects the following Django endpoints:

- `POST /auth/login/` - Login endpoint (expects `{ email, password }`, returns `{ access, refresh, user }`)
- `POST /auth/register/` - Registration endpoint (expects `{ username, email, password }`)
- `POST /auth/logout/` - Logout endpoint (expects `{ refresh }` token)
- `GET /auth/me/` - Get current authenticated user
- `GET /auth/users/<id>/` - Get specific user details
- `PATCH /auth/users/<id>/update/` - Update user
- `POST /auth/token/refresh/` - Refresh JWT access token (expects `{ refresh }`)

### 3. CORS Configuration

Ensure your Django backend has CORS configured to allow requests from your React frontend:

```python
# In settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # Alternative React port
]

# Or for development:
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!
```

## How It Works

### Authentication Flow

1. **Login/Register**: User credentials are sent to Django backend
2. **Token Storage**: JWT access and refresh tokens are stored in `localStorage`
3. **Automatic Token Attachment**: All API requests automatically include the access token in the `Authorization: Bearer <token>` header
4. **Token Refresh**: When access token expires (401 error), the frontend automatically attempts to refresh using the refresh token
5. **Logout**: Refresh token is sent to backend for blacklisting, then tokens are cleared from localStorage

### Token Management

- **Storage**: Tokens are stored in `localStorage` (access_token, refresh_token)
- **Automatic Refresh**: Axios interceptors handle token refresh automatically
- **Logout**: Clears tokens and calls backend logout endpoint

### Header Authentication Check

The Header component uses `useAuth()` hook which:
- Checks for stored tokens on app load
- Fetches current user data if tokens exist
- Shows user's username/email if authenticated
- Shows "Guest" and Login/Signup links if not authenticated

## Testing the Integration

1. **Start Django Backend**:
   ```bash
   python manage.py runserver
   ```

2. **Start React Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Registration**:
   - Navigate to `/register`
   - Fill in username, email, and password
   - Submit form
   - Should redirect to dashboard if successful

4. **Test Login**:
   - Navigate to `/login`
   - Enter email and password
   - Submit form
   - Should redirect to dashboard if successful

5. **Verify Header**:
   - After login, header should show your username/email
   - Logout button should be visible in profile dropdown

## Troubleshooting

### "Unable to connect to server"
- Check if Django backend is running
- Verify `VITE_API_BASE_URL` in `.env` matches your Django server URL
- Check CORS configuration in Django settings

### "401 Unauthorized" errors
- Check if tokens are being stored correctly (check browser localStorage)
- Verify JWT token expiration settings in Django
- Check if refresh token endpoint is correct

### Login/Register not working
- Check browser console for detailed error messages
- Verify backend endpoints match expected paths
- Check Django backend logs for server-side errors
- Ensure backend returns expected response format: `{ access, refresh, user }`

### Token refresh not working
- Verify refresh endpoint path in `.env` (default: `/auth/token/refresh/`)
- Check if refresh token is being stored correctly
- Verify Django JWT refresh endpoint configuration

## API Service File

The main API integration is in `src/services/api.js`:
- Axios instance with base URL configuration
- Request interceptor for adding auth tokens
- Response interceptor for automatic token refresh
- Token management utilities
- Auth API methods (login, register, logout, getCurrentUser, etc.)

## Next Steps

1. Customize error messages based on your backend's error response format
2. Add loading states for better UX during API calls
3. Implement protected routes that require authentication
4. Add user profile editing functionality
5. Connect other features (calculators, price tracker, etc.) to backend APIs
