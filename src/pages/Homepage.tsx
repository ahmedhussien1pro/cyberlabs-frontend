// display hello from home page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('home.welcome')}</CardTitle>
      </CardHeader>
      <CardContent>{t('home.intro')}</CardContent>
    </Card>
  )
}

export default HomePage
