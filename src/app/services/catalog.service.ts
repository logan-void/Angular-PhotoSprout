import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';
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
          id: doc.id,
          title: data['imgName'],
          description: data['description'],
          image: data['source'],
          author: {
            id: data['authorId'],
            username: data['authorUsername']
          }
        };
      });

      return items;
    } catch (error) {
      console.error('Error fetching catalog items', error);
      return [];
    }
  }

  async fetchItemById(id: string): Promise<CatalogItem | null> {
    try {
      const itemDocRef = doc(this.db, 'catalogItems', id);
      const docSnap = await getDoc(itemDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          title: data['imgName'],
          description: data['description'],
          image: data['source'],
          author: {
            id: data['authorId'],
            username: data['authorUsername']
          }
        };
      } else {
        console.log(`Couldn't find document!`);
        return null;
      }
    } catch (error) {
      console.log('Error fetching catalog item by ID', error);
      return null;
    }
  }

  async addCatalogItem(data: {
    imgName: string;
    description: string;
    source: string;
    authorId: string;
    authorUsername: string;
  }): Promise<void> {
    try {
      await addDoc(this.catalogCollection, {
        imgName: data.imgName,
        description: data.description,
        source: data.source,
        authorId: data.authorId,
        authorUsername: data.authorUsername
      });
    } catch (error) {
      console.error('Error adding catalog item:', error);
      throw error;
    }
  }
}
