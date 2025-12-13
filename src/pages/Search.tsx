import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';

const mockExplore = [
  { id: '1', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400', type: 'image' },
  { id: '2', image: 'https://images.unsplash.com/photo-1682686578615-5c96e8f11f23?w=400', type: 'image' },
  { id: '3', image: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=400', type: 'image' },
  { id: '4', image: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400', type: 'image' },
  { id: '5', image: 'https://images.unsplash.com/photo-1682686580391-615b1e32b5f1?w=400', type: 'image' },
  { id: '6', image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400', type: 'image' },
  { id: '7', image: 'https://images.unsplash.com/photo-1682695794816-7b9da18ed470?w=400', type: 'image' },
  { id: '8', image: 'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=400', type: 'image' },
  { id: '9', image: 'https://images.unsplash.com/photo-1682695798522-6e208131916d?w=400', type: 'image' },
];

export default function SearchPage() {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-background/95 pb-4 backdrop-blur-xl">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Explore Grid */}
        <div className="grid grid-cols-3 gap-1">
          {mockExplore.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src={item.image}
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
