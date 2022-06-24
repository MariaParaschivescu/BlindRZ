import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DeviseSetCredentialsPage } from './device-set-credentials.page';

const routes: Routes = [
  {
    path: '',
    component: DeviseSetCredentialsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DeviseSetCredentialsPage],
})
export class DeviseSetCredentialsModule {}
