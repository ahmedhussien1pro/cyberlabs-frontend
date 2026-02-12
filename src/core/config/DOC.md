# Configuration Module Documentation

## i18n Configuration

### Overview

Multi-language support (Arabic/English) using i18next and react-i18next.

---

## Features

- ✅ Arabic and English support
- ✅ RTL/LTR automatic switching
- ✅ Language detection (localStorage → browser)
- ✅ Lazy loading of translation files
- ✅ Namespaced translations

---

## Usage

### Basic Translation

```typescript
import { useTranslation } from "react-i18next"

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t("common:app.name")}</h1>
      <p>{t("auth:login.title")}</p>
    </div>
  )
}
```

### With Variables

```typescript
const { t } = useTranslation();

// English: "Username must be at least 3 characters"
// Arabic: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"
t('validation:minLength', { field: 'Username', min: 3 });
```

### Change Language

```typescript
import { useTranslation } from "react-i18next"

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: "en" | "ar") => {
    i18n.changeLanguage(lng)

    // Update document direction
    document.dir = lng === "ar" ? "rtl" : "ltr"
  }

  return (
    <button onClick={() => changeLanguage("ar")}>
      العربية
    </button>
  )
}
```

### Current Language

```typescript
const { i18n } = useTranslation();

const currentLanguage = i18n.language; // "en" or "ar"
const isRTL = i18n.dir() === 'rtl';
```

---

## Translation Namespaces

| Namespace    | Purpose         | Example Keys                                    |
| ------------ | --------------- | ----------------------------------------------- |
| `common`     | Shared UI text  | `app.name`, `actions.submit`, `navigation.home` |
| `auth`       | Authentication  | `login.title`, `register.submit`                |
| `courses`    | Course-related  | `list.title`, `detail.enroll`                   |
| `dashboard`  | Dashboard       | `stats.title`, `activity.recent`                |
| `profile`    | User profile    | `edit.title`, `achievements.title`              |
| `validation` | Form validation | `required`, `email`, `minLength`                |
| `errors`     | Error messages  | `general`, `network`, `unauthorized`            |

---

## File Structure

```
public/
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── auth.json
    │   ├── validation.json
    │   └── errors.json
    └── ar/
        ├── common.json
        ├── auth.json
        ├── validation.json
        └── errors.json
```

---

## Best Practices

1. **Always use namespaces**: `t("namespace:key")`
2. **Keep keys organized**: Group related translations
3. **Use variables**: `t("key", { variable: value })`
4. **Add missing keys**: Create PR with new translations
5. **Test both languages**: Ensure UI works in AR and EN

---

## RTL Support

### Automatic Direction

```typescript
// In main.tsx or App.tsx
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.dir = i18n.dir()
  }, [i18n.language])

  return <div>...</div>
}
```

### CSS for RTL

```css
/* Tailwind automatically handles RTL with rtl: modifier */
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Content
</div>
```

---

## Related Files

- `src/core/providers/i18n-provider.tsx` - i18n provider wrapper
- `public/locales/` - Translation files
