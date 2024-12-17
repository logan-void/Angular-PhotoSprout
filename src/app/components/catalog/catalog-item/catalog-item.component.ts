import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogItem } from '../../../types';

@Component({
  selector: 'app-catalog-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './catalog-item.component.html',
  styleUrl: './catalog-item.component.css'
})
export class CatalogItemComponent {
  @Input() item!: CatalogItem;
}
