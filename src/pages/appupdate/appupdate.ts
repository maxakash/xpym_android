import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-appupdate',
  templateUrl: 'appupdate.html',
})
export class AppupdatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

 open(){
   window.open("https://play.google.com/store/apps/details?id=app.mazaakiya.com&hl=ru", "_system");
 }

}
