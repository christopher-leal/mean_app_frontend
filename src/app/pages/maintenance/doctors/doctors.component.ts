import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Doctor } from './../../../models/Doctor';
import { DoctorService } from './../../../services/doctor.service';
import { SearchService } from './../../../services/search.service';
import { ModalService } from './../../../services/modal.service';
import { delay, debounceTime, map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-doctors',
	templateUrl: './doctors.component.html',
	styleUrls: [ './doctors.component.css' ]
})
export class DoctorsComponent implements OnInit {
	doctors: Doctor[] = [];
	totalItems = 0;
	offset = 0;
	limit = 10;
	isLoading = true;
	@ViewChild('searchInput', { static: true })
	searchInput: ElementRef;
	constructor(
		private _doctorService: DoctorService,
		private _searchService: SearchService,
		private _modalService: ModalService
	) {}

	ngOnInit(): void {
		this.getData();
		this._modalService.newImage.pipe(delay(500)).subscribe((img) => this.getData());
	}

	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		fromEvent(this.searchInput.nativeElement, 'input')
			.pipe(debounceTime(500), map((event: any) => event.target.value), distinctUntilChanged())
			.subscribe((res) => {
				this.search(res);
			});
	}

	getData() {
		this.isLoading = true;

		this._doctorService
			.getDoctors(this.limit, this.offset)
			.pipe(
				catchError((err) => {
					console.log(err);
					this.isLoading = false;

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe(({ items, total, ok }: any) => {
				this.isLoading = false;

				this.doctors = items;
				this.totalItems = total;
			});
	}

	changePage(value: number) {
		this.offset += value;

		if (this.offset < 0) {
			this.offset = 0;
		} else if (this.offset >= this.totalItems) {
			this.offset -= value;
		}
		this.getData();
	}

	search(find) {
		this._searchService
			.getAllByCollection('doctor', find)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe((items) => {
				this.doctors = items;
				console.log(items);
			});
	}

	deleteDoctor(doctor: Doctor) {
		Swal.fire({
			title: 'Estas seguro?',
			text: `Esta a punto de elimar el usuario ${doctor.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, borrar'
		}).then((result) => {
			if (result.value) {
				this.isLoading = true;

				this._doctorService
					.deleteDoctor(doctor._id)
					.pipe(
						catchError((err) => {
							console.log(err);
							this.isLoading = false;

							return of({ ok: false, error: err.error.error });
						})
					)
					.subscribe(({ ok, Doctor }: any) => {
						this.isLoading = false;
						if (ok) {
							this.getData();
							return Swal.fire({
								toast: true,
								icon: 'success',
								title: `Doctor ${doctor.name} eliminado`,
								position: 'top-end',
								showConfirmButton: false,
								timer: 3000
							});
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
		});
	}

	saveChanges(doctor: Doctor) {
		Swal.fire({
			title: 'Estas seguro?',
			text: `Esta a punto de modificar el doctor ${doctor.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, modificar'
		}).then((result) => {
			if (result.value) {
				this.isLoading = true;

				this._doctorService
					.setDoctor(doctor)
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
							this.getData();
							return Swal.fire({
								toast: true,
								icon: 'success',
								title: `doctor ${doctor.name} modificado`,
								position: 'top-end',
								showConfirmButton: false,
								timer: 3000
							});
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
		});
	}

	openModal(doctor: Doctor) {
		this._modalService.openModal('doctors', doctor._id, doctor.img);
	}
}
