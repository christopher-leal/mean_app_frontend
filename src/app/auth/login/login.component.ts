import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { saveToken } from './../../utils/jwt';
import { environment } from './../../../environments/environment';

declare const gapi: any;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	form: FormGroup;
	auth2: any;

	constructor(
		private _authService: AuthService,
		private _router: Router,
		private _fb: FormBuilder,
		private ngZone: NgZone
	) {}

	ngOnInit(): void {
		this.form = this._fb.group({
			email: [ localStorage.getItem('email') || '', [ Validators.required ] ],
			password: [ '', [ Validators.required ] ],
			remember: [ localStorage.getItem('email') ? true : false, [] ]
		});

		this.renderButton();
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

	renderButton() {
		gapi.signin2.render('my-signin2', {
			scope: 'profile email',
			width: 240,
			height: 50,
			longtitle: true,
			theme: 'dark'
		});
		this.startApp();
	}

	async startApp() {
		await this._authService.googleInit();
		this.auth2 = this._authService.auth2;
		this.attachSignin(document.getElementById('my-signin2'));
	}

	attachSignin(element) {
		this.auth2.attachClickHandler(
			element,
			{},
			(googleUser) => {
				const id_token = googleUser.getAuthResponse().id_token;
				this._authService
					.googleSignIn(id_token)
					.pipe(
						catchError((err) => {
							console.log(err);
							return of({ ok: false, error: err.error.error });
						})
					)
					.subscribe((res: any) => {
						console.log(res);
						if (res.ok) {
							Swal.fire({
								toast: true,
								icon: 'success',
								title: 'Iniciaste sesion.',
								position: 'top-end',
								showConfirmButton: false,
								timer: 3000
							});
							saveToken(res.token);
							this.ngZone.run(() => {
								this._router.navigateByUrl('/');
							});
							return;
						}
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: res.error
						});
					});
			},
			(error) => {
				alert(JSON.stringify(error, undefined, 2));
			}
		);
	}
}
