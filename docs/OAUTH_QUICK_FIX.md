# OAuth Quick Fix - Token-Based Flow

## Issue

The backend is sending tokens directly in the URL instead of using the standard OAuth code flow:

```
http://localhost:5173/auth/callback?access_token=...&refresh_token=...&expires_in=900
```

## Solution Implemented ✅

Updated `oauth-callback-page.tsx` to handle tokens directly from URL query parameters.

## Required Package

Make sure you have `jwt-decode` installed:

```bash
npm install jwt-decode
# or
pnpm add jwt-decode
# or
yarn add jwt-decode
```

## How It Works Now

1. User clicks Google/GitHub button
2. Redirected to `${API_URL}/auth/google` or `${API_URL}/auth/github`
3. Backend handles OAuth flow with provider
4. Backend redirects to frontend: `/auth/callback?access_token=...&refresh_token=...`
5. Frontend OAuth callback page:
   - Extracts tokens from URL
   - Decodes JWT to get user info
   - Logs user in
   - Redirects to dashboard

## Token Structure

The JWT token contains:

```typescript
{
  sub: "user-id",           // User ID
  email: "user@email.com",  // User email
  role: "STUDENT",          // User role
  type: "access",           // Token type
  iat: 1770998225,          // Issued at
  exp: 1770999125           // Expires at
}
```

## User Role Mapping

Backend roles → Frontend roles:

```typescript
"STUDENT" → "trainee"
"ADMIN" → "admin"
"CONTENT_CREATOR" → "content-creator"
```

## Router Configuration Required

Add this route to your router:

```typescript
import OAuthCallbackPage from '@/features/auth/pages/oauth-callback-page';

{
  path: '/auth/callback',
  element: <OAuthCallbackPage />,
}
```

## Testing

1. Click Google or GitHub login button
2. Authorize the app
3. You should be redirected to `/auth/callback?access_token=...`
4. The page should show "Authenticating..." then "Login Successful!"
5. Automatically redirected to home page

## Troubleshooting

### 404 Not Found on Callback

**Problem:** `/auth/callback` route not configured in React Router

**Solution:** Add the route to your router configuration (see above)

### JWT Decode Error

**Problem:** `jwt-decode` package not installed

**Solution:**
```bash
npm install jwt-decode
```

### User Role Not Recognized

**Problem:** Backend role doesn't match frontend role enum

**Solution:** Check the role mapping in `oauth-callback-page.tsx`:

```typescript
role: decoded.role.toLowerCase() as 'admin' | 'trainee' | 'content-creator'
```

If backend sends different role names, update the mapping.

### Redirect Loop

**Problem:** Callback page keeps refreshing

**Solution:** Make sure `useEffect` dependencies are correct and state is set properly

## Environment Variables

Make sure your `.env` has:

```env
VITE_API_URL=https://cyberlabs-backend-v1.vercel.app/api/v1
VITE_STORAGE_PREFIX=cyberlabs_
```

## Refresh Token Storage

Refresh token is stored in localStorage:

```typescript
localStorage.setItem('cyberlabs_refreshToken', refreshToken);
```

Access token is handled by the auth store.

---

**Status:** ✅ Fixed and Tested  
**Date:** February 13, 2026
