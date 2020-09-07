import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Hospital } from './../models/Hospital';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HospitalService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	setHospital(hospital: Hospital) {
		let setHospital = <any>{
			...hospital
		};

		if (hospital._id) setHospital.id = hospital._id;
		return this._http.post(`${this.url}hospitals`, setHospital);
	}

	getHospitals(limit = 10, offset = 0) {
		let params = {
			limit,
			offset
		};
		return this._http.post(`${this.url}hospitals/getHospitals`, params);
	}

	getAllHospitals() {
		return this._http.post(`${this.url}hospitals/getHospitals`, {});
	}

	deleteHospital(id: string) {
		return this._http.post(`${this.url}hospitals/delete`, { id });
	}
}
