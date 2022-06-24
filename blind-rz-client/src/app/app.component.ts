import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Account, Role } from './shared/_models';
import { AccountService } from './shared/_services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Role = Role;
  account: Account;
  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((x) => (this.account = x));
  }

  logout() {
    this.accountService.logout();
  }
}
