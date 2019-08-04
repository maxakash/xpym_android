import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchService } from '../../providers/service/search-service';
import { Service } from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { ModalController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { ProductPage } from '../product/product';
import { Searchbar } from 'ionic-angular';


@Component({
    selector: 'search-page',
    templateUrl: 'search.html'
})

export class SearchPage {
    @ViewChild("contentRef") contentHandle: Content;
    @ViewChild('searchbar') searchbar: Searchbar;
    id: any;
    searchKey: any;
    has_more_items: boolean = true;
    options: any;
    status: any;
    products: any;
    moreProducts: any;
    quantity: any;
    filter: any;
    shouldShowCancel: boolean = true;
    loading: boolean = false;
    searchedName: any;
    hidecategory: boolean = false;
    items: any;
    search:any=[];
    myInput:any;
    catId: any;
    hidenoproduct:boolean=true;
    subcat: boolean = false;
    categories: any;
    subCategories: any;
    popularSearches: any;
    showtrending:boolean=true;
    private tabBarHeight;
    private topOrBottom: string;
    private contentBox;
   

    constructor(public mainservice: Service, private platform: Platform,public modalCtrl: ModalController, public nav: NavController, public service: SearchService, public values: Values, params: NavParams, public functions: Functions) {
        this.platform.registerBackButtonAction(() => {
            this.nav.pop();
        });
      this.search=this.values.data.search;
      console.log(this.search)
        this.filter = {};
        this.values.filter = {};
        this.options = [];
        this.quantity = "1";
        this.filter.page = 1;
        this.filter.status="publish";
        this.items = [];
        this.popularSearches = [];
    }
    getCart() {
        this.nav.push(CartPage);
    }

    getsearch(search){
        this.loading = true;
        this.myInput=search;
        this.showtrending=false;
        this.filter.page = 1;
        this.filter.search = search;
        console.log(this.filter);
        this.service.getSearch(this.filter).then((results) => {
            this.loading = false;
            this.hidenoproduct=true;
            this.products = results;


        });
    }

    onInput($event) {
     console.log($event)
        this.loading = true;
        this.showtrending = false;
        this.hidecategory = true;
        this.filter.page = 1;
        this.filter.search = $event.srcElement.value;
        


        this.service.getSearch(this.filter).then((results) => {
            this.loading = false;
            this.hidenoproduct = true;
            this.showtrending = false;
            this.products = results;
            


        });
    }
    
   
       


    onKey(e) {
        if (e.keyCode == 13) {
            let activeElement = <HTMLElement>document.activeElement;
            activeElement && activeElement.blur && activeElement.blur();
        }
    }

   
  
    onCancel($event) {
        console.log('cancelled');
        this.hidecategory = false;
        this.showtrending=true;
        this.products=[];
        this.hidenoproduct=false;
    }
    getProduct(id) {
        this.nav.push(ProductPage, id);
    }
    doInfinite(infiniteScroll) {
        this.filter.page += 1;
        this.service.getSearch(this.filter).then((results) => this.handleMore(results, infiniteScroll));
    }
    handleMore(results, infiniteScroll) {
        if (results != undefined) {
            for (var i = 0; i < results.length; i++) {
                this.products.push(results[i]);
            };
        }
        if (results == 0) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }
    

    
   
   
    setListView() {
        this.values.listview = true;
    }
    setGridView() {
        this.values.listview = false;
    }
   
   /* getFilter() {
        let modal = this.modalCtrl.create(Filter, this.filter);
        modal.onDidDismiss(data => {
            if (this.values.applyFilter) {
                this.filter = this.values.filter;
                this.has_more_items = true;
                this.filter.page = 1;
                this.filter.opts = undefined;
                this.filter.component = undefined;
                this.service.getSearch(this.filter).then((results) => this.handleFilterResults(results));
            }
        });
        modal.present();
    }
    */
    handleFilterResults(results) {
        this.products = results;
    }
   
    scrollingFun(e) {
        if (e.scrollTop > this.contentHandle.getContentDimensions().contentHeight) {
            if (document.querySelector(".tabbar")) document.querySelector(".tabbar")['style'].display = 'none';
            if (this.topOrBottom == "top") {
                this.contentBox.marginTop = 0;
            } else if (this.topOrBottom == "bottom") {
                this.contentBox.marginBottom = 0;
            }
        } else {
            if (document.querySelector(".tabbar")) document.querySelector(".tabbar")['style'].display = 'flex';
            if (this.topOrBottom == "top") {
                this.contentBox.marginTop = this.tabBarHeight;
            } else if (this.topOrBottom == "bottom") {
                this.contentBox.marginBottom = this.tabBarHeight;
            }
        } //if else
    }
    ionViewDidEnter() {
        setTimeout(() => {
            this.searchbar.setFocus();
        });
        this.topOrBottom = this.contentHandle._tabsPlacement;
        this.contentBox = document.querySelector(".scroll-content")['style'];
        if (this.topOrBottom == "top") {
            this.tabBarHeight = this.contentBox.marginTop;
        } else if (this.topOrBottom == "bottom") {
            this.tabBarHeight = this.contentBox.marginBottom;
        }
    }
}