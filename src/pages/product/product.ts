import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { ProductService } from '../../providers/service/product-service';
import { CartService } from '../../providers/service/cart-service';
import { Service } from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';





@Component({
    templateUrl: 'product.html',
    selector: 'page-product',
})
export class ProductPage {

    product: any;
    pincode: any;
    id: any;
    status: any;
    options: any = {};
    quantity: any;
    vendor: any;
    vendorid: any;
    showvendor: boolean = false;
    AddToCart: any;
    related: any;
    items: any;
    showhead: boolean = false;
    form: any = {};
    pins: any;
    count: any;
    showadd: boolean = true;
    shipping_policy: any
    action: any = 0;
    showspinner: boolean = false;
    filter: any = {};
    usedVariationAttributes: any = [];
    variations: any;
    prodvariation: any = [];

    constructor(public toastCtrl: ToastController, public cd: ChangeDetectorRef, public loadingctrl: LoadingController, public cartservice: CartService, public platform: Platform, public Service: Service, public viewCtrl: ViewController, public nav: NavController, public service: ProductService, params: NavParams, public functions: Functions, public values: Values, ) {
        
        this.id = params.data.item;
        //console.log(values.cart[this.id])
        this.values.homecount = 1;
        this.quantity = "1";
        this.options.product_id = this.id;
        this.service.getProduct(this.id)
            .then((results) => this.handleProductResults(results));


    }

    handleProductResults(results) {
        this.product = results;
       // console.log(this.product);
        this.cd.detectChanges();
       


    }
    close() {
        this.nav.pop();
    }

    addToCart(id, stock, sale) {
        if (stock > this.values.cart[id]) {
            // console.log(id)


            if (sale) {
                this.values.cart[id] += 1;
                this.showadd = false;
                this.showspinner = true;
                //  this.cd.detectChanges();
                this.Service.deleteFromCart(id, this.values.cart[id]).then((results) => this.updateCart1(results));
            }
            else if (!sale) {
                this.values.cart[id] += 1;
                this.options.product_id = id;
                this.showadd = false;
                this.showspinner = true;
                this.Service.addToCart(this.options).then((results) => this.updateCart(results));
            }



        }


    }
    
    addToCart1(id,stock) {
        if(stock){

    console.log("product addition button clicked");
           this.options.product_id = id;
            this.values.cart[id] += 1;
            this.showadd = false;
            this.showspinner = true;
            this.service.addToCart(this.options).then((results) => this.updateCart(results));

        }

    }
    delete(id,qty) {
        if (this.values.cart[id]) {
            this.values.cart[id] -= 1;

        }
        qty-=1;
        this.showspinner = true;
        this.service.deleteFromCart(id,qty).then((results) => this.updateCart1(results));

    }



    updateCart(results) {
      //  console.log(results)
        this.showspinner = false;
        this.values.updateCartTwo(results);
        this.cd.detectChanges();


    }
    updateCart1(results) {
        //console.log(results)
        this.showspinner = false;
        this.showadd = false;
        this.cd.detectChanges();

        this.Service.updateqty().then((data)=>{

            this.Service.getcart();
            this.cd.detectChanges();
            
        });
        //this.values.updateCartTwo(results);
        //this.presentToast("Added to Cart");
    }
    handlecart(data) {
      //  console.log(data)
        var data = data;
        
    }

    getCart() {
        this.viewCtrl.dismiss();
        this.nav.push(CartPage);
    }
    onScroll($event) {
      //  console.log($event);
        this.showhead = true;
        this.cd.detectChanges();
    }
    






    getSearch() {
        this.nav.push(SearchPage);
    }


    presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 1000,
            position: 'bottom'
        });
        toast.present();
    }


}