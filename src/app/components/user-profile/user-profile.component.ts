import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseApp } from '@angular/fire/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  routeParamsSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private firebaseApp: FirebaseApp
  ) {}

  ngOnInit() {
    this.listenToRouteChanges();
    this.fetchUserProfile();
  }

  ngOnDestroy() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  private listenToRouteChanges() {
    this.routeParamsSubscription = this.route.params.subscribe(() => {
      this.fetchUserProfile();
    });
  }

  private async fetchUserProfile() {
    const db = getFirestore(this.firebaseApp);
    const userId = this.route.snapshot.paramMap.get('id');
    this.isLoading.set(true);

    try {
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          this.profileUser.set(userDoc.data() as User);
        } else {
          this.profileUser.set(null);
        }
      } else {
        const currentUser = this.authService.user();
        if (currentUser) {
          this.profileUser.set(currentUser);
        } else {
          this.profileUser.set(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.profileUser.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  get isOwnProfile(): boolean {
    const loggedInUser = this.authService.user();
    const profile = this.profileUser();
    return loggedInUser?.uid === profile?.uid;
  }

  get loggedInUser() {
    return this.authService.user();
  }
}
