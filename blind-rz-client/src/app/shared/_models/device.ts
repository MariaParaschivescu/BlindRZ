import { Program } from './program';

export class Device {
  constructor(
    public deviceId: string,
    public status: boolean,
    public localIP: string,
    public externalIP: string,
    public openingPercent: number,
    public description: string,
    public programs: Program[]
  ) {}
}
