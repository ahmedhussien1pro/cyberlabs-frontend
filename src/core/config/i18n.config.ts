import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ENV } from '@/shared/constants';

// Inline translations (no HTTP loading)
const resources = {
  en: {
    common: {
      app: {
        name: 'CyberLabs',
        tagline: 'Learn. Code. Excel.',
        description: 'Master programming skills with interactive courses',
      },
      navigation: {
        home: 'Home',
        courses: 'Courses',
        dashboard: 'Dashboard',
        profile: 'Profile',
        about: 'About',
        contact: 'Contact',
        pricing: 'Pricing',
      },
      actions: {
        submit: 'Submit',
        cancel: 'Cancel',
        back: 'Back',
        save: 'Save',
      },
      settings: {
        title: 'Settings',
      },
    },
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Login to your account',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submit: 'Login',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        success: 'Login successful!',
        error: 'Login failed. Please try again.',
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join CyberLabs today',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Username',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        agreeToTerms: 'I agree to the Terms and Conditions',
        submit: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        success: 'Account created! Please check your email to verify.',
        error: 'Registration failed. Please try again.',
      },
      forgotPassword: {
        title: 'Forgot Password',
        subtitle: 'Enter your email to reset password',
        email: 'Email Address',
        submit: 'Send Reset Link',
        backToLogin: 'Back to login',
      },
      resetPassword: {
        title: 'Reset Password',
        subtitle: 'Enter your new password',
      },
      verifyEmail: {
        title: 'Verify Email',
        subtitle: 'Check your email for verification link',
      },
      logout: {
        success: 'Logged out successfully',
      },
    },
    errors: {
      notFound: 'Page Not Found',
    },
  },
  ar: {
    common: {
      app: {
        name: 'سايبر لابز',
        tagline: 'تعلم. برمج. تفوق.',
        description: 'اتقن مهارات البرمجة من خلال دورات تفاعلية',
      },
      navigation: {
        home: 'الرئيسية',
        courses: 'الدورات',
        dashboard: 'لوحة التحكم',
        profile: 'الملف الشخصي',
        about: 'عن المنصة',
        contact: 'تواصل معنا',
        pricing: 'الأسعار',
      },
      actions: {
        submit: 'إرسال',
        cancel: 'إلغاء',
        back: 'رجوع',
        save: 'حفظ',
      },
      settings: {
        title: 'الإعدادات',
      },
    },
    auth: {
      login: {
        title: 'مرحباً بعودتك',
        subtitle: 'سجل دخولك إلى حسابك',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'نسيت كلمة المرور؟',
        submit: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        signUp: 'إنشاء حساب',
        success: 'تم تسجيل الدخول بنجاح!',
        error: 'فشل تسجيل الدخول. حاول مرة أخرى.',
      },
      register: {
        title: 'إنشاء حساب جديد',
        subtitle: 'انضم إلى سايبر لابز اليوم',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        agreeToTerms: 'أوافق على الشروط والأحكام',
        submit: 'إنشاء الحساب',
        haveAccount: 'لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول',
        success: 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني للتأكيد.',
        error: 'فشل إنشاء الحساب. حاول مرة أخرى.',
      },
      forgotPassword: {
        title: 'نسيت كلمة المرور',
        subtitle: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور',
        email: 'البريد الإلكتروني',
        submit: 'إرسال رابط إعادة التعيين',
        backToLogin: 'العودة لتسجيل الدخول',
      },
      resetPassword: {
        title: 'إعادة تعيين كلمة المرور',
        subtitle: 'أدخل كلمة المرور الجديدة',
      },
      verifyEmail: {
        title: 'تأكيد البريد الإلكتروني',
        subtitle: 'تحقق من بريدك الإلكتروني للحصول على رابط التأكيد',
      },
      logout: {
        success: 'تم تسجيل الخروج بنجاح',
      },
    },
    errors: {
      notFound: 'الصفحة غير موجودة',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],

    debug: false,

    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'common',
    ns: ['common', 'auth', 'errors'],

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: `${ENV.STORAGE_PREFIX}language`,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
