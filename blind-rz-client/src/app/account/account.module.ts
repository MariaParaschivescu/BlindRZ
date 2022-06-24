import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutPage } from './layout.page';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { VerifyEmailPage } from './verify-email.page';
import { ForgotPasswordPage } from './forgot-password.page';
import { ResetPasswordPage } from './reset-password.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    IonicModule,
  ],
  declarations: [
    LayoutPage,
    LoginPage,
    RegisterPage,
    VerifyEmailPage,
    ForgotPasswordPage,
    ResetPasswordPage,
  ],
  // exports: [LayoutPage],
})
export class AccountModule {}
