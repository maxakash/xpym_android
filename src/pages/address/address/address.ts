import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, Platform, NavController, ToastController,LoadingController } from 'ionic-angular';
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
    LatLngBounds,
    Poly




} from '@ionic-native/google-maps';

@IonicPage({
    name: 'address'
})
@Component({
    templateUrl: 'address.html',
    selector: 'page-address'
})
export class Address {
    @ViewChild('apartment') apartment;
    @ViewChild('map') myitem: ElementRef;
    map: GoogleMap;
    location: any;;
    marker: Marker;
    marker1: Marker;
    points: any = {};
    polygon: Polygon;
    address: any = {};
    poly: Poly;
    homeloc: any;
    editAddress: any = {};
    showcorrectadd: boolean = false;
    showincorrectadd: boolean = false;
    vendorid: any;
    add:any={};
    loader:any;




    constructor(public http: Http, public platform: Platform,public loadCtrl: LoadingController, public StatusBar: StatusBar, private cd: ChangeDetectorRef, private locationAccuracy: LocationAccuracy, public values: Values, public storage: Storage, public nav: NavController, public toastCtrl: ToastController, public service: Service) {
        this.values.homecount=1;


    }

    getzones() {
        return new Promise(resolve => {
            this.http.get('http://xpym.ru/zones.json').pipe(map(res => res.json())).subscribe(data => {
                 console.log(data.zones);
                console.log(data);


                for (let item in data.zones) {
                    console.log(data.zones[item].coordinates)
                    if (data.zones[item].coordinates) {
                        this.points[item] = data.zones[item].coordinates;
                    }



                }
                /// console.log(this.points[0]);
                //this.loadMap();
                this.getlocation()
                

            });
        });
      
    }

    ionViewDidLoad() {
       // this.StatusBar.overlaysWebView(true);
       this.getzones();
       



    }

    loadMap() {
        var target = [

            { lat: 60.03615988476938, lng: 30.451032268829636 },
            { lat: 60.03514794001693, lng: 30.45258526784926 },
            { lat: 60.03464873824492, lng: 30.450978624649338 },
            { lat: 60.03568916602118, lng: 30.449656295604996 }


        ];
        //getting center of zone 1
        var latLngBounds = new LatLngBounds(target);
        console.log(latLngBounds.getCenter())

        var option = {
            enableHighAccuracy: true // use GPS as much as possible
        };


        var div = document.getElementById("map_canvas");
        this.map = GoogleMaps.create(div, {
            camera: {
                target: target,
                zoom: 25

            }
        });
        this.createMarker(latLngBounds.getCenter()).then((marker: Marker) => {
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

                    this.createMarker1(data[0], item).then((marker: Marker) => {
                        this.marker = marker;


                    });


                });
            }
            this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {

                this.createMarker2(data[0]).then((marker: Marker) => {
                    this.marker1 = marker;
                    //marker.remove();



                });

            },error => console.error(error));
     }


        this.map.getMyLocation(option).then((location) => {
            console.log(location)
            if(location.latLng){
                this.createMarker(location.latLng).then((marker: Marker) => {
                    this.marker = marker;
    
                });
                this.map.setCameraTarget(location.latLng);
               
            }
           
            

           

            // move the map's camera to position


        }, error => console.log(error));


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
    createMarker1(loc, item) {
        this.vendorid = item;
        console.log(this.vendorid);
        Geocoder.geocode({
            position: loc,

        }).then((results) => {
            this.homeloc = loc;
            console.log(results[0].thoroughfare);
            console.log(results[0].subThoroughfare);
            console.log(results[0].extra.lines[0]);
            this.address = results[0].thoroughfare + ", " + "дом " + results[0].subThoroughfare ;
           
            this.editAddress["city"] = results[0].locality;
            this.editAddress["postcode"] = results[0].postalCode;
            this.editAddress["country"] = results[0].country;

            
           
           console.log(this.address)
            this.editAddress["address_2"] =this.address;
            this.showincorrectadd = false;
            this.showcorrectadd = true;
            this.cd.detectChanges();
          



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
                // this.polygon.setFillColor("");


                this.polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {



                    //console.log(data);
                    this.createMarker1(data[0], item).then((marker: Marker) => {
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
            console.log(results[0].thoroughfare);
            console.log(results[0].subThoroughfare);
            console.log(results[0].extra.lines[0]);
           
          

         this.address = results[0].thoroughfare + ", " + "дом " + results[0].subThoroughfare ;
           console.log(this.address)
            this.showcorrectadd = false;
            this.showincorrectadd = true;
            this.cd.detectChanges();
          



        }
        );

        this.map.clear();
        for (let item in this.points) {
            if (this.points[item]) {
                console.log("vendorid" + item)
                this.polygon = this.map.addPolygonSync({
                    points: this.points[item],
                    strokeColor: '#ffd00a',
                    fillColor: 'rgba(255, 208, 10, 0.3)',
                    strokeWidth: 6,
                    clickable: true
                });
                //this.polygon.setFillColor("");

                this.polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {

                    //console.log(data);

                    this.createMarker1(data[0], item).then((marker: Marker) => {
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
    presentLoading() {
        this.loader = this.loadCtrl.create({
            spinner: 'hide',
            cssClass: 'loader1',
            content: `<ion-avatar>
             <img  src="assets/imgs/loader.svg" /></ion-avatar>`
        });
        this.loader.present();
    }

    dismissLoading() {
        this.loader.dismiss();
    }


    saveaddress() {
        console.log(this.apartment.value);
        console.log(this.vendorid);
        if (this.apartment.value) {
            //this.presentLoading();
            console.log(this.editAddress);
            this.editAddress["address_1"] = this.apartment.value;
            this.editAddress["state"] = "";
            this.storage.set('LoggedIn', 1);
            this.storage.set('homeloc', this.homeloc);
            this.storage.set('vendorid', this.vendorid);
            this.values.vendorid = this.vendorid;
            console.log(this.vendorid);
            this.storage.set('address', this.editAddress);
            this.marker=undefined;
            this.service.block=[];
            this.showcorrectadd=undefined;
            this.showincorrectadd=undefined;
            this.service.load1(this.vendorid).then((data)=>{
                if (this.service.block)
                {
                   // this.dismissLoading();
                        this.nav.setRoot('home')}
                
               

            });
            
        }
        else if (!this.apartment.value) {

            this.presentToast();

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




