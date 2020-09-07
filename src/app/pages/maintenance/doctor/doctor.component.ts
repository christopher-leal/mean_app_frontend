import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from './../../../services/doctor.service';
import { HospitalService } from './../../../services/hospital.service';
import { of } from 'rxjs';
import { Hospital } from './../../../models/Hospital';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from './../../../models/Doctor';

@Component({
	selector: 'app-doctor',
	templateUrl: './doctor.component.html',
	styleUrls: [ './doctor.component.css' ]
})
export class DoctorComponent implements OnInit {
	hospitals: Hospital[] = [];
	form: FormGroup;
	isLoading = true;
	id: string;
	selectedHospital: Hospital = <Hospital>{};
	doctor: Doctor = <Doctor>{};
	constructor(
		private _doctorService: DoctorService,
		private _hospitalService: HospitalService,
		private _fb: FormBuilder,
		private _route: ActivatedRoute,
		private _router: Router
	) {}

	ngOnInit(): void {
		this.form = this._fb.group({
			name: [ '', [ Validators.required ] ],
			hospital: [ '', [ Validators.required ] ]
		});
		this.loadHospitals();

		this.form.get('hospital').valueChanges.subscribe((hospitalId) => {
			this.selectedHospital = this.hospitals.find((hospital) => hospital._id === hospitalId);
		});

		this._route.params.subscribe((params) => {
			this.id = params.id;
			if (this.id !== 'new') {
				this._doctorService
					.getDoctor(this.id)
					.pipe(
						map((doctors: any) => (doctors.ok ? doctors.items[0] : null)),
						catchError((err) => {
							return null;
						})
					)
					.subscribe((doctor) => {
						console.log(doctor);
						if (!doctor) {
							return this._router.navigateByUrl(`/dashboard/doctors`);
						}
						this.doctor = doctor;
						let params = {
							name: doctor.name,
							hospital: doctor.hospital._id
						};
						this.form.patchValue(params);
					});
			}
		});
	}

	setDoctor() {
		if (this.form.invalid) {
			return;
		}
		const setDoctor = {
			...this.form.value,
			id: this.id !== 'new' ? this.id : null
		};
		let message = this.id !== 'new' ? 'editado' : 'agregado';
		this._doctorService
			.setDoctor(setDoctor)
			.pipe(
				catchError((err) => {
					console.log(err);
					this.isLoading = false;

					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe(({ ok, doctor }: any) => {
				this.isLoading = false;
				if (ok) {
					Swal.fire({
						toast: true,
						icon: 'success',
						title: `Doctor ${doctor.name} ${message}`,
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					return this._router.navigateByUrl(`/dashboard/doctor/${doctor._id}`);
				}
				Swal.fire({
					toast: true,
					icon: 'error',
					title: 'Ha ocurrido un error',
					position: 'top-end',
					showConfirmButton: false,
					timer: 3000
				});
			});
	}

	loadHospitals() {
		this._hospitalService
			.getAllHospitals()
			.pipe(map((resp: any) => (resp.ok ? resp.items.filter((hospital) => hospital.status) : [])))
			.subscribe((hospitals) => {
				this.hospitals = hospitals;
			});
	}
}
