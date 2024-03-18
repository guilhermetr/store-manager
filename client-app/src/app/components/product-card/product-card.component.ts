import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { MessageDisplayService } from 'src/app/services/message-display.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  
  @Input() product!: Product;

  constructor(
    private dialogRef: MatDialog, 
    private productService: ProductService,
    private messageDisplayService: MessageDisplayService,
  ) {}

  ngOnInit(): void {}

  openProductFormDialog(): void {
    this.dialogRef.open(ProductFormComponent, {
      width: '500px', 
      data: { product: this.product! },
    });
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Produto',
        message: `Tem certeza que deseja eliminar o produto "${this.product.name}"?`,        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {        
        this.productService.deleteProduct(this.product.id!).subscribe({
          next: () => {
            this.messageDisplayService.displayMessage('Produto desativado.');
          },
          error: (error) => {
            console.error('Error eliminating product:', error);
            this.messageDisplayService.displayMessage('Ocorreu um erro ao eliminar o produto. Por favor, tente novamente.');
          }
        });
      }
    });
  }

  openReactivateConfirmationDialog(): void {
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        title: 'Reativar Produto',
        message: `Tem certeza que deseja reativar o produto "${this.product.name}"?`,        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        var updatedProduct = {...this.product};
        updatedProduct.isActive = true;
        this.productService.updateProduct(updatedProduct).subscribe({
          next: () => {            
            this.messageDisplayService.displayMessage('Produto reativado!');
          },
          error: (error) => {
            console.error('Error reactivating product:', error);
            this.messageDisplayService.displayMessage('Ocorreu um erro ao reativar o produto. Por favor, tente novamente.');
          }
        });
      }
    });
  }

}
