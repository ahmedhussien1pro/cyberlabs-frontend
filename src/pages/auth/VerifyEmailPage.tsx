// display verify email page
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const VerifyEmailPage = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('verifyEmail.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('verifyEmail.intro')}</CardContent>
    </Card>
  )
}

export default VerifyEmailPage
