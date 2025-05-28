'use client';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
  type User,
  type Auth as FirebaseAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  applyActionCode,
  checkActionCode,
  reload,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  collection,
  type Firestore 
} from 'firebase/firestore';
import { auth, db } from './config';
import { FirebaseError } from 'firebase/app';

export interface UserData {
  name: string;
  email: string;
  company: string;
  createdAt: string;
  emailVerified?: boolean;
  verifiedAt?: string;
  lastPasswordChange?: string;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const getAuthInstance = (): FirebaseAuth => {
  if (!auth) throw new AuthError('Firebase auth not initialized');
  return auth;
};

const getDbInstance = (): Firestore => {
  if (!db) throw new AuthError('Firestore not initialized');
  return db;
};

export const signUp = async (
  email: string,
  password: string,
  userData: { name: string; company: string }
): Promise<UserCredential> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

    // Send verification email
    await sendEmailVerification(userCredential.user);

    // Store user data in Firestore with verification status
    await setDoc(doc(dbInstance, 'users', userCredential.user.uid), {
      name: userData.name,
      email: email,
      company: userData.company,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      verificationSentAt: new Date().toISOString()
    });

    return userCredential;
  } catch (error) {
    console.error('Error with sign up:', error);
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to sign up',
      error instanceof Error && 'code' in error ? String(error.code) : undefined
    );
  }
};

export const signIn = async (email: string, password: string): Promise<{ userCredential: UserCredential; userData: UserData }> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // Instead of sending a new verification email, just throw an error
      // This prevents triggering Firebase's rate limiting
      throw new AuthError('Please verify your email before logging in. You can request a new verification email on the verify-email page.');
    }

    // Get user data from Firestore
    const userDoc = await getDoc(doc(dbInstance, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new AuthError('User data not found. Please contact support.');
    }

    const userData = userDoc.data() as UserData;

    return { userCredential, userData };
  } catch (error) {
    console.error('Error with sign in:', error);
    
    // Handle specific Firebase auth errors
    if (error instanceof Error && 'code' in error) {
      const code = String(error.code);
      switch (code) {
        case 'auth/too-many-requests':
          throw new AuthError('Too many login attempts. Please try again later or reset your password.');
        case 'auth/user-not-found':
          throw new AuthError('No account found with this email address.');
        case 'auth/wrong-password':
          throw new AuthError('Incorrect password. Please try again.');
        case 'auth/invalid-email':
          throw new AuthError('Invalid email address.');
        case 'auth/user-disabled':
          throw new AuthError('This account has been disabled. Please contact support.');
        default:
          throw new AuthError(
            error instanceof Error ? error.message : 'Failed to sign in',
            code
          );
      }
    }
    
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to sign in'
    );
  }
};

export const logOut = async (): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
  } catch (error) {
    console.error('Error signing out:', error);
    if (error instanceof AuthError) throw error;
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to sign out',
      error instanceof Error && 'code' in error ? String(error.code) : undefined
    );
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const dbInstance = getDbInstance();
    const userDoc = await getDoc(doc(dbInstance, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    if (error instanceof AuthError) throw error;
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to get user data',
      error instanceof Error && 'code' in error ? String(error.code) : undefined
    );
  }
};

export async function updatePassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No user is currently signed in");
  }

  try {
    // Reauthenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await firebaseUpdatePassword(user, newPassword);

    // Store password change timestamp in Firestore
    const dbInstance = getDbInstance();
    await setDoc(doc(dbInstance, 'users', user.uid), {
      lastPasswordChange: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/wrong-password':
          throw new Error('Current password is incorrect');
        case 'auth/requires-recent-login':
          throw new Error('Please log in again before changing your password');
        default:
          throw new Error('Failed to update password. Please try again.');
      }
    }
    throw error;
  }
}

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await sendPasswordResetEmail(authInstance, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    if (error instanceof AuthError) throw error;
    
    // Handle specific Firebase auth errors
    if (error instanceof Error && 'code' in error) {
      const code = String(error.code);
      switch (code) {
        case 'auth/user-not-found':
          throw new AuthError('No account found with this email address.');
        case 'auth/invalid-email':
          throw new AuthError('Invalid email address.');
        case 'auth/too-many-requests':
          throw new AuthError('Too many attempts. Please try again later.');
        default:
          throw new AuthError(
            error instanceof Error ? error.message : 'Failed to send password reset email',
            code
          );
      }
    }
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to send password reset email'
    );
  }
};

export const sendEmailVerification = async (user: User): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    if (!user) {
      throw new AuthError('No user is currently signed in');
    }
    await firebaseSendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to send verification email'
    );
  }
};

export const forceRefreshUser = async (user: User): Promise<void> => {
  try {
    await reload(user);
  } catch (error) {
    console.error('Error refreshing user:', error);
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to refresh user state'
    );
  }
};

export const verifyEmail = async (actionCode: string): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    
    // First check the action code to get the email
    const info = await checkActionCode(authInstance, actionCode);
    const email = info.data.email;
    
    if (!email) {
      throw new AuthError('Could not verify email: No email found in verification code');
    }
    
    // Apply the action code
    await applyActionCode(authInstance, actionCode);
    
    // Get the user by email since they might not be logged in
    const userQuery = await getDocs(query(collection(dbInstance, 'users'), where('email', '==', email)));
    if (userQuery.empty) {
      throw new AuthError('Could not find user account');
    }
    
    const userId = userQuery.docs[0].id;
    
    // Add retry mechanism for Firestore update
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // Update emailVerified status in Firestore
        await setDoc(doc(dbInstance, 'users', userId), {
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        }, { merge: true });
        
        // If successful, break the retry loop
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          throw error; // Throw error if all retries failed
        }
        // Wait for a short time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // If user is logged in, refresh their state
    const currentUser = authInstance.currentUser;
    if (currentUser && currentUser.email === email) {
      await forceRefreshUser(currentUser);
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to verify email'
    );
  }
};

export const checkVerificationCode = async (actionCode: string): Promise<boolean> => {
  try {
    const authInstance = getAuthInstance();
    await checkActionCode(authInstance, actionCode);
    return true;
  } catch (error) {
    console.error('Error checking verification code:', error);
    return false;
  }
};

// Add a new type for the sign-in mode
export type GoogleSignInMode = 'signup' | 'login';

export const signInWithGoogle = async (mode: GoogleSignInMode): Promise<{ userCredential: UserCredential; userData: UserData }> => {
  try {
    const authInstance = getAuthInstance();
    const dbInstance = getDbInstance();
    const provider = new GoogleAuthProvider();

    // Sign in with Google
    const userCredential = await signInWithPopup(authInstance, provider);
    const user = userCredential.user;

    if (!user.email) {
      throw new AuthError('No email provided by Google account');
    }

    // Check if a user with this email already exists in Firestore
    const userQuery = await getDocs(query(collection(dbInstance, 'users'), where('email', '==', user.email)));
    const userExists = !userQuery.empty;

    // Handle different behaviors based on mode
    if (mode === 'signup' && userExists) {
      // If trying to sign up but account exists, delete the new auth and throw error
      await user.delete();
      throw new AuthError('ACCOUNT_EXISTS', 'An account with this email already exists. Please sign in instead.');
    }

    if (mode === 'login' && !userExists) {
      // If trying to login but no account exists, delete the new auth and throw error
      await user.delete();
      throw new AuthError('NO_ACCOUNT', 'No account found with this email. Please create an account first.');
    }

    if (userExists) {
      // User exists, get their data
      const existingUserDoc = userQuery.docs[0];
      const userData = existingUserDoc.data() as UserData;

      // If the existing user was created with email/password, we should link the accounts
      if (existingUserDoc.id !== user.uid) {
        // Delete the new Google account since we'll use the existing one
        await user.delete();
        
        // Sign in with the existing account
        const existingUser = await getDoc(doc(dbInstance, 'users', existingUserDoc.id));
        if (!existingUser.exists()) {
          throw new AuthError('Account exists but data not found. Please contact support.');
        }

        // Return the existing user data
        return {
          userCredential: {
            user: {
              ...user,
              uid: existingUserDoc.id,
            },
          } as UserCredential,
          userData: existingUser.data() as UserData,
        };
      }

      // If it's the same user ID, just return the existing data
      return { userCredential, userData };
    }

    // For new users in signup mode, create user data
    try {
      const userData: UserData = {
        name: user.displayName || 'Google User',
        email: user.email,
        company: 'Not Specified',
        createdAt: new Date().toISOString(),
        emailVerified: true, // Google accounts are pre-verified
        verifiedAt: new Date().toISOString()
      };

      // Create the user document in Firestore
      await setDoc(doc(dbInstance, 'users', user.uid), userData);
      
      // Return the new user data
      return { userCredential, userData };
    } catch (createError) {
      // If we fail to create the user data, delete the auth account
      await user.delete();
      throw new AuthError('Failed to create user account. Please try again.');
    }
  } catch (error) {
    console.error('Error with Google sign in:', error);
    
    // Handle specific Firebase auth errors
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          throw new AuthError('An account already exists with this email. Please sign in with your original method.');
        case 'auth/popup-closed-by-user':
          throw new AuthError('Sign-in was cancelled. Please try again.');
        case 'auth/popup-blocked':
          throw new AuthError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
        case 'auth/cancelled-popup-request':
          throw new AuthError('Sign-in was cancelled. Please try again.');
        case 'auth/network-request-failed':
          throw new AuthError('Network error. Please check your internet connection and try again.');
        case 'auth/too-many-requests':
          throw new AuthError('Too many attempts. Please try again later.');
        default:
          throw new AuthError(
            error.message || 'Failed to sign in with Google',
            error.code
          );
      }
    }
    
    // Handle our custom errors
    if (error instanceof AuthError) {
      if (error.code === 'ACCOUNT_EXISTS' || error.code === 'NO_ACCOUNT') {
        throw error; // Pass through our custom errors
      }
    }
    
    throw new AuthError(
      error instanceof Error ? error.message : 'Failed to sign in with Google'
    );
  }
}; 