// src/features/auth/components/social-auth-buttons.tsx
import { toast } from 'sonner';
import { ENV } from '@/shared/constants';

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register';
  disabled?: boolean;
}

interface SocialProvider {
  name: string;
  icon: string;
  enabled: boolean;
  url?: string;
}

const socialProviders: SocialProvider[] = [
  {
    name: 'Google',
    icon: 'fa-google',
    enabled: true,
    url: `${ENV.API_URL}/auth/google`,
  },
  {
    name: 'GitHub',
    icon: 'fa-github',
    enabled: true,
    url: `${ENV.API_URL}/auth/github`,
  },
  {
    name: 'Facebook',
    icon: 'fa-facebook-f',
    enabled: false, // Coming soon
  },
  {
    name: 'LinkedIn',
    icon: 'fa-linkedin-in',
    enabled: false, // Coming soon
  },
];

/**
 * Social Authentication Buttons
 * Supports Google and GitHub OAuth
 */
export function SocialAuthButtons({
  mode = 'login',
  disabled = false,
}: SocialAuthButtonsProps) {
  const handleSocialAuth = (provider: SocialProvider) => {
    if (disabled) return;

    if (!provider.enabled) {
      toast.info('Coming Soon', {
        description: `${provider.name} ${mode} will be available soon`,
      });
      return;
    }

    try {
      if (provider.url) {
        // Redirect to OAuth provider
        window.location.href = provider.url;
      }
    } catch (error) {
      console.error('OAuth error:', error);
      toast.error('Authentication Error', {
        description: `Unable to connect to ${provider.name}`,
      });
    }
  };

  return (
    <div className='auth-form__social-icons'>
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          type='button'
          onClick={() => handleSocialAuth(provider)}
          disabled={disabled}
          className='auth-form__social-link'
          aria-label={`${mode === 'login' ? 'Login' : 'Register'} with ${provider.name}`}>
          <i className={`fa-brands ${provider.icon}`}></i>
        </button>
      ))}
    </div>
  );
}
