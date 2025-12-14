import { useState, useRef, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Music, Volume2, VolumeX, ArrowLeft, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const mockReels = [
  {
    id: '1',
    userId: 'user1',
    username: 'sarah_design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
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
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1682686578615-5c96e8f11f23?w=600',
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
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=600',
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Play current video, pause others
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex && isPlaying) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
        video.muted = isMuted;
      }
    });
  }, [currentIndex, isMuted, isPlaying]);

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
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Top Bar with Back Button */}
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
        <Link to="/">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        </Link>
        <span className="text-lg font-semibold text-white">Reels</span>
        <div className="w-20" />
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full snap-y snap-mandatory overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockReels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative flex h-full w-full snap-start items-center justify-center"
          >
            {/* Reel Container */}
            <div className="relative h-full w-full max-w-[500px]">
              {/* Video Player */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.mediaUrl}
                poster={reel.thumbnail}
                loop
                playsInline
                muted={isMuted}
                onClick={togglePlayPause}
                className="absolute inset-0 h-full w-full cursor-pointer object-cover"
              />
              
              {/* Play/Pause Overlay */}
              {!isPlaying && index === currentIndex && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="rounded-full bg-black/50 p-4">
                    <Play className="h-12 w-12 text-white" fill="white" />
                  </div>
                </motion.div>
              )}

              {/* Gradient Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex">
                {/* Left Side - Caption */}
                <div className="flex flex-1 flex-col justify-end p-4 pb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-[75%] space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={reel.avatar}
                        alt={reel.username}
                        className="h-10 w-10 rounded-full border-2 border-white object-cover"
                      />
                      <span className="font-semibold text-white">
                        {reel.username}
                      </span>
                      <button className="rounded-lg border border-white/50 px-3 py-1 text-xs font-medium text-white hover:bg-white/10">
                        Follow
                      </button>
                    </div>
                    <p className="text-sm text-white/90">{reel.caption}</p>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Music className="h-3 w-3" />
                      <span className="truncate">{reel.audioName}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex flex-col items-center justify-end gap-5 p-4 pb-8">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
                      <Heart
                        className={cn(
                          'h-7 w-7 text-white transition-all',
                          likedReels.has(reel.id) && 'fill-red-500 text-red-500'
                        )}
                      />
                    </div>
                    <span className="text-xs font-medium text-white">
                      {(reel.likesCount + (likedReels.has(reel.id) ? 1 : 0)).toLocaleString()}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
                      <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">
                      {reel.commentsCount.toLocaleString()}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
                      <Send className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">Share</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full bg-black/30 p-3 backdrop-blur-sm"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </motion.button>

                  {/* User Avatar */}
                  <div className="relative">
                    <img
                      src={reel.avatar}
                      alt={reel.username}
                      className="h-12 w-12 rounded-lg border-2 border-white object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        {mockReels.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all duration-300',
              index === currentIndex ? 'h-6 bg-white' : 'h-1 bg-white/40'
            )}
          />
        ))}
      </div>
    </div>
  );
}
