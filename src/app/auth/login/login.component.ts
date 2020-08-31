import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { saveToken } from './../../utils/jwt';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	form: FormGroup;
	constructor(private _authService: AuthService, private _router: Router, private _fb: FormBuilder) {}

	ngOnInit(): void {
		this.form = this._fb.group({
			email: [ localStorage.getItem('email') || '', [ Validators.required ] ],
			password: [ '', [ Validators.required ] ],
			remember: [ false, [] ]
		});
	}

	login() {
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

		this._authService
			.signIn(this.form.value)
			.pipe(
				catchError((err) => {
					console.log(err);

					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe((res: any) => {
				this.getFormControl('remember').value
					? localStorage.setItem('email', this.getFormControl('email').value)
					: localStorage.removeItem('email');

				if (res.ok) {
					console.log('entro');
					Swal.fire({
						toast: true,
						icon: 'success',
						title: 'Iniciaste sesion.',
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					saveToken(res.token);
					return this._router.navigateByUrl('/');
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
}
