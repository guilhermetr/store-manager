import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, OrderItem, OrderStatus } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Provider } from 'src/app/models/provider.model';
import { MessageDisplayService } from 'src/app/services/message-display.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {

  @Input() order!: Order;  
  isEditForm!: boolean;
  providers!: Provider[];
  availableProducts!: Product[];

  constructor(
    private orderService: OrderService,
    private providerService: ProviderService,
    private productService: ProductService,
    private messageDisplayService: MessageDisplayService,
    private dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {    
    this.isEditForm = this.data?.order != undefined;
    if (this.isEditForm) {
      this.order = {
        ...this.data.order,
        orderItems: this.data.order.orderItems.map((orderItem: OrderItem) => ({ ...orderItem })) // Create a copy
    };
    } else {
      this.order = { orderItems: [{}], comments: '', status: OrderStatus.Active };
    }

    this.providers = this.providerService.getProviders();
    this.availableProducts = this.productService.getProducts();
  }

  onAddOrderItem(): void {
    this.order.orderItems.push({});
  }

  onRemoveOrderItem(index: number): void {
    this.order.orderItems.splice(index, 1);
  }

  getOrderTotal(): number {
    return this.order.orderItems
     .map((orderItem) => orderItem.productId && orderItem.quantity ? this.productService.getProduct(orderItem.productId)!.price! * orderItem.quantity! : 0)
     .reduce((prev, current) => prev + current, 0);
  }

  onSubmit(): void {
    if (this.isEditForm)
      this.updateOrder();
    else
      this.addOrder();    
  }

  private updateOrder(): void {
    this.orderService.updateOrder(this.order).subscribe({
      next: () => {
        this.messageDisplayService.displayMessage('Pedido atualizado com sucesso!');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error updating order:', error);
        this.messageDisplayService.displayMessage('Ocorreu um erro ao atualizar o pedido. Por favor, tente novamente.');
      }
    });
  }

  private addOrder(): void {
    this.orderService.addOrder(this.order).subscribe({
      next: () => {
        this.messageDisplayService.displayMessage('Pedido criado com sucesso!');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error adding order:', error);
        this.messageDisplayService.displayMessage('Ocorreu um erro ao criar o pedido. Por favor, tente novamente.');
      }
    });
  }

}
