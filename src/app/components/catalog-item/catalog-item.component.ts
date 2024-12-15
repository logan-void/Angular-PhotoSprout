import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-item',
  standalone: true,
  imports: [],
  templateUrl: './catalog-item.component.html',
  styleUrl: './catalog-item.component.css'
})
export class CatalogItemComponent {
  @Input() item: any;
}
