import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class Pipe {

  constructor(public http: Http) {
    console.log('Hello Pipe Provider');
  }

}
