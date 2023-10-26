import { firestore } from 'firebase-admin';
import type { Book, BookRef } from '../../models/book';
import { db } from './firebase.server';
import { saveFileToBucket } from './firestorage.server';
import { PUBLIC_PAGE_SIZE } from '$env/static/public';

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
		small_picture: smallPictureUrl
	});

	// return book id
	return bookRef.id;
};

export const getBooksForUser = async (userId: string) => {
	const user = await getUser(userId);
	const books = await db
		.collection('books')
		.orderBy('created_at', 'desc')
		.where('user_id', '==', userId)
		.get();

	return books.docs.map((d) => {
		const likeBook = user?.bookIds.includes(d.id) || false;
		const book: BookRef = {
			id: d.id,
			title: d.data()?.title,
			author: d.data()?.author,
			description: d.data()?.description,
			short_description: d.data()?.short_description,
			main_picture: d.data()?.main_picture,
			small_picture: d.data()?.small_picture,
			user_id: d.data()?.user_id,
			likes: d.data()?.likes,
			likeBook: likeBook
		};
		return book;
	});
};

export const getBooks = async (userId: string, page = 1) => {
	const user = userId ? await getUser(userId) : null;

	const bookCount = await db.collection('books').count().get();
	const totalBooks = bookCount.data().count;

	const next = totalBooks > page * +PUBLIC_PAGE_SIZE;
	const previous = page > 1;

	const books = await db
		.collection('books')
		.limit(+PUBLIC_PAGE_SIZE)
		.offset((page - 1) * +PUBLIC_PAGE_SIZE)
		.orderBy('created_at', 'desc')
		.get();

	const likeBooks = books.docs.map((d) => {
		const likeBook = user?.bookIds?.includes(d.id) || false;
		const book: BookRef = {
			id: d.id,
			title: d.data()?.title,
			author: d.data()?.author,
			description: d.data()?.description,
			short_description: d.data()?.short_description,
			main_picture: d.data()?.main_picture,
			small_picture: d.data()?.small_picture,
			user_id: d.data()?.user_id,
			likes: d.data()?.likes,
			likeBook: likeBook
		};
		return book;
	});
	return { books: likeBooks, next, previous };
};

export const editBook = async (id: string, book: Book, userId: string) => {
	const bookRef = await db.collection('books').doc(id);
	let mainPicture = book.main_picture || null;
	let smallPicture = book.small_picture || null;
	await bookRef.update({
		title: book.title,
		author: book.author,
		short_description: book.short_description,
		description: book.description,
		updated_at: firestore.Timestamp.now().seconds
	});

	if (mainPicture && mainPicture.size > 0) {
		const mainPictureUrl = await saveFileToBucket(
			mainPicture,
			`${userId}/${bookRef.id}/main_picuture`
		);
		await bookRef.update({
			main_picture: mainPictureUrl
		});
	}
	if (smallPicture && smallPicture.size > 0) {
		const smallPictureUrl = await saveFileToBucket(
			smallPicture,
			`${userId}/${bookRef.id}/small_picuture`
		);
		await bookRef.update({
			small_picture: smallPictureUrl
		});
	}
};

export const getBook = async (id: string, userId: string | null = null) => {
	const bookRef = await db.collection('books').doc(id).get();

	if (bookRef.exists) {
		const user = userId ? await getUser(userId) : null;
		const likeBook = user?.bookIds?.includes(id) || false;

		console.log(user);
		console.log(userId);
		console.log(likeBook);
		console.log(user?.bookIds);
		console.log(id);

		const book: BookRef = {
			id: id,
			title: bookRef.data()?.title,
			author: bookRef.data()?.author,
			description: bookRef.data()?.description,
			short_description: bookRef.data()?.short_description,
			main_picture: bookRef.data()?.main_picture,
			small_picture: bookRef.data()?.small_picture,
			user_id: bookRef.data()?.user_id,
			likes: bookRef.data()?.likes,
			likeBook: likeBook
		};
		return { ...book };
	}
};

export const getLikeBooks = async (userId: string) => {
	const user = await getUser(userId);
	const bookIds = (user?.bookIds || []) as string[];

	if (bookIds.length === 0) {
		return [];
	}

	const books = await db
		.collection('books')
		.where(firestore.FieldPath.documentId(), 'in', bookIds)
		.get();

	return books.docs.map((d) => {
		const book: BookRef = {
			id: d.id,
			title: d.data()?.title,
			author: d.data()?.author,
			description: d.data()?.description,
			short_description: d.data()?.short_description,
			main_picture: d.data()?.main_picture,
			small_picture: d.data()?.small_picture,
			user_id: d.data()?.user_id,
			likes: d.data()?.likes,
			likeBook: true
		};
		return book;
	});
};

export const getUser = async (userId: string) => {
	const user = await db.collection('users').doc(userId).get();

	return user?.data();
};

export const toggleBookLike = async (bookId: string, userId: string) => {
	const bookDoc = db.collection('books').doc(bookId);

	const userDoc = db.collection('users').doc(userId);

	const user = await userDoc.get();
	const userData = user.data();

	if (userData && userData.bookIds && userData.bookIds.includes(bookId)) {
		await userDoc.update({
			bookIds: firestore.FieldValue.arrayRemove(bookId)
		});
		await bookDoc.update({
			likes: firestore.FieldValue.increment(-1)
		});
	} else {
		await userDoc.update({
			bookIds: firestore.FieldValue.arrayUnion(bookId)
		});
		await bookDoc.update({
			likes: firestore.FieldValue.increment(1)
		});
	}

	return await getBook(bookId, userId);
};
