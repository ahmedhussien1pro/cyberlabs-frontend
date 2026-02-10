// display reset password page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ResetPasswordPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('resetPassword.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('resetPassword.intro')}</CardContent>
    </Card>
  )
}

export default ResetPasswordPage
