import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './../interfaces/User';
import { environment } from './../../environments/environment';

declare const gapi: any;

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	setUser(user: User) {
		return this._http.post(`${this.url}users`, user);
	}
}
