/* eslint-disable @typescript-eslint/naming-convention */
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BackApiHttpRequest } from 'src/app/shared/_models/back-api-http-request.model';
import { WifiCredentialsBoardHttpRequest } from 'src/app/shared/_models/wifi-credentials-board-http-request.model';
import { HttpService } from 'src/app/shared/_services/http.service';

@Component({
  selector: 'app-device-set-credentials',
  templateUrl: 'device-set-credentials.page.html',
})
export class DeviseSetCredentialsPage implements OnInit {
  public credentialsForm: FormGroup;

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder
  ) {}

  get ssid() {
    return this.credentialsForm.get('ssid') as FormControl;
  }

  get password() {
    return this.credentialsForm.get('password') as FormControl;
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ssid: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const credentialsWifiRequest = new WifiCredentialsBoardHttpRequest('', {
      ssid: this.ssid.value,
      password: this.password.value,
    });
    this.httpService
      .post(credentialsWifiRequest)
      .subscribe((e) => console.log(e));
  }
}
