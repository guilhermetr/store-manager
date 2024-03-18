import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { MessageDisplayService } from 'src/app/services/message-display.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

  @Input() product!: Product;  
  isEditForm!: boolean;

  constructor(
    private productService: ProductService, 
    private messageDisplayService: MessageDisplayService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {    
    this.isEditForm = this.data?.product != undefined;
    if (this.isEditForm) {
      this.product = { ...this.data.product };
    } else {
      this.product = { id: 0, name: '', isActive: true };
    }
  }

  onSubmit(): void {
    if (this.isEditForm)
      this.updateProduct();
    else
      this.addProduct();    
  }

  private updateProduct(): void {
    this.productService.updateProduct(this.product).subscribe({
      next: () => {
        this.messageDisplayService.displayMessage('Produto atualizado com sucesso!');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.messageDisplayService.displayMessage('Ocorreu um erro ao atualizar o produto. Por favor, tente novamente.');
      }
    });
  }

  private addProduct(): void {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.messageDisplayService.displayMessage('Produto criado com sucesso!');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.messageDisplayService.displayMessage('Ocorreu um erro ao criar o produto. Por favor, tente novamente.');
      }
    });
  }

}
