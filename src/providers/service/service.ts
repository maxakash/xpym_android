
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import { CartService } from '../service/cart-service';
import { Storage } from '@ionic/storage';


@Injectable()
export class Service {
    data: any;
    url: any;
    categories: any = [];
    banners: any;
    orders: any;
    order: any;
    isloggedIn: any;
    status: any;
    tag: any;
    address: any;
    users: any = [];
    discounts: any;
    products: any;
    product: any;
    cart: any;
    configuration: any;
    loader: any;
    loginStatus: boolean = false;
    mainCategories: any;
    country: any;
    user: any;
    sellerProducts: any;
    searches: any = [];
    login_nonce: any;
    dir: any = 'left';
    googleResponse: any;
    filter: any = {};
    filter1: any = {};
    featuredProduct: any;
    bestOffers: any;
    trending: any;
    pins: any = [];
    blocks: any = [];
    block: any = [];
    block1: any = [];
    has_more_items: boolean = true;
    customername: any;
    vendorid: any;
    coupondiscount: any;
    showplaceholder: boolean = true;
    cartpromo:any;



    promo: any;
    constructor(private http: Http, private config: Config, public toastctrl: ToastController, public cartservice: CartService, private storage: Storage, private _http: HttpClient, private values: Values, public loadingCtrl: LoadingController) {
        this.mainCategories = [];
        this.filter.page = 1;
        this.filter.status = 'publish';

        this.storage.get('vendorid').then((data) => {
            this.values.vendorid = data;
            this.vendorid = data;
            this.filter.vendor = this.vendorid;
        })
    }
    load() {
        this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
            this.cart = data;
            this.values.updateCart(this.cart);
        });

        // console.log(this.vendorid)
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-keys', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.values.data = data;
                this.blocks = data.blocks;
                this.promo = data.promo.promo[0].image;
                this.cartpromo=data.cartpromo.promo[0].image;
                this.coupondiscount = data.coupon;
             //   console.log(this.cartpromo)


                for (let item in this.blocks) {



                    for (let items in this.blocks[item].children) {
                        if (this.blocks[item].children[items].title == 'product' || this.blocks[item].children[items].title == 'Product') {
                            //console.log(this.blocks[item].children[items]);
                            if (this.blocks[item].children[items].description == this.vendorid && this.blocks[item].children[items].stock_status) {
                                this.block1.push(this.blocks[item].children[items]);
                            }
                        }
                        else
                            //console.log(this.blocks[item].children[items]);
                            this.block1.push(this.blocks[item].children[items]);



                    }
                    this.block.push(this.block1);
                    this.block1 = [];

                }
               // console.log(data);
                //console.log(this.block);
                this.showplaceholder = false;


                this.login_nonce = data.login_nonce;
                this.banners = data.banners;

                //  this.getCategories(1);


                if (data.user && data.user.data != undefined) {
                    console.log(data.user);
                    //this.loginStatus = data.user.data.status;
                    //this.values.isLoggedIn = data.user.data.status;
                    //this.values.customerId = data.user.data.ID;

                    this.storage.get('loginData').then(data => {
                        if (data) {
                            if (data.type == 'social') {
                                this.values.customerName = data.displayName;
                            }
                        }
                    }, error => console.error(error));

                }
                this.storage.get('loginData').then(data => {
                    if (data) {
                        if (data.type == 'woo') {
                            this.login(data);
                        } else if (data.type == 'social') {
                            this.values.customerName = data.displayName;
                            this.socialLogin(data.username);
                        }
                    }
                }, error => console.error(error));

                //this.storage.get('loginData').then(data => this.login(data), error => console.error(error));


                this.storage.set('blocks', this.blocks).then(data => console.log('Saved'), error => console.error(error));

            });
            resolve(true);
        });

    }
    load1(vendorid) {

        //this.blocks=[];
     // console.log(this.vendorid)
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-keys', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.values.data = data;
                this.blocks = data.blocks;

                for (let item in this.blocks) {



                    for (let items in this.blocks[item].children) {
                        if (this.blocks[item].children[items].title == 'product' || this.blocks[item].children[items].title == 'Product') {


                        //    console.log(this.blocks[item].children[items].stock_status)

                            //console.log(this.blocks[item].children[items]);
                            if (this.blocks[item].children[items].description == vendorid && this.blocks[item].children[items].stock_status) {
                                this.block1.push(this.blocks[item].children[items]);
                            }
                        }
                        else
                            //console.log(this.blocks[item].children[items]);
                            this.block1.push(this.blocks[item].children[items]);



                    }
                    this.block.push(this.block1);
                    this.block1 = [];

                }
                // console.log(this.blocks);
                // console.log(this.block);
                this.showplaceholder = false;
                resolve(this.block);

                // console.log("Akash")
            });


        });
    }


    updateqty() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.cart = data;
                this.values.updateCart(this.cart);
                resolve(data);
            });
        });
    }


    getNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-nonce', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }
    login(loginData) {
        var params = new URLSearchParams();
        params.append("username", loginData.username);
        params.append("password", loginData.password);
        params.append("_wpnonce", this.login_nonce);
        params.append("login", 'Login');
        params.append("redirect", this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-userdata');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-login', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {

                if (!data.errors && data.data) {
                    this.values.isLoggedIn = data.data.status;
                    this.values.customerName = data.data.display_name;
                    this.values.customerId = data.data.ID;
                    params = new URLSearchParams();
                    params.append("customer_id", this.values.customerId.toString());
                    this.storage.set("customer_id", this.values.customerId.toString());

                    this.loginStatus = data.data.status;
                    this.storage.set('loginData', {
                        username: loginData.username,
                        password: loginData.password,
                        avatar: data.data.avatar_url,
                        type: 'woo'
                    }).then(data => console.log('Login Details Stored'), error => console.error(error));
                }
                resolve(data);
            }, err => {
                resolve(err._body.toString());
                console.log(err._body)
            });
        });
    }
    encodeUrl(href) {
        return href.replace(/&amp;/g, '&')
    }


    getcart() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });

        });
    }
    presentToast(message) {
        let toast = this.toastctrl.create({
            message: message,
            duration: 1500,
            position: 'bottom'
        });
        toast.present();
    }
    logout() {
        //this.storage.set('LoggedIn', 2);
        this.values.isLoggedIn = false;
        this.storage.remove('loginData');
        this.storage.remove("customer_id");
        this.loginStatus = false;
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-logout', this.config.options).subscribe(data => {
                this.values.customerName = "";
                this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                    this.cart = data;

                    this.customername = "";
                    this.values.updateCart(this.cart);
                });
                resolve(this.cart);
            });
        });
    }
    passwordreset(email, nonce, url) {
        var params = new URLSearchParams();
        params.append("user_login", email);
        params.append("wc_reset_password", "true");
        params.append("_wpnonce", nonce);
        params.append("_wp_http_referer", '/my-account/lost-password/');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/my-account/lost-password/', params, this.config.options).subscribe(status => {
                resolve(status);
            });
        });
    }
    passwordResetNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-passwordreset', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }
    getAddress() {
        this.storage.get("customer_id").then((data) => {
            if (data) {
                this.values.customerId = data;

            }
        });
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/customers/' + this.values.customerId + '?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.address = data;
            //    console.log(this.address)
                resolve(this.address);
            });
        });
    }
    saveAddress(address) {
        var params = address;
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v3/customers/' + this.values.customerId + '?', false), params, { withCredentials: false }).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
               // console.log(data)
            }, err => {
                resolve(err._body.toString());
            });
        });
    }
    updateaddress(form, phone) {
  //   console.log(form)
        var params = new URLSearchParams();


        params.append("address", form.address_1);
        params.append("address_2", form.address_2);
        params.append("city", form.city);
        params.append("postcode", form.postcode);
        params.append("country", "RU");
        params.append("state", "state");
        params.append("phone", phone);


        return new Promise(resolve => {
         //   console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-update_address', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }


    pushNotification(notification) {
        var params = new URLSearchParams();
        params.append("device_id", notification.device_id);
        params.append("platform", notification.platform);
        params.append("email", notification.email);
        params.append("city", notification.city);
        params.append("state", notification.state);
        params.append("country", notification.country);
        params.append("pincode", notification.pincode);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-user-subcribe-notify', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    pushNotify(deviceId, platform) {
        var params = new URLSearchParams();
        params.append("device_id", deviceId);
        params.append("platform", platform);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-user-subcribe-notify', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    getOrder(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/orders/' + id + '?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.order = data;
                resolve(this.order);
            });
        });
    }


    getsellerimage(id) {
     //   console.log("getting seller images");
        return new Promise(resolve => {
            this._http.get(this.config.url + "/wp-json/wp/v2/media/" + id)
                .subscribe((results) => {
                 //   console.log(results);
                    resolve(results);
                });
        });

    }





    getCountry() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-get_country', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.country = data;
                resolve(this.country);
            });
        });
    }
    registerCustomer(customer) {
        var params = customer;
        return new Promise(resolve => {
            this.http.post(this.config.setUrl('POST', '/wp-json/wc/v2/customers?', false), params, { withCredentials: false }).pipe(map(res => res.json())).subscribe(data => {
                this.user = data;
                resolve(this.user);
            }, err => {
                resolve(JSON.parse(err._body));
            });
        });
    }
    getOrders(filter) {
        return new Promise(resolve => {

            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/orders?', filter), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.orders = data;
                resolve(this.orders);
            });
        });
    }
    updateOrder(data, id) {
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v3/orders/' + id + '?', false), data, { withCredentials: true }).pipe(map(res => res.json())).subscribe(data => {
                this.status = data;
                resolve(this.status);
            }, err => {
                resolve(err._body.toString());
            });
        });
    }
    getTracking(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/orders/' + id + '/shipment-trackings/?', false), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }

    presentLoading(text) {
        this.loader = this.loadingCtrl.create({
            content: text,
        });
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }


    getProducts() {
        this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/?', this.filter), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
            this.products = data;
        });
    }
    getfeaturedProduct() {
        this.filter.featured = true;
        this.filter.on_sale = undefined;
        this.filter.per_page = 4;
        this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/?', this.filter), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
            this.featuredProduct = data;
            //console.log(data);
            this.storage.set('featured', data).then(data => console.log('Saved featured'), error => console.error(error));
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
                console.log(data);
                // this.values.cartNonce = data.cart_nonce;
                this.values.updateCart(this.status);
                //this.values.updateCartTwo(this.status);
                resolve(this.status);
            });
        });
    }
    addToCart1(qty, key) {
        var params = new URLSearchParams();
        params.set("key", key);
        params.set("qty", qty);
        //  console.log(params)
        return new Promise(resolve => {
            // console.log(params)
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-set_quantity', params, this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    //  console.log(data)
                    resolve(data);
                });
        });
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
                    this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-cart', this.config.options).pipe(map(res => res.json())).subscribe(data => {
                        this.cart = data;
                        this.values.updateCart(this.cart);
                    });
                });
        });
    }
    emptycart() {
        this.cartservice.loadCart()
            .then((results) => this.handleCartInit(results));
        return new Promise(resolve => {

            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-empty_cart', this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                    console.log("cart emptied")
                    resolve(data);
                });
        });

    }
    handleCartInit(results) {

        // console.log(results);
        for (let item in results.cart_contents) {
            //  console.log(results.cart_contents[item].key);
            this.delete(results.cart_contents[item].key);
        }
    }
    delete(key) {

        this.cartservice.deleteItem(key);
    }
    appversion() {
        return new Promise(resolve => {

            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-app_version', this.config.options).pipe(map(res => res.json()))
                .subscribe(data => {
                   // console.log(data.appversion)
                    resolve(data.appversion);
                });
        });

    }









    getLocationAddress(lat, lon) {
        return new Promise(resolve => {
            this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true').pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }
    sendToken(token) {
        var params = new URLSearchParams();
        params.append("access_token", token);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-facebook_connect', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                if (data.status) {
                    this.values.isLoggedIn = true;
                    this.values.customerName = data.last_name;
                    this.values.customerId = data.user_id;
                    this.storage.set('loginData', {
                        username: data.user_login,
                        avatar: data.avatar,
                        type: 'social',
                        displayName: data.last_name
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }
    googleLogin(phone) {
        var params = new URLSearchParams();
        params.append("phone", phone);
        //params.append("first_name", res.givenName);
        //params.append("last_name", res.familyName);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-google_connect', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.googleResponse = data;
                if (data.status) {
                    this.values.isLoggedIn = true;
                    //this.values.customerName = res.displayName;
                    this.values.customerId = data.user_id;
                    // this.values.avatar = res.imageUrl;
                    this.storage.set('loginData', {
                        // username: res.email,
                        //avatar: res.imageUrl,
                        type: 'social',
                        // displayName: res.displayName
                    }).then(data => console.log('Pphone login data stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }
    socialLogin(phone) {
        var params = new URLSearchParams();

        params.append("phone", phone);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-google_connect', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                this.googleResponse = data;
                console.log(data)
                if (data.status) {
                    this.values.isLoggedIn = true;
                    this.values.customerId = data.user_id;
                    this.storage.set("customer_id", data.user_id);
                    this.storage.set('LoggedIn', 1);
                    this.loginStatus = true;
                    this.storage.set('loginData', {
                        type: 'social',
                        username: phone
                        // displayName: res.displayName
                    }).then(data => console.log('Pphone login data stored'), error => console.error(error));

                }
                resolve(data);
            });
        });

    }
    getAttributes() {
        if (this.values.attributes) {
            return Promise.resolve(this.values.attributes);
        }
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/attributes?', {
                per_page: 100
            }), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.values.attributes = data;
                if (this.values.attributes[0]) {
                    this.values.attributes[0].selected = true;
                    this.values.selectedFilter = this.values.attributes[0];
                    resolve(this.values.attributes);
                }
            });
        });
    }
    attributeTerms(id) {
        if (this.values.attributeTerms[id]) {
            return Promise.resolve(this.values.attributeTerms[id]);
        }
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/attributes/' + id + '/terms?', {
                per_page: 100
            }), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.values.attributeTerms[id] = data;
                resolve(this.values.attributeTerms[id]);
            });
        });
    }


    getPage(id: any) {
        var params = new URLSearchParams();
        params.append("page_id", id);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=WooComm-page_content', params, this.config.options).pipe(map(res => res.json())).subscribe(data => {
                resolve(data);
            });
        });
    }

    loadMore() {
        this.filter.page += 1;
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v3/products/?', this.filter), this.config.optionstwo).pipe(map(res => res.json())).subscribe(data => {
                this.handleMore(data);
                resolve(true);
            });
        });
    }

    handleMore(results) {
        if (results != undefined) {
            for (var i = 0; i < results.length; i++) {
                this.products.push(results[i]);
            };
        }
        if (results.length == 0) {
            this.has_more_items = false;
        }
    }
}