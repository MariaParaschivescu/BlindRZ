import { Attribute, Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  constructor(
    @Attribute('appPasswordValidator') public passwordControl: string
  ) {}
  validate(form: FormControl) {
    const password = form.root.get(this.passwordControl);
    const confirmPassword = password;

    if (confirmPassword == null) {
      return null;
    }

    if (password) {
      const subscrition: Subscription = password.valueChanges.subscribe(() => {
        confirmPassword.updateValueAndValidity();
        subscrition.unsubscribe();
      });
    }
    return password && password.value !== confirmPassword.value
      ? { passwordMatchError: true }
      : null;
  }
}
