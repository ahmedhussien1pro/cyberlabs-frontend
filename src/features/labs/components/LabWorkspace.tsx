import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLabStore } from '../store/useLabStore';
import { FlagSubmissionForm } from './FlagSubmissionForm';
import { useStartLabMutation, useStopLabMutation } from '../api/labQueries';
import { ExternalLink, TerminalSquare } from 'lucide-react';

export const LabWorkspace: React.FC<{ labId: string }> = ({ labId }) => {
  const { t } = useTranslation();
  const { isLabRunning, labUrl } = useLabStore();
  const startMutation = useStartLabMutation();
  const stopMutation = useStopLabMutation();

  const handleToggleMachine = () => {
    if (isLabRunning) {
      stopMutation.mutate();
    } else {
      startMutation.mutate(labId);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full gap-4 p-4'>
      {/* Instructions & Actions Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='w-full lg:w-1/3 flex flex-col gap-4'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>{t(`labs.${labId}.title`)}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t(`labs.${labId}.description`)}
            </p>

            <div className='flex items-center justify-between p-4 bg-muted rounded-lg border'>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold text-sm'>
                  {t('labs.workspace.machineStatus')}
                </span>
                <span
                  className={`text-xs ${isLabRunning ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {isLabRunning
                    ? t('labs.workspace.running')
                    : t('labs.workspace.stopped')}
                </span>
              </div>
              <Button
                onClick={handleToggleMachine}
                disabled={startMutation.isPending || stopMutation.isPending}
                variant={isLabRunning ? 'destructive' : 'default'}
                className='min-w-[100px]'>
                {startMutation.isPending || stopMutation.isPending
                  ? t('labs.workspace.loading')
                  : isLabRunning
                    ? t('labs.workspace.stop')
                    : t('labs.workspace.start')}
              </Button>
            </div>

            {/* Flag Submission Form */}
            {isLabRunning && (
              <div className='pt-4 border-t'>
                <FlagSubmissionForm labId={labId} />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Area - Status & External Links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className='w-full lg:w-2/3 flex flex-col gap-4'>
        <Card className='flex-1 flex flex-col items-center justify-center p-8 bg-muted/30 border-dashed'>
          {!isLabRunning ? (
            <div className='flex flex-col items-center text-center max-w-md space-y-4 text-muted-foreground'>
              <TerminalSquare className='w-16 h-16 opacity-20 mb-4' />
              <h3 className='text-lg font-semibold text-foreground'>
                {t('labs.workspace.machineNotStarted')}
              </h3>
              <p className='text-sm'>
                قم بتشغيل اللاب لبدء التحدي. سيتم فتح بيئة العمل في تبويب جديد
                معزول لضمان أفضل تجربة.
              </p>
              <Button
                onClick={handleToggleMachine}
                disabled={startMutation.isPending}
                className='mt-4'>
                {startMutation.isPending
                  ? t('labs.workspace.loading')
                  : t('labs.workspace.start')}
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center text-center max-w-md space-y-6'>
              <div className='w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2'>
                <TerminalSquare className='w-10 h-10 text-emerald-500' />
              </div>
              <div>
                <h3 className='text-xl font-bold mb-2'>اللاب قيد التشغيل</h3>
                <p className='text-sm text-muted-foreground mb-6'>
                  تم تجهيز بيئة العمل بنجاح. إذا لم تفتح البيئة تلقائياً في
                  تبويب جديد، يمكنك الوصول إليها من خلال الرابط أدناه.
                </p>
              </div>
              <div className='flex gap-4 w-full'>
                <Button
                  className='flex-1 gap-2'
                  onClick={() => window.open(labUrl || '', '_blank')}
                  variant='default'>
                  <ExternalLink className='w-4 h-4' />
                  الوصول إلى اللاب
                </Button>
                <Button
                  className='flex-1'
                  variant='outline'
                  onClick={() => stopMutation.mutate()}>
                  إيقاف وتدمير البيئة
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
