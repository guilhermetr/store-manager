import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order, OrderItem, OrderStatus } from 'src/app/models/order.model';
import { MessageDisplayService } from 'src/app/services/message-display.service';
import { OrderService } from 'src/app/services/order.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrderFormComponent } from '../order-form/order-form.component';
import { ProviderService } from 'src/app/services/provider.service';
import { Provider } from 'src/app/models/provider.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {
  
  @Input() order!: Order;
  provider!: Provider;

  constructor(
    private dialogRef: MatDialog, 
    private orderService: OrderService,
    private productService: ProductService,
    private providerService: ProviderService,
    private messageDisplayService: MessageDisplayService,
  ) {}

  ngOnInit(): void {
    this.provider = this.providerService.getProvider(this.order.providerId!)!;
  }

  isOrderActive(): boolean {
    var test = OrderStatus.Active.valueOf();
    return this.order.status == OrderStatus.Active.valueOf();
  }

  getProduct(id: number): Product {
    return this.productService.getProduct(id)!;
  }

  getOrderTotal(): number {
    return this.order.orderItems
     .map((orderItem) => {
        var product = this.productService.getProduct(orderItem.productId!)
        return product && orderItem.quantity ? product.price! * orderItem.quantity! : 0
      })
     .reduce((prev, current) => prev + current, 0);
  }


  openOrderFormDialog(): void {
    this.dialogRef.open(OrderFormComponent, {
      width: '500px', 
      data: { order: this.order! },
    });
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Pedido',
        message: `Tem certeza que deseja eliminar este pedido?`,        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {        
        this.orderService.deleteOrder(this.order.id!).subscribe({
          next: () => {
            this.messageDisplayService.displayMessage('Pedido eliminado.');
          },
          error: (error) => {
            console.error('Error eliminating order:', error);
            this.messageDisplayService.displayMessage('Ocorreu um erro ao eliminar o pedido. Por favor, tente novamente.');
          }
        });
      }
    });
  }

  openReactivateConfirmationDialog(): void {
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        title: 'Reativar Pedido',
        message: `Tem certeza que deseja reativar este pedido?`,        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        var updatedOrder = {...this.order};
        updatedOrder.status = OrderStatus.Active;
        this.orderService.updateOrder(updatedOrder).subscribe({
          next: () => {            
            this.messageDisplayService.displayMessage('Pedido reativado!');
          },
          error: (error) => {
            console.error('Error reactivating order:', error);
            this.messageDisplayService.displayMessage('Ocorreu um erro ao reativar o pedido. Por favor, tente novamente.');
          }
        });
      }
    });
  }

  openFinishConfirmationDialog(): void {
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        title: 'Finalizar Pedido',
        message: `Tem certeza que deseja finalizar este pedido?`,        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        var updatedOrder = {...this.order};
        updatedOrder.status = OrderStatus.Finished;
        this.orderService.updateOrder(updatedOrder).subscribe({
          next: () => {            
            this.messageDisplayService.displayMessage('Pedido finalizado.');
          },
          error: (error) => {
            console.error('Error finishing order:', error);
            this.messageDisplayService.displayMessage('Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.');
          }
        });
      }
    });
  }

}
