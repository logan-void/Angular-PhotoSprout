import { Injectable, signal } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  private db;

  constructor(private auth: Auth, firebaseApp: FirebaseApp) {
    this.db = getFirestore(firebaseApp);

    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          this.user.set(userDoc.data() as User);
        } else {
          this.user.set(this.mapFirebaseUser(firebaseUser));
        }
      } else {
        this.user.set(null);
      }
    });
  }

  async register(email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
    const firebaseUser = credentials.user;

    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName || '',
      profilePicture: firebaseUser.photoURL || 'default-avatar.jpg',
      createdAt: new Date(),
    };

    await setDoc(doc(this.db, 'users', newUser.uid), newUser);

    return firebaseUser;
  }

  async login(email: string, password: string) {
    const credentials = await signInWithEmailAndPassword(this.auth, email, password);
    return credentials.user;
  }

  async logout() {
    await signOut(this.auth);
    console.log('User logged out successfully');
    this.user.set(null);
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName || '',
      profilePicture: firebaseUser.photoURL || '',
      createdAt: new Date(),
    };
  }
}
