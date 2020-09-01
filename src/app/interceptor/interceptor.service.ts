import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { getToken } from '../utils/jwt';
import { environment } from './../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
	constructor(private _authService: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const currentUser = this._authService.user;
		const token = getToken();
		const isLoggedIn = currentUser && token;
		const isApiUrl = req.url.startsWith(environment.url);
		if (isLoggedIn && isApiUrl) {
			req = req.clone({
				setHeaders: {
					token: `${token}`
				}
			});
		}

		return next.handle(req);
	}
}
