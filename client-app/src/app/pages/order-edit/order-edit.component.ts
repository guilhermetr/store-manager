import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderFormComponent } from 'src/app/components/order-form/order-form.component';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent {

  orders!: Order[];

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orderService.orders$.subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  openOrderFormDialog(): void {
    this.dialog.open(OrderFormComponent, {
      width: '500px', 
    });
  }

}
