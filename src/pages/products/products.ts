import { Component, ChangeDetectorRef} from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CategoryService } from '../../providers/service/category-service';
import { Values } from '../../providers/service/values';
import { ModalController } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { SearchPage } from '../search/search';
import { Service } from '../../providers/service/service';
import { CartService } from '../../providers/service/cart-service';





@Component({
    selector: 'page-products',
    templateUrl: 'products.html'
})
export class ProductsPage {
    products: any;
    moreProducts: any;
    count: any;
    category: any;
    showFilters: boolean = false;
    has_more_items: boolean = true;
    noProducts: boolean = false;
    status: any;
    options: any;
    pop: any;
    categories: any;
    items: any;
    quantity: any;
    filter: any;
    categoryName: any;
    loading: boolean = false;
    data: any;
    related: any;
    orderby: any;
    descending:any;
    actionsheet: any;
    action: any = 0;
    filter1: any = {};
    filter2:any={};
    attributeTerms: any = [];
    term: any;
    showselectedatt: any;
    showselectedterm: boolean = false;
    filterType:any;
    attributes:any;
    attributes1: any=[];
    attributes2: any=[];
    newattributes:any=[];
    index:any;
    showarray1:boolean=true;
    showarray2:boolean=false;
    showarray3:boolean=false;
    showarray4: boolean = false;




    constructor(public modalCtrl: ModalController,public viewctrl:ViewController, public service1:CartService,public cd:ChangeDetectorRef,public Service:Service,  public nav: NavController,  public service: CategoryService, params: NavParams, public values: Values) {
        
        this.values.homecount = 1;
        this.data = {};
        this.filter = {};
        this.filter.status = 'publish';
        this.filter1.status = 'publish';
        this.filter.stock_status ='instock';
        this.filter1.stock_status = 'instock';
         this.filter.vendor=this.values.vendorid;
        this.filter1.vendor = this.values.vendorid;
        this.filter1.page = 1;
        this.filter1.per_page =70;
        this.filter.page = 1;
        this.filter.per_page=70;
        this.count = 10;
        this.values.filter = {};
        this.options = [];
        this.items = [];
        this.quantity = "1";
        console.log(params)
        this.filter.category = params.data.item.id;
        this.filter1.category = params.data.item.id;
        this.categoryName = params.data.item.name;
        
        
       
    
}
    handleProducts(results) {
        this.products=results;
       
    }
  
    getAttributeTerms(id) {
        this.service.attributeTerms(id).then((results) => {
            this.attributeTerms[id] = results;
            this.cd.detectChanges();
        });
    }
    attributeterms(filterType){
        this.filter1.attribute = filterType.slug;
        this.showselectedatt = filterType.name;
       
        if (this.newattributes) {
            this.newattributes = [];
        }
        this.newattributes[0]=filterType;

        for(let item in this.attributes){
            if(this.attributes[item].name==filterType.name){
               // this.newattributes[item] = filterType;
                this.index=+item;
                console.log(this.index)
            }
        }
        for (let item in this.attributeTerms)
        {
            if(item==filterType.id){
               
                for (let items in this.attributeTerms[item]){
                    //this.attributeTerms[item].name = this.attributeTerms[item].name.replace(/\|/g, '');
                    //this.attributeTerms[item].name = this.attributeTerms[item].name.replace(/\x/g, '');
                   
                    this.newattributes.push(this.attributeTerms[item][items]);
                  
                }
            }
        }
        this.showarray1 = false;
        this.showarray2=true;
        this.cd.detectChanges();
       // console.log(this.values.attributes);
      //  console.log(this.attributeTerms);
       // console.log(this.showselectedatt)
    }
   
    getProduct(item) {
       
       
            let modal = this.modalCtrl.create(ProductPage, { item },
                { cssClass: "my-modal" });
            modal.onDidDismiss(data => {

            });
            modal.present();
        
    }
    applyfilter(filtertype){
        var temp1=filtertype
        if (this.showselectedatt==filtertype.name){
            this.showarray1 = true;
            this.showarray2 = false;
            this.showselectedatt = undefined
            this.cd.detectChanges();
        }
        else if (this.showselectedatt != filtertype.name){
            temp1.name = temp1.name + ' ' + '| x';
            this.products = undefined;
            if (this.attributes1) {
                this.attributes1 = [];
            }
            this.attributes1[0] = this.attributes[this.index];
            this.attributes1.push(temp1);

            console.log(this.attributes1)

            this.showselectedatt = filtertype.name;
            this.showarray1 = false;
            this.showarray2 = false;
            this.showarray3 = true;
            this.cd.detectChanges();
           
            if (!filtertype.order_by) {

                // console.log(filtertype)

                this.filter1.attribute_term = filtertype.id;
                this.filter1.vendor = this.values.vendorid;
                this.cd.detectChanges();
                this.service.load(this.filter1).then((results) => this.handleFilterResults(results));
            }
        }
        
        
}
    applyfilter1(filtertype) {
      
        filtertype.name = filtertype.name.replace(/\|/g, '');
        filtertype.name = filtertype.name.replace(/\x/g, '');
        console.log(this.attributes1)
       this.cd.detectChanges();
        
        if (!filtertype.order_by) {
            this.products=undefined;
            this.showarray1 = true;
            this.showarray2 = false;
            this.showarray3 = false;
            this.attributes1=[];
            this.attributes=[];
            this.newattributes = [];
            this.attributes=this.values.attributes;
            this.showselectedatt=undefined;
            this.cd.detectChanges();
            this.filter1.attribute_term = undefined;
            this.filter1.vendor = this.values.vendorid;
            this.service.load(this.filter1).then((results) => this.handleFilterResults(results));
        }
     
    }
    handleFilterResults(results) {
        this.products = results;
        this.cd.detectChanges();
        console.log(this.showarray1 + " " + this.showarray2 + " " + this.showarray3)

    }
    getSearch(){
        this.nav.push(SearchPage);
    }
    getCart() {
        
        this.nav.pop();
        this.values.productsback=true;
           
       
        
    }
    
    addToCart(id, stock, sale) {
        if (stock > this.values.cart[id]) {
            // console.log(id)


            if (sale) {
                this.values.cart[id] += 1;
                this.options.product_id = id;
                
                //  this.cd.detectChanges();
                this.Service.deleteFromCart(id, this.values.cart[id]).then((results) => this.updateCart1(results));
            }
            else if (!sale) {
                this.values.cart[id] += 1;
                this.options.product_id = id;
              
                this.Service.addToCart(this.options).then((results) => this.updateCart(results));
            }



        }


    }
    addToCart1(id,stock) {
       if(stock){
            this.values.cart[id] += 1;
            this.options.product_id = id;
            this.Service.addToCart(this.options).then((results) => this.updateCart(results));
        
    }
}

    delete(id, qty) {
        this.values.cart[id] -= 1;

        qty -= 1;
        this.options.product_id = id;
        this.Service.deleteFromCart(id, qty).then((results) => {
            console.log(results)
            this.service1.loadCart();
        });

    }
    handlecart(data, id) {
        console.log(data)
        var data = data;
        
    }

    updateCart(results) {
       // console.log(results)
       this.cd.detectChanges();
        this.values.updateCartTwo(results);


    }
    updateCart1(results) {
       


    }
   
   
    
 
    
    
  
    ionViewWillEnter(){
        this.service.getAttributes().then((results) => {
            this.attributes = results;
           
            this.values.attributes=results;
            this.cd.detectChanges();

            this.values.attributes.forEach(item => {

                this.getAttributeTerms(item.id);
                this.cd.detectChanges();

            });

        });
        this.service.load(this.filter).then((results) => this.handleProducts(results));
    }
    ionViewWillLeave(){
        this.values.attributes=undefined;
    }
  
   
   
   
}