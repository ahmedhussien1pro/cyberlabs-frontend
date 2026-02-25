import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Calendar, Edit2, Link as LinkIcon, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from './profile-avatar';
import { ProfileSocialLinks } from './profile-social-links';
import type { UserProfile } from '../../types/profile.types';
import type { UserPoints } from '@/shared/types/user.types';

interface Props {
  profile: UserProfile;
  points?: UserPoints;
  isOwner?: boolean;
  onEdit?: () => void;
}

export function ProfileHero({ profile, points, isOwner, onEdit }: Props) {
  const { t } = useTranslation('profile');

  // Format date nicely
  const joinedDate = new Date(profile.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className='overflow-hidden border-border/40 bg-gradient-to-br from-card/90 to-background/50 shadow-sm backdrop-blur-md transition-all hover:shadow-md'>
      {/* Cover Image/Banner Area */}
      <div className='h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative group'>
        {isOwner && onEdit && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm border-border/50"
            onClick={onEdit}
          >
            <Edit2 className="w-3.5 h-3.5 mr-2" />
            {t('hero.editCover', 'Edit Profile')}
          </Button>
        )}
      </div>

      <CardContent className='relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8'>
          
          {/* Avatar Area (pulled up over the banner) */}
          <div className='-mt-16 flex justify-center sm:justify-start shrink-0 z-10'>
            <ProfileAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              level={points?.currentLevel ?? 1}
              editable={isOwner}
              size='lg'
            />
          </div>

          {/* Info Area */}
          <div className='flex flex-1 flex-col items-center pt-2 sm:items-start'>
            <div className='flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex flex-col items-center sm:items-start'>
                <h1 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                  {profile.name}
                </h1>
                
                <div className='mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
                  <Badge variant='secondary' className='bg-primary/10 text-primary hover:bg-primary/20 transition-colors'>
                    {profile.role === 'admin' 
                      ? t('hero.roleAdmin', 'Admin') 
                      : profile.role === 'content-creator' 
                        ? t('hero.roleCreator', 'Content Creator') 
                        : t('hero.roleTrainee', 'Trainee')}
                  </Badge>
                  
                  {points && (
                    <Badge variant='outline' className='border-border/50 bg-background/50 text-muted-foreground'>
                      {t('hero.level', 'Level {{lvl}}', { level: points.currentLevel })}
                    </Badge>
                  )}
                  
                  <Badge variant='outline' className='border-border/50 bg-background/50 text-muted-foreground'>
                    {t('hero.joined', 'Joined {{date}}', { date: joinedDate })}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              {isOwner && onEdit && (
                <div className='flex w-full sm:w-auto shrink-0'>
                  <Button
                    onClick={onEdit}
                    variant='outline'
                    className='w-full border-border/50 bg-background/50 hover:bg-accent/50 sm:w-auto'
                  >
                    <Edit2 className='mr-2 h-4 w-4' />
                    {t('hero.editButton', 'Edit Profile')}
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio ? (
              <p className='mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-left'>
                {profile.bio}
              </p>
            ) : isOwner ? (
              <p className='mt-4 text-sm text-muted-foreground/60 italic text-center sm:text-left'>
                {t('hero.noBio', 'No bio added yet. Tell us about yourself!')}
              </p>
            ) : null}

            {/* Meta Info (Location, Phone, etc) */}
            {(profile.address || profile.phoneNumber) && (
              <div className='mt-5 flex flex-wrap items-center justify-center gap-4 sm:justify-start text-sm text-muted-foreground'>
                {profile.address && (
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='h-3.5 w-3.5 shrink-0 opacity-70' />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className='flex items-center gap-1.5'>
                    <Phone className='h-3.5 w-3.5 shrink-0 opacity-70' />
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {(profile.socialLinks && profile.socialLinks.length > 0) && (
              <div className='mt-5 flex w-full justify-center sm:justify-start border-t border-border/40 pt-5'>
                <ProfileSocialLinks links={profile.socialLinks} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
