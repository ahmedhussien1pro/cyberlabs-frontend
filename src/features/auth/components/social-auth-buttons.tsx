// src/features/auth/components/social-auth-buttons.tsx
import { toast } from 'sonner';
import { ENV } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

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

export function SocialAuthButtons({
  mode = 'login',
  disabled = false,
}: SocialAuthButtonsProps) {
  const { t } = useTranslation('auth');

  const socialProviders: SocialProvider[] = [
    {
      name: t('social.google'),
      icon: 'fa-google',
      enabled: true,
      url: `${ENV.API_URL}/auth/google`,
    },
    {
      name: t('social.github'),
      icon: 'fa-github',
      enabled: true,
      url: `${ENV.API_URL}/auth/github`,
    },
    {
      name: t('social.facebook'),
      icon: 'fa-facebook-f',
      enabled: false,
    },
    {
      name: t('social.linkedin'),
      icon: 'fa-linkedin-in',
      enabled: false,
    },
  ];

  const handleSocialAuth = (provider: SocialProvider) => {
    if (disabled || !provider.enabled) return;

    try {
      if (provider.url) {
        window.location.href = provider.url;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[SocialAuth] redirect failed:', error);
      }
      toast.error(t('social.authError'), {
        description: t('social.authErrorDescription', {
          provider: provider.name,
        }),
      });
    }
  };

  return (
    <div className='auth-form__social-icons'>
      {socialProviders.map((provider) => {
        const isDisabled = disabled || !provider.enabled;

        return (
          <button
            key={provider.name}
            type='button'
            onClick={() => handleSocialAuth(provider)}
            disabled={isDisabled}
            title={
              !provider.enabled
                ? t('social.comingSoon')
                : t('social.ariaLabel', {
                    action:
                      mode === 'login'
                        ? t('social.login')
                        : t('social.register'),
                    provider: provider.name,
                  })
            }
            aria-label={t('social.ariaLabel', {
              action:
                mode === 'login' ? t('social.login') : t('social.register'),
              provider: provider.name,
            })}
            aria-disabled={isDisabled}
            className={cn(
              'auth-form__social-link',
              isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
            )}>
            <i className={`fa-brands ${provider.icon}`}></i>
          </button>
        );
      })}
    </div>
  );
}
