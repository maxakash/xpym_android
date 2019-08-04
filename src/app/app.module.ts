import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EditAddressForm } from '../pages/address/edit-address-form/edit-address-form';
import { MyInformation } from '../pages/account/my-information/my-information';
import { OrderDetails } from '../pages/order/order-details/order-details';
import { Orders } from '../pages/order/orders/orders';
import { CartPage } from '../pages/cart/cart';
import { BillingAddressForm } from '../pages/checkout/billing-address-form/billing-address-form';
import { OrderSummary } from '../pages/checkout/order-summary/order-summary';
import { ProductPage } from '../pages/product/product';
import { ProductsPage } from '../pages/products/products';
import { SearchPage } from '../pages/search/search';
import { Post } from '../pages/post/post';
import { Promo} from '../pages/promo/promo';
import { KeysPipe } from '../pipes/pipe'
import { HTTP } from '@ionic-native/http';
import { Otp } from '../pages/account/otp/otp';
import { AppupdatePage} from '../pages/appupdate/appupdate'








/*------------------------Providers----------------------------------*/

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../providers/service/cart-service';
import { WishlistService } from '../providers/service/wishlist-service';
import { CategoryService } from '../providers/service/category-service';
import { CheckoutService } from '../providers/service/checkout-service';
import { Config } from '../providers/service/config';
import { Functions } from '../providers/service/functions';
import { ProductService } from '../providers/service/product-service';
import { SearchService } from '../providers/service/search-service';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { OrderModule } from 'ngx-order-pipe';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Firebase } from '@ionic-native/firebase';
import { Network } from '@ionic-native/network';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { GoogleMaps } from "@ionic-native/google-maps";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { BackbuttonModule } from "ionic3-android-backbutton";
import {  LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu);









const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB5gOl7Ts8AonFCk6sAQ7GG4xqNnc07tQI",
  authDomain: "xpym-49667.firebaseapp.com",
  databaseURL: "https://xpym-49667.firebaseio.com",
  projectId: "xpym-49667",
  storageBucket: "xpym-49667.appspot.com",
  messagingSenderId: "1011164521015"
};





export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({

  declarations: [
    MyApp,
    EditAddressForm,
    MyInformation,
    OrderDetails,
    Orders,
    Otp,
    AppupdatePage,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    ProductPage,
    ProductsPage,
    SearchPage,
    KeysPipe,
    Post,
    Promo





  ],

  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    OrderModule,
    BrMaskerModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'ios-arrow-back',
    }),
    BackbuttonModule.forRoot(),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],


  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Otp,
    AppupdatePage,
    EditAddressForm,
    MyInformation,
    OrderDetails,
    Orders,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    ProductPage,
    ProductsPage,
    SearchPage,
    Post,
    Promo
  ],

  providers: [
    { provide: LOCALE_ID, useValue: "ru" },
    DatePipe,
    CartService,
    WishlistService,
    CategoryService,
    CheckoutService,
    Config,
    Functions,
    ProductService,
    SearchService,
    Service,
    Values,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    NativeStorage,
    HTTP,
    Keyboard,
    Firebase,
    Network,
    GoogleMaps,
    LocationAccuracy,
    { provide: ErrorHandler, useClass: IonicErrorHandler }


  ]
})
export class AppModule { }
