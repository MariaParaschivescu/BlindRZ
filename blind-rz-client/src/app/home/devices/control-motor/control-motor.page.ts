import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Command } from 'src/app/shared/_models/command';
import { CommandService } from 'src/app/shared/_services/command.service';
// import { BackApiHttpRequest } from 'src/app/shared/_models/back-api-http-request.model';
// import { HttpService } from 'src/app/shared/_services/http.service';

@Component({
  selector: 'app-control-motor',
  templateUrl: 'control-motor.page.html',
})
export class ControlMotorPage {
  public controlForm: FormGroup;

  constructor(
    private httpService: HttpClient,
    private fb: FormBuilder,
    private commandService: CommandService
  ) {
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
    const controlRequest = new Command(
      (this.clockwise.value as boolean) ? 'CW' : 'CCW',
      String(this.commandValue.value)
    );
    this.commandService.uploadCommand(controlRequest);
  }
}
