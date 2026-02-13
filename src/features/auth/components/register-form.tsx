import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthInput } from './auth-input';
import { PasswordStrengthIndicator } from './password-strength';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Eye } from 'lucide-react';
import { registerSchema, type RegisterForm } from '../schemas';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

interface RegisterFormProps {
  onSuccess?: (user: any, token: string) => void;
  setLoading: (loading: boolean) => void;
}

export function RegisterForm({ onSuccess, setLoading }: RegisterFormProps) {
  const { login } = useAuthStore();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const response = await authService.register(
        data.username,
        data.email,
        data.password,
      );
      login(response.user, response.token);

      toast.success('التسجيل نجح!', {
        description: `مرحباً ${data.username}!`,
      });

      onSuccess?.(response.user, response.token);
    } catch (error: any) {
      toast.error('فشل التسجيل', {
        description: error.message || 'حاول مرة أخرى',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='auth-page__form'>
      <AuthInput
        label='الاسم'
        icon={User}
        {...form.register('username')}
        error={form.formState.errors.username?.message}
        placeholder='أدخل اسمك'
      />

      <AuthInput
        label='البريد الإلكتروني'
        type='email'
        icon={Mail}
        {...form.register('email')}
        error={form.formState.errors.email?.message}
        placeholder='example@email.com'
      />

      <div className='space-y-2'>
        <AuthInput
          label='كلمة السر'
          type='password'
          icon={Eye}
          togglePassword
          {...form.register('password')}
          error={form.formState.errors.password?.message}
          placeholder='••••••••'
        />
        <PasswordStrengthIndicator password={form.watch('password')} />
      </div>

      <AuthInput
        label='تأكيد كلمة السر'
        type='password'
        icon={Eye}
        togglePassword
        {...form.register('confirmPassword')}
        error={form.formState.errors.confirmPassword?.message}
        placeholder='••••••••'
      />

      <Button
        type='submit'
        className='auth-page__submit-btn'
        disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'جاري التسجيل...' : 'إنشاء حساب'}
      </Button>
    </form>
  );
}
