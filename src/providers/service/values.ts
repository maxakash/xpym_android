import { Injectable } from '@angular/core';

@Injectable()
export class Values {
  showbackbutton:boolean=false;
  count: number = 0;
  filter: any;
  isLoggedIn: boolean = false;
  customerName: string ;
  cashback:any;
  customerId: number = null;
  listview: boolean = false;
  cart: Array<number> = [];
  filterUpdate: boolean = false;
  loadingcat: boolean = true;
  loadingprod: boolean = true;
  orderby:any;
  descending:any;
  lan: any;
  billingcart:any;
  orderstatus:any;
  ordercreated:any;
  productsback:boolean=false;
  users: any = [];
  showtrack:number=0;
  logoutUrl: any;
  categoryname: any = "";
  cartItem: any;
  cartNonce: any;
  currency: any = "₽";
  data: any = {};
  dir: any = 'left';
  orderload:boolean=false;
  deviceId: any;
  platform: any;
  quantity: number = 2;
  max_price: any;
  onsale: boolean = false;
  newCollections: boolean = false;
  featuredProducts : boolean = false;
  cartLoadEnable: boolean = false;
  applyFilter: any;
  selectedFilter: any = {};
  title:any="";
  price: any = {lower: 1, upper: 1000};
  attributes: any;
  phonenumber:any;
  navback:any="";
  check: number=1;
  payment:boolean=false
  attributeTerms: any = [];
  sortType: any;
  showorder:boolean=false;
  catid:any;
  prodid:any;
  counter:any=0;
  otpsent:boolean=false;
  loadingadd: boolean= true;
  showSubcat: boolean = false;
  showshipping:any;
  form: any;
  orderid:any;
  vendorid:any;
  app_dir:any="ltr";
  language:any= "english";
  homecount: number = 0;
  loginpage: boolean = false;
  homepage: boolean = false;
  helppage: boolean = false;
  orderpage: boolean = false;
  addresspage: boolean = false;

  // /Users/akash/Library/Android/sdk/build-tools/29.0.1/zipalign -v 4 yourapk.apk xpym.apk
  //jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore   yourapk.apk maxkey
  dimensions: any = {imageGridViewHeight: 100, imageProductViewHeight: 100, scrollProductHeight: 100, productSliderWidth : 42};
  
  constructor() {
  	this.filter = {};
    this.sortType = 0;
    this.logoutUrl = "";
  }
  updateCart(crt) {
    console.log(crt)
    this.cartNonce = crt.cart_nonce;
    this.cartItem = crt.cart_contents;
    this.cart = [];
    this.count = 0;
    for (let item in crt.cart_contents) {
      this.cart[crt.cart_contents[item].product_id] = parseInt(crt.cart_contents[item].quantity);
      this.count += parseInt(crt.cart_contents[item].quantity);
    }
    console.log(this.cart)
  }
   updateCartTwo(crt) {
     console.log(crt)
       this.cart = [];
       this.count = 0;
       this.cartItem = crt;
       for (let item in crt) {
           this.cart[crt[item].product_id] = parseInt(crt[item].quantity);
           this.count += parseInt(crt[item].quantity);
       }
     console.log(this.cart)
   }
   updatecount(){
     this.count-=1;
   }
  
 
   getDevide(width){

      if (width >= 1025) {
        return 5;
      }

      if (width >= 769) {
        return 4;
      }

      if (width >= 481) {
        return 3;
      }
          
      else {
        return 2;
      }
   }
 }