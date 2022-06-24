import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../shared/_services';
import { CookieService } from 'ngx-cookie-service';
import { ToastController } from '@ionic/angular';

@Component({ templateUrl: 'login.page.html' })
export class LoginPage implements OnInit {
  @Output() pageTitle = new EventEmitter<string>();
  form: FormGroup;
  loading = false;
  submitted = false;
  invisible = true;
  cookieValue: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private cookieService: CookieService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.pageTitle.emit('Log In');
  }

  // convenience getter for easy access to form fields
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get f() {
    return this.form.controls;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get passwordInputType(): string {
    if (this.invisible === false) {
      return 'text';
    }

    return 'password';
  }

  onChangeVisibility() {
    this.invisible = !this.invisible;
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
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: async () => {
          this.cookieValue = this.cookieService.get('refreshToken');
          // get return url from query parameters or default to home page
          const returnUrl =
            this.route.snapshot.queryParams.returnUrl === '/'
              ? '/home/tabs/devices'
              : '/home/tabs/devices';
          console.log(returnUrl);
          await this.presentToast('Login success', 'success');
          this.router.navigateByUrl(returnUrl);
        },
        error: async (error) => {
          this.alertService.error(error);
          this.loading = false;
          await this.presentToast('Login failed', 'danger');
        },
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    toast.present();
  }
}
