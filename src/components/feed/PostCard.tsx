import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    caption: string;
    media: { mediaUrl: string; type: string }[];
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    isLiked?: boolean;
    isSaved?: boolean;
  };
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export function PostCard({ post, onLike, onSave }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showHeart, setShowHeart] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      onLike?.(post.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post.id);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="elevated-card mb-4 overflow-hidden rounded-2xl"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <img
              src={post.avatar}
              alt={post.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{post.username}</p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="action-icon"
        >
          <MoreHorizontal className="h-5 w-5" />
        </motion.button>
      </header>

      {/* Media */}
      <div
        className="relative aspect-square cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.media[currentMediaIndex].mediaUrl}
          alt="Post"
          className="h-full w-full object-cover"
        />
        
        {/* Double tap heart animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className="h-24 w-24 fill-primary-foreground text-primary-foreground drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel dots */}
        {post.media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {post.media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-all',
                  index === currentMediaIndex 
                    ? 'w-4 bg-primary-foreground' 
                    : 'bg-primary-foreground/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className="action-icon"
          >
            <Heart
              className={cn(
                'h-6 w-6 transition-colors',
                isLiked && 'fill-destructive text-destructive animate-heart-pop'
              )}
            />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="action-icon">
            <MessageCircle className="h-6 w-6" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="action-icon">
            <Send className="h-6 w-6" />
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="action-icon"
        >
          <Bookmark
            className={cn(
              'h-6 w-6 transition-colors',
              isSaved && 'fill-foreground'
            )}
          />
        </motion.button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-4">
        <motion.p
          key={likesCount}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-sm font-semibold"
        >
          {likesCount.toLocaleString()} likes
        </motion.p>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{post.username}</span>{' '}
          <span className="text-foreground/90">{post.caption}</span>
        </p>
        {post.commentsCount > 0 && (
          <button className="mt-1 text-sm text-muted-foreground">
            View all {post.commentsCount} comments
          </button>
        )}
      </div>
    </motion.article>
  );
}
