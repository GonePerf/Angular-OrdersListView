import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Contractor, Order } from '../api.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  contractor_id: number = 0;
  orders: Observable<Order[]>;
  contractors: Observable<Contractor[]>;
  lastestValueContractors: Contractor[];
  lastestValueOrders: Order[];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.contractors = this.api.getContractors();
    this.orders = this.api.getOrders();
    this.contractors.subscribe(value => this.lastestValueContractors = value);
    this.orders.subscribe(value => this.lastestValueOrders = value);

  }

  saveOrder(){
    let order = new Order;
    order.id_kontrahenta = this.contractor_id;
    order.nr_zamowienia = this.lastestValueOrders.length + 1;
    console.log(order.nr_zamowienia)
    order.status_zamowienia = 'W realizacji';
    order.wartosc_zamowienia = 0;
    return this.api.newOrder(order).subscribe(
      () => alert('Dodano pomyślnie'),
      err => console.log('error:', err), 
    );
  }

  

}
