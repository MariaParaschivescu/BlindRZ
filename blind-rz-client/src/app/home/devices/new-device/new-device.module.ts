import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NewDevicePage } from './new-device.page';
import { NewProgramPage } from '../../programs/new-program/new-program.page';

const routes: Routes = [
  {
    path: '',
    component: NewDevicePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [NewDevicePage, NewProgramPage],
})
export class NewDevicePageModule {}
