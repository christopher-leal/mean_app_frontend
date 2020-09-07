export class Doctor {
	constructor(
		public name: string,
		public status?: true,
		public _id?: string,
		public hospital?: DoctorHospital,
		public createdBy?: UserHospital,
		public img?: string
	) {}
}

interface DoctorHospital {
	_id: string;
	name: string;
}
interface UserHospital {
	_id: string;
	name: string;
}
