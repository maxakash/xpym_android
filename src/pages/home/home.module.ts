import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home} from './home';
import { ScrollHideDirective } from '../../directives/scroll-hide/scroll-hide';
//import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';






@NgModule({
  declarations: [
   Home,
    ScrollHideDirective
  ],
  imports: [
    IonicPageModule.forChild(Home),
    
  ],
  entryComponents: [
    Home
  ]
})
export class HomeModule {}
