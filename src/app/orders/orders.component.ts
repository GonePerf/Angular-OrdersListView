import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Contractor, Order, Order_Pos, Product } from '../api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Observable<Order[]>;
  orders_pos: Observable<Order_Pos[]>;
  lastestValueOrderPos: Order_Pos[];
  lastestValueOrder: Order[];
  lastestValueProducts: Product[];
  lastestValueContractors: Contractor[];
  products: Observable<Product[]>;
  contractors: Observable<Contractor[]>;
  products_for_contractor: Observable<Product[]>;
  lastestProducts_for_contractor: Product[];
  orderId: number;
  delete: boolean = false;
  order_pos: boolean = false;
  product_id: number;
  ilosc: number;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.orders = this.api.getOrders();
    this.products = this.api.getProducts();
    this.contractors = this.api.getContractors();
    this.orders_pos = this.api.getOrders_Pos();
    this.orders_pos.subscribe(value => this.lastestValueOrderPos = value);
    this.orders.subscribe(value => this.lastestValueOrder = value);
    this.contractors.subscribe(value => this.lastestValueContractors = value);
    this.products.subscribe(value => this.lastestValueProducts = value);
  }
  actionDelete(id){
    this.orderId = id;
    this.delete = !this.delete;
  }
  addOrderPos(id){
    this.orderId = id;
    this.order_pos = !this.order_pos;
  }
  deleteOrder(order: Order){
    let r = confirm("Jesteś pewny?");
    if (r == true) {
      if(!this.isOrderPos(order.id)){
        return this.api.deleteOrder(order.id).subscribe(
          () => {
            alert('Usunięto pomyślnie');
            this.ngOnInit();
          },
          err => console.log('error:', err), 
        );
      }
      else{
        alert('Najpierw usuń pozycje!');
      } 
    } 
  }


  getProductName(id){
    for(let i = 0; i < this.lastestValueProducts.length; i++){
      if(this.lastestValueProducts[i].id == id){
        return this.lastestValueProducts[i].nazwa;
      }
    }
  }

  getContractorName(id){
    for(let i = 0; i < this.lastestValueContractors.length; i++){
      if(this.lastestValueContractors[i].kontrahentID == id){
        return this.lastestValueContractors[i].nazwaFirmy;
      }
    }
  }
  isOrderPos(id){
    if(this.lastestValueOrderPos){
      for(let i = 0; i < this.lastestValueOrderPos.length; i++){
        if(this.lastestValueOrderPos[i].id_zamowienia == id){
          return true;
        }
      }
      return false;
    }
    
  }
  getNip(id){
    for(let i = 0; i < this.lastestValueContractors.length; i++){
      if(this.lastestValueContractors[i].kontrahentID == id){
        return this.lastestValueContractors[i].nip;
      }
    }
  }

  getPrice(id){
    for(let i = 0; i < this.lastestProducts_for_contractor.length; i++){
      if(this.lastestProducts_for_contractor[i].id == id){
        if(this.lastestProducts_for_contractor[i].cena_netto_dla_kontrahenta){
          return this.lastestProducts_for_contractor[i].cena_netto_dla_kontrahenta;
        }
        else{
          return this.lastestProducts_for_contractor[i].cena_netto;
        }
      }
    }
  }

  updateOrder(order: Order){
    setTimeout(() => {
      return this.api.updateOrder(order).subscribe(
        () => {
          this.delete = false;
          this.ngOnInit();
        },
        err => console.log('error:', err), 
      );
      
    }, 1500);
  }
  changeOrderStatusToUnrealized(order: Order){
    let r = confirm("Jesteś pewny?");
    if (r == true) {
      order.status_zamowienia = 'W realizacji';
      this.updateOrder(order);
    }
    
  }
  changeOrderStatusToRealized(order: Order){
    if(this.isOrderPos(order.id)){
      let r = confirm("Jesteś pewny?");
      if (r == true) {
        order.status_zamowienia = 'Zrealizowane';
        this.updateOrder(order);
      }
    }else{
      alert('Zamówienie jest puste!')
    }
    
    
  }
  addition(num1:number, num2:number)
  {
    return (Number(num1) + Number(num2))
  }
  substraction(num1:number, num2:number)
  {
    return (Number(num1) - Number(num2))
  }

  addNewOrderPos(order: Order){
    let orderPos = new Order_Pos;
    this.products_for_contractor = this.api.getProductsWithNip(this.getNip(order.id_kontrahenta));
    this.products_for_contractor.subscribe(value => this.lastestProducts_for_contractor = value);
    
    setTimeout(() => {
      orderPos.wartosc_zamowienia = this.getPrice(this.product_id) * this.ilosc;
      orderPos.cena_netto = this.getPrice(this.product_id);
      orderPos.id_produktu = this.product_id;
      orderPos.id_zamowienia = order.id;
      orderPos.ilosc = this.ilosc;
      orderPos.nazwa = this.getProductName(this.product_id);
      order.wartosc_zamowienia = this.addition(order.wartosc_zamowienia, orderPos.wartosc_zamowienia);
      return this.api.newOrderPos(orderPos).subscribe(
        () => {
          this.updateOrder(order);
          alert('Dodano pomyślnie');
        },
        err => console.log('error:', err), 
      );
    }, 1500);
  }
  deleteOrderPos(order_pos: Order_Pos, order: Order){
    let r = confirm("Jesteś pewny?");
    if (r == true) {
      order.wartosc_zamowienia = this.substraction(order.wartosc_zamowienia, order_pos.wartosc_zamowienia);
    return this.api.deleteOrderPos(order_pos).subscribe(
      () => {
        this.updateOrder(order);
        alert('Usunięto pomyślnie');
      },
      err => console.log('error:', err), 
    );
    } 
    
  }
}
