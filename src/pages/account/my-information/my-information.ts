import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';
import { Post } from '../../post/post';

@Component({
    templateUrl: 'my-information.html',
    selector:'page-my-information'
})
export class MyInformation {
    search:any;
    
    constructor(public nav: NavController, public service: Service,public toast:ToastController, public platform: Platform, public values: Values) {
        this.platform.registerBackButtonAction(() => {
            this.nav.pop();
        });
        this.search = this.values.data.search;

}


openwhatsapp(){
    window.open("whatsapp://send?phone=79955056002", "_system", "location = yes");
}
    opentelegram() {
        window.open("https://t.me/Xpym_bot", "_system", "location = yes");
    }
    openviber() {
        window.open("viber://pa?chatURI=Xpym", "_system", "location = yes");
    }
    openurl1(){
        var id = this.search.link1;
        console.log(this.values.data.search.link1)
     this.nav.push(Post,{id})
}
    openurl2() {
        var id = this.search.link2;
       console.log(this.values.data.search.link2)
        this.nav.push(Post, { id })
    }
    openurl3() {

        var id = this.search.link3;
     console.log(this.values.data.search.link3)
        this.nav.push(Post, { id })
    }
}