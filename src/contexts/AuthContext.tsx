import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdAt: Date;
  isPrivate: boolean;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      
      if (user) {
        // Defer Firestore call to avoid deadlock
        setTimeout(() => {
          getDoc(doc(db, 'users', user.uid)).then((profileDoc) => {
            if (profileDoc.exists()) {
              setProfile({ uid: user.uid, ...profileDoc.data() } as UserProfile);
            }
          });
        }, 0);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, username: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const profileData = {
      name,
      username: username.toLowerCase(),
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      createdAt: serverTimestamp(),
      isPrivate: false,
      verified: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    };

    await setDoc(doc(db, 'users', user.uid), profileData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!profileDoc.exists()) {
      const username = user.email?.split('@')[0] || `user_${Date.now()}`;
      const profileData = {
        name: user.displayName || 'User',
        username: username.toLowerCase(),
        email: user.email,
        avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: '',
        createdAt: serverTimestamp(),
        isPrivate: false,
        verified: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      };
      
      await setDoc(doc(db, 'users', user.uid), profileData);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
