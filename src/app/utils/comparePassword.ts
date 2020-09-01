import { FormGroup } from '@angular/forms';
export const checkPassword = (password, password2) => {
	return (form: FormGroup) => {
		const pass1Control = form.get(password);
		const pass2Control = form.get(password2);

		pass1Control.value === pass2Control.value
			? pass2Control.setErrors(null)
			: pass2Control.setErrors({ ...pass2Control.errors });
	};
};
