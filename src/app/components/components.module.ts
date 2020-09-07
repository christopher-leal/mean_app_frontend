import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
	declarations: [ IncrementadorComponent, DonaComponent, SpinnerComponent, ModalComponent ],
	exports: [ IncrementadorComponent, DonaComponent, SpinnerComponent, ModalComponent ],
	imports: [ CommonModule, FormsModule, ChartsModule ]
})
export class ComponentsModule {}
