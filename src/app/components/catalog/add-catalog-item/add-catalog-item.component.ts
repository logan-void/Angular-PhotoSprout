import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { catalogService } from '../../../services/catalog.service';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-add-catalog-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-catalog-item.component.html',
  styleUrl: './add-catalog-item.component.css'
})
export class AddCatalogItemComponent {
  userForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private catalogService: catalogService
  ) {
    this.userForm = this.fb.group({
      imgName: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
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
  if (this.userForm.invalid || !this.selectedFile) return;

  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const userId = currentUser.uid;

    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      console.error('User document not found');
      return;
    }

    const userData = userSnap.data();
    const username = userData['username'] || 'anonymous';

    const filePath = `user_uploads/${userId}/catalog_items/${Date.now()}_${this.selectedFile.name}`;
    const imageUrl = await this.storageService.uploadFile(this.selectedFile, filePath);

    await this.catalogService.addCatalogItem({
      imgName: this.userForm.value.imgName,
      description: this.userForm.value.description,
      source: imageUrl,
      authorId: userId,
      authorUsername: username
    });

    this.router.navigate(['/catalog']);
  } catch (error) {
    console.error('Error submitting catalog item:', error);
  }
}
}