import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styles: []
})
export class HeaderComponent implements OnInit {
	user: User;
	constructor(private _authService: AuthService) {
		this.user = this._authService.user;
	}

	ngOnInit(): void {}

	logOut() {
		this._authService.logOut();
	}
}
