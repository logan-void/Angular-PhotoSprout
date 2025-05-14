import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FirebaseApp } from '@angular/fire/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  profileUser: User | null = null;
  isLoading = true;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private firebaseApp: FirebaseApp,
    private router: Router,
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      profilePicture: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const db = getFirestore(this.firebaseApp);
    const userId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.user();

    if (currentUser && userId !== currentUser.uid) {
      this.router.navigate(['/users', currentUser.uid, 'edit']);
    }

    if (userId) {
      this.fetchUserProfile(userId);
    } else {
      this.isLoading = false;
      const currentUser = this.authService.user();
      if (currentUser) {
        this.profileUser = currentUser;
        this.setFormValues();
      }
    }
  }

  private async fetchUserProfile(userId: string) {
    const db = getFirestore(this.firebaseApp);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      this.profileUser = userDoc.data() as User;
      this.setFormValues();
    } else {
      console.error('User not found');
    }
    this.isLoading = false;
  }

  private setFormValues() {
    if (this.profileUser) {
      this.userForm.patchValue({
        username: this.profileUser.username,
        email: this.profileUser.email,
        profilePicture: this.profileUser.profilePicture,
      });
    }
  }

  get isOwnProfile(): boolean {
    const loggedInUser = this.authService.user();
    return loggedInUser?.uid === this.profileUser?.uid;
  }


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}

async onSubmit() {
  if (this.userForm.invalid) return;

  try {
    const userId = this.profileUser?.uid;
    if (!userId) return;

    let profilePictureUrl = this.userForm.value.profilePicture;

    if (this.selectedFile) {
      profilePictureUrl = await this.storageService.uploadProfilePicture(this.selectedFile, userId);
    }

    const updatedUser = {
      username: this.userForm.value.username,
      profilePicture: profilePictureUrl,
    };

    const db = getFirestore(this.firebaseApp);
    await updateDoc(doc(db, 'users', userId), updatedUser);
    this.router.navigate([`/users/${userId}`]);

  } catch (error) {
    console.error('Error updating profile:', error);
  }
}
}