/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Program } from '../_models';

const baseUrl = `${environment.apiUrl}/User`;

@Injectable({ providedIn: 'root' })
export class ProgramService {
  programsHasChanges = new Subject<Program[]>();

  startedEditing = new Subject<number>();

  private _programs: Program[] = [
    // new Program('11', '12', ''),
    // new Program('13', '14', ''),
  ];

  constructor() {}

  getPrograms() {
    // eslint-disable-next-line no-underscore-dangle
    return this._programs.slice();
  }

  getProgramByIndex(index: number) {
    return this._programs[index];
  }

  addNewProgram(start: Date, end: Date) {
    const program = new Program('', new Date(), new Date());
    program.startDate = start;
    program.endDate = end;
    this._programs.push(program);
    this.programsHasChanges.next(this._programs.slice());
  }

  addPrograms(programs: Program[]) {
    this._programs.splice(0);
    this._programs.push(...this._programs);
    return this.programsHasChanges.next(this._programs.slice());
  }

  updateProgram(program: Program, index: number) {
    this._programs[index] = program;
    return this.programsHasChanges.next(this._programs.slice());
  }

  deleteProgram(index: number) {
    this._programs.splice(index, 1);
    return this.programsHasChanges.next(this._programs.slice());
  }
}
