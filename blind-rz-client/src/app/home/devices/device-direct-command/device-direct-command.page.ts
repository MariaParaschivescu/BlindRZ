import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BackApiHttpRequest } from 'src/app/shared/_models/back-api-http-request.model';
import { HttpService } from 'src/app/shared/_services/http.service';

@Component({
  selector: 'app-device-direct-command',
  templateUrl: 'device-direct-command.page.html',
})
export class DeviceDirectCommandPage {
  public controlForm: FormGroup;

  constructor(private httpService: HttpService, private fb: FormBuilder) {
    this.controlForm = this.fb.group({
      commandValue: [0, Validators.required],
      clockwise: [false, Validators.required],
    });
  }

  get commandValue() {
    return this.controlForm.get('commandValue') as FormControl;
  }

  get clockwise() {
    return this.controlForm.get('clockwise') as FormControl;
  }

  get clockwiseControl() {
    return (this.controlForm.get('clockwise') as FormControl).value as boolean;
  }

  toggleCheckBox() {
    return !this.clockwiseControl;
  }

  public onSubmit() {
    const controlRequest = new BackApiHttpRequest('', {
      direction: (this.clockwise.value as boolean) ? 'CW' : 'CCW',
      steps: this.commandValue.value,
    });

    this.httpService.post(controlRequest).subscribe((e) => console.log(e));
  }
}
