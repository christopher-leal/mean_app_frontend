import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	signIn(user) {
		return this._http.post(`${this.url}auth/login`, user);
	}
}
