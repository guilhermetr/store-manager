import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from 'src/app/components/product-form/product-form.component';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit{

  products!: Product[];

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  openProductFormDialog(): void {
    this.dialog.open(ProductFormComponent, {
      width: '500px', 
    });
  }

}
