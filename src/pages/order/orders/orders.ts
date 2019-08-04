import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';
import { OrderDetails } from '../order-details/order-details';
import { Storage } from '@ionic/storage';
import { ProductService } from '../../../providers/service/product-service';




@Component({
    templateUrl: 'orders.html',
    selector:'page-orders'
})
export class Orders {
  
    orders: any;
    slug: any;
    count: any;
    has_more_items: boolean = true;
    quantity: any;
    showorder:any;
    page: number = 1;
    id: any;
    variations:any=[];
    images: any = [];
    product:any;
    filter: any;
    load:boolean=false;
    status: any;
    totalquantity: any = {};
    constructor(public nav: NavController, public service: Service, public Service: ProductService, private toastCtrl: ToastController, public storage: Storage, params: NavParams, public values: Values) {
        
        this.id = params.data;
        this.values.homecount = 1;
        
    }
    handleorders(results){
        this.orders = results;
       
        
        for (var item in this.orders) {
            console.log(this.orders[item])
            this.totalquantity[this.orders[item].id]=0;
            for (var items in this.orders[item].line_items) {
                
                this.totalquantity[this.orders[item].id] += +this.orders[item].line_items[items].quantity;


            }  

        }
        console.log(this.totalquantity);
        this.load=true;
}
   
        
 
    getOrderDetails(id) {
        this.values.navback = "order";
        this.nav.push(OrderDetails, id);
    }
    

    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'Please login first',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
   
   
    ionViewWillEnter (){
        
        this.load=false; 
        
        this.storage.get("customer_id").then((data) => {
            if (data) {
                this.filter = {};
                this.filter.per_page = 40;
               
               
                console.log(data);
                this.filter.customer = data;
                this.service.getOrders(this.filter)
                    .then((results) => this.handleorders(results));
            }
        });
       

    }
    




}