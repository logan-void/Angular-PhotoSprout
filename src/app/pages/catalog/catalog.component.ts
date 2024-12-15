import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CatalogItemComponent } from '../../components/catalog-item/catalog-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CatalogItemComponent, CommonModule],
  providers: [FirebaseService],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  items: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      const fetchedItems = await this.firebaseService.fetchItems();
      
      console.log("Fetched items:", fetchedItems);
      
      this.items = fetchedItems;

      console.log("Items array:", this.items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }
}
