import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowImgPipe } from './show-img.pipe';

@NgModule({
	declarations: [ ShowImgPipe ],
	imports: [ CommonModule ],
	exports: [ ShowImgPipe ]
})
export class PipesModule {}
