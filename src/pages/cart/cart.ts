import { Component, ViewChild,  ChangeDetectorRef, OnInit} from '@angular/core';
import { NavController, NavParams, Navbar, ToastController, ViewController,  ModalController,LoadingController, AlertController} from 'ionic-angular';
import { CartService } from '../../providers/service/cart-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { ProductPage } from '../product/product';
import { Storage } from '@ionic/storage';
import { ProductService } from '../../providers/service/product-service';
import { Home } from '../home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Service } from '../../providers/service/service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Firebase } from '@ionic-native/firebase';
import * as firebase from 'firebase/app';
import { BillingAddressForm } from '../checkout/billing-address-form/billing-address-form';
import { CheckoutService } from '../../providers/service/checkout-service';
import { OrderSummary } from '../checkout/order-summary/order-summary';
import { EditAddressForm } from '../address/edit-address-form/edit-address-form';





@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit{
    @ViewChild('myNav') navbar: Navbar;
    @ViewChild('phoneNumber') phoneNumber;
    @ViewChild('code') code;
    option:any=[];
    cart: any;
    status: any;
    obj: any;
    loader:any;
    placeholder:any;
    quantity: number;
    update: any;
    toast: any;
    loading:any;
    needsFocus: boolean;
    variationimage:any=[];
    options: any;
    number: any;
    addProduct: boolean = true;
    coupon: any;
    a: any;
    disableSubmit: boolean = false;
    buttonCoupon: boolean = false;
    disableSubmitCoupon: boolean = false;
    chosen_shipping: any;
    shipping: any;
    Apply: any;
    action:any=0;
    Checkout: any;
    actionsheet: any;
    enableCoupon: boolean = false;
    product:any;
    store:any={};
    Next:any;
    phonenumber:any;
    verid:any;
    address:any;
    showtab: boolean = false;
    cartlength:boolean=true;
    public disableSubmit1: boolean = false;
    form: any;
    order_id:any;
    preferredpayment:any;
    preferredpaymentid:any;
    subtotal:number;

    constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, public iab: InAppBrowser, public checkoutservice: CheckoutService, private cd: ChangeDetectorRef,public loadingCtrl: LoadingController, public productservice: ProductService, public Service: Service, public modalCtrl: ModalController,  public storage: Storage, public nav: NavController, public service: CartService, public values: Values, public params: NavParams, public functions: Functions, private toastCtrl: ToastController, private fireAuth: AngularFireAuth, private fire: Firebase) {
       
        
        this.values.showbackbutton=true;
        this.quantity = 1;
        this.values.productsback=false;
        this.options = [];
        this.obj = params.data;
        this.storage.get('address').then((data) => {
      
            this.address = data;})
        
        
            this.storage.get('preferred_payment').then((data)=>{
                if (data == 'cod' || data == 'COD'){
                      this.preferredpayment ='Наличными курьеру';
                      this.preferredpaymentid='cod';
                  }
                  else if(data=='tinkoff'){
                      this.preferredpayment ='Картой в приложении';
                      this.preferredpaymentid = 'tinkoff';
                  }
            })
        this.service.checkout().then((results) => this.handleform(results));
      
        this.showtab = false;
    }

    handleform(results) {
        this.form = results;
       // console.log(this.form)
        this.form.shipping = true;
     //  this.cd.detectChanges();
       // this.service.updateOrderReview(this.form).then((results) => this.handleOrderReviews(results));

    }

    checkout2() {
        this.storage.set('preferred_payment', this.form.payment_method);
        this.values.check = 1;

        if (this.form.payment_method != undefined) {

           // this.buttonSubmit = true;
            //this.blank = false;
            this.presentLoading();

            if (this.form.payment_method == 'cod' || this.form.payment_method == 'COD') {
                this.checkoutservice.checkout(this.form).then((results) => this.handleBilling(results));
            }
            else if (this.form.payment_method != undefined) {

                this.checkoutservice.checkout(this.form).then((results) => this.handleRazorpay(results));
            }
        }

    }
    handleRazorpay(results) {
        this.dismissLoading();
     //console.log(results)
        if (results.result == 'success') {
            this.presentLoading();
           // console.log(results.redirect);
            var options = "location=no,hidden=yes,hideurlbar=yes";
            let browser = this.iab.create(results.redirect, '_blank', options);
            browser.on('loadstop').subscribe(data => {
                browser.show();
            });

            browser.on('loadstart').subscribe(data => {
                if (data.url.indexOf('Success=true') != -1) {
                    this.values.cart = [];
                    this.values.count = 0;
                    var str = data.url;
                    var pos1 = str.lastIndexOf("OrderId=");
                    var pos2 = str.lastIndexOf("&PaymentId=");
                    var pos3 = pos2 - (pos1 + 8);
                    this.order_id = str.substr(pos1 + 8, pos3);
                    //console.log(this.order_id);
                    this.values.orderid = this.order_id;
                    this.dismissLoading();
                   
                    browser.close();
                    this.nav.popToRoot().then((data) => {
                        this.nav.push(OrderSummary);
                    })

                }



                else if (data.url.indexOf('Success=false') != -1) {
                    browser.close();
                    this.dismissLoading();
                    
                        let alert = this.alertCtrl.create({
                            title: 'Не удалось оплатить заказ',
                            message: 'Попробуйте ещё раз или выберите оплату наличными.',
                            enableBackdropDismiss: true,
                            buttons: [
                                {
                                    text: 'продолжить',
                                    role: 'cancel',
                                    handler: () => {
                                      //  console.log('Cancel clicked');
                                    }
                                }
                            ]
                        });
                        alert.present();
                   
                }

            });

            browser.on('exit').subscribe(data => {
                if (this.loader) {
                    this.dismissLoading();
                }
               // console.log(data.type)

               // this.nav.pop();
               

            });



        }
    }
    handleBilling(results) {
     //   console.log(results)
        if (results.result == "success") {
            var str = results.redirect;
            var pos1 = str.lastIndexOf("order-received/");
            var pos2 = str.lastIndexOf("/?key=");
            var pos3 = pos2 - (pos1 + 15);
            this.order_id = str.substr(pos1 + 15, pos3);
            this.values.cart = [];
            this.values.count = 0;
            this.values.orderid = this.order_id;
            this.dismissLoading();
            this.nav.popToRoot().then((data) => {
                this.nav.push(OrderSummary);
            })
        } else if (results.result == "failure") {
            //console.log(results.messages)
            if(this.loader){
                this.dismissLoading();
            }
            this.functions.showAlert("", results.messages);
        }
       

    }
    ngOnDestroy() {
        this.cd.detach();
       
    }
    ngOnInit() {


        // console.log('LoginPage ngOnInit');
        this.fireAuth.authState.subscribe(auth => {
            if (!auth) {
                return;
            }

            auth.getIdToken()
                .then((token: string) => {
                    console.log('LoginPage getIdToken token', token);
                   
                });
        });
    }

    // tslint:disable-next-line
    private registerPhone(): void {
        if (this.phoneNumber.value) {
            this.phonenumber = this.phoneNumber.value
            this.disableSubmit = true;
            this.Next = "Sending OTP..."
            console.log('registerPhone');
            this.phoneNumber.value = this.phonenumber.replace(/\s/g, '');
            this.phonenumber = this.phonenumber.replace(/\(/g, '');
            this.phonenumber = this.phonenumber.replace(/\)/g, '');
            this.phonenumber = this.phonenumber.replace(/\-/g, '');


            const phone = '+7' + this.phonenumber;
            this.values.phonenumber = this.phonenumber;
            console.log('registerPhone phone', phone);
            this.fire.verifyPhoneNumber(phone, 30)
                .then((res) => {
                    this.values.otpsent = true;
                 //   this.cd.detectChanges();                    
                    const { verificationId } = res;
                    console.log('registerPhone verificationId', verificationId);
                    this.verid = verificationId;

                })
                .catch(err => {
                    console.log('registerPhone error', err);
                })
        }
        else {
            this.presentToast("Please enter mobile number")
        }
    }
   

    private async verifyCode(code: string, verificationId: string) {
        this.presentLoading();
        try {
            const credential = await firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            await firebase.auth().signInWithCredential(credential)
                .then(() => {
                    this.doLogin();
                    
                })
                .catch(err => {
                    this.presentToast("Неверный код подтверждения");
                    this.disableSubmit1 = false;
                    if(this.loader){
                        this.dismissLoading();
                    }
                   
                    console.error('LoginPage verifyCode signInWithCredential err', err);
                })
        } catch (err) {
            console.error('LoginPage verifyCode err', err);
            this.disableSubmit1 = false;
            this.presentToast("Неверный код подтверждения");
            this.disableSubmit1 = false;
            if (this.loader) {
                this.dismissLoading();
            }
           
        }
    }
    verify() {
       
        this.disableSubmit1 = true;
        this.verifyCode(this.code.value, this.verid);
    }

   


    private doLogin(): void {
        this.Service.socialLogin(this.phonenumber).then((data) => {
            console.log(data);
            this.service.loadCart()
                .then((results) => this.handleCartInit(results));
            this.saveAddress();
            this.values.otpsent = false;
          //  this.cd.detectChanges();
           
            
        });
       
    }
    saveAddress() {
        this.storage.get('address').then((data) =>{
             
               console.log(data);
            this.address=data;
            this.service.updateaddress(data, this.phonenumber)
                .then((results) => {
                    console.log(results)
                    this.service.checkout().then((results) => this.handleform(results));
                 //   this.cd.detectChanges();
                    if(this.loader){
                        this.dismissLoading();
                    }
                    
                });
           
        })

        
           
       
        
    }
   
    updateqty(id,key,stock){
        //this.loading = 1;
        if (stock > this.values.cart[id]) {
        this.presentLoading();
        var qty1 = this.values.cart[id] += 1;
      //  this.cd.detectChanges();
        this.service.deleteFromCart(qty1, key).then((results) => this.handleCart(results));
    }
}
  
    handleCartInit(results) {
        this.cart = results;
        if (this.cart.cart_contents.length > 4){
             this.cartlength=false;
           // this.cd.detectChanges(); 
        }
        if (this.Service.loginStatus){
            this.submitCoupon();
        }
       
        if(this.loader){
           this.dismissLoading();
        }
        this.loading = 0;
        //this.cd.detectChanges(); 
        this.shipping = results.zone_shipping;
        this.chosen_shipping = results.chosen_shipping;
    }
    handleCart(results) {
    
        this.service.loadCart()
            .then((results) => this.handleCartInit(results));
    }
    handleCart1(results) {
       // this.dismissLoading();
       console.log(results)
        this.cart = results;
       // this.cd.detectChanges(); 
        if (this.cart.cart_totals.discount_total){
            this.subtotal = +this.cart.cart_totals.subtotal + this.cart.cart_totals.subtotal_tax;
        }
        console.log(this.subtotal)
       
    }
    home(){
        this.nav.setRoot('home');
    }
    delete(key) {
        this.presentLoading();
       
       // this.cd.detectChanges(); 
        this.service.deleteItem(key).then((results) => this.handleCart(results));
    }
    delete1(id, key) {
        this.presentLoading();
        var qty = this.values.cart[id] -= 1;
       // this.cd.detectChanges();
        this.service.deleteFromCart(qty, key).then((results) => this.handleCart(results));
    }
  
  
    checkout() {
        if (this.cart.cart_totals.total == 0) {
            this.presentLoading();
            this.form.payment_method='cod';
            this.checkoutservice.checkout(this.form).then((results) => this.handleBilling(results));
        }
        else if (this.cart.cart_totals.total != 0){
        if (this.preferredpayment){
            this.form.payment_method = this.preferredpaymentid;
                this.checkout2();   
        }
        else if (!this.preferredpayment){
            this.checkout1();
        }
    }
}
    checkout1() {

        var form = this.form;
       // this.form.payment_method = 'tinkoff';
        let modal = this.modalCtrl.create(BillingAddressForm, { form },
            { cssClass: "my-modal2" });
        modal.onDidDismiss(data => {
            console.log(data);
            if(data){
            this.nav.push(OrderSummary);
            }
        });
        modal.present();

    }
    editAddress()
    {
        
        this.nav.push(EditAddressForm);
    }
   
  
    gohome() {
        this.nav.setRoot(Home);
    }
    deleteFromCart(id, key) {
        //this.presentToast1('Updating Quantity...');
        this.service.deleteFromCart(id, key).then((results) => this.handleCart(results));
    }
    addToCart(id, key) {
        //this.presentToast1('Updating Quantity...')
        this.service.addToCart(id, key).then((results) => this.handleCart(results));
    }
    updateCart(results) {
        this.service.loadCart().then((results) => this.handleCart(results));
    }
    submitCoupon() {
        this.service.submitCoupon().then((results) => this.handleCoupon(results));
        
    }
    handleCoupon(results) {
        console.log(results);
        this.cart.coupon = "";
       // this.functions.showAlert("", results._body);
        this.service.loadCart().then((results) => this.handleCart1(results));
    }
    removeCoupon() {
        //this.presentLoading();
        this.service.removeCoupon(this.cart.applied_coupons).then((results) => this.handleRemoveCoupon(results));
    }
    handleRemoveCoupon(results) {
        // this.functions.showAlert("", results.message);
        this.service.loadCart().then((results) => this.handleCart1(results));

    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'hide',
            cssClass: 'loader1',
            content: `<ion-avatar>
             <img  src="assets/imgs/loader.svg" /></ion-avatar>`
        });
        this.loader.present();
    }
   
    dismissLoading() {
        this.loader.dismiss();
    }
    close(){
        this.nav.pop();
    }
    
    handleResults(a) {
        if (a.message.status == 'success') {
            this.presentToast(a.message.text);

        } else {
            this.presentToast(a.message.text);
        }
    }
    updateShipping(method) {
        this.chosen_shipping = method;
        this.service.updateShipping(method).then((results) => this.handleShipping(results));
    }
    handleShipping(results) {
        this.cart = results;
    }

    getProduct(id) {
        this.values.navback = "cart";
        this.nav.push(ProductPage, id);
    }
   
   


    presentToast(text) {
        this.toast = this.toastCtrl.create({
            message: text,
            duration: 1500,
            position: 'bottom',
           
        });
        this.toast.present();
    }
  
    dismissToast() {
        this.toast.dismiss();
    }
    ionViewWillEnter(){
        this.service.loadCart()
            .then((results) => this.handleCartInit(results));
    }
  
}