import {
  Bell,
  BookOpen,
  FlaskConical,
  KeyRound,
  LogIn,
  Mail,
  Map,
  Shield,
  ShieldCheck,
  Star,
  Trophy,
  UserPen,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import type { NotificationType } from '../types/notification.types';

export const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; cls: string }
> = {
  AUTH_LOGIN: { icon: LogIn, cls: 'bg-blue-500/10   text-blue-500' },
  AUTH_REGISTER: { icon: Star, cls: 'bg-emerald-500/10 text-emerald-500' },
  AUTH_PASSWORD_CHANGED: {
    icon: KeyRound,
    cls: 'bg-orange-500/10 text-orange-500',
  },
  AUTH_PASSWORD_RESET: { icon: KeyRound, cls: 'bg-red-500/10    text-red-500' },
  AUTH_2FA_ENABLED: {
    icon: ShieldCheck,
    cls: 'bg-green-500/10  text-green-500',
  },
  AUTH_EMAIL_VERIFIED: { icon: Mail, cls: 'bg-blue-500/10   text-blue-400' },
  PROFILE_UPDATED: { icon: UserPen, cls: 'bg-slate-500/10  text-slate-400' },
  PROFILE_AVATAR_CHANGED: {
    icon: UserPen,
    cls: 'bg-slate-500/10  text-slate-400',
  },
  COURSE_ENROLLED: { icon: BookOpen, cls: 'bg-blue-500/10   text-blue-400' },
  COURSE_COMPLETED: { icon: Trophy, cls: 'bg-yellow-500/10 text-yellow-500' },
  PATH_ENROLLED: { icon: Map, cls: 'bg-violet-500/10 text-violet-500' },
  PATH_COMPLETED: { icon: Trophy, cls: 'bg-yellow-500/10 text-yellow-500' },
  LAB_COMPLETED: { icon: FlaskConical, cls: 'bg-cyan-500/10   text-cyan-500' },
  BADGE_EARNED: { icon: Shield, cls: 'bg-amber-500/10  text-amber-500' },
  POINTS_EARNED: { icon: Zap, cls: 'bg-orange-500/10 text-orange-500' },
  LEADERBOARD_RANK_UP: {
    icon: TrendingUp,
    cls: 'bg-green-500/10  text-green-500',
  },
  XP_LEVEL_UP: { icon: Star, cls: 'bg-yellow-500/10 text-yellow-400' },
  SUBSCRIPTION_ACTIVATED: {
    icon: Crown,
    cls: 'bg-purple-500/10 text-purple-500',
  },
  SUBSCRIPTION_EXPIRING: { icon: Crown, cls: 'bg-red-500/10    text-red-400' },
  SUBSCRIPTION_CANCELLED: {
    icon: Crown,
    cls: 'bg-slate-500/10  text-slate-400',
  },
  SYSTEM_WELCOME_BACK: { icon: Bell, cls: 'bg-blue-500/10   text-blue-500' },
};
