# Utilities Module Documentation

## Overview

Reusable utility functions for storage, sanitization, formatting, validation, and error handling.

---

## Files

### 1. `storage.ts` - Storage Manager

Secure localStorage/sessionStorage wrapper with encryption support.

#### Features:

- ✅ Automatic prefixing of keys
- ✅ AES encryption for sensitive data
- ✅ Type-safe get/set operations
- ✅ Support for both localStorage and sessionStorage

#### Usage:

```typescript
import { storage } from '@/shared/utils';

// Save data (unencrypted)
storage.set('user', { name: 'Ahmed' });

// Save sensitive data (encrypted)
storage.set('token', 'secret-token-123', 'local', true);

// Get data
const user = storage.get<{ name: string }>('user');

// Get encrypted data
const token = storage.get<string>('token', 'local', true);

// Remove specific key
storage.remove('user');

// Clear all app data
storage.clearAll();
```

### 2. `sanitize.ts` - XSS Protection

Prevents XSS attacks by sanitizing user input using DOMPurify.

#### Usage:

```typescript
import { sanitize } from '@/shared/utils';

// Sanitize HTML content
const clean = sanitize.html("<p>Safe content</p><script>alert('xss')</script>");
// Result: "<p>Safe content</p>"

// Strip all HTML from user input
const safe = sanitize.input('<b>Username</b>');
// Result: "Username"

// Sanitize URLs
const url = sanitize.url("javascript:alert('xss')");
// Result: "" (blocked)

const safeUrl = sanitize.url('https://example.com');
// Result: "https://example.com"
```

---

### 3. `format.ts` - Formatting Utilities

Format dates, numbers, currency, and text with Arabic/English support.

#### Usage:

```typescript
import { format } from '@/shared/utils';

// Format date (English)
format.date(new Date(), 'PPP', 'en');
// Result: "February 12, 2026"

// Format date (Arabic)
format.date(new Date(), 'PPP', 'ar');
// Result: "١٢ فبراير ٢٠٢٦"

// Relative time (English)
format.dateRelative(new Date(Date.now() - 3600000), 'en');
// Result: "about 1 hour ago"

// Relative time (Arabic)
format.dateRelative(new Date(Date.now() - 3600000), 'ar');
// Result: "منذ ساعة تقريباً"

// Format numbers
format.number(1234567);
// Result: "1,234,567"

// Format currency
format.currency(99.99, 'USD', 'en-US');
// Result: "$99.99"

format.currency(99.99, 'EGP', 'ar-EG');
// Result: "٩٩٫٩٩ ج.م."

// Format percentage
format.percentage(0.856, 1);
// Result: "85.6%"

// Format file size
format.fileSize(1536000);
// Result: "1.46 MB"

// Truncate text
format.truncate('This is a very long text...', 20);
// Result: "This is a very lo..."
```

---

### 4. `validation.ts` - Validation Helpers

Common validation functions for forms and user input.

#### Usage:

```typescript
import { validation } from '@/shared/utils';

// Email validation
validation.isEmail('user@example.com'); // true
validation.isEmail('invalid-email'); // false

// Password strength (8+ chars, uppercase, lowercase, number)
validation.isStrongPassword('Pass123'); // false (too short)
validation.isStrongPassword('Password123'); // true

// Username validation (3-20 alphanumeric + underscore)
validation.isValidUsername('user_123'); // true
validation.isValidUsername('a'); // false (too short)

// URL validation
validation.isURL('https://example.com'); // true
validation.isURL('not-a-url'); // false

// Phone number validation (international)
validation.isPhoneNumber('+201234567890'); // true

// Arabic text detection
validation.isArabic('مرحباً'); // true
validation.isArabic('Hello'); // false

// English text detection
validation.isEnglish('Hello World'); // true
validation.isEnglish('مرحباً'); // false
```

---

### 5. `error-handler.ts` - Error Handling

Centralized error handling with toast notifications.

#### Usage:

```typescript
import { handleError, getErrorMessage } from '@/shared/utils';

// Basic error handling with toast
try {
  await someAsyncFunction();
} catch (error) {
  handleError(error); // Shows toast with error message
}

// Custom error message
handleError(error, {
  customMessage: 'Failed to load data',
});

// Disable toast
handleError(error, {
  showToast: false,
});

// Custom error callback
handleError(error, {
  onError: (err) => {
    console.log('Custom handling:', err.message);
  },
});

// Extract error message only
const message = getErrorMessage(error);
```

---

## Best Practices

### Storage

- ✅ Use encryption for sensitive data (tokens, passwords)
- ✅ Use sessionStorage for temporary data
- ✅ Clear storage on logout

### Sanitization

- ✅ Always sanitize user-generated HTML
- ✅ Sanitize all URLs from user input
- ✅ Strip HTML from form inputs

### Formatting

- ✅ Pass current language for date/number formatting
- ✅ Use consistent date formats across the app
- ✅ Format large numbers for readability

### Validation

- ✅ Validate on client AND server
- ✅ Use with Zod schemas for forms
- ✅ Provide clear error messages

### Error Handling

- ✅ Always handle errors in async functions
- ✅ Show user-friendly messages
- ✅ Log errors in development

---

## Arabic/English Support

All utilities support both Arabic and English:

| Utility                  | Arabic Support | Notes                            |
| ------------------------ | -------------- | -------------------------------- |
| `format.date()`          | ✅             | Uses date-fns Arabic locale      |
| `format.dateRelative()`  | ✅             | Arabic relative dates            |
| `format.currency()`      | ✅             | Supports EGP and Arabic numerals |
| `validation.isArabic()`  | ✅             | Detects Arabic text              |
| `validation.isEnglish()` | ✅             | Detects English text             |

---

## Related Files

- `src/shared/constants/env.ts` - Environment config
- `src/core/types/common.types.ts` - Common types
