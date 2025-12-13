import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, UserPlus, MessageCircle, AtSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: {
      username: 'sarah_design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    content: 'liked your photo',
    postImage: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100',
    timestamp: '2m',
    isNew: true,
  },
  {
    id: '2',
    type: 'follow',
    user: {
      username: 'john.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    content: 'started following you',
    timestamp: '15m',
    isNew: true,
  },
  {
    id: '3',
    type: 'comment',
    user: {
      username: 'emma_photo',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    content: 'commented: "This is amazing! 🔥"',
    postImage: 'https://images.unsplash.com/photo-1682686578615-5c96e8f11f23?w=100',
    timestamp: '1h',
    isNew: false,
  },
  {
    id: '4',
    type: 'mention',
    user: {
      username: 'alex_travel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    content: 'mentioned you in a comment',
    postImage: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=100',
    timestamp: '3h',
    isNew: false,
  },
  {
    id: '5',
    type: 'like',
    user: {
      username: 'lisa.art',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    content: 'and 23 others liked your post',
    postImage: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=100',
    timestamp: '5h',
    isNew: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 fill-destructive text-destructive" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-primary" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-primary" />;
    case 'mention':
      return <AtSign className="h-4 w-4 text-primary" />;
    default:
      return null;
  }
};

export default function NotificationsPage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const newNotifications = mockNotifications.filter((n) => n.isNew);
  const earlierNotifications = mockNotifications.filter((n) => !n.isNew);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <header>
          <h1 className="text-xl font-semibold">Notifications</h1>
        </header>

        {/* New */}
        {newNotifications.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">New</h2>
            <div className="space-y-1">
              {newNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-xl bg-primary/5 p-3"
                >
                  <div className="relative">
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.user.username}</span>{' '}
                      {notification.content}
                    </p>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                  {notification.postImage && (
                    <img
                      src={notification.postImage}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  {notification.type === 'follow' && (
                    <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                      Follow
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Earlier */}
        {earlierNotifications.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Earlier</h2>
            <div className="space-y-1">
              {earlierNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (newNotifications.length + index) * 0.05 }}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                >
                  <div className="relative">
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.user.username}</span>{' '}
                      {notification.content}
                    </p>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                  {notification.postImage && (
                    <img
                      src={notification.postImage}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </MainLayout>
  );
}
