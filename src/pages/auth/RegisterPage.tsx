// display register page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const RegisterPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('register.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('register.intro')}</CardContent>
    </Card>
  )
}

export default RegisterPage
