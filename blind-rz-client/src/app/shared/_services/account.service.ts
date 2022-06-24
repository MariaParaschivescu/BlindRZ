import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../_models';
import { finalize, map, take, tap } from 'rxjs/operators';
import { CookieDict, CookieService } from 'ngx-cookie';
import { Storage } from '@capacitor/storage';

const baseUrl = `${environment.apiUrl}/Accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountSubject: BehaviorSubject<Account>;
  account: Observable<Account>;
  pageTitle: string;
  cookieRefreshToken: CookieDict;
  private refreshTokenTimeout;
  private _userId = 'xyz';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.accountSubject = new BehaviorSubject<Account>(null);
    this.account = this.accountSubject.asObservable();
    this.restoreSession();
    //this.cookieRefreshToken = this.cookieService.getAll();
  }

  public get accountValue() {
    return this.accountSubject.value;
  }

  get userId() {
    // eslint-disable-next-line no-underscore-dangle
    return this._userId;
  }

  get token() {
    return this.accountSubject.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.jwtToken;
        } else {
          return null;
        }
      })
    );
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders();
    return this.http
      .post<any>(
        `${baseUrl}/authenticate`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((account) => {
          this.accountSubject.next(account);
          this.startRefreshTokenTimer();
          localStorage.setItem('user', JSON.stringify(account));
          return account;
        }),
        tap(this.setUserData.bind(this))
      );
  }

  //this method must be implemented in API, path must be provided after logout
  logout() {
    const headers = new HttpHeaders();
    const refreshToken = this.cookieService.get('refreshToken');
    //const allCookies = this.cookieService.removeAll();

    //headers.append('Authorization', `Bearer ${token}`);
    headers.append('Cookie', `refreshToken=${refreshToken}`);
    this.http
      .post<any>(`${baseUrl}/revoke-token`, {}, { headers })
      .pipe(take(1))
      .subscribe();
    localStorage.removeItem('user');
    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    Storage.remove({ key: 'authData' });
    this.router.navigateByUrl('/account/login');
  }

  refreshToken() {
    return this.http
      .post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(take(1))
      .subscribe((e) => {
        this.accountSubject.next(e);
      });
  }

  register(account: Account) {
    //const headers = new HttpHeaders();
    return this.http
      .post<any>(`${baseUrl}/register`, account)
      .pipe(tap(this.setUserData.bind(this)));
  }

  verifyEmail(token: string) {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string) {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.patch(`${baseUrl}/reset-password`, {
      token,
      password,
      confirmPassword,
    });
  }
  getAll() {
    return this.http.get<Account[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Account>(`${baseUrl}/${id}`);
  }

  create(params) {
    return this.http.post(baseUrl, params);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/${id}`, params).pipe(
      map((account: any) => {
        // update the current account if it was updated
        if (account.id === this.accountValue.id) {
          // publish updated account to subscribers
          account = { ...this.accountValue, ...account };
          this.accountSubject.next(account);
        }
        return account;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`).pipe(
      finalize(() => {
        // auto logout if the logged in account was deleted
        if (id === this.accountValue.id) {
          this.logout();
        }
      })
    );
  }

  //helper methods
  private restoreSession() {
    if (localStorage.getItem('user')) {
      const account: Account = JSON.parse(localStorage.getItem('user'));
      if (account) {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
      }
    }
  }

  private startRefreshTokenTimer() {
    const token = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

    const reloadInterval = new Date(token.exp).getTime() - Date.now() / 1000;

    this.refreshTokenTimeout = timer(500, 10800000).subscribe((_) =>
      this.refreshToken()
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private setUserData(accountData: Account) {
    const account = new Account(
      accountData.id,
      accountData.title,
      accountData.firstName,
      accountData.lastName,
      accountData.email,
      accountData.role,
      accountData.jwtToken
    );
    this.accountSubject.next(account);
    this.storeAuthData(accountData.id, accountData.jwtToken, accountData.email);
  }

  private storeAuthData(userId: string, token: string, email: string) {
    const data = JSON.stringify({
      userId,
      token,
      email,
    });
    Storage.set({ key: 'authData', value: data });
  }
}
