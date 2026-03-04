// src/features/paths/components/paths-hero.tsx
import { useTranslation } from 'react-i18next';
import { PageHero } from '@/shared/components/common/page-hero';

interface PathsHeroProps {
  search: string;
  onSearchChange: (v: string) => void;
  totalCount?: number;
}

export function PathsHero({
  search,
  onSearchChange,
  totalCount,
}: PathsHeroProps) {
  const { t } = useTranslation('paths');

  return (
    <PageHero
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      description={t('hero.description')}
      imageAlt={t('hero.imageAlt')}
      showSearch={true}
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={t('hero.searchPlaceholder')}
      totalCount={totalCount}
      totalCountLabel={t('hero.available')}
      extraStatLabel={t('hero.zeroToExpert')}
    />
  );
}
