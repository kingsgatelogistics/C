import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';



const routes: Routes = [
  // {path:'update', component: HomeComponent },
  {path:'update/:trackingKey', component:HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
