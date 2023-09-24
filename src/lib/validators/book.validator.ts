import yup from 'yup';

interface validateBookForm {
	title: FormDataEntryValue | null;
	author: FormDataEntryValue | null;
	description: FormDataEntryValue | null;
	short_description: FormDataEntryValue | null;
	main_picture?: FormDataEntryValue | null;
	small_picture?: FormDataEntryValue | null;
}

const validate = async (formData: FormData) => {
	const schema = yup.object({
		title: yup.string().required('Book title is required').min(4).max(20),
		author: yup.string().required().min(5).max(200),
		short_description: yup.string().required().min(5).max(200),
		description: yup.string().required().min(5).max(4500),
		small_picture: yup
			.mixed()
			.required()
			.test('fileType', 'The file must be an image', (value) => {
				if (value) {
					const file = value as File;
					return ['image/png', 'image/jpeg'].includes(file.type);
				}
				return true;
			})
			.test('fileSize', 'The file must be under 4 MB', (value) => {
				if (value) {
					const file = value as File;
					return file.size < 4_000_000;
				}
				return true;
			}),
		main_picture: yup
			.mixed()
			.required()
			.test('fileType', 'The file must be an image', (value) => {
				if (value) {
					const file = value as File;
					return ['image/png', 'image/jpeg'].includes(file.type);
				}
				return true;
			})
			.test('fileSize', 'The file must be under 4 MB', (value) => {
				if (value) {
					const file = value as File;
					return file.size < 4_000_000;
				}
				return true;
			})
	});

	const data: validateBookForm = {
		title: formData.get('title'),
		author: formData.get('author'),
		description: formData.get('description'),
		short_description: formData.get('short_description'),
		main_picture: formData.get('main_picture'),
		small_picture: formData.get('small_picture')
	};

	try {
		await schema.validate(data, { abortEarly: false });
		return { success: true, book: data };
	} catch (error: any) {
		// TODO: fix any
		const errors = error.inner.reduce((agg: any, e: any) => {
			if (!agg['error_' + e.path]) {
				agg['error_' + e.path] = e.message;
			}
			return agg;
		}, {});

		console.log(error);

		delete data.main_picture;
		delete data.small_picture;

		return { errors: errors, book: data, success: false };
	}
};

export default validate;
