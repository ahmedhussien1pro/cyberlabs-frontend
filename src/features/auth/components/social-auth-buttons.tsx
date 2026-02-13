import { toast } from 'sonner';

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register';
  onSocialAuth?: (provider: string) => void;
}

const socialProviders = [
  { name: 'Google', icon: 'fa-google' },
  { name: 'Facebook', icon: 'fa-facebook-f' },
  { name: 'GitHub', icon: 'fa-github' },
  { name: 'LinkedIn', icon: 'fa-linkedin-in' },
];

export function SocialAuthButtons({
  mode = 'login',
  onSocialAuth,
}: SocialAuthButtonsProps) {
  const handleSocialLogin = (provider: string) => {
    if (onSocialAuth) {
      onSocialAuth(provider);
    } else {
      toast.info('Coming Soon', {
        description: `${provider} ${mode} will be available soon`,
      });
    }
  };

  return (
    <div className='flex justify-center gap-3 flex-wrap'>
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          type='button'
          onClick={() => handleSocialLogin(provider.name)}
          className='w-12 h-12 flex items-center justify-center border-2 border-foreground/20 text-foreground rounded-lg hover:border-primary hover:text-primary hover:scale-105 transition-all bg-transparent cursor-pointer'
          aria-label={`${mode === 'login' ? 'Login' : 'Register'} with ${provider.name}`}>
          <i className={`fa-brands ${provider.icon}`}></i>
        </button>
      ))}
    </div>
  );
}
