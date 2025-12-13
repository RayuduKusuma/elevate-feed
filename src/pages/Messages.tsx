import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';

const mockConversations = [
  {
    id: '1',
    user: {
      username: 'sarah_design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    lastMessage: 'That sounds amazing! Let me know when you\'re free',
    timestamp: '2m',
    unread: true,
  },
  {
    id: '2',
    user: {
      username: 'john.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    lastMessage: 'Check out this new project I\'m working on',
    timestamp: '15m',
    unread: false,
  },
  {
    id: '3',
    user: {
      username: 'emma_photo',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    lastMessage: 'The photos turned out great!',
    timestamp: '1h',
    unread: false,
  },
  {
    id: '4',
    user: {
      username: 'alex_travel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    lastMessage: 'Can\'t wait for our next adventure 🌍',
    timestamp: '3h',
    unread: true,
  },
];

export default function MessagesPage() {
  const { user, loading, profile } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{profile?.username || 'Messages'}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="action-icon"
          >
            <Edit className="h-5 w-5" />
          </motion.button>
        </header>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search messages"
            className="pl-11"
          />
        </div>

        {/* Conversations */}
        <div className="space-y-1">
          {mockConversations.map((conversation, index) => (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors"
            >
              <div className="relative">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.username}
                  className="h-14 w-14 rounded-full object-cover"
                />
                {conversation.unread && (
                  <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {conversation.user.username}
                  </p>
                  <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                </div>
                <p className={`truncate text-sm ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
}
