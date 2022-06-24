import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'devices',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./devices/devices.module').then(
                (m) => m.DevicesPageModule
              ),
          },
          {
            path: 'new-device',
            loadChildren: () =>
              import('./devices/new-device/new-device.module').then(
                (m) => m.NewDevicePageModule
              ),
          },
          {
            path: 'direct-control',
            loadChildren: () =>
              import(
                './devices/device-direct-command/device-direct-command.module'
              ).then((m) => m.DeviceDirectCommandModule),
          },
          {
            path: 'device-set-credentials',
            loadChildren: () =>
              import(
                './devices/device-set-credentials/device-set-credentials.module'
              ).then((m) => m.DeviseSetCredentialsModule),
          },
          {
            path: 'control-motor',
            loadChildren: () =>
              import('./devices/control-motor/control-motor.module').then(
                (m) => m.ControlMotorModule
              ),
          },
          {
            path: 'device-pair-instructions',
            loadChildren: () =>
              import(
                './devices/device-pair-instructions/device-pair-instructions.module'
              ).then((m) => m.DevicePairInstructionsModule),
          },
          {
            path: ':deviceId',
            loadChildren: () =>
              import('./devices/device-edit/device-edit.module').then(
                (m) => m.DeviceEditPageModule
              ),
          },
        ],
      },
      // {
      //   path: 'programs',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('./programs/programs.module').then(
      //           (m) => m.ProgramsPageModule
      //         ),
      //     },
      //     {
      //       path: 'new-program',
      //       loadChildren: () =>
      //         import('./programs/new-program/new-program.module').then(
      //           (m) => m.NewProgramPageModule
      //         ),
      //     },
      //   ],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
