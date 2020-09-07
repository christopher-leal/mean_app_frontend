import { Injectable, EventEmitter } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private url = environment.url;
	private _hideModal = true;
	type: 'users' | 'doctors' | 'hospitals';
	id: string;
	img: string = null;

	newImage: EventEmitter<string> = new EventEmitter<string>();
	constructor() {}

	get getModalStatus() {
		return this._hideModal;
	}

	openModal(type: 'users' | 'doctors' | 'hospitals', id: string, img?: string) {
		this._hideModal = false;
		this.type = type;
		this.id = id;
		this.img = this.imagenUrl(img);
	}

	closeModal() {
		this._hideModal = true;
	}

	imagenUrl(img) {
		if (img && img.includes('http')) {
			return img;
		}

		return `${this.url}uploads/${this.type}/${img}`;
	}
}
