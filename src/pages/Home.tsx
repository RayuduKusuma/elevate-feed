import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PostCard } from '@/components/feed/PostCard';
import { StoriesBar } from '@/components/feed/StoriesBar';

// Mock data for demo
const mockStories = [
  { id: '1', username: 'sarah_design', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', hasStory: true },
  { id: '2', username: 'john.dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', hasStory: true },
  { id: '3', username: 'emma_photo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', hasStory: true, isViewed: true },
  { id: '4', username: 'alex_travel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', hasStory: true },
  { id: '5', username: 'lisa.art', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', hasStory: true },
  { id: '6', username: 'mike_music', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', hasStory: false },
];

const mockPosts = [
  {
    id: '1',
    userId: 'user1',
    username: 'sarah_design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    caption: 'Exploring the beautiful architecture of this city. Every corner tells a story ✨',
    media: [{ mediaUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600', type: 'image' }],
    likesCount: 1243,
    commentsCount: 45,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    userId: 'user2',
    username: 'john.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    caption: 'New setup, new vibes 💻 Ready to build something amazing',
    media: [{ mediaUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', type: 'image' }],
    likesCount: 892,
    commentsCount: 23,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    userId: 'user3',
    username: 'emma_photo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    caption: 'Golden hour magic at its finest 🌅',
    media: [{ mediaUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600', type: 'image' }],
    likesCount: 2156,
    commentsCount: 78,
    createdAt: new Date(Date.now() - 14400000),
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState(mockPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Stories */}
        <StoriesBar stories={mockStories} />

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* Load More Indicator */}
        {loadingPosts && (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
            />
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
