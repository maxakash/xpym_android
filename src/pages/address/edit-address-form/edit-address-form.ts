import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {  Platform, NavController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators/map';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Values } from '../../../providers/service/values';
import { Storage } from '@ionic/storage';
import { Service } from '../../../providers/service/service';
import { StatusBar } from '@ionic-native/status-bar';









import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    Marker,
    MarkerOptions,
    Polygon,
    Geocoder,





} from '@ionic-native/google-maps';


@Component({
    templateUrl: 'edit-address-form.html',
    selector: 'page-edit-address-form'
})
export class EditAddressForm {
    @ViewChild('apartment') apartment;
    @ViewChild('map') myitem: ElementRef;
    map: GoogleMap;
    location: any;;
    marker: Marker;
    marker1: Marker;
    points: any = {};
    polygon: Polygon;
    address: any = {};
    address1: any = {};
    homeloc: any;
    editAddress: any = {};
    showcorrectadd: boolean = false;
    showincorrectadd: boolean = false;
    vendorid:any;



    constructor(public http: Http, public platform: Platform, public StatusBar: StatusBar, private cd: ChangeDetectorRef, private locationAccuracy: LocationAccuracy, public values: Values, public storage: Storage, public nav: NavController, public toastCtrl: ToastController,public service:Service) {
      
    }

    getzones() {
        this.storage.get('homeloc').then((data) => {
            this.homeloc = data;
            console.log(this.homeloc)

        });
        
        this.http.get('http://xpym.ru/zones.json').pipe(map(res => res.json())).subscribe(data => {
            //  console.log(data.zones[0].coordinates);


            for (let item in data.zones) {
                console.log(data.zones[item].coordinates)
                if (data.zones[item].coordinates) {
                    this.points[item] = data.zones[item].coordinates;
                }



            }
           
            this.storage.get('address').then((data) => {
                this.address1 = data;
                this.address = data.address_2 ;
                this.apartment = data.address_1;
                console.log(data);
                this.showcorrectadd = true;
                this.cd.detectChanges();
                this.loadMap();
            });


        });

    }

    close(){
        this.nav.pop();
    }
    ionViewWillEnter() {

        this.getzones();



    }

    loadMap() {

        var div = document.getElementById("map_canvas");
        this.map = GoogleMaps.create(div, {
            camera: {
                target: this.homeloc,
                zoom: 17

            }
        });
        this.createMarker(this.homeloc).then((marker: Marker) => {
            this.marker = marker;




        });
        




        for (let item in this.points) {
            if (this.points[item]) {
                console.log("added polygon")
                this.polygon = this.map.addPolygonSync({
                    points: this.points[item],
                    strokeColor: '#ffd00a',
                    fillColor: 'rgba(255, 208, 10,0.3)',
                    strokeWidth: 6,
                    clickable: true
                });
               // this.polygon.setFillColor("");

                this.polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {

                    //console.log(data);

                    this.createMarker1(data[0],item).then((marker: Marker) => {
                        this.marker = marker;


                    });


                });
            }
            this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {

                this.createMarker2(data[0]).then((marker: Marker) => {
                    this.marker1 = marker;
                    //marker.remove();



                });

            });
        }


       


    }



    //marker when inside polygon
    createMarker(loc) {

        let markeroptions: MarkerOptions = {
            position: loc,


            icon: {
                url: 'assets/imgs/pin1.png',
                size: { width: 44, height: 60 }
            }


        };

        return this.map.addMarker(markeroptions);
    }
    //marker put initially 
    createMarker1(loc,item) {
        this.homeloc = loc;
        this.vendorid = item;
        Geocoder.geocode({
            position: loc,

        }).then((results) => {
            console.log("got location with address" + results[0]);
            console.log(results[0].thoroughfare)
            console.log(results[0].subThoroughfare)
            console.log(results[0].locality)
            console.log(results[0].adminArea)
            console.log(results[0].postalCode)
           
            this.editAddress["city"] = results[0].locality;
            this.editAddress["postcode"] = results[0].postalCode;
            this.editAddress["country"] = results[0].country;

            this.address = results[0].thoroughfare + ", " + "дом " + results[0].subThoroughfare ;
            this.editAddress["address_2"] = this.address;
            this.showincorrectadd = false;
            this.showcorrectadd = true;
            this.cd.detectChanges();
            console.log(this.address)



        }
        );

        this.map.clear();
        for (let item in this.points) {
            if (this.points[item]) {
                console.log("added polygon on zone click")
                this.polygon = this.map.addPolygonSync({
                    points: this.points[item],
                    strokeColor: '#ffd00a',
                    fillColor: 'rgba(255, 208, 10,0.3)',
                    strokeWidth: 6,
                    clickable: true
                });
                //this.polygon.setFillColor("");


                this.polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {
                    console.log("geocode called")

                    //console.log(data);
                    this.createMarker1(data[0],item).then((marker: Marker) => {
                        this.marker = marker;


                    });
                    console.log(data[0])


                });

            }

        }
        let markeroptions: MarkerOptions = {
            position: loc,


            icon: {
                url: 'assets/imgs/pin.png',
                size: { width: 230, height: 117 }
            }


        };

        return this.map.addMarker(markeroptions);
    }
    //marker when outside polygon
    createMarker2(loc) {
        Geocoder.geocode({
            position: loc,

        }).then((results) => {
            console.log("got location with address" + results)
           
              
            this.address = results[0].thoroughfare + ", " + "дом " + results[0].subThoroughfare ;
            this.showcorrectadd = false;
            this.showincorrectadd = true;
            this.cd.detectChanges();
            console.log(this.address)



        }
        );

        this.map.clear();
        for (let item in this.points) {
            if (this.points[item]) {
                console.log("added polygon")
                this.polygon = this.map.addPolygonSync({
                    points: this.points[item],
                    strokeColor: '#ffd00a',
                    fillColor: 'rgba(255, 208, 10,0.3)',
                    strokeWidth: 6,
                    clickable: true
                });
               // this.polygon.setFillColor("");

                this.polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {

                    //console.log(data);

                    this.createMarker1(data[0],item).then((marker: Marker) => {
                        this.marker = marker;


                    });



                });
            }

        }



        let markeroptions: MarkerOptions = {
            position: loc,


            icon: {
                url: 'assets/imgs/pin2.png',
                size: { width: 262, height: 115 }
            }


        };


        return this.map.addMarker(markeroptions);
    }
    getlocation() {

        console.log(this.locationAccuracy.canRequest());



        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                this.loadMap();
                console.log('Request successful')
            },
            error => {
                this.loadMap();
                console.log('Error requesting location permissions', error)
            }
        );



    }



    saveaddress() {
        console.log(this.apartment);
        console.log(this.vendorid);
        if (this.vendorid) {

            console.log(this.editAddress);
            this.editAddress["address_1"] = this.apartment;
            this.storage.set('LoggedIn', 1);
            this.storage.set('homeloc', this.homeloc);
            console.log(this.vendorid);
            
           
            this.storage.set('address', this.editAddress);
            this.marker = undefined;
            this.service.block = [];
            this.showcorrectadd = undefined;
            this.showincorrectadd = undefined;
          
              
                this.storage.set('vendorid', this.vendorid);
                this.values.vendorid = this.vendorid;
                console.log(this.vendorid);

                this.service.load1(this.vendorid).then((data) => {
                    if (this.service.block) {
                        console.log(this.service.block)
                        console.log("vendor changed")
                        this.map.destroy();
                        this.service.updateaddress(this.editAddress, this.values.phonenumber)
                            .then((results) => {
                                console.log(results)
                                
                            });
                        this.nav.setRoot('home')
                    }



                });
            
            
           

        }
        else if (!this.apartment) {

            this.presentToast();

        }
        else {
            console.log("ajasdh")
            this.nav.pop();

        }


    }
    presentToast() {
        let toast = this.toastCtrl.create({
            message: "Введите номер вашей квартиры",
            duration: 2000,
            position: "bottom"
        });
        toast.present();
    }
}




