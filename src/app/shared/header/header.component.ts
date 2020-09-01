import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/User';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styles: []
})
export class HeaderComponent implements OnInit {
	imgUrl: string;
	user: User;
	constructor(private _authService: AuthService) {
		this.imgUrl = this._authService.getImage;
		this.user = this._authService.user;
	}

	ngOnInit(): void {}

	logOut() {
		this._authService.logOut();
	}
}
