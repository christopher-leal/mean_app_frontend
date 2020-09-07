import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class FileUploadService {
	private url = environment.url;

	constructor(private _http: HttpClient) {}

	updateFile(file: File, type: 'users' | 'doctors' | 'hospitals', id: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('type', type);
		formData.append('id', id);
		return this._http.put(`${this.url}uploads`, formData);
	}
}
