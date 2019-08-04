import { Component, ChangeDetectorRef  } from '@angular/core';
import { NavController, Platform, ViewController, Events } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { CartService } from '../../../providers/service/cart-service';
import { OrderDetails } from '../../order/order-details/order-details';
import { StatusBar } from '@ionic-native/status-bar';




@Component({
    templateUrl: 'order-summary.html',
    selector: 'page-order-summary'
})
export class OrderSummary {

    orderSummary: any;
    status: any;
    payment: any;
    id: any;
    showloader:boolean=true;
    tabBarElement: any;
    show:any;

    constructor(public nav: NavController, public viewctl: ViewController, public events: Events, private cd: ChangeDetectorRef, public StatusBar: StatusBar,public cartservice:CartService, public service: Service, private platform: Platform,  public functions: Functions, public values: Values) {
       
        
      
    }

    handleorderdetails(results) {
        this.orderSummary = results;
        if (this.orderSummary.status == 'processing' || this.orderSummary.status == 'completed'){
            this.show=2;
            this.showloader=false;
            this.cd.detectChanges();
            this.service.emptycart();
            
        } 
        
       
        
        else if (this.orderSummary.status == 'failed' || this.orderSummary.status == 'on-hold' || this.orderSummary.status == 'cancelled' || this.orderSummary.status == 'pending'){
            this.showloader = false;
            this.show = 1;
            this.cd.detectChanges();
        }
        this.cd.detectChanges();
        console.log(results);
      
       


    }
    close() {
        this.nav.setRoot('home');
    }

  
    ionViewWillLeave() {
        this.StatusBar.overlaysWebView(false);
        this.StatusBar.backgroundColorByHexString('#CCffffff');
        this.viewctl.dismiss();
        this.events.publish('modals:close');

    }
    

    ionViewWillEnter() {
        
        this.StatusBar.overlaysWebView(true);
        this.id = this.values.orderid;
        this.cartservice.loadCart()
            .then((results) => this.handleCartInit(results));
       
        console.log("ordersumm "+ this.id)
        if (this.id.toString().length<=10){
            console.log("number is id");
            this.service.getOrder(this.id)
                .then((results) => this.handleorderdetails(results));
        }
        
       
 
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
    
   
    getOrderDetails() {
        
        this.values.navback='ordersummary';
        this.nav.push(OrderDetails, this.id);
    }
   

}