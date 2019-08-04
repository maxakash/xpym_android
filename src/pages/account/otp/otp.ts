import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Firebase } from '@ionic-native/firebase';
import * as firebase from 'firebase/app';
import { Values } from '../../../providers/service/values'
import { Service } from '../../../providers/service/service';
import { Storage } from '@ionic/storage';






@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',

})
export class Otp implements OnInit {
  @ViewChild('phoneNumber') phoneNumber;
  @ViewChild('code') code;
  toast: any;
  verid: any;
  Verify: any;
  Next:any;
  phonenumber:any;
  public disableSubmit: boolean = false;
  public disableSubmit1: boolean = false;

  constructor(public navCtrl: NavController, public storage: Storage, public service: Service, private toastctrl: ToastController, private values: Values, public navParams: NavParams, private fireAuth: AngularFireAuth, private fire: Firebase, ) {
    this.Verify = "Verify"
    this.Next="Next";
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
          if (token) {
           
            //this.doLogin();
          }
        });
    });
  }

  // tslint:disable-next-line
  private registerPhone(): void {
    if(this.phoneNumber.value){
      this.phonenumber = this.phoneNumber.value
    this.disableSubmit = true;
    this.Next="Sending OTP..."
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
        const { verificationId } = res;
        console.log('registerPhone verificationId', res);
        this.verid = verificationId;

      })
      .catch(err => {
        console.log('registerPhone error', err);
      })
    }
    else{
      this.presentToast("Please enter mobile number")
    }
  }
  

  private async verifyCode(code: string, verificationId: string) {
    console.log(code)
    console.log(verificationId)
    try {
      const credential = await firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      await firebase.auth().signInWithCredential(credential)
        .then(() => {
          this.doLogin();
        })
        .catch(err => {
          this.presentToast("Неверный код подтверждения");
          this.disableSubmit1 = false;
          this.Verify = "Verify";
          console.error('LoginPage verifyCode signInWithCredential err', err);
        })
    } catch (err) {
      console.error('LoginPage verifyCode err', err);
      this.disableSubmit1 = false;
      this.Verify = "Verify";
    }
  }
  verify() {
    this.Verify = "Verifying";
    this.disableSubmit1 = true;
    this.verifyCode(this.code.value, this.verid);
  }

  close() {
    this.values.otpsent = false;
    //this.navCtrl.setRoot(Home);
  }
  

  private doLogin(): void {
    this.service.socialLogin(this.phonenumber).then((data) => {
      console.log(data);
      this.storage.get('address').then((data) => {

        console.log(data);
        
        this.service.updateaddress(data, this.phonenumber)
          .then((results) => {
            console.log(results)
            
          });

      })

     
      this.navCtrl.push('home');
      this.values.otpsent = false;

    });
   // this.navCtrl.push(AccountRegister);
  }

  presentToast(text) {
    this.toast = this.toastctrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    this.toast.present();
  }
}

