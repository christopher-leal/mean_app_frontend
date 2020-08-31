import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { IsAuthGuard } from './../guards/is-auth.guard';

const routes: Routes = [
	{
		path: 'dashboard',
		component: PagesComponent,
		children: [
			{ path: '', component: DashboardComponent, data: { titulo: 'Dashboard' }, canActivate: [ IsAuthGuard ] },
			{
				path: 'progress',
				component: ProgressComponent,
				data: { titulo: 'ProgressBar' },
				canActivate: [ IsAuthGuard ]
			},
			{
				path: 'grafica1',
				component: Grafica1Component,
				data: { titulo: 'Gráfica #1' },
				canActivate: [ IsAuthGuard ]
			},
			{
				path: 'account-settings',
				component: AccountSettingsComponent,
				data: { titulo: 'Ajustes de cuenta' },
				canActivate: [ IsAuthGuard ]
			},
			{
				path: 'promesas',
				component: PromesasComponent,
				data: { titulo: 'Promesas' },
				canActivate: [ IsAuthGuard ]
			},
			{ path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' }, canActivate: [ IsAuthGuard ] }
		],
		canActivate: [ IsAuthGuard ]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class PagesRoutingModule {}
