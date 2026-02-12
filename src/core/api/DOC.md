# API Module Documentation

## Overview

This module handles all HTTP communication with the backend API using Axios.

---

## Files

### 1. `client.ts` - Axios Configuration

Main Axios instance with interceptors for:

- ✅ Auto-attaching authentication tokens
- ✅ Token refresh on 401 errors
- ✅ Request/Response transformation
- ✅ Error handling

#### Usage Example:

```typescript
import { apiClient } from '@/core/api';

// GET request
const response = await apiClient.get('/users');

// POST request
const data = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});
```

---

### 2. `endpoints.ts` - API Endpoint Constants

Centralized API endpoint definitions organized by feature.

#### Usage Example:

```typescript
import { API_ENDPOINTS, apiClient } from '@/core/api';

// Login
await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

// Get course by ID
await apiClient.get(API_ENDPOINTS.COURSES.BY_ID('course-123'));

// Get lesson
await apiClient.get(
  API_ENDPOINTS.COURSES.LESSON_BY_ID('course-123', 'lesson-456'),
);
```

---

## Features

### 🔐 Automatic Token Management

- Tokens stored in localStorage with prefix
- Auto-attached to requests via Authorization header
- Auto-refresh on expiration (401 errors)
- Auto-logout if refresh fails

### 🌐 Request Interceptor

- Adds `Authorization: Bearer <token>` header
- Adds timestamp to GET requests (cache busting)

### 📥 Response Interceptor

- Transforms successful responses to ApiResponse format
- Handles 401 errors with token refresh
- Transforms errors to ApiError format

### ⚠️ Error Handling

All errors are transformed to:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

---

## Best Practices

1. **Always use apiClient** instead of raw axios
2. **Use API_ENDPOINTS constants** instead of hardcoded strings
3. **Handle errors** using try-catch or React Query error handling
4. **Don't store tokens manually** - interceptors handle it

---

## Arabic/English Support

The API client automatically includes the current language in requests.
Language detection is handled by i18n configuration.

---

## Example: Full Authentication Flow

```typescript
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { LoginCredentials, User, AuthTokens } from '@/core/types';

// Login
const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post<
    ApiResponse<{ user: User; tokens: AuthTokens }>
  >(API_ENDPOINTS.AUTH.LOGIN, credentials);

  // Tokens are auto-stored by interceptor
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.ME,
  );
  return response.data;
};

// Logout
const logout = async () => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  // Tokens are auto-cleared
};
```

## Related Files

- `src/core/types/api.types.ts` - API type definitions
- `src/core/types/user.types.ts` - User & Auth types
- `src/shared/constants/env.ts` - Environment variables
