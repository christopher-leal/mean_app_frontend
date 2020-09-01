import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styles: []
})
export class SidebarComponent implements OnInit {
	menuItems: any[];
	user: User;
	constructor(private sidebarService: SidebarService, private _authService: AuthService) {
		this.menuItems = this.sidebarService.menu;
		this.user = this._authService.user;
	}

	ngOnInit(): void {}

	logOut() {
		this._authService.logOut();
	}
}
