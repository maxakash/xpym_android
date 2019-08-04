import { Component } from '@angular/core';
import { NavParams, Platform, NavController } from 'ionic-angular';
import { Values } from '../../providers/service/values';
import { Service } from '../../providers/service/service';

@Component({
  templateUrl: 'post.html'
})
export class Post {
  post: any;
  id: any;
  constructor(public service: Service, public values: Values, public platform: Platform, params: NavParams, public nav: NavController) {
    this.platform.registerBackButtonAction(() => {
      this.nav.pop();
    });
    this.values.homecount = 1;
    console.log(params.data)
    this.id = params.data.id;
    this.service.getPage(this.id)
      .then((results) => this.post = results);
  }
  close(){
    this.nav.pop();
  }
}
