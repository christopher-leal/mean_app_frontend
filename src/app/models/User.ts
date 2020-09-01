import { environment } from '../../environments/environment';

const url = environment.url;

export class User {
	constructor(
		public name: string,
		public email: string,
		public password?: string,
		public img?: string,
		public google?: boolean,
		public role?: string,
		public _id?: string
	) {}

	get imagenUrl() {
		if (this.img.includes('http')) {
			return this.img;
		}

		return `${url}uploads/users/${this.img}`;
	}
}
