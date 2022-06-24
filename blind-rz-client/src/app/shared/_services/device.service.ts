/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from '.';
import { Device, Program } from '../_models';
import { ProgramService } from './program.service';

const baseUrl = `${environment.apiUrl}/User`;

@Injectable({ providedIn: 'root' })
export class DeviceService {
  deviceChanged = new Subject<Device[]>();
  deviceOfChoice = new Subject<Device[]>();
  private _devices = new BehaviorSubject<Device[]>([
    // new Device(
    //   'd1',
    //   false,
    //   '401.203.12.13',
    //   '405.234.56.78',
    //   34.5,
    //   'Beathroom',
    //   []
    // ),
    // new Device(
    //   'd2',
    //   false,
    //   '423.203.12.13',
    //   '453.234.56.78',
    //   50.5,
    //   'Bedroom',
    //   []
    // ),
  ]);

  constructor(private programService: ProgramService) {}

  get devices() {
    return this._devices.asObservable();
  }

  getDevice(id: string) {
    return this.devices.pipe(
      take(1),
      map((devices) => ({ ...devices.find((d) => d.deviceId === id) }))
    );
  }

  getDeviceById(index: number) {
    return this._devices[index];
  }

  addDevice(
    status: boolean = false,
    localIp: string,
    externIp: string,
    openingPercent: number,
    description: string,
    programs: Program[]
  ) {
    // let fetchedUserId: string;
    // return this.accountService.userId.pipe(
    //   take(1),
    //   switchMap((userId) => {
    //     return fetchedUserId = userId;
    //     return this.accountService.token;
    //   }),
    //   take(1),
    //   switchMap((token) => {
    //     if (!fetchedUserId) {
    //       throw new Error("No user found!");
    //     }
    //     const newDevice = new Device(
    //       Math.random().toString(),
    //       status,
    //       localIp,
    //       externIp,
    //       openingPercent,
    //       description,
    //       fetchedUserId
    //     );
    //     return this.devices.pipe(
    //       take(1),
    //       tap((devices) => this._devices.next(devices.concat(newDevice)))
    //    );
    //   })
    const newDevice = new Device(
      Math.random().toString(),
      status,
      localIp,
      externIp,
      openingPercent,
      description,
      programs
    );
    return this.devices.pipe(
      take(1),
      tap((devices) => {
        this._devices.next(devices.concat(newDevice));
      })
    );
  }

  addProgramToDevice(
    deviceId: string,
    start: Date,
    end: Date,
    description: string
  ) {
    const newProgram = new Program(description, start, end);
    this.getDevice(deviceId)
      .pipe(take(1))
      .subscribe((editedDevice) => {
        if (editedDevice != null) {
          editedDevice.programs.push(newProgram);
          this.updateDevice(
            editedDevice.deviceId,
            editedDevice.description,
            editedDevice.openingPercent,
            editedDevice.localIP,
            editedDevice.externalIP,
            editedDevice.programs
          );
        } else {
          console.error('No existing device with this id!');
        }
      });
  }

  updateDevice(
    deviceId: string,
    description: string,
    openingPercent: number,
    localIP: string,
    externalIP: string,
    programs: Program[]
  ) {
    return this.devices.pipe(
      take(1),
      delay(1000),
      tap((devices) => {
        const updatedDeviceIndex = devices.findIndex(
          (device) => device.deviceId === deviceId
        );
        const updatedDevices = [...devices];
        const oldDevice = updatedDevices[updatedDeviceIndex];
        updatedDevices[updatedDeviceIndex] = new Device(
          oldDevice.deviceId,
          oldDevice.status,
          localIP,
          externalIP,
          openingPercent,
          description,
          programs
        );
        this._devices.next(updatedDevices);
      })
    );
  }

  deleteDevice() {}
}
