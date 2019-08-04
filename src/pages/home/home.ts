import { Component,ChangeDetectorRef} from '@angular/core';
import { NavController,  ToastController, ModalController, IonicPage } from 'ionic-angular';
import { Service } from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { ProductPage } from '../product/product';
import { ProductService } from '../../providers/service/product-service';
import { CartService } from '../../providers/service/cart-service';
import { Storage } from '@ionic/storage';
import { Backbutton } from "ionic3-android-backbutton";
import { MenuController } from 'ionic-angular';
import { AppupdatePage } from '../appupdate/appupdate';






@IonicPage({
name:'home',
segment:'Home'
})



@Component({
    templateUrl: 'home.html',
    selector: 'page-home',


})

export class Home  {

    items: any;
    loading: boolean = true;
    image: any;
    loader: any;
    public counter = 0;
    homecount: number = 0;
    internet: boolean = true;
    showspinner:boolean=false;
    cartquantity:any={};
    options: any = {};
    blocks:any={};
    bbcounter = 1;
    date: any;
    call:any;
    appversion:number=1.0;
    showsearch:boolean=false;
    
    




    constructor(public nav: NavController, public menuCtrl: MenuController, public cd: ChangeDetectorRef, public Service: ProductService, public bb: Backbutton, public storage: Storage, public service1: CartService, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: Service, public values: Values, public functions: Functions) {
        
        this.date = new Date().getHours();
        this.values.homepage=true;
        this.items = [];
        this.service.appversion().then((data=>{
           var newversion= +data;
        //   console.log(newversion)
           if(newversion>this.appversion){
               this.nav.setRoot(AppupdatePage)
           }
        }))
        
     

        

    }
    doRefresh(refresher) {

            this.service.load1(this.values.vendorid).then((results) => {
                this.handleService(results);
                refresher.complete();
            });
       
    }
    handleService(results) {
        this.cd.detectChanges();
        // 
    }


    
    
    getSearch() {
       // this.showsearch=true;
       // this.cd.detectChanges();
       // this.nav.push(SearchPage);
    }
    onCancel($event) {
        this.showsearch = false;
        this.cd.detectChanges();
    }
    onKey(e) {
        if (e.keyCode == 13) {
            let activeElement = <HTMLElement>document.activeElement;
            activeElement && activeElement.blur && activeElement.blur();
        }
    }

   
    getCart(){
        this.nav.push(CartPage);
    }
    addToCart(id, stock, sale) {
        if (stock > this.values.cart[id]) {
            // console.log(id)
            

            if (sale) {
                this.values.cart[id] += 1;
                this.options.product_id = id;
                this.showspinner = true;
                //  this.cd.detectChanges();
                this.service.deleteFromCart(id, this.values.cart[id]).then((results) => console.log(results));
            }
            else if (!sale) {
                this.values.cart[id] += 1;
                this.options.product_id = id;
                this.showspinner = true;
                this.service.addToCart(this.options).then((results) => this.updateCart(results));
            }



        }


    }
  
    addToCart1(id, stock) {
        //console.log(stock)
        if (stock) {
            this.values.cart[id] += 1;
            console.log(id)
             this.options.product_id = id;
            // this.options.quantity = this.values.cart[id];
            this.showspinner = true;
            this.service.addToCart(this.options).then((results) => this.updateCart(results));


        }
       
    }
    openmenu(){
        this.menuCtrl.open();
    }
    delete(id, qty) {
        this.values.cart[id]-=1;
        
        qty-=1;
        this.options.product_id = id;
        this.showspinner = true;
        this.service.deleteFromCart(id, qty).then((results) => {
            //console.log(results)
            this.service1.loadCart();
            this.cd.detectChanges();
        });

    }
    handlecart(data,id) {
      //  console.log(data)
        var data = data;
        for (let item in data.cart_contents) {
            if (data.cart_contents[item].product_id == id) {
                this.cartquantity = data.cart_contents[item].quantity;
                this.showspinner = false;
                this.cd.detectChanges();
                console.log(this.cartquantity)
            }

        }
    }

    updateCart(results) {
      // console.log(results)
       this.values.updateCartTwo(results);
       this.cd.detectChanges();
       
       
    }
   

    getProduct(item) {
        let modal = this.modalCtrl.create(ProductPage, { item },
            { cssClass: "my-modal" });
        modal.onDidDismiss(data => {
           
        });
        modal.present();
    }

    getCategory(id, name) {
        this.items.id = id;
        this.items.name = name;
        var item=this.items;
        
        let modal = this.modalCtrl.create(ProductsPage, { item },
            { cssClass: "my-modal1" });
        modal.onDidDismiss(data => {
          
          
            if (this.values.productsback){
                this.nav.push(CartPage);
            }
           
        });
        modal.present();
       
       
    }
    ionViewDidEnter() {
        this.values.helppage = false;
        this.values.homepage = true;
        this.values.loginpage = false;
        this.values.orderpage = false;
        this.values.addresspage = false;
       // console.log("homepageentered")
        this.bb.registerDefaultAction(() => {
            this.bbcounter--;
            if (this.bbcounter > 0) {
               /* this.toastCtrl.create({
                    message: 'Press again to Exit',
                    duration: 2000,
                    position: 'bottom'
                }).present();*/
                return false; //cancel backbutton action
            } else {
                this.bb.unregisterAction('default'); //unregistering function because we won't need it anymore
                return true; //allow backbutton action
            }
        })
    }

  


    goto(data) {
       // console.log(data);
        if (data.description == "product") {
            this.nav.push(ProductPage, data.url);
        }
        else if (data.description == "category") {
            this.items.id = data.url;
            this.items.categories = this.service.categories;
            this.values.categoryname = this.items.categories;
            
        }

        else if (data.description == "post") {
            //this.nav.push(Post, data.url);
        }
    }
    hideLoading() {
        this.loading = false;
    }
    getSubCategories(id) {
        const results = this.service.categories.filter(item => item.parent === parseInt(id));
        return results;
    }




    presentToast() {
        let toast = this.toastCtrl.create({
            message: "Not in stock",
            duration: 2000,
            position: "bottom"
        });
        toast.present();
    }

  
    ionViewWillEnter() {
       this.storage.get('vendorid').then((data)=>{
           console.log(data);
           this.values.vendorid=data;
           if(this.values.vendorid==undefined){
               this.nav.push('address')
           }
       });
        

    }
}


















