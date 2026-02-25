import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, Check, Trash2, Settings, 
  ChevronLeft, LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

import { 
  useNotifications, 
  useMarkAllRead, 
  useClearAll,
  useMarkAsRead,
  useArchiveNotification,
  useDeleteNotification
} from '../hooks/use-notifications';
import { NotificationItem } from '../components/notification-item';
import { ROUTES } from '@/shared/constants';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>('all');
  
  const { data, isLoading } = useNotifications();
  const { mutate: markAllRead, isPending: isMarking } = useMarkAllRead();
  const { mutate: clearAll, isPending: isClearing } = useClearAll();
  
  const markOne = useMarkAsRead();
  const archive = useArchiveNotification();
  const del = useDeleteNotification();

  const notifications = data?.notifications || [];
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" asChild>
              <Link to={ROUTES.DASHBOARD.DashboardPage}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Notification Center
            </h1>
            {data?.unreadCount ? (
              <Badge variant="default" className="ml-2">
                {data.unreadCount} unread
              </Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground pl-10">
            Manage your notifications and alerts
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button 
            variant="outline" 
            size="sm"
            disabled={isMarking || notifications.every(n => n.isRead)}
            onClick={() => markAllRead()}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
            disabled={isClearing || notifications.length === 0}
            onClick={() => clearAll()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground">
            <Link to={`${ROUTES.DASHBOARD.DashboardPage}/settings?tab=notifications`}>
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Link>
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4 outline-none">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3">
              {filteredNotifications.map((notification, index) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  index={index}
                  onRead={(id) => markOne.mutate(id)}
                  onArchive={(id) => archive.mutate(id)}
                  onDelete={(id) => del.mutate(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 outline-none">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState message="You're all caught up! No unread notifications." />
          ) : (
            <div className="grid gap-3">
              {filteredNotifications.map((notification, index) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  index={index}
                  onRead={(id) => markOne.mutate(id)}
                  onArchive={(id) => archive.mutate(id)}
                  onDelete={(id) => del.mutate(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message = "No notifications yet." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-card/50">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Bell className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        When you complete labs, earn badges, or receive important updates, they'll show up here.
      </p>
      <Button variant="outline" className="mt-6" asChild>
        <Link to="/labs">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Go to Labs
        </Link>
      </Button>
    </div>
  );
}
