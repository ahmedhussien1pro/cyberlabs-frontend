// display hello dashboard page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DashboardPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.welcome')}</CardTitle>
      </CardHeader>
      <CardContent>{t('dashboard.intro')}</CardContent>
    </Card>
  )
}

export default DashboardPage
