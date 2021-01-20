import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'https://damp-garden-67656.herokuapp.com/api';
  constructor(private http: HttpClient) { }
  getOrders(){
    return this.http.get<Order[]>(`${this.url}/order`);
  }
  newOrder(order: Order){
    return this.http.post<Order>(`${this.url}/order`, order);
  }
  updateOrder(order: Order){
    return this.http.patch<Order>(`${this.url}/order/${order.id}`, order);
  }
  deleteOrder(order_id: number){
    return this.http.delete<Order>(`${this.url}/order/${order_id}`);
  }
  newOrderPos(order_pos: Order_Pos){
    return this.http.post<Order_Pos>(`${this.url}/order_item`, order_pos);
  }
  deleteOrderPos(order_pos: Order_Pos){
    return this.http.delete<Order_Pos>(`${this.url}/order_item/${order_pos.id}`);
  }
  getOrders_Pos(){
    return this.http.get<Order_Pos[]>(`${this.url}/order_item`);
  }
  getContractors(){
    return this.http.get<Contractor[]>(`http://www.contractorsapi.somee.com/api/kontrahenci`);
  }
  getProducts(){
    return this.http.get<Product[]>(`https://radiant-river-64861.herokuapp.com/api/getProducts`);
  }
  getProductsWithNip(nip){
    return this.http.get<Product[]>(`https://radiant-river-64861.herokuapp.com/api/getProducts/${nip}`);
  }
}

export class Order{
  id?: number
  id_kontrahenta: number
  nr_zamowienia: number
  status_zamowienia: string
  wartosc_zamowienia: number
}

export class Order_Pos{
  id?: number
  nazwa: string
  id_zamowienia: number
  ilosc: number
  cena_netto: number
  wartosc_zamowienia: number
  id_produktu: number
}

export class Contractor{
  kontrahentID?: number
  nazwaFirmy: string
  nip: string
  adres: string
}

export class Product {
  id?: number;
  cena_netto_dla_kontrahenta?: number
  nazwa: string;
  stawka_vat: number;
  cena_netto: number;
  jednostka_miary: string;
  constructor(){}
}