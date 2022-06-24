import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, first } from 'rxjs/operators';
import { AccountService, AlertService } from '../shared/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
})
export class ForgotPasswordPage implements OnInit {
  form: FormGroup;
  initial = 'Email';
  loading = false;
  submitted = false;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
          ),
        ],
      }),
    });
  }

  // convenience getter for easy access to form fields
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.alertService.clear();
    this.accountService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () =>
          this.alertService.success(
            'Please check your email for password reset instructions'
          ),
        error: (error) => this.alertService.error(error),
      });
    this.accountService.pageTitle = 'Forgot Password';
  }
}
