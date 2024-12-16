import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CatalogItem } from '../types';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class catalogService {
  private db;
  private catalogCollection;

  constructor(firebaseApp: FirebaseApp) {
    this.db = getFirestore(firebaseApp);
    this.catalogCollection = collection(this.db, 'catalogItems');
  }

  async fetchItems(): Promise<CatalogItem[]> {
    try {
      const querySnapshot = await getDocs(this.catalogCollection);
      const items: CatalogItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        console.log('Fetched catalog items', data);

        return {
          title: data['imgName'],
          image: data['source'],
        };
      });

      return items;
    } catch (error) {
      console.error('Error fetching catalog items', error);
      return [];
    }
  }
}
