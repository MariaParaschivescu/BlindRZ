import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Command } from '../_models/command';
import { AccountService } from './account.service';

const baseUrl = `${environment.apiUrl}/Command`;

@Injectable({ providedIn: 'root' })
export class CommandService {
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  uploadCommand(commandRequest: Command) {
    const headers = new HttpHeaders();
    //TODO get token and put on bearer
    const bearerToken = this.accountService.token;
    bearerToken.subscribe((token) => {
      headers.set('Authorization', `Bearer ${token}`);
      return this.http
        .post<any>(
          `${baseUrl}/upload-command`,
          { ...commandRequest },
          { withCredentials: true, headers }
        )
        .subscribe((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          result
            ? this.toastr.success('Your command was registered successfully!')
            : this.toastr.error('Your command was not registered!');
        });
    });
  }
}
