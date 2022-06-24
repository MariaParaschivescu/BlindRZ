import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { format, parseISO } from 'date-fns';
import { Device } from 'src/app/shared/_models';
import { DeviceService } from 'src/app/shared/_services/device.service';

@Component({
  selector: 'app-new-program',
  templateUrl: './new-program.page.html',
})
export class NewProgramPage implements OnInit, OnDestroy {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  form: FormGroup;
  editMode = false;
  id: string;
  device: Device;
  dateValue = '';
  dateValueEnd = '';
  public isNewDevice = false;
  private deviceSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private router: Router
  ) {}

  get programs() {
    return this.form.get('programs') as FormArray;
  }

  get controls() {
    return this.programs.controls;
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('deviceId');
      this.editMode = paramMap.has('deviceId') !== null;
      this.initForm();
    });
  }

  onCreateProgram() {
    if (!this.form.valid) {
      return;
    }
    this.deviceService.addProgramToDevice(
      this.device.deviceId,
      this.form.value.startDate,
      this.form.value.endDate,
      this.form.value.description
    );
  }

  ngOnDestroy(): void {
    if (this.deviceSub) {
      this.deviceSub.unsubscribe();
    }
  }

  smallerThan(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.parent) {
        return null; // Control is not yet associated with a parent.
      }
      const thisValue = control.value;
      const otherValue = control.parent.get(otherControlName).value;
      if (thisValue < otherValue) {
        return null;
      }

      return {
        smallerthan: true,
      };
    };
  }

  greaterThan(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.parent) {
        return null; // Control is not yet associated with a parent.
      }
      const thisValue = control.value;
      const otherValue = control.parent.get(otherControlName).value;
      if (thisValue > otherValue) {
        return null;
      }

      return {
        greaterthan: true,
      };
    };
  }
  private initForm() {
    this.form = this.fb.group({
      startDate: [
        new Date(Date.now()).toISOString(),
        {
          updateOn: 'blur',
          validators: [
            Validators.required,
            this.smallerThan('endDate').bind(this),
          ],
        },
      ],
      endDate: [
        new Date(Date.now()).toISOString(),
        {
          updateOn: 'blur',
          validators: [
            Validators.required,
            this.greaterThan('startDate').bind(this),
          ],
        },
      ],
      description: [
        '',
        { updateOn: 'blur', validators: [Validators.required] },
      ],
    });
  }
}

// private initForm() {
//   const programs = new FormArray([]);
//   if (this.editMode) {
//     this.deviceSub = this.deviceService
//       .getDevice(this.id)
//       .subscribe((device) => {
//         this.device = device;
//         if (device.programs) {
//           for (const program of device.programs) {
//             programs.push(
//               this.fb.group({
//                 startDate: [
//                   program.startDate,
//                   { updateOn: 'blur', validators: [Validators.required] },
//                 ],
//                 endDate: [
//                   program.endDate,
//                   { updateOn: 'blur', validators: [Validators.required] },
//                 ],
//               })
//             );
//           }
//         }
//         this.form = this.fb.group({ programs });
//       });
//   }
// }}
