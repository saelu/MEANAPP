import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.module';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthService {
    private token: string;
    private authStatusListner = new Subject<boolean>();
    private isAuthenticat = false;
    private tokenTimer: any;
    private userId: string;
    constructor(private http: HttpClient, private router: Router) { }

getToken() {
     return this.token;
    }
getIsAuth() {
    return this.isAuthenticat;
}
getUserId() {
    return this.userId;
}
getAuthStatusListner() {
    return this.authStatusListner.asObservable();
}
createUser(email: string, password: string) {
    const autData: AuthData = {email: email, password: password};

    this.http.post('http://localhost:3000/api/user/signup', autData)
    .subscribe(() => {
         this.router.navigate(['/']);
    }, error => {
        this.authStatusListner.next(false);
    });
}
login(email: string, password: string) {
    const autData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', autData)
    .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticat = true;
            this.userId = response.userId;
            this.authStatusListner.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userId);
            console.log(expirationDate);
            this.router.navigate(['/']);
        }
    }, error => {
        this.authStatusListner.next(false);
    });
}

autoAuthUser() {

  const authInformation =  this.getAuthData();
  if (!authInformation) {
      return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
     this.token = authInformation.token;
     this.isAuthenticat = true;
     this.userId = authInformation.userId;
     this.setAuthTimer(expiresIn / 1000);
     this.authStatusListner.next(true);
  }
}
logout() {
    this.token = null;
    this.isAuthenticat = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
}
private setAuthTimer(duration: number) {
    console.log('Setting Timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
        this.logout();
       }, duration * 1000) ;
}
private saveAuthData(token: string, expirationDate: Date , userId: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
}
private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
}
private getAuthData() {

    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
       return;
    }

    return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
    };
}
}