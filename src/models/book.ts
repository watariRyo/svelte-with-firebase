export type Book = {
	title: string;
	author: string;
	description: string;
	short_description: string;
	main_picture: File;
	small_picture: File;
};

export type BookRef = {
	title: string;
	author: string;
	description: string;
	short_description: string;
	main_picture: string;
	small_picture: string;
	user_id: string;
};
