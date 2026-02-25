import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLabStore } from '../store/useLabStore';
import { FlagSubmissionForm } from './FlagSubmissionForm';

export const LabWorkspace: React.FC<{ labId: string }> = ({ labId }) => {
  const { t } = useTranslation();
  const { isLabRunning, labUrl, startLab, stopLab } = useLabStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMachine = async () => {
    setIsLoading(true);
    // TODO: استبدال هذا بـ TanStack Query لنداء الـ API الفعلي
    setTimeout(() => {
      if (isLabRunning) {
        stopLab();
      } else {
        // محاكاة استلام رابط اللاب من الخادم (يجب أن يكون Subdomain مختلف)
        startLab(labId, `https://${labId}.labs.cyberlabs.com`);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className='flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full gap-4 p-4'>
      {/* قسم التعليمات وإرسال الـ Flag */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>{t(`labs.${labId}.title`)}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {t(`labs.${labId}.description`)}
            </p>

            <div className='flex items-center justify-between p-4 bg-muted rounded-lg'>
              <span className='font-semibold'>
                {t('labs.workspace.machineStatus')}
              </span>
              <Button
                onClick={handleToggleMachine}
                disabled={isLoading}
                variant={isLabRunning ? 'destructive' : 'default'}>
                {isLoading
                  ? t('labs.workspace.loading')
                  : isLabRunning
                    ? t('labs.workspace.stop')
                    : t('labs.workspace.start')}
              </Button>
            </div>

            {/* فورم تسليم الفلاج */}
            {isLabRunning && <FlagSubmissionForm labId={labId} />}
          </CardContent>
        </Card>
      </motion.div>

      {/* قسم التطبيق الضعيف (Iframe) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className='w-full lg:w-2/3 h-full border rounded-lg bg-background overflow-hidden relative'>
        {!isLabRunning ? (
          <div className='flex h-full items-center justify-center text-muted-foreground flex-col gap-4'>
            <p>{t('labs.workspace.machineNotStarted')}</p>
          </div>
        ) : (
          <iframe
            src={labUrl!}
            className='w-full h-full border-0'
            sandbox='allow-scripts allow-same-origin allow-forms'
            title='Vulnerable Lab Workspace'
          />
        )}
      </motion.div>
    </div>
  );
};
