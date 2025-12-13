import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, MessageCircle, Heart, PlusSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Film, label: 'Reels', path: '/reels' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Heart, label: 'Notifications', path: '/notifications' },
  { icon: PlusSquare, label: 'Create', path: '/create' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[72px] flex-col border-r border-border bg-background px-3 py-6 lg:flex xl:w-[244px]">
      {/* Logo */}
      <Link to="/" className="mb-8 flex items-center px-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-gradient hidden text-2xl font-bold xl:block">Instagram</span>
          <span className="text-gradient block text-2xl font-bold xl:hidden">I</span>
        </motion.div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-4 rounded-xl px-3 py-3 transition-all duration-200',
                  isActive 
                    ? 'bg-secondary font-semibold' 
                    : 'hover:bg-secondary/60'
                )}
              >
                <Icon 
                  className={cn(
                    'h-6 w-6 transition-all',
                    isActive && 'scale-110'
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="hidden xl:block">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar */}
      {profile && (
        <Link to="/profile" className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/60"
          >
            <div className="avatar-ring">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-medium">{profile.name}</p>
              <p className="text-xs text-muted-foreground">@{profile.username}</p>
            </div>
          </motion.div>
        </Link>
      )}
    </aside>
  );
}

export function MobileNav() {
  const location = useLocation();

  const mobileNavItems = [
    { icon: Home, path: '/' },
    { icon: Search, path: '/search' },
    { icon: PlusSquare, path: '/create' },
    { icon: Film, path: '/reels' },
    { icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={cn(
                'rounded-xl p-2 transition-colors',
                isActive && 'text-primary'
              )}
            >
              <Icon 
                className="h-6 w-6" 
                strokeWidth={isActive ? 2.5 : 2}
              />
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
