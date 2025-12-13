import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed?: boolean;
}

interface StoriesBarProps {
  stories: Story[];
  onStoryClick?: (storyId: string) => void;
}

export function StoriesBar({ stories, onStoryClick }: StoriesBarProps) {
  return (
    <div className="mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-1 py-2">
        {/* Your Story */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-secondary" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              +
            </div>
          </div>
          <span className="text-xs">Your story</span>
        </motion.button>

        {/* Other Stories */}
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStoryClick?.(story.id)}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              'p-[3px] rounded-full',
              story.hasStory && !story.isViewed
                ? 'bg-gradient-to-br from-primary to-[hsl(340,75%,55%)]'
                : story.hasStory && story.isViewed
                ? 'bg-muted'
                : 'bg-transparent'
            )}>
              <div className="rounded-full bg-background p-[2px]">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="max-w-[64px] truncate text-xs">
              {story.username}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

