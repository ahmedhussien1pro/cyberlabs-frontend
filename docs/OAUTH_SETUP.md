# OAuth Setup Guide

## Overview

This guide explains how to set up Google and GitHub OAuth authentication in the CyberLabs frontend.

## How OAuth Works

1. User clicks on Google/GitHub button
2. Frontend redirects to backend OAuth endpoint (`/auth/google` or `/auth/github`)
3. Backend redirects to Google/GitHub OAuth consent page
4. User authorizes the app
5. Google/GitHub redirects back to backend callback URL with auth code
6. Backend exchanges code for access token and creates user session
7. Backend redirects to frontend callback page with user data
8. Frontend completes login and redirects to dashboard

## Frontend Implementation

### 1. OAuth Login Flow

**File:** `src/features/auth/pages/auth-page.tsx`

```typescript
const handleSocialLogin = (provider: string) => {
  if (provider === 'Google') {
    // Direct navigation to backend OAuth endpoint
    const googleAuthUrl = `${ENV.API_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  } else if (provider === 'GitHub') {
    const githubAuthUrl = `${ENV.API_URL}/auth/github`;
    window.location.href = githubAuthUrl;
  }
};
```

**Why direct navigation?**
- OAuth redirects cannot be handled via AJAX/fetch due to CORS
- Must use `window.location.href` for full page navigation
- Backend handles the actual OAuth flow

### 2. OAuth Callback Page

**File:** `src/features/auth/pages/oauth-callback-page.tsx`

This page receives the OAuth response from the backend and completes the login:

```typescript
useEffect(() => {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (code && state) {
    handleOAuthCallback(code, state, provider);
  }
}, []);
```

### 3. Routes Configuration

**File:** `src/shared/constants/routes.ts`

```typescript
AUTH: {
  OAUTH_CALLBACK: '/auth/callback',
  GOOGLE_CALLBACK: '/auth/google/callback',
  GITHUB_CALLBACK: '/auth/github/callback',
}
```

### 4. Router Setup

Add these routes to your React Router configuration:

```typescript
// In your router file (e.g., src/core/router/routes.tsx)
import OAuthCallbackPage from '@/features/auth/pages/oauth-callback-page';

const routes = [
  {
    path: '/auth/callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/auth/google/callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/auth/github/callback',
    element: <OAuthCallbackPage />,
  },
];
```

## Backend Requirements

### 1. OAuth Endpoints

Your backend must implement these endpoints:

#### Google OAuth
```
GET  /auth/google
POST /auth/google/callback
```

#### GitHub OAuth
```
GET  /auth/github
POST /auth/github/callback
```

### 2. Redirect URLs

Configure these redirect URLs in your OAuth providers:

**Google Cloud Console:**
```
https://cyberlabs-backend-v1.vercel.app/api/v1/auth/google/callback
```

**GitHub OAuth Apps:**
```
https://cyberlabs-backend-v1.vercel.app/api/v1/auth/github/callback
```

### 3. Backend Flow

**Step 1: Initial OAuth Request (`GET /auth/google`)**
```typescript
// Backend should redirect to Google OAuth URL
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&response_type=code` +
  `&scope=email profile`;

res.redirect(googleAuthUrl);
```

**Step 2: OAuth Callback (`POST /auth/google/callback`)**
```typescript
// 1. Receive auth code from Google
const { code } = req.body;

// 2. Exchange code for access token
const tokens = await exchangeCodeForToken(code);

// 3. Get user info from Google
const userInfo = await getUserInfo(tokens.access_token);

// 4. Create or update user in database
const user = await findOrCreateUser(userInfo);

// 5. Generate JWT token
const jwtToken = generateJWT(user);

// 6. Return user and token
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token: jwtToken,
  refreshToken: refreshToken,
};
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://cyberlabs-backend-v1.vercel.app/api/v1
```

### Backend
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://cyberlabs-backend-v1.vercel.app/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://cyberlabs-backend-v1.vercel.app/api/v1/auth/github/callback

# Frontend URL (for redirecting after OAuth)
FRONTEND_URL=http://localhost:5173
```

## Testing OAuth Locally

### 1. Use ngrok or similar tool

```bash
ngrok http 3000  # Your backend port
```

### 2. Update OAuth Provider Settings

Add ngrok URL to authorized redirect URIs:
```
https://your-ngrok-url.ngrok.io/api/v1/auth/google/callback
```

### 3. Update Backend Environment Variables

```env
GOOGLE_REDIRECT_URI=https://your-ngrok-url.ngrok.io/api/v1/auth/google/callback
```

## Common Issues

### 1. CORS Error

**Problem:** `No 'Access-Control-Allow-Origin' header`

**Solution:** Don't use axios/fetch for OAuth login. Use direct navigation:
```typescript
window.location.href = oauthUrl;  // ✅ Correct
await axios.get(oauthUrl);        // ❌ Wrong
```

### 2. 404 on Callback

**Problem:** Callback route not found

**Solution:** Make sure callback routes are added to React Router:
```typescript
<Route path="/auth/google/callback" element={<OAuthCallbackPage />} />
```

### 3. Redirect URI Mismatch

**Problem:** `redirect_uri_mismatch` error from OAuth provider

**Solution:** Ensure the redirect URI in OAuth provider settings exactly matches the one in your backend code.

### 4. State Parameter Mismatch

**Problem:** Invalid state parameter

**Solution:** Backend should generate and validate state parameter for security:
```typescript
// Generate random state
const state = generateRandomString();

// Store in session or JWT
session.oauthState = state;

// Include in OAuth URL
const oauthUrl = `...&state=${state}`;

// Validate on callback
if (req.body.state !== session.oauthState) {
  throw new Error('Invalid state');
}
```

## Security Best Practices

1. **Always use HTTPS in production**
2. **Validate state parameter** to prevent CSRF attacks
3. **Use short-lived tokens** (15-30 minutes)
4. **Implement refresh token rotation**
5. **Store tokens securely** (httpOnly cookies recommended)
6. **Never expose client secrets** in frontend code
7. **Implement rate limiting** on OAuth endpoints

## OAuth Provider Setup

### Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret

### GitHub OAuth Apps

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in app details:
   - Application name: CyberLabs
   - Homepage URL: https://cyberlabs.com
   - Authorization callback URL: https://cyberlabs-backend-v1.vercel.app/api/v1/auth/github/callback
4. Copy Client ID and generate Client Secret

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

**Last Updated:** February 13, 2026  
**Version:** 1.0  
**Maintainer:** CyberLabs Development Team
