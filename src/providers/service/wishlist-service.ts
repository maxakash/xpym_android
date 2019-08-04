
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';


@Injectable()
export class WishlistService {
    wishlist: any;
    url: any;
    cartData: any;
    constructor(private http: Http, private config: Config, private values: Values) {
    } 
    loadWishlist() {
        var params = new URLSearchParams();
        params.append("customer_id", this.values.customerId.toString());
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-get_wishlist', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.wishlist = data;
                resolve(this.wishlist);
            });
        });
    }
    deleteItem(id) {
        var params = new URLSearchParams();
        params.append("product_id", id);
        params.append("customer_id", this.values.customerId.toString());
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-remove_wishlist', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.wishlist = data;
                resolve(this.wishlist);
            });
        });
    }
    addToCart(id) {
        var params = new URLSearchParams();
        params.append("quantity", "1");
        params.append("product_id", id);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-add_to_cart', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.cartData = data;
                this.values.cartNonce = data.cart_nonce;
                this.values.updateCartTwo(data.cart);
                resolve(this.cartData);
            });
        });
    }
}