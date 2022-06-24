import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Program } from 'src/app/shared/_models';
import { DeviceService } from 'src/app/shared/_services/device.service';
import { NewProgramPage } from '../../programs/new-program/new-program.page';

@Component({
  selector: 'app-new-device',
  templateUrl: './new-device.page.html',
})
export class NewDevicePage implements OnInit {
  @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
  form: FormGroup;
  devicePrograms = new FormArray([]);
  programRef: ComponentRef<NewProgramPage>;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private loadingController: LoadingController,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  get controls() {
    return (this.form.get('programs') as FormArray).controls;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      status: new FormControl(false, {
        updateOn: 'blur',
      }),
      localIp: new FormControl(null, {
        updateOn: 'blur',
      }),
      externalIp: new FormControl(null, {
        updateOn: 'blur',
      }),
      openingPercent: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      programs: this.devicePrograms,
    });
  }

  onAddProgram() {
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(NewProgramPage);
    const res = this.target.createComponent(factory);
    this.programRef = res;
  }

  onSaveProgram() {
    if (!this.programRef.instance.form) {
      return;
    } else {
      const startDate = this.programRef.instance.form.value.startDate;
      const endDate = this.programRef.instance.form.value.endDate;
      const description = this.programRef.instance.form.value.description;
      const newProgram = new Program(description, startDate, endDate);
      (this.form.get('programs') as FormArray).push(
        newProgram as unknown as FormControl
      );
    }
  }

  onDeleteProgram(index: number) {
    (this.form.get('programs') as FormArray).removeAt(index);
  }

  onCreateDevice() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController
      .create({ message: 'Creating a device...' })
      .then((loadingElement) => {
        loadingElement.present();
        this.deviceService
          .addDevice(
            this.form.value.status,
            this.form.value.localIP,
            this.form.value.externalIP,
            this.form.value.openingPercent,
            this.form.value.description,
            this.form.value.programs
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.form.reset();
            this.removeAllProgramsOnSubmitting();
            this.router.navigateByUrl('/home/tabs/devices');
          });
      });
  }

  private removeAllProgramsOnSubmitting() {
    while ((this.form.get('programs') as FormArray).length !== 0) {
      (this.form.get('programs') as FormArray).removeAt(0);
    }
  }
}
