import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from 'src/app/shared/_models';
import { AccountService } from 'src/app/shared/_services';
import { DeviceService } from 'src/app/shared/_services/device.service';

interface DeviceData {
  status: boolean;
  localIP: string;
  externalIP: string;
  openingPercen: number;
}

@Component({ selector: 'app-devices', templateUrl: 'devices.page.html' })
export class DevicesPage implements OnInit, OnDestroy {
  relevantDevices: Device[];
  badge: string;
  private deviceSubscrition: Subscription;

  constructor(
    private deviceService: DeviceService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.deviceSubscrition = this.deviceService.devices.subscribe((devices) => {
      this.relevantDevices = devices;
    });
  }
  ngOnDestroy(): void {
    if (this.deviceSubscrition) {
      this.deviceSubscrition.unsubscribe();
    }
  }

  onRemove(deviceId: string) {
    console.log('This will be implemented later');
  }

  extractFirstTwoLetters(word: string) {
    return word.slice(0, 2);
  }
}
