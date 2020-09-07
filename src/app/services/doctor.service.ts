import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Doctor } from '../models/Doctor';

@Injectable({
	providedIn: 'root'
})
export class DoctorService {
	private url = environment.url;
	constructor(private _http: HttpClient) {}

	setDoctor(doctor: Doctor) {
		let setDoctor = <any>{
			...doctor
		};
		if (doctor._id) setDoctor.id = doctor._id;
		return this._http.post(`${this.url}doctors`, setDoctor);
	}

	getDoctors(limit = 10, offset = 0) {
		let params = {
			limit,
			offset
		};
		return this._http.post(`${this.url}doctors/getDoctors`, params);
	}

	getDoctor(id) {
		return this._http.post(`${this.url}doctors/getDoctors`, { id });
	}

	deleteDoctor(id: string) {
		return this._http.post(`${this.url}doctors/delete`, { id });
	}
}
