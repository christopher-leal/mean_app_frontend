import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor/interceptor.service';

@NgModule({
	declarations: [ AppComponent, NopagefoundComponent ],
	imports: [ BrowserModule, AppRoutingModule, PagesModule, AuthModule, HttpClientModule ],
	bootstrap: [ AppComponent ],
	providers: [ { provide: HTTP_INTERCEPTORS, multi: true, useClass: InterceptorService } ]
})
export class AppModule {}
