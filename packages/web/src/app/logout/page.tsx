import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function deleteToken() {
	'use server';
	cookies().delete('token');
}

export default async function Page() {
	deleteToken();
	redirect('/login');

	return <h1>Logout</h1>;
}
