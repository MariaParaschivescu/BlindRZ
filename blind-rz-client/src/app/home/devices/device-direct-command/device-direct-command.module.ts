import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { DeviceDirectCommandPage } from './device-direct-command.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceDirectCommandPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DeviceDirectCommandPage],
})
export class DeviceDirectCommandModule {}
