import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { pluck, map } from 'rxjs/operators';
import { User } from './../models/User';
@Injectable({
	providedIn: 'root'
})
export class SearchService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	getAllByCollection(collection: 'user' | 'doctor' | 'hospital', find: string) {
		let params = {
			collection,
			find
		};
		return this._http.post(`${this.url}all/collection`, params).pipe(
			map((resp: any) => {
				switch (collection) {
					case 'user':
						resp.items = resp.items.map(
							(user) =>
								new User(
									user.name,
									user.email,
									'',
									user.img,
									user.google,
									user.status,
									user.role,
									user._id
								)
						);
						break;
					case 'doctor':
						break;
					case 'hospital':
						break;

					default:
						resp.items = [];
						break;
				}
				return resp.items;
			})
		);
	}
}
