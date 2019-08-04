import { Component,ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ToastController, AlertController, ViewController  } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CheckoutService } from '../../../providers/service/checkout-service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Service } from '../../../providers/service/service';
import { Config } from '../../../providers/service/config';
import { CartService } from '../../../providers/service/cart-service';
import { Storage } from '@ionic/storage';






@Component({
    selector: 'page-billing-address-form',
    templateUrl: 'billing-address-form.html'
})
export class BillingAddressForm {
    billingAddressForm: any;
    billing: any;
    regions: any;
    status: any;
    errorMessage: any;
    address: any;
    form: any;
    states: any;
    OrderReview: any;
    loginData: any;
    id: any;
    couponStatus: any;
    buttonSubmit: boolean = false;
    buttonSubmitLogin: boolean = false;
    buttonSubmitCoupon: boolean = false;
    PlaceOrder: any;
    loader: any;
    mydate: any;
    time: any;
    date: any;
    selectedDate: any;
    shipping: any;
    order: any;
    blank:boolean=true;
    enableBillingAddress: boolean = true;
    enableShippingMethods: boolean = false;
    enableShippingForm: boolean = false;
    chosen_shipping: any;
    enablePaymentMethods: boolean = false;
    showAddress: boolean = false;
    loadLogin: any;
    order_id: any;;
    error: any;
    public disableSubmit: boolean = false;
    errors: any;
    gres: any;
    Checkout: any;

    constructor(public platform: Platform, public cartservice: CartService, public cd: ChangeDetectorRef, public viewctrl: ViewController, public storage: Storage, public toast: ToastController, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public iab: InAppBrowser, public service: CheckoutService, params: NavParams, public functions: Functions, public values: Values, public nav: NavController, public service1: Service, public config: Config) {
        this.platform.registerBackButtonAction(() => {
            this.nav.pop();

        });
        this.form = params.data.form;
        
        console.log(params.data.form)
        this.values.orderid = null;
        this.Checkout = "Continue";
        this.billing = {};
        this.form.payment_method='tinkoff';

        this.shipping = {};
        this.showAddress = true;
        this.enableShippingMethods = true;
        this.enablePaymentMethods = true;




    }
    handleform(results) {
        this.form = results;
        console.log(this.form)
        this.form.shipping = true;
        this.service.updateOrderReview(this.form).then((results) => this.handleOrderReviews(results));

    }


    presentLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'hide',
            cssClass: 'loader',
            content: `<ion-avatar>
             <img style="background-color: blue" src="assets/imgs/loader.svg" /></ion-avatar>`
        });
        this.loader.present();
    }
    presentToast(text) {
        let toast = this.toast.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }

    handleOrderReviews(results) {
        this.OrderReview = results;
        this.form.payment=this.OrderReview.payment;
        console.log(this.OrderReview);
        this.chosen_shipping = this.OrderReview.chosen_shipping;

        //console.log(this.chosen_shipping);
    }
    checkout() {
        this.storage.set('preferred_payment',this.form.payment_method);
        this.values.check = 1;

        if (this.form.payment_method != undefined) {
           
            this.buttonSubmit = true;
            this.blank=false;
            this.presentLoading();
          
            if (this.form.payment_method == 'cod' || this.form.payment_method == 'COD') {
                this.service.checkout(this.form).then((results) => this.handleBilling(results));
            } 
            else  {

                this.service.checkout(this.form).then((results) => this.handleRazorpay(results));
            }
        }
       
    }


    handleRazorpay(results) {
        this.dismissLoading();
        console.log(results)
        if (results.result == 'success') {
            this.presentLoading();
            console.log(results.redirect);
            var options = "location=no,hidden=yes,hideurlbar=yes";
            let browser = this.iab.create(results.redirect, '_blank', options);
            browser.on('loadstop').subscribe(data => {
                browser.show();

                this.buttonSubmit = false;
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
                    this.viewctrl.dismiss(this.order_id);
                    browser.close();
                   
                    
                   

                }
                //http://xpym.ru/wp-content/plugins/tinkoff-woocommerce/tinkoff/success.php?Success=true&ErrorCode=0&Message=None&Details=&Amount=9500&MerchantEmail=hello%40xpym.ru&MerchantName=Xpym&OrderId=736&PaymentId=79042440&TranDate=&BackUrl=http%3A%2F%2Fxpym.ru&CompanyName=%D0%98%D0%9F+%D0%90%D0%A0%D0%98%D0%9A%D0%9E%D0%92+%D0%A0%D0%90%D0%A8%D0%98%D0%94+%D0%90%D0%A1%D0%9B%D0%91%D0%95%D0%9A%D0%9E%D0%92%D0%98%D0%A7&EmailReq=hello%40xpym.ru&PhonesReq=9992003015




                else if (data.url.indexOf('Success=false') != -1 ) {
                    browser.close();
                    this.dismissLoading();
                    this.buttonSubmit = false;
                    this.viewctrl.dismiss().then((data) => {
                        let alert = this.alertCtrl.create({
                            title: 'Не удалось оплатить заказ',
                            message: 'Попробуйте ещё раз или выберите оплату наличными.',
                            enableBackdropDismiss: true,
                            buttons: [
                                {
                                    text: 'продолжить',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                }
                            ]
                        });
                        alert.present();
                    })
                }


                else if (data.url.indexOf('order-received') != -1) {
                    var str = data.url;
                    var pos1 = str.lastIndexOf("order-received/");
                    var pos2 = str.lastIndexOf("/?key=");
                    var pos3 = pos2 - (pos1 + 15);
                    this.order_id = str.substr(pos1 + 15, pos3);
                    this.values.cart = [];
                    this.values.count = 0;
                    this.values.orderid = this.order_id;
                    this.dismissLoading();
                    browser.close();
                    this.viewctrl.dismiss(this.order_id);
                }
              

            });

            browser.on('exit').subscribe(data => {
                if(this.loader){ 
                    this.dismissLoading();
                }
                console.log(data.type)
               
                this.viewctrl.dismiss(this.order_id);

            });



        }
    }
//OrderId=451&PaymentId=
//Success=true&ErrorCode=0
//xpym.ru/checkout/order-received/426/?key=wc_order_nKVpz4rotgsto
//Success=false&ErrorCode=1051

//http://xpym.ru/wp-content/plugins/tinkoff-woocommerce/tinkoff/success.php?Success=true&ErrorCode=0&Message=None&Details=&Amount=9500&MerchantEmail=hello%40xpym.ru&MerchantName=Xpym&OrderId=736&PaymentId=79042440&TranDate=&BackUrl=http%3A%2F%2Fxpym.ru&CompanyName=%D0%98%D0%9F+%D0%90%D0%A0%D0%98%D0%9A%D0%9E%D0%92+%D0%A0%D0%90%D0%A8%D0%98%D0%94+%D0%90%D0%A1%D0%9B%D0%91%D0%95%D0%9A%D0%9E%D0%92%D0%98%D0%A7&EmailReq=hello%40xpym.ru&PhonesReq=9992003015
//http://xpym.ru/wp-content/plugins/tinkoff-woocommerce/tinkoff/success.php?Success=false&ErrorCode=1051&Message=%D0%9D%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BE%D1%87%D0%BD%D0%BE+%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2+%D0%BD%D0%B0+%D0%BA%D0%B0%D1%80%D1%82%D0%B5.&Details=&Amount=9500&MerchantEmail=hello%40xpym.ru&MerchantName=Xpym&OrderId=738&PaymentId=79042509&TranDate=&BackUrl=http%3A%2F%2Fxpym.ru&CompanyName=%D0%98%D0%9F+%D0%90%D0%A0%D0%98%D0%9A%D0%9E%D0%92+%D0%A0%D0%90%D0%A8%D0%98%D0%94+%D0%90%D0%A1%D0%9B%D0%91%D0%95%D0%9A%D0%9E%D0%92%D0%98%D0%A7&EmailReq=hello%40xpym.ru&PhonesReq=9992003015
    handleBilling(results) {
        console.log(results)
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
            this.viewctrl.dismiss(this.order_id);
            
        } else if (results.result == "failure") {
            if (this.loader) {
                this.dismissLoading();
            }
            this.functions.showAlert("", results.messages);
        }
        this.buttonSubmit = false;

    }



    handleResults(a) {
        this.buttonSubmitLogin = false;
        //this.form.shipping = true;
        if (a.user_logged) {
            this.form = a;
            this.states = this.form.state[this.form.billing_country];
            this.values.isLoggedIn = a.user_logged;
            this.values.customerName = a.billing_first_name;
            this.values.customerId = a.user_id;
            this.values.logoutUrl = a.logout_url;
            this.showAddress = true;
            this.enableShippingMethods = true;
            this.enablePaymentMethods = true;
            this.service.updateOrderReview(this.form).then((results) => this.handleOrderReviews(results));
        }
    }
    changePayment(method) {
        console.log(method);
        this.cd.detectChanges();
        this.form.payment_method=method;
      this.cd.detectChanges();
        //  this.form.payment_instructions = this.form.payment[this.form.payment_method].description; 
       
    }

   
    updateOrderReview() {
        this.service.updateOrderReview(this.form).then((results) => this.handleOrderReviews(results));
    }
    
   



}