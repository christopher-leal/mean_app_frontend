import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from './../../services/modal.service';
import Swal from 'sweetalert2';
import { FileUploadService } from './../../services/file-upload.service';
import { catchError } from 'rxjs/operators';
import { User } from './../../models/User';
import { of } from 'rxjs';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: [ './modal.component.css' ]
})
export class ModalComponent implements OnInit {
	// user: User;

	file: File;
	previewUrl: any = null;

	constructor(public _modalService: ModalService, private _fileUploadService: FileUploadService) {}

	ngOnInit(): void {}

	closeModal() {
		this.previewUrl = null;
		this._modalService.closeModal();
	}

	changeFile(file: File) {
		this.file = file;

		if (!file) {
			return (this.previewUrl = null);
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = () => {
			this.previewUrl = reader.result;
		};
	}

	fileUpload() {
		Swal.fire({
			icon: 'info',
			title: 'Espere por favor',
			allowOutsideClick: false
		});
		Swal.showLoading();

		this._fileUploadService
			.updateFile(this.file, this._modalService.type, this._modalService.id)
			.pipe(
				catchError((err) => {
					return of({ ok: false, error: err.error.error });
				})
			)
			.subscribe((res: any) => {
				if (res.ok) {
					Swal.fire({
						toast: true,

						icon: 'success',
						title: res.msg,
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});
					this._modalService.newImage.emit(res.fileName);
					this._modalService.closeModal();
					// this._modalService.img = res.fileName;
					return;
					// return this._router.navigate([ 'login' ]);
				}
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: res.error
				});
			});
	}
}
