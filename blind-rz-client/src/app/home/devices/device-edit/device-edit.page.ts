import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import { format, utcToZonedTime } from 'date-fns-tz';
import { format, parseISO } from 'date-fns';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from 'src/app/shared/_models';
import { DeviceService } from 'src/app/shared/_services/device.service';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.page.html',
})
export class DeviceEditPage implements OnInit, OnDestroy {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  form: FormGroup;
  device: Device;
  dateValue = '';
  dateValue2 = '';
  private deviceSub: Subscription;

  ngOnInit() {
    console.log('ura');
  }

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private deviceService: DeviceService,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private navController: NavController,
  //   private loadingController: LoadingController
  // ) {}

  // get programs() {
  //   return this.form.get('programs') as FormArray;
  // }

  // get controls() {
  //   return this.programs.controls;
  // }

  // confirm() {
  //   this.datetime.confirm();
  // }

  // reset() {
  //   this.datetime.reset();
  // }

  // formatDate(value: string) {
  //   return format(parseISO(value), 'MMM dd yyyy');
  // }

  // ngOnInit() {
  //   this.route.paramMap.subscribe((paramMap) => {
  //     if (!paramMap.has('deviceId')) {
  //       this.navController.navigateBack('/home/tabs/devices');
  //       return;
  //     }
  //     this.deviceSub = this.deviceService
  //       .getDevice(paramMap.get('deviceId'))
  //       .subscribe((device) => {
  //         this.device = device;
  //         this.form = this.formBuilder.group({
  //           description: [
  //             this.device.description,
  //             { updateOn: 'blur', validators: [Validators.required] },
  //           ],
  //           localIP: [this.device.localIP, { updateOn: 'blur' }],
  //           externalIP: [this.device.externalIP, { updateOn: 'blur' }],
  //           openingPercent: [
  //             this.device.openingPercent,
  //             { updateOn: 'blur', validators: [Validators.required] },
  //           ],
  //           programs: this.formBuilder.array(this.device.programs),
  //         });
  //       });
  //   });
  // }

  // onAddProgram() {
  //   this.programs.push(
  //     this.formBuilder.group({
  //       startDate: [
  //         null,
  //         { updateOn: 'blur', validators: [Validators.required] },
  //       ],
  //       endDate: [
  //         null,
  //         { updateOn: 'blur', validators: [Validators.required] },
  //       ],
  //     })
  //   );
  // }

  // onDeleteProgram(index: number) {
  //   this.programs.removeAt(index);
  // }

  // onUpdateDevice() {
  //   if (!this.form.valid) {
  //     return;
  //   }
  //   this.loadingController
  //     .create({ message: 'Updating device...' })
  //     .then((loadingElem) => {
  //       loadingElem.present();
  //       this.deviceService
  //         .updateDevice(
  //           this.device.deviceId,
  //           this.device.description,
  //           this.device.openingPercent,
  //           this.device.localIP,
  //           this.device.externalIP,
  //           this.device.programs
  //         )
  //         .subscribe(() => {
  //           loadingElem.dismiss();
  //           this.form.reset();
  //           this.router.navigateByUrl('home/tabs/devices');
  //         });
  //     });
  // }

  ngOnDestroy(): void {
    if (this.deviceSub) {
      this.deviceSub.unsubscribe();
    }
  }
}
