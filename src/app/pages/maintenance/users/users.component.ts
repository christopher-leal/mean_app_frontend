import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { catchError, distinctUntilChanged, debounceTime, map, delay } from 'rxjs/operators';
import { of, fromEvent } from 'rxjs';
import { SearchService } from './../../../services/search.service';
import Swal from 'sweetalert2';
import { ModalService } from './../../../services/modal.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.css' ]
})
export class UsersComponent implements OnInit {
	users: User[] = [];
	totalItems = 0;
	offset = 0;
	limit = 10;
	isLoading = true;
	@ViewChild('searchInput', { static: true })
	searchInput: ElementRef;
	constructor(
		private _userService: UserService,
		private _searchService: SearchService,
		private _modalService: ModalService
	) {}

	ngOnInit(): void {
		this.getData();

		this._modalService.newImage.pipe(delay(100)).subscribe((img) => this.getData());
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

		this._userService
			.getUsers(this.limit, this.offset)
			.pipe(
				catchError((err) => {
					console.log(err);
					this.isLoading = false;

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe(({ items, total, ok }: any) => {
				this.isLoading = false;

				this.users = items;
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
			.getAllByCollection('user', find)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error, items: [], total: 0 });
				})
			)
			.subscribe((items) => {
				this.users = items;
				console.log(items);
			});
	}

	deleteUser(user: User) {
		Swal.fire({
			title: 'Estas seguro?',
			text: `Esta a punto de elimar el usuario ${user.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, borrar'
		}).then((result) => {
			if (result.value) {
				this.isLoading = true;

				this._userService
					.deleteUser(user._id)
					.pipe(
						catchError((err) => {
							console.log(err);
							this.isLoading = false;

							return of({ ok: false, error: err.error.error });
						})
					)
					.subscribe(({ ok, user }: any) => {
						this.isLoading = false;
						if (ok) {
							this.getData();
							return Swal.fire({
								toast: true,
								icon: 'success',
								title: `Usuario ${user.name} eliminado`,
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

	changeRole(user: User) {
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();
		this._userService
			.setUser(user)
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
					user = res.user;

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

	openModal(user: User) {
		this._modalService.openModal('users', user._id, user.img);
	}
}
