export interface User {
	name: string;
	email: string;
	password: string;
	password2?: string;
	img: string;
	role: string;
	google: boolean;
	status: boolean;
}
