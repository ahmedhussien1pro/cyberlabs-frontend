import { toast } from 'sonner';
import { ENV } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

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
    if (disabled) return;

    if (!provider.enabled) {
      toast.info(t('social.comingSoon'), {
        description: t('social.comingSoonDescription', {
          provider: provider.name,
          mode: mode === 'login' ? t('social.login') : t('social.register'),
        }),
      });
      return;
    }

    try {
      if (provider.url) {
        // <Navigate to={provider.url} />;
        window.location.href = provider.url;
      }
    } catch (error) {
      console.error('OAuth error:', error);
      toast.error(t('social.authError'), {
        description: t('social.authErrorDescription', {
          provider: provider.name,
        }),
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
          disabled={!provider.enabled}
          className='auth-form__social-link'
          aria-label={t('social.ariaLabel', {
            action: mode === 'login' ? t('social.login') : t('social.register'),
            provider: provider.name,
          })}>
          <i className={`fa-brands ${provider.icon}`}></i>
        </button>
      ))}
    </div>
  );
}
