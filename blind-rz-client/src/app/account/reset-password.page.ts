/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../shared/_services';
import { MustMatchValidator } from '../shared/_helpers';

enum TokenStatus {
  Validating,
  Valid,
  Invalid,
}

@Component({ templateUrl: 'reset-password.page.html' })
export class ResetPasswordPage implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token = null;
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatchValidator('password', 'confirmPassword'),
      }
    );

    const token = this.route.snapshot.queryParams.token;

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.accountService
      .validateResetToken(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.token = token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error: () => {
          this.tokenStatus = TokenStatus.Invalid;
        },
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
    this.accountService
      .resetPassword(
        this.token,
        this.f.password.value,
        this.f.confirmPassword.value
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success(
            'Password reset successful, you can now login',
            { keepAfterRouteChange: true }
          );
          this.router.navigateByUrl('./account/login');
        },
        error: (error) => {
          this.alertService.error('error');
          this.loading = false;
        },
      });
    this.accountService.pageTitle = 'Reset Password';
  }
}
