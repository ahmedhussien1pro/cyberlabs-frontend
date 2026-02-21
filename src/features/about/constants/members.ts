import { ahmed, emad, nasar, laila } from '@/shared/constants/constants';

export interface TeamMember {
  key: string; // used as i18n namespace key
  img: string;
  links: { fb: string; twitter: string; linkedin: string };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    key: 'nasar',
    img: nasar,
    links: {
      fb: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
  {
    key: 'emad',
    img: emad,
    links: {
      fb: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
  {
    key: 'laila',
    img: laila,
    links: {
      fb: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
  {
    key: 'ahmed',
    img: ahmed,
    links: {
      fb: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/',
    },
  },
];
