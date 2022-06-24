import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastrModule } from 'ngx-toastr';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, HomeRoutingModule, IonicModule],
  declarations: [HomePage],
})
export class HomeModule {}
