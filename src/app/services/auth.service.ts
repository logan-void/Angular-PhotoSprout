import { Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);

  constructor(private auth: Auth) {
      onAuthStateChanged(this.auth, (firebaseUser) => {
        if (firebaseUser) {
          this.user.set(this.mapFirebaseUser(firebaseUser));
        } else {
          this.user.set(null);
        }
      });
  }

  async register(email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
    return credentials.user;
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
