import type { UserProfile } from '../types/profile.types';

export interface CompletionCheck {
  key: string;
  labelKey: string;
  done: boolean;
}

export function calcProfileCompletion(profile: UserProfile): {
  percentage: number;
  checks: CompletionCheck[];
} {
  const checks: CompletionCheck[] = [
    { key: 'name', labelKey: 'completion.name', done: !!profile.name },
    { key: 'bio', labelKey: 'completion.bio', done: !!profile.bio },
    { key: 'avatar', labelKey: 'completion.avatar', done: !!profile.avatarUrl },
    {
      key: 'birthday',
      labelKey: 'completion.birthday',
      done: !!profile.birthday,
    },
    { key: 'phone', labelKey: 'completion.phone', done: !!profile.phoneNumber },
    { key: 'address', labelKey: 'completion.address', done: !!profile.address },
    {
      key: 'social',
      labelKey: 'completion.social',
      done: (profile.socialLinks?.length ?? 0) > 0,
    },
    {
      key: 'skills',
      labelKey: 'completion.skills',
      done: (profile.skills?.length ?? 0) > 0,
    },
    {
      key: 'education',
      labelKey: 'completion.education',
      done: (profile.education?.length ?? 0) > 0,
    },
  ];

  const done = checks.filter((c) => c.done).length;
  const percentage = Math.round((done / checks.length) * 100);

  return { percentage, checks };
}
