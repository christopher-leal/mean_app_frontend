import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SearchService } from './../../../services/search.service';
import { ModalService } from './../../../services/modal.service';
import { delay, debounceTime, map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Hospital } from './../../../models/Hospital';
import { HospitalService } from './../../../services/hospital.service';

@Component({
	selector: 'app-hospitals',
	templateUrl: './hospitals.component.html',
	styleUrls: [ './hospitals.component.css' ]
})
export class HospitalsComponent implements OnInit {
	hospitals: Hospital[] = [];
	totalItems = 0;
	offset = 0;
	limit = 10;
	isLoading = true;
	@ViewChild('searchInput', { static: true })
	searchInput: ElementRef;
	constructor(
		private _hospitalService: HospitalService,
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
			.pipe(debounceTime(1500), map((event: any) => event.target.value), distinctUntilChanged())
			.subscribe((res) => {
				this.search(res);
			});
	}

	getData() {
		this.isLoading = true;

		this._hospitalService
			.getHospitals(this.limit, this.offset)
			.pipe(
				catchError((err) => {
					console.log(err);
					this.isLoading = false;

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe(({ items, total, ok }: any) => {
				this.isLoading = false;

				this.hospitals = items;
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
			.getAllByCollection('hospital', find)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe((items) => {
				this.hospitals = items;
				console.log(items);
			});
	}

	deleteHospital(hospital: Hospital) {
		Swal.fire({
			title: 'Estas seguro?',
			text: `Esta a punto de elimar el usuario ${hospital.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, borrar'
		}).then((result) => {
			if (result.value) {
				this.isLoading = true;

				this._hospitalService
					.deleteHospital(hospital._id)
					.pipe(
						catchError((err) => {
							console.log(err);
							this.isLoading = false;

							return of({ ok: false, error: err.error.error });
						})
					)
					.subscribe(({ ok, hospital }: any) => {
						this.isLoading = false;
						if (ok) {
							this.getData();
							return Swal.fire({
								toast: true,
								icon: 'success',
								title: `Usuario ${hospital.name} eliminado`,
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

	saveChanges(hospital: Hospital) {
		Swal.fire({
			title: 'Estas seguro?',
			text: `Esta a punto de modificar el hospital ${hospital.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, modificar'
		}).then((result) => {
			if (result.value) {
				this.isLoading = true;

				this._hospitalService
					.setHospital(hospital)
					.pipe(
						catchError((err) => {
							console.log(err);
							this.isLoading = false;

							return of({ ok: false, error: err.error.error });
						})
					)
					.subscribe(({ ok, hospital }: any) => {
						this.isLoading = false;
						if (ok) {
							this.getData();
							return Swal.fire({
								toast: true,
								icon: 'success',
								title: `Hospital ${hospital.name} modificado`,
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

	changeRole(hospital: Hospital) {
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();
		this._hospitalService
			.setHospital(hospital)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe((res: any) => {
				if (res.ok) {
					Swal.fire({
						toast: true,

						icon: 'success',
						title: 'Usuario actualizado correctamente',
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					hospital = res.hospital;

					return;
					// return this._router.navigate([ 'login' ]);
				}
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: res.error
				});
			});
	}

	openModal(hospital: Hospital) {
		this._modalService.openModal('hospitals', hospital._id, hospital.img);
	}

	async setHospital() {
		const { value: name } = await Swal.fire<string>({
			title: 'Agregar hospital',
			input: 'text',
			inputPlaceholder: 'Enter the URL',
			showCancelButton: true
		});

		if (name) {
			this._hospitalService
				.setHospital({ name })
				.pipe(
					catchError((err) => {
						console.log(err);
						this.isLoading = false;

						return of({ ok: false, error: err.error.error });
					})
				)
				.subscribe(({ ok, hospital }: any) => {
					this.isLoading = false;
					if (ok) {
						this.searchInput.nativeElement.value
							? this.search(this.searchInput.nativeElement.value)
							: this.getData();

						return Swal.fire({
							toast: true,
							icon: 'success',
							title: `Hospital ${hospital.name} agregado`,
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
			Swal.fire(`Entered name: ${name}`);
		}
	}
}
