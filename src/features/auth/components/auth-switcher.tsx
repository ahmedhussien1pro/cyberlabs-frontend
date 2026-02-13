import { Button } from '@/components/ui/button';

interface AuthSwitcherProps {
  isRegister: boolean;
  onToggle: () => void;
}

export function AuthSwitcher({ isRegister, onToggle }: AuthSwitcherProps) {
  return (
    <div className='auth-page__switch-link'>
      {isRegister ? 'عندك حساب بالفعل؟ ' : 'ليس لديك حساب؟ '}
      <Button
        variant='link'
        onClick={onToggle}
        className='auth-page__switch-btn p-0 h-auto'
        type='button'>
        {isRegister ? 'تسجيل الدخول' : 'إنشاء حساب'}
      </Button>
    </div>
  );
}
