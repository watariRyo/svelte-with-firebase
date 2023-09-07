import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const loginWithGoogle = async () => {
	const auth = getAuth();
	const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
	return userCredential.user;
};

export const logout = async () => {
	await signOut(getAuth());
};
