import { forkJoin as observableForkJoin } from "rxjs/observable/forkJoin";
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from './config';
import { URLSearchParams } from '@angular/http';




var headers = new Headers();

headers.append('Content-Type', 'application/x-www-form-urlencoded');
@Injectable()
export class CheckoutService {
    data: any;
    url: any;
    status: any;
    total: any = 500;
    billingAddressForm: any;
    shippingAddressForm: any;
    billingAddress: any;
    shippingAddress: any;
    shippingMethods: any;
    paymentMethods: any;
    paymentMethod: any;
    shippingStatus: any;
    paymentStatus: any;
    orderSummary: any;
    addresses: any;
    address: any;
    shippingUpdate : any;

    constructor(private http: Http, private config: Config) { 
        
    }
    updateOrderReview(form) {
        var params = new URLSearchParams();
        params.append("security", form.nonce.update_order_review_nonce);
        params.append("payment_method", form.payment_method);
       
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_order_review', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
   
    checkout(form) {
        var params = new URLSearchParams();
        params.append("billing_first_name", form.billing_first_name);
        params.append("billing_last_name", form.billing_last_name);
        params.append("billing_company", form.billing_company);
        params.append("billing_email", form.billing_email);
        params.append("billing_phone", form.billing_phone);
        params.append("billing_address_1", form.billing_address_1);
        params.append("billing_address_2", form.billing_address_2);
        params.append("billing_city", form.billing_city);
        params.append("billing_postcode", form.billing_postcode);

        params.append("shipping_first_name", form.shipping_first_name);
        params.append("shipping_last_name", form.shipping_last_name);
        params.append("shipping_company", form.shipping_company);
        params.append("shipping_email", form.shipping_email);
        params.append("shipping_phone", form.shipping_phone);
        params.append("shipping_address_1", form.shipping_address_1);
        params.append("shipping_address_2", form.shipping_address_2);
        params.append("shipping_city", form.shipping_city);
        params.append("shipping_postcode", form.shipping_postcode);
        params.append("billing_country", form.billing_country);
        params.append("billing_state", form.billing_state);
        params.append("shipping_country", form.shipping_country);
        params.append("shipping_state", form.shipping_state);

        if(form.terms){
            params.append("terms", 'on');
            params.append("terms-field", '1');
        }

        if(!form.shipping){
            params.append("ship_to_different_address", "1");
        }

        params.append("payment_method", form.payment_method);
        params.append("_wpnonce", form.checkout_nonce);
        params.append("_wp_http_referer", this.config.url + '/checkout?wc-ajax=update_order_review');

        if (form.password) {
            params.append("createaccount", form.register);
            params.append("account_password", form.password);
        }
       
        return new Promise(resolve => {
            this.http.post(this.config.url + '/checkout?wc-ajax=checkout', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    saveBillingAddress(form) {
        var params = new URLSearchParams();
        params.append("billing_first_name", form.billing_first_name);
        params.append("billing_last_name", form.billing_last_name);
        params.append("billing_company", form.billing_company);
        params.append("billing_email", form.billing_email);
        params.append("billing_phone", form.nonce.billing_phone);
        params.append("billing_address_1", form.billing_address_1);
        params.append("billing_address_2", form.billing_address_2);
        params.append("billing_city", form.billing_city);
        params.append("billing_postcode", form.billing_postcode);
        params.append("billing_country", form.billing_country);
        params.append("billing_state", form.billing_state);
        params.append("createaccount", form.billing_address_1);
        params.append("account_password", form.billing_address_2);
        params.append("payment_method", form.payment_method);
        params.append("_wpnonce", "544bcd0d1d");
        return new Promise(resolve => {
            this.http.post(this.config.url + '/checkout?wc-ajax=checkout', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    saveShippingAddress(shipping) {
        var params = new URLSearchParams();
        params.append("shipping[firstname]", shipping.firstname);
        params.append("shipping[lastname]", shipping.lastname);
        params.append("shipping[company]", shipping.company);
        params.append("shipping[street][0]", shipping.street1);
        params.append("shipping[street][1]", shipping.street2);
        params.append("shipping[city]", shipping.city);
        params.append("shipping[postcode]", shipping.postcode);
        params.append("shipping[country_id]", shipping.country_id);
        params.append("shipping[state_id]", shipping.state_id);
        if (shipping.entity_id) {
            params.append("shipping_address_id", shipping.entity_id);
        }
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-get_checkout_form', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    getShippingPayment() {
        if (this.shippingMethods && this.paymentMethods) {
            return Promise.resolve(this.shippingMethods);
        }
        return new Promise(resolve => {
            observableForkJoin(
                this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-payment', this.config.options).pipe(map(res => res.json()))
            ).subscribe(data => {
                this.shippingMethods = data[0];
                this.paymentMethods = data[1];
                resolve(this.shippingMethods);
            });
        });
    }
    saveMethods(shippingMethod, payment) {
        var shipping = new URLSearchParams();
        var params = new URLSearchParams();
        shipping.append("shipping_method", shippingMethod);
        for (let param in payment) {
            params.set("payment[" + param + "]", payment[param]);
        }
        return new Promise(resolve => {
            observableForkJoin(
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-payment', params, this.config.options).pipe(map(res => res.json()))
            ).subscribe(data => {
                this.shippingStatus = data[0];
                this.paymentStatus = data[1];
                resolve(this.shippingStatus);
            });
        });
    }
    getTime(date) {
        var params = new URLSearchParams();
        params.append("action", "iconic_wds_get_slots_on_date");
        params.append("date", date);
        console.log(params);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    console.log(data);
                    resolve(this.status);
                });
        });
    }
    getDate() {
        var params = new URLSearchParams();
        params.append("action", "iconic_wds_get_upcoming_bookable_dates");
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    console.log(data);
                    resolve(this.status);
                });
        });
    }
    login(form) {
        var params = new URLSearchParams();
        params.append("username", form.username);
        params.append("password", form.password);
        params.append("_wpnonce", form.checkout_login);
        params.append("login", "Login");
        params.append("_wp_http_referer", "/checkout/");
        params.append("redirect", this.config.url + "/wp-admin/admin-ajax.php?action=WooComm-userdata");
        return new Promise(resolve => {
            this.http.post(this.config.url + '/checkout/', params, this.config.options)
                .subscribe(data => {
                    this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-get_checkout_form', this.config.options).pipe(map(res => res.json()))
                        .subscribe(data => {
                            this.status = data;
                            resolve(this.status);
                        });
                });
        });
    }
    submitCoupon(form) {
        var params = new URLSearchParams()
        params.append("coupon_code", form.coupon_code);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-apply_coupon', params, this.config.options)
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
   
    
    getOrderSummary(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/orders/' + id + '?', false), this.config.optionstwo).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.orderSummary = data;
                    resolve(this.orderSummary);
                });
        });
    }
    updateShipping(method) {
        var params = new URLSearchParams()
        params.append("shipping_method[0]", method);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_shipping_method', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.shippingUpdate = data;
                    resolve(this.shippingUpdate);
                });
        });
    }
}