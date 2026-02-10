// display forgot password page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ForgotPasswordPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('forgotPassword.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('forgotPassword.intro')}</CardContent>
    </Card>
  )
}

export default ForgotPasswordPage
