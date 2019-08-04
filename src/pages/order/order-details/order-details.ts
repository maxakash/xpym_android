import { NavController, NavParams, Platform } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { ProductService } from '../../../providers/service/product-service';
import { Values } from '../../../providers/service/values';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';




@Component({
    templateUrl: 'order-details.html',

})
export class OrderDetails {
    orderDetails: any;
    images: any = [];
    showorderdetail: any;
    variations:any;
    id: any;
    count:number=0;
    id1: number;
    product: any;
    total:any={};
    discounttotal:any;
    discounttotal1: any;
    reg_price:any={};
    sale_price: any = {};
    totalquantity:number=0;
    constructor(public nav: NavController,public storage:Storage,  public datepipe: DatePipe, public service: Service, public Service: ProductService,  params: NavParams, public platform: Platform, public values: Values) {
                this.platform.registerBackButtonAction(() => {
           this.nav.pop();
            
        });

        this.id = params.data;
        this.service.getOrder(this.id)
            .then((results) => this.handleorderdetails(results));
       
        
        

    }
    close(){
        this.nav.pop();
    }
  
  

    handleorderdetails(results) {

       this.orderDetails = results;
        this.discounttotal = +this.orderDetails.total + +this.orderDetails.discount_total;
        this.discounttotal1 =  +this.orderDetails.discount_total;

       
       //console.log(results);
       
        
        
        for (var item in this.orderDetails.line_items) {
            this.totalquantity += +this.orderDetails.line_items[item].quantity;
            this.total[this.orderDetails.line_items[item].product_id] = +this.orderDetails.line_items[item].total + +this.orderDetails.line_items[item].total_tax;
            this.Service.getProduct(this.orderDetails.line_items[item].product_id)
                .then((results) => this.handleproduct(results, this.orderDetails.line_items[item].variation_id));
            
        }
       

    }
    handleproduct(results,varid) {
        this.product = results;
        console.log(this.product);
        this.reg_price[this.product.id]=this.product.regular_price;
        if (this.product.sale_price)
        this.sale_price[this.product.id] = this.product.sale_price;
        if (varid!=0){
            this.Service.getVariation(this.product.id, varid).then((results) => {
                this.variations=results;
               // console.log(results)
                this.images[this.product.id]=this.variations.image.src;
            });
        }
            
      else if (varid == 0){
        
        this.images[this.product.id] = this.product.images[0].src;
        }
        
     
       
        //console.log(this.product);
    }

    handlecancelOrder(results) {
       // console.log(results);

        this.nav.push(OrderDetails, this.id);

    }
    handlereturnOrder(results) {
       // console.log(results);

        this.nav.push(OrderDetails, this.id);

    }
  
   
    

   
   
    

   

}



