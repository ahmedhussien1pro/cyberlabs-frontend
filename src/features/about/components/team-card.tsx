import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { TeamMember } from '../constants/members';

interface Props {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: Props) {
  const { t } = useTranslation('about');
  const [hovered, setHovered] = useState(false);

  const name = t(`members.${member.key}.name`);
  const desig = t(`members.${member.key}.desig`);
  const bio = t(`members.${member.key}.bio`);

  const socialLinks = [
    { href: member.links.fb, Icon: Facebook, label: 'Facebook' },
    { href: member.links.twitter, Icon: Twitter, label: 'Twitter' },
    { href: member.links.linkedin, Icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='group relative w-[260px] overflow-hidden rounded-2xl border border-white/5 bg-card px-5 pb-5 pt-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10'>
      <div className='flex flex-col items-center text-center'>
        <div className='mb-4 h-[150px] w-[150px] flex-shrink-0 overflow-hidden rounded-full border-2 border-border/20 shadow-lg ring-2 ring-primary/10 transition-all duration-300 group-hover:border-primary/30 group-hover:ring-primary/25'>
          <img
            src={member.img}
            alt={name}
            className='h-full w-full object-cover object-top'
          />
        </div>

        <div className='mb-3 h-px w-10 bg-primary/30' />

        <h3 className='text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary'>
          {name}
        </h3>

        <span className='mt-1 block text-[0.7rem] font-medium text-muted-foreground'>
          {desig}
        </span>

        <div className='mt-4 flex justify-center gap-2'>
          {socialLinks.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg',
                'border border-border/40 bg-muted/30 text-muted-foreground',
                'transition-all duration-200 hover:scale-110 hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
              )}>
              <Icon className='h-3 w-3' />
            </a>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            key='bio'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className='absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card px-5 text-center [backdrop-filter:none]'>
            <div className='mb-3 h-14 w-14 overflow-hidden rounded-full border border-primary/20 ring-1 ring-primary/10'>
              <img
                src={member.img}
                alt={name}
                className='h-full w-full object-cover object-top'
              />
            </div>

            <h3 className='text-sm font-bold text-primary'>{name}</h3>

            <span className='mt-0.5 block text-[0.65rem] font-medium text-primary/60'>
              {desig}
            </span>

            <div className='my-3 h-px w-10 bg-primary/25' />

            <p className='line-clamp-5 text-[0.72rem] leading-relaxed text-muted-foreground'>
              {bio}
            </p>

            <div className='mt-4 flex justify-center gap-2'>
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-all duration-200 hover:scale-110 hover:bg-primary/25'>
                  <Icon className='h-3 w-3' />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
