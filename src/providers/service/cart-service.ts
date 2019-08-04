
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';


@Injectable()
export class CartService {
    data: any;
    url: any;
    cart: any;
    status: any;
    billing: any;
    headers: any;
    paymentMethods: any;
    loader: any;
    wishlist: any;
    cartData: any;
    categories: any;
    mainCategories: any;

    constructor(private http: Http, private config: Config, private values: Values, private loadingController: LoadingController) {
        this.mainCategories = [];
    }
    loadCart() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                console.log(data);
                this.cart = data;
                this.values.cartNonce = data.cart_nonce;
                this.values.updateCart(this.cart);
                resolve(this.cart);
             ;
            });
        });
    }
   
    
    updateaddress(form,phone) {
        console.log(form)
        var params = new URLSearchParams();
      
       
        params.append("address", form.address_1);
        params.append("address_2", form.address_2);
        params.append("city", form.city);
        params.append("postcode", form.postcode);
        params.append("country", "RU");
        params.append("state", "state");
        params.append("phone", phone);
       
       
        return new Promise(resolve => {
            console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_address', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    checkout() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-get_checkout_form', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.billing = data;
                this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_order_review', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                    resolve(data);
                });
                resolve(this.billing);
            });
        });
    }
    addToCart(qty, key) {
        var params = new URLSearchParams();
        params.set("key", key);
        params.set("qty", qty);
        console.log(params)
        return new Promise(resolve => {
            console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-set_quantity', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    console.log(data)
                    resolve(data);
                });
        });
    }
    deleteFromCart(qty, key) {
        var params = new URLSearchParams();
        params.set("key", key);
        params.set("qty", qty);
        console.log(params)
        return new Promise(resolve => {
            console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-set_quantity', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    console.log(data)
                    resolve(data);
                });
        });
    }
    deleteItem(item_key) {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-remove_cart_item&item_key=' + item_key, this.config.options).map(res => res.json()).subscribe(data => {
                this.cart = data;
                this.values.updateCart(this.cart);
                resolve(this.cart);
            });
        });
    }
    emptycart() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-empty_cart', this.config.options).map(res => res.json()).subscribe(data => {
               console.log(data)
                resolve(data);
            });
        });
    }
   
    submitCoupon() {
        var params = new URLSearchParams()
        params.append("coupon_code",'first-use-sale');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-apply_coupon', params, this.config.options).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    removeCoupon(coupon) {
        var params = new URLSearchParams()
        params.append("coupon", coupon);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-remove_coupon', params, this.config.options).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    updateShipping(method) {
        var params = new URLSearchParams()
        params.append("shipping_method[0]", method);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_shipping_method', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.cart = data;
                this.values.cartNonce = data.cart_nonce;
                this.values.updateCart(this.cart);
                resolve(this.cart);
            });
        });
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
    deleteWishlistItem(id) {
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
    addToCartFromWishlist(id) {
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
    presentLoading(text) {
        this.loader = this.loadingController.create({
            content: text,
        });
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }
}