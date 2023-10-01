import { firestore } from 'firebase-admin';
import type { Book, BookRef } from '../../models/book';
import { db } from './firebase.server';
import { saveFileToBucket } from './firestorage.server';

export const addBook = async (book: Book, userId: string) => {
	// save to firestore without picture informaition
	const bookCollection = db.collection('books');

	const bookRef = await bookCollection.add({
		title: book.title,
		author: book.author,
		short_description: book.short_description,
		description: book.description,
		user_id: userId,
		created_at: firestore.Timestamp.now().seconds,
		updated_at: firestore.Timestamp.now().seconds,
		likes: 0
	});

	// save the picutures
	const smallPictureUrl = await saveFileToBucket(
		book.small_picture,
		`${userId}/${bookRef.id}/small_picuture`
	);
	const mainPictureUrl = await saveFileToBucket(
		book.main_picture,
		`${userId}/${bookRef.id}/main_picuture`
	);

	// update the document in firestore database with the picuture urls
	await bookRef.update({
		main_picture: mainPictureUrl,
		small_picuture: smallPictureUrl
	});

	// return book id
	return bookRef.id;
};

export const getBook = async (id: string) => {
	const bookRef = await db.collection('books').doc(id).get();

	if (bookRef.exists) {
		const book: BookRef = {
			title: bookRef.data()?.title,
			author: bookRef.data()?.author,
			description: bookRef.data()?.description,
			short_description: bookRef.data()?.short_description,
			main_picture: bookRef.data()?.main_picture,
			small_picture: bookRef.data()?.small_picture
		};
		return { id: bookRef.id, ...book };
	}
};
