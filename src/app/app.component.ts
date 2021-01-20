import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ZamowieniaFrontend';
  newOrder: boolean = false;
  orders: boolean = false;

  actionNewOrder(){
    this.orders = false;
    this.newOrder = true;
  }
  actionOrders(){
    this.newOrder = false;
    this.orders = true;
  }
}
