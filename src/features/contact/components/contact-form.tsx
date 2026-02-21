import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { useContact } from '../hooks/use-contact';
import { ContactSuccess } from './contact-success';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { t } = useTranslation('contact');
  const { mutate, isPending, isSuccess } = useContact();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = (values: FormValues) => mutate(values);

  if (isSuccess) {
    return (
      <ContactSuccess
        onReset={() => {
          form.reset();
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <div className='grid gap-5 sm:grid-cols-2'>
          {(['name', 'email'] as const).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {t(`form.${fieldName}`)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={fieldName === 'email' ? 'email' : 'text'}
                      placeholder={t(`form.${fieldName}Placeholder`)}
                      className='border-border/40 bg-background/50 transition-colors focus:border-primary/50'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name='subject'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('form.subject')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.subjectPlaceholder')}
                  className='border-border/40 bg-background/50 transition-colors focus:border-primary/50'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('form.message')}
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder={t('form.messagePlaceholder')}
                  className='resize-none border-border/40 bg-background/50 transition-colors focus:border-primary/50'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          size='lg'
          disabled={isPending}
          className={cn(
            'w-full gap-2 rounded-full font-mono shadow-lg shadow-primary/20',
            'transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/40',
          )}>
          {isPending ? (
            <>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
              {t('form.submitting')}
            </>
          ) : (
            <>
              <Send className='h-4 w-4' />
              {t('form.submit')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
