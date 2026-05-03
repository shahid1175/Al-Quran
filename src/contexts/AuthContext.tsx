import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          // New user
          const newProfileData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            points: 0,
            level: 1,
            badges: [],
            settings: {
              font: 'madani',
              showTranslation: true,
              tafsirLanguage: 'bangla',
              reminderEnabled: true,
              reminderTime: '08:00'
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', user.uid), newProfileData);
          // Fetch the profile matching the state expectation
          const snap = await getDoc(doc(db, 'users', user.uid));
          setProfile(snap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the login popup.');
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const updatePoints = async (addedPoints: number) => {
    if (!user || !profile) return;
    const newPoints = profile.points + addedPoints;
    const newLevel = Math.floor(newPoints / 1000) + 1;
    
    const ts = serverTimestamp();

    // Update user profile
    await setDoc(doc(db, 'users', user.uid), {
      points: newPoints,
      level: newLevel,
      updatedAt: ts
    }, { merge: true });

    // Update leaderboard entry
    await setDoc(doc(db, 'leaderboard', user.uid), {
      userId: user.uid,
      displayName: profile.displayName || 'Servant of Allah',
      points: newPoints,
      updatedAt: ts
    });

    // Update local state
    setProfile({
      ...profile,
      points: newPoints,
      level: newLevel,
      updatedAt: new Date() // Approximate for local UI
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
