import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Music, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const mockReels = [
  {
    id: '1',
    userId: 'user1',
    username: 'sarah_design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
    caption: 'Living my best life ✨ #travel #adventure',
    likesCount: 12400,
    commentsCount: 234,
    audioName: 'Original Audio',
  },
  {
    id: '2',
    userId: 'user2',
    username: 'john.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1682686578615-5c96e8f11f23?w=600',
    caption: 'Coding at sunrise 💻',
    likesCount: 8920,
    commentsCount: 156,
    audioName: 'Lo-Fi Beats',
  },
  {
    id: '3',
    userId: 'user3',
    username: 'emma_photo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=600',
    caption: 'Nature always wins 🌿',
    likesCount: 21560,
    commentsCount: 412,
    audioName: 'Ambient Sounds',
  },
];

export default function ReelsPage() {
  const { user, loading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const handleLike = (reelId: string) => {
    setLikedReels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setCurrentIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-foreground lg:left-[72px] xl:left-[244px]">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide"
      >
        {mockReels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative h-full w-full snap-start"
          >
            {/* Background Image (simulating video) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${reel.mediaUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/60" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex">
              {/* Left Side - Caption */}
              <div className="flex flex-1 flex-col justify-end p-4 pb-20 lg:pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-[70%] space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={reel.avatar}
                      alt={reel.username}
                      className="h-10 w-10 rounded-full border-2 border-background object-cover"
                    />
                    <span className="font-semibold text-background">
                      {reel.username}
                    </span>
                  </div>
                  <p className="text-sm text-background/90">{reel.caption}</p>
                  <div className="flex items-center gap-2 text-xs text-background/70">
                    <Music className="h-3 w-3" />
                    <span>{reel.audioName}</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex flex-col items-center justify-end gap-6 p-4 pb-20 lg:pb-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(reel.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="rounded-full bg-background/20 p-3 backdrop-blur-sm">
                    <Heart
                      className={cn(
                        'h-7 w-7 text-background transition-all',
                        likedReels.has(reel.id) && 'fill-destructive text-destructive'
                      )}
                    />
                  </div>
                  <span className="text-xs font-medium text-background">
                    {(reel.likesCount + (likedReels.has(reel.id) ? 1 : 0)).toLocaleString()}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="rounded-full bg-background/20 p-3 backdrop-blur-sm">
                    <MessageCircle className="h-7 w-7 text-background" />
                  </div>
                  <span className="text-xs font-medium text-background">
                    {reel.commentsCount.toLocaleString()}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="rounded-full bg-background/20 p-3 backdrop-blur-sm">
                    <Send className="h-7 w-7 text-background" />
                  </div>
                  <span className="text-xs font-medium text-background">Share</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full bg-background/20 p-3 backdrop-blur-sm"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-background" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-background" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-1 lg:flex">
        {mockReels.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 w-1 rounded-full transition-all',
              index === currentIndex ? 'h-4 bg-background' : 'bg-background/40'
            )}
          />
        ))}
      </div>
    </div>
  );
}
