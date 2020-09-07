import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { User } from './../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	setUser(user: User) {
		let setUser = <any>{
			...user
		};

		if (user._id) setUser.id = user._id;
		return this._http.post(`${this.url}users`, setUser);
	}

	getUsers(limit = 10, offset = 0) {
		let params = {
			limit,
			offset
		};
		return this._http.post(`${this.url}users/getUsers`, params).pipe(
			map((resp: any) => {
				const users = resp.items.map(
					(user) =>
						new User(user.name, user.email, '', user.img, user.google, user.status, user.role, user._id)
				);
				resp.items = users;
				return resp;
			})
		);
	}

	deleteUser(id: string) {
		return this._http.post(`${this.url}users/delete`, { id });
	}
}
