import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class IsAuthGuard implements CanActivate {
	constructor(private _router: Router, private _authService: AuthService) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this._authService.refreshToken().pipe(
			tap((resp) => {
				if (!resp) {
					this._router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
				}
			})
		);
	}
}
