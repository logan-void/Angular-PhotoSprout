import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../environments/environment';

interface CatalogItem {
  title: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db;
  private catalogCollection;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
    this.catalogCollection = collection(this.db, 'catalogItems');
  }

  async fetchItems(): Promise<CatalogItem[]> {
    try {
      const querySnapshot = await getDocs(this.catalogCollection);
      const items: CatalogItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        console.log('Fetched document data:', data);

        return {
          title: data['imgName'],
          image: data['source'],
        };
      });

      return items;
    } catch (error) {
      console.error('Error fetching documents: ', error);
      return [];
    }
  }
}
