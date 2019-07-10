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
    constructor(private http: HttpClient, private router: Router) { }

getToken() {
     return this.token;
    }
getIsAuth() {
    return this.isAuthenticat;
}
getAuthStatusListner() {
    return this.authStatusListner.asObservable();
}
createUser(email: string, password: string) {
    const autData: AuthData = {email: email, password: password};

    this.http.post('http://localhost:3000/api/user/signup', autData)
    .subscribe(response => {
        console.log(response);
    });
}
login(email: string, password: string) {
    const autData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', autData)
    .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
            const expiresInDuration = response.expiresIn;
            setTimeout(() => {}, expiresInDuration * 1000);
            this.isAuthenticat = true;
            this.authStatusListner.next(true);
            this.router.navigate(['/']);
        }
        // this.router.navigate['/create'];
    });
}

logout() {
    this.token = null;
    this.isAuthenticat = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
}
}