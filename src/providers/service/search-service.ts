
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from './config'
import { URLSearchParams } from '@angular/http';

import { Values } from './values';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
@Injectable()
export class SearchService { 
    data: any;
    url: any;
    search: any;
    status: any;
    headers: any;
    filters: any;
    cart: any;
    code: any;
    products: any;
    categories: any;
    mainCategories: any;

    constructor(private http: Http, private config: Config, private values: Values) {
        this.mainCategories = [];
    }
    load() {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/categories?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.categories = data;
                this.mainCategories = [];
                for (var i = 0; i < this.categories.length; i++) {
                    if (this.categories[i].parent == '0') {
                        this.mainCategories.push(this.categories[i]);
                    }
                }
                resolve(this.categories);
            });
        });
    }
    getSearch(filter) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products?', filter), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.products = data;
                resolve(this.products);
            });
        });
    }
    addToCart(params) {
        return new Promise(resolve => {
            var searchParams = new URLSearchParams();
            for (let param in params) {
                searchParams.set(param, params[param]);
            }
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-add_to_cart', searchParams, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.status = data.cart;
                this.values.cartNonce = data.cart_nonce;
                this.values.updateCartTwo(this.status);
                resolve(this.status);
            });
        });
    }
    deleteFromCart(id) {
        var params = new URLSearchParams();
        for (let key in this.values.cartItem) {
            if (this.values.cartItem[key].product_id == id) {
                this.values.count -= 1;
                if (this.values.cartItem[key].quantity != undefined && this.values.cartItem[key].quantity == 0) {
                    this.values.cartItem[key].quantity = 0
                } else {
                    this.values.cartItem[key].quantity -= 1
                };
                if (this.values.cart[id] != undefined && this.values.cart[id] == 0) {
                    this.values.cart[id] = 0
                } else {
                    this.values.cart[id] -= 1
                };
                params.set('cart[' + key + '][qty]', this.values.cartItem[key].quantity);
            }
        }
        params.set('_wpnonce', this.values.cartNonce);
        params.set('update_cart', 'Update Cart');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/cart/', params, this.config.options).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    addToWishlist(id) {
        return new Promise(resolve => {
            var params = new URLSearchParams();
            params.append("product_id", id);
            params.append("customer_id", this.values.customerId.toString());
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-add_wishlist', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    deleteItem(id) {
        var params = new URLSearchParams();
        params.append("product_id", id);
        params.append("customer_id", this.values.customerId.toString());
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-remove_wishlist', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }
}