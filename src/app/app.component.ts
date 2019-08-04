import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, Nav, MenuController, App, ToastController, ActionSheetController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { Config } from '../providers/service/config';
import { TranslateService } from '@ngx-translate/core';
import { ProductsPage } from '../pages/products/products';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Orders } from '../pages/order/orders/orders';
import { Network } from '@ionic-native/network';
import { Otp } from '../pages/account/otp/otp';
import { StatusBar } from '@ionic-native/status-bar';
import { EditAddressForm } from '../pages/address/edit-address-form/edit-address-form';
import { MyInformation } from '../pages/account/my-information/my-information';
import { Promo } from '../pages/promo/promo';















@Component({
    templateUrl: 'app.html'

})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    @ViewChild('myitem') myitem: ElementRef;
    @ViewChild('myitem1') myitem1: ElementRef;
    rootPage: any;
    status: any;
    items: any = {};
    categories: any;
    image: any;
    name: any;
    height: any;
    public counter = 0;
    showmore: boolean = false;
    data: any = {};
    subCategories: any;
    subcat: boolean = false;
    catId: any;

    constructor(public statusbar: StatusBar, private network: Network, public toastctrl: ToastController, public actionctrl: ActionSheetController, public storage: Storage, public app: App, public nativeStorage: NativeStorage, public platform: Platform, splashScreen: SplashScreen, public service: Service, public config: Config, public values: Values, public translateService: TranslateService, public menuCtrl: MenuController) {
        this.platform.ready().then(() => {

            this.statusbar.backgroundColorByHexString('#E6ffffff');
           
            this.statusbar.overlaysWebView(false);
            this.statusbar.styleDefault();

            //this.statusbar.styleLightContent();
            this.storage.get('LoggedIn').then((val) => {
                if (val == 1) {

                    this.rootPage = 'home';
                }

                else if (val == 2) {
                    this.rootPage = 'address';
                }
                else {
                    this.rootPage = Promo;
                }

            }).then((data => {
                this.service.load().then((results) => this.handleService(results));

                this.storage.get('blocks').then(data => {
                    if (data) {

                        this.service.blocks = data;

                        if (this.values.app_dir == 'rtl') this.platform.setDir('rtl', true);
                        this.translateService.setDefaultLang(this.values.language);
                    }
                }, error => console.error(error));

                this.myitem.nativeElement.style.height = (platform.height() - 320) / 2 + 'px';
                this.myitem1.nativeElement.style.height = (platform.height() - 192) / 2 + 'px';





                this.network.onDisconnect().subscribe(() => {
                    this.presentToast("Подключение к Интернету отсутствует");

                });
                this.network.onConnect().subscribe(() => {
                    setTimeout(() => {
                        this.service.load().then((results) => this.handleService(results));
                        this.nav.setRoot('home');
                    }, 500);
                });
                this.translateService.setDefaultLang('english');


                // splashScreen.hide();
                this.storage.get('featured').then(data => {
                    if (data) {
                        this.service.featuredProduct = data;

                    }

                }, error => console.error(error));
                this.service.getfeaturedProduct();
            }));

        });




    }
    support() {
        this.values.helppage = true;
        this.values.homepage = false;
        this.values.loginpage = false;
        this.values.orderpage = false;
        this.values.addresspage = false;
        this.nav.push(MyInformation);
    }
    home() {
        this.values.helppage = false;
        this.values.homepage = true;
        this.values.loginpage = false;
        this.values.orderpage = false;
        this.values.addresspage = false;
        this.nav.setRoot("home");
    }


    getCategory(id, name) {
        this.subcat = false;
        this.values.onsale = false;
        this.values.newCollections = false;
        this.values.featuredProducts = false;
        this.items.id = id;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.push(ProductsPage, this.items);
    }

    getSubCategoryDropdown(id, name) {
        this.subCategories = "";
        this.subCategories = [];
        for (var i = 0; i < this.service.categories.length; i++) {
            if (this.service.categories[i].parent == id) {
                this.subCategories.push(this.service.categories[i]);
            }

            this.subcat = true;
            this.catId = id;

        }
        if (this.subCategories == undefined || this.subCategories == "" || this.subCategories == []) {
            this.getCategory(id, name);
        }
    }
    getSubCategoryDropup(id) {
        if (id == this.catId) {
            this.subCategories = "";
            this.subcat = false;
            this.catId = "";
        } else {
            this.subCategories = "";
            this.subCategories = [];
            for (var i = 0; i < this.service.categories.length; i++) {
                if (this.service.categories[i].parent == id) {
                    this.subCategories.push(this.service.categories[i]);
                }
                this.subcat = true;
                this.catId = id;
            }
        }
    }

    login() {
        this.values.helppage = false;
        this.values.homepage = false;
        this.values.loginpage = true;
        this.values.orderpage = false;
        this.values.addresspage = false;
        this.nav.push(Otp);
    }


    myorders() {
        this.values.helppage = false;
        this.values.homepage = false;
        this.values.loginpage = false;
        this.values.orderpage = true;
        this.values.addresspage = false;
        this.nav.push(Orders);

    }
    getaddress() {
        
        this.nav.push('address');

    }
    editaddress() {
        this.values.showbackbutton=false;
        this.values.helppage = false;
        this.values.homepage = false;
        this.values.loginpage = false;
        this.values.orderpage = false;
        this.values.addresspage = true;
        this.nav.push(EditAddressForm);
    }

    logout() {
        this.service.logout().then((data) => {
            this.presentToast('вышли из...');
            this.nav.setRoot('home');
        });

        //this.service.load();

    }
    presentToast(message) {
        let toast = this.toastctrl.create({
            message: message,
            duration: 1500,
            position: 'bottom'
        });
        toast.present();
    }
    handleService(results) {
        if (this.values.app_dir == 'rtl') this.platform.setDir('rtl', true);
        this.translateService.setDefaultLang(this.values.language);


    }



}