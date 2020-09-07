import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {
	menu: any[] = [
		{
			titulo: 'Dashboard',
			icon: 'mdi mdi-gauge',
			submenu: [
				{ titulo: 'Main', url: '/' },
				{ titulo: 'Gráficas', url: 'grafica1' },
				{ titulo: 'rxjs', url: 'rxjs' },
				{ titulo: 'Promesas', url: 'promesas' },
				{ titulo: 'ProgressBar', url: 'progress' }
			]
		},
		{
			titulo: 'Mantenimiento',
			icon: 'mdi mdi-folder-lock-open',
			submenu: [
				{ titulo: 'Usuarios', url: 'users' },
				{ titulo: 'Hospitales', url: 'hospitals' },
				{ titulo: 'Doctores', url: 'doctors' }
			]
		}
	];

	constructor() {}
}
