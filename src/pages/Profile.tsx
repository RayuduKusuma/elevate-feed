import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Grid, Film, Bookmark, UserCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

const mockPosts = [
  { id: '1', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400' },
  { id: '2', image: 'https://images.unsplash.com/photo-1682686578615-5c96e8f11f23?w=400' },
  { id: '3', image: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=400' },
  { id: '4', image: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400' },
  { id: '5', image: 'https://images.unsplash.com/photo-1682686580391-615b1e32b5f1?w=400' },
  { id: '6', image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400' },
];

type TabType = 'posts' | 'reels' | 'saved';

export default function ProfilePage() {
  const { user, profile, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('posts');

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

  const tabs = [
    { id: 'posts' as TabType, icon: Grid, label: 'Posts' },
    { id: 'reels' as TabType, icon: Film, label: 'Reels' },
    { id: 'saved' as TabType, icon: Bookmark, label: 'Saved' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="story-ring h-fit">
              <img
                src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={profile?.name || 'Profile'}
                className="h-24 w-24 rounded-full object-cover lg:h-36 lg:w-36"
              />
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <h1 className="text-xl font-semibold">{profile?.username || 'username'}</h1>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Edit Profile
                </Button>
                <Button variant="secondary" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <span className="font-semibold">{profile?.postsCount || 0}</span>
                <p className="text-sm text-muted-foreground">posts</p>
              </div>
              <button className="text-center">
                <span className="font-semibold">{profile?.followersCount || 0}</span>
                <p className="text-sm text-muted-foreground">followers</p>
              </button>
              <button className="text-center">
                <span className="font-semibold">{profile?.followingCount || 0}</span>
                <p className="text-sm text-muted-foreground">following</p>
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <p className="font-semibold">{profile?.name || 'Your Name'}</p>
              <p className="text-sm text-muted-foreground">{profile?.bio || 'Add a bio to tell people about yourself'}</p>
            </div>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-destructive hover:text-destructive"
            >
              Log out
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-t border-border">
          <div className="flex justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 border-t-2 px-6 py-4 text-xs font-semibold uppercase tracking-wide transition-colors',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1">
          {mockPosts.map((post, index) => (
            <motion.button
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
}
