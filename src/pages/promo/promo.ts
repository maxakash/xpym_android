import { Component } from '@angular/core';
import { NavParams, Platform, NavController } from 'ionic-angular';
import { Values } from '../../providers/service/values';
import { Storage } from '@ionic/storage';
import { Service } from '../../providers/service/service';
import { StatusBar } from '@ionic-native/status-bar';





@Component({
  templateUrl: 'promo.html',
  selector:'page-promo'
})
export class Promo {
  post: any;
  id: any;
  constructor(public storage: Storage, public service: Service, public StatusBar: StatusBar, public values: Values, public platform: Platform, params: NavParams, public nav: NavController) {
    

    
    
  }
  close(){
    this.storage.set('LoggedIn',2);
    this.nav.push('address');
  }

  ionViewWillEnter(){
this.StatusBar.overlaysWebView(true);

  }
  ionViewWillLeave(){
    this.StatusBar.overlaysWebView(false);
    this.StatusBar.backgroundColorByHexString('#CCffffff'); 
    this.StatusBar.styleDefault();

  }
 
}
