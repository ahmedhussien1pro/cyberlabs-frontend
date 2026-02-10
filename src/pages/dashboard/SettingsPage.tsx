// diplay settings page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SettingsPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('settings.intro')}</CardContent>
    </Card>
  )
}

export default SettingsPage
