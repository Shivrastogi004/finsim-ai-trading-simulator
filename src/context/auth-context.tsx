
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

interface AuthUser extends User {
    firstName?: string;
    lastName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: () => {} });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Use onSnapshot for real-time updates
        const unsubDoc = onSnapshot(userDocRef, (doc) => {
             if (doc.exists()) {
                setUser({ ...firebaseUser, ...doc.data() } as AuthUser);
            } else {
                setUser(firebaseUser);
            }
            setLoading(false);
        });

        // Return the snapshot listener's unsubscribe function
        return () => unsubDoc();

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isWelcomePage = pathname === '/';
    const isDemoPage = pathname === '/demo';
    
    if (!user && !isAuthPage && !isWelcomePage && !isDemoPage) {
      router.push('/login');
    } else if (user && (isAuthPage || isWelcomePage || isDemoPage)) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const value = { user, loading, setUser };

  // While the user object is loading, we want to avoid rendering children
  // that might depend on it, especially on non-auth pages.
  const showLoader = loading && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && pathname !== '/';

  return (
    <AuthContext.Provider value={value}>
      {showLoader ? <div className="flex justify-center items-center h-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
