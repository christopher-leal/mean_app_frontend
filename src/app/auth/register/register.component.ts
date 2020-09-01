import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { checkPassword } from './../../utils/comparePassword';
@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
	isLoading = false;
	form: FormGroup;
	constructor(private _fb: FormBuilder, private _userService: UserService, private _router: Router) {}

	ngOnInit(): void {
		this.form = this._fb.group(
			{
				name: [ '', [ Validators.required ] ],
				email: [ '', [ Validators.required ] ],
				password: [ '', [ Validators.required ] ],
				password2: [ '', [ Validators.required ] ],
				agree: [ null, [ Validators.required ] ]
			},
			{
				validators: checkPassword('password', 'password2')
			}
		);
	}

	handleSubmit() {
		console.log(this.form.value);
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();

		this._userService
			.setUser(this.form.value)
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
						title: 'Signed in successfully',
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					return this._router.navigate([ 'login' ]);
				}
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: res.error
				});
			});
	}

	getFormControl(campo: string) {
		return this.form.get(campo);
	}

	inputValidation(campo: string): boolean {
		return this.form.get(campo).invalid && this.form.get(campo).touched;
	}
}
