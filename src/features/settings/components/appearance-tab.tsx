import { useTranslation } from 'react-i18next';
import { Palette, Languages } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/common/theme-toggle';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher';

function SettingRow({
  icon: Icon,
  title,
  description,
  control,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between rounded-xl border border-border/40 bg-card p-4'>
      <div className='flex items-center gap-3'>
        <Icon size={20} className='text-muted-foreground' />
        <div>
          <p className='text-sm font-medium'>{title}</p>
          <p className='text-xs text-muted-foreground'>{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

export function AppearanceTab() {
  const { t } = useTranslation('settings');

  return (
    <div className='space-y-3'>
      <SettingRow
        icon={Palette}
        title={t('appearance.theme')}
        description={t('appearance.themeDesc')}
        control={<ThemeToggle />}
      />
      <SettingRow
        icon={Languages}
        title={t('appearance.language')}
        description={t('appearance.languageDesc')}
        control={<LanguageSwitcher />}
      />
    </div>
  );
}
