import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { checkPassword } from './../../utils/comparePassword';
import Swal from 'sweetalert2';
import { UserService } from './../../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { FileUploadService } from './../../services/file-upload.service';
import { User } from './../../models/User';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	form: FormGroup;
	user: User;
	file: File;
	constructor(
		private _fb: FormBuilder,
		private _userService: UserService,
		private _authService: AuthService,
		private _fileUploadService: FileUploadService
	) {
		this.user = this._authService.user;
	}

	ngOnInit(): void {
		this.form = this._fb.group(
			{
				name: [ this.user.name, [ Validators.required ] ],
				email: [ this.user.email, [ Validators.required, Validators.email ] ],
				password: [ '', [] ],
				password2: [ '', [] ]
			},
			{
				validators: checkPassword('password', 'password2')
			}
		);
	}

	handleSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const setUser = { ...this.form.value, id: this._authService.userId };
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();

		this._userService
			.setUser(setUser)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe((res: any) => {
				console.log(res.user);
				if (res.ok) {
					Swal.fire({
						toast: true,

						icon: 'success',
						title: 'Usuario actualizado correctamente',
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					this.user.name = res.user.name;
					this.user.email = res.user.email;
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

	changeFile(file: File) {
		this.file = file;
	}

	fileUpload() {
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();

		this._fileUploadService
			.updateFile(this.file, 'users', this.user._id)
			.pipe(
				catchError((err) => {
					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe((res: any) => {
				if (res.ok) {
					Swal.fire({
						toast: true,

						icon: 'success',
						title: res.msg,
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					this.user.img = res.fileName;
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
}
