export class Hospital {
	constructor(
		public name: string,
		public img?: string,
		public status?: boolean,
		public _id?: string,
		public createdBy?: UserHospital
	) {}
}

interface UserHospital {
	_id: string;
	name: string;
}
