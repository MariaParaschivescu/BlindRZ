import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/_services';
@Component({ templateUrl: 'layout.page.html' })
export class LayoutPage {
  pageTitle: Event;
  constructor(private router: Router, private accountService: AccountService) {
    // redirect to home if already logged in
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
  }

  displayTitle(title: Event) {
    this.pageTitle = title;
  }
}
