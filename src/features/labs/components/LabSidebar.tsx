import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLabStore } from '../store/useLabStore';
import { useStartLabMutation, useStopLabMutation } from '../api/labQueries';
import { FlagSubmissionForm } from './FlagSubmissionForm';
import { LabTerminal } from './LabTerminal';
import { Button } from '@/components/ui/button';

export const LabSidebar: React.FC<{ labId: string }> = ({ labId }) => {
  const { t } = useTranslation();
  const { isLabRunning } = useLabStore();
  const startMutation = useStartLabMutation();
  const stopMutation = useStopLabMutation();

  const toggleMachine = () => {
    if (isLabRunning) stopMutation.mutate();
    else startMutation.mutate(labId);
  };

  return (
    <Card className='flex-1 flex flex-col h-full overflow-hidden border-none shadow-none'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl'>{t(`labs.${labId}.title`)}</CardTitle>
        <div className='flex items-center justify-between mt-2 p-3 bg-muted rounded-lg'>
          <span className='text-sm font-semibold'>
            {t('labs.workspace.machineStatus')}
          </span>
          <Button
            onClick={toggleMachine}
            disabled={startMutation.isPending || stopMutation.isPending}
            variant={isLabRunning ? 'destructive' : 'default'}
            size='sm'>
            {isLabRunning
              ? t('labs.workspace.stop')
              : t('labs.workspace.start')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='flex-1 overflow-hidden p-0'>
        <Tabs defaultValue='instructions' className='flex flex-col h-full'>
          <TabsList className='w-full justify-start rounded-none border-b px-4'>
            <TabsTrigger value='instructions'>
              {t('labs.tabs.instructions')}
            </TabsTrigger>
            <TabsTrigger value='hints'>{t('labs.tabs.hints')}</TabsTrigger>
            {isLabRunning && (
              <TabsTrigger value='terminal'>
                {t('labs.tabs.terminal')}
              </TabsTrigger>
            )}
          </TabsList>

          <ScrollArea className='flex-1 p-4'>
            <TabsContent value='instructions' className='mt-0 space-y-4'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {t(`labs.${labId}.description`)}
              </p>
              {isLabRunning && <FlagSubmissionForm labId={labId} />}
            </TabsContent>

            <TabsContent value='hints' className='mt-0'>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='hint-1'>
                  <AccordionTrigger>
                    {t('labs.workspace.hint')} 1
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground'>
                    {t(`labs.${labId}.hints.1`)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='hint-2'>
                  <AccordionTrigger>
                    {t('labs.workspace.hint')} 2
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground'>
                    {t(`labs.${labId}.hints.2`)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {isLabRunning && (
              <TabsContent value='terminal' className='mt-0 h-64 lg:h-full'>
                <LabTerminal labId={labId} />
              </TabsContent>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
