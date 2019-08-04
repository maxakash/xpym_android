
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';

import { LoadingController } from 'ionic-angular';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
@Injectable()
export class ProductService { 
    data: any;
    url: any;
    product: any;
    gallery: any;
    status: any;
    headers: any;
    wishlist: any;
    reviews: any;
    related: any;
    reviewForm: any;
    cart: any;
    code: any;
    loader: any;
    upsell: any;
    commentdata:any;
    crossSell: any;

    constructor(private http: Http, private config: Config, private values: Values, private loadingController: LoadingController) {
    }
    getProduct(id) {
        this.values.loadingprod = true;
         return new Promise(resolve => {
             this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/' + id + '?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                 this.values.loadingprod=false; 
                this.product = data;
                 resolve(this.product);
             });
         });
    }
    

    getReviews(id) {
         return new Promise(resolve => {
             this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/'+  id + '/reviews' + '?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                 this.reviews = data;
                 resolve(this.reviews);
             });
         });
     }
    
    getRelatedProducts(params) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products?', params), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.related = data;
                    resolve(this.related);
                });
        });
    }

    getUpsellProducts(params) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products?', params), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.upsell = data;
                    resolve(this.upsell);
                });
        });
    }

    getCrossSellProducts(params) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products?', params), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.crossSell = data;
                    resolve(this.crossSell);
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
                 this.values.updateCart(this.status);
                 //this.values.updateCartTwo(this.status);
                 resolve(this.status);
             });
         });
     }
     
     presentLoading(text) {
         this.loader = this.loadingController.create({
             content: text,
         });
         this.loader.present();
     }
     dismissLoading() {
         this.loader.dismiss();
     }
     
    
    deleteFromCart(id, qty) {




        var params = new URLSearchParams();
        for (let key in this.values.cartItem) {
            //console.log(this.values.cartItem[key].product_id + id);
            if (this.values.cartItem[key].product_id == id) {

                // this.values.cartItem[key].quantity = qty;
                params.set("key", key);
                params.set("qty", qty);
            }
        }

        return new Promise(resolve => {
            console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-set_quantity', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    console.log(data)
                    resolve(data);
                });
        });
    }
     updateToCart(id) {
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
    getVariationProducts(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/' + id + '/variations' + '?', {per_page: 100} ), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                  // console.log(data)
                    resolve(data);
                });
        });
    }
    getVariation(prodid,varid) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/' + prodid + '/variations/' + varid   + '?', { per_page: 100 }), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                    console.log(data)
                    resolve(data);
                });
        });
    }
}