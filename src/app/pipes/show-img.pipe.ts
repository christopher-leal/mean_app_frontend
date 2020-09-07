import { Pipe, PipeTransform } from '@angular/core';
import { environment } from './../../environments/environment';
const url = environment.url;

@Pipe({
	name: 'showImg'
})
export class ShowImgPipe implements PipeTransform {
	transform(img: string, type: 'users' | 'doctors' | 'hospitals'): unknown {
		if (img && img.includes('http')) {
			return img;
		}

		return `${url}uploads/${type}/${img}`;
	}
}
