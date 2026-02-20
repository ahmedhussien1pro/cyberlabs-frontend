import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Globe,
  Mail,
} from 'lucide-react';
import type { SocialLink } from '../../types/profile.types';

const ICON_MAP: Record<string, React.ElementType> = {
  GITHUB: Github,
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  YOUTUBE: Youtube,
  FACEBOOK: Facebook,
  EMAIL: Mail,
  PORTFOLIO: Globe,
  OTHER: Globe,
};

export function ProfileSocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;
  return (
    <div className='mt-4 flex flex-wrap gap-2'>
      {links.map((link) => {
        const Icon = ICON_MAP[link.type] ?? Globe;
        const href = link.type === 'EMAIL' ? `mailto:${link.url}` : link.url;
        return (
          <a
            key={link.id}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            title={link.type}
            className='flex h-8 w-8 items-center justify-center rounded-full border border-border/40
                       bg-muted text-muted-foreground transition-all duration-200
                       hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:scale-110'>
            <Icon className='h-3.5 w-3.5' />
          </a>
        );
      })}
    </div>
  );
}
