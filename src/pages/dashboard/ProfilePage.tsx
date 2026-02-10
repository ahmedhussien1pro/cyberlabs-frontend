// display hello profile page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ProfilePage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('profile.intro')}</CardContent>
    </Card>
  )
}

export default ProfilePage
