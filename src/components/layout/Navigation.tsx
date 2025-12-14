import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, MessageCircle, PlusSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Film, label: 'Reels', path: '/reels' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
];

export function TopNav() {
  const location = useLocation();
  const { user, profile } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-gradient text-2xl font-bold">Instagram</span>
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200',
                    isActive
                      ? 'bg-secondary font-semibold'
                      : 'hover:bg-secondary/60'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5 transition-all', isActive && 'scale-110')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/create">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <PlusSquare className="h-6 w-6" />
                </motion.div>
              </Link>
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="avatar-ring"
                >
                  <img
                    src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </motion.div>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
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
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
