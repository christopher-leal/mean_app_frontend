import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { saveToken, getToken } from './../utils/jwt';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './../models/User';

declare const gapi: any;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = environment.url;
	auth2: any;
	user: User;

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
			map((resp: any) => {
				const { email, google, status, name, role, img = '', _id } = resp.user;
				this.user = new User(name, email, '', img, google, status, role, _id);
				saveToken(resp.token);
				return true;
			}),
			catchError((err) => {
				console.log(err);
				return of(false);
			})
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

	// get getImage() {
	// 	if (this.user.img.startsWith('http')) {
	// 		return `${this.user.img}`;
	// 	}
	// 	return `${this.url}uploads/users/${this.user.img}`;
	// }

	get userId() {
		console.log(this.user);
		return this.user._id || '';
	}
}
