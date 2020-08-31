import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { saveToken, getToken } from './../utils/jwt';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const gapi: any;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = environment.url;
	auth2: any;

	constructor(private _http: HttpClient, private _router: Router, private ngZone: NgZone) {
		this.googleInit();
	}

	googleInit() {
		return new Promise((resolve) => {
			gapi.load('auth2', () => {
				// Retrieve the singleton for the GoogleAuth library and set up the client.
				this.auth2 = gapi.auth2.init({
					client_id: environment.OAUTH_CLIENT,
					cookiepolicy: 'single_host_origin'
					// Request scopes in addition to 'profile' and 'email'
					//scope: 'additional_scope'
				});
				resolve();
			});
		});
	}

	signIn(user) {
		return this._http.post(`${this.url}auth/login`, user);
	}

	googleSignIn(token) {
		return this._http.post(`${this.url}auth/login/google`, { token });
	}

	refreshToken(): Observable<boolean> {
		const token = getToken();
		return this._http.get(`${this.url}auth/refreshToken`, { headers: { token } }).pipe(
			tap((resp: any) => {
				saveToken(resp.token);
			}),
			map((resp) => true),
			catchError((err) => of(false))
		);
	}

	logOut() {
		localStorage.removeItem('token');
		this.signOut();
	}

	private signOut() {
		this.auth2.signOut().then(() => {
			this.ngZone.run(() => {
				this._router.navigate([ 'login' ]);
			});
		});
	}
}
