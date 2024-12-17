import { Component, OnInit } from '@angular/core';
import { CatalogItem } from '../../../../types';
import { ActivatedRoute } from '@angular/router';
import { catalogService } from '../../../../services/catalog.service';

@Component({
  selector: 'app-catalog-item-details',
  standalone: true,
  imports: [],
  templateUrl: './catalog-item-details.component.html',
  styleUrl: './catalog-item-details.component.css'
})
export class CatalogItemDetailsComponent implements OnInit{
  item: CatalogItem | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private catalogService: catalogService) {}

  ngOnInit(): void {
      this.fetchItem();
  }


  fetchItem(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.catalogService.fetchItemById(id).then((item) => {
        this.item = item;
        this.isLoading = false;
      }).catch((error) => {
        console.log('Error fetching item details', error);
        this.error = 'Failed to load item details';
        this.isLoading = false;
      })
    } else {
      this.error = 'Invalid item ID';
      this.isLoading = false;
    }
  }
}
