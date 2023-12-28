import api from '@/utils/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginPayloadSchema = z.object({
	token: z.string(),
});

export default async function Page() {
	async function handleSubmit(formData: FormData) {
		'use server';

		const result = await api.post('/login', {
			username: formData.get('username'),
			password: formData.get('password'),
		});

		const payload = loginPayloadSchema.parse(result.data);

		cookies().set('token', payload.token);

		redirect('/dashboard');
	}

	return (
		<div className="container mx-auto">
			<form
				action={handleSubmit}
				className="p-8 bg-slate-300 mt-8 flex flex-col gap-2 items-start"
			>
				<label htmlFor="username">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					className="px-2 py-1"
					placeholder="Enter username"
				/>

				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					className="px-2 py-1"
					placeholder="Enter password"
				/>

				<button
					type="submit"
					className="bg-green-700 px-8 py-1 text-neutral-50 hover:bg-green-800 transition-colors"
				>
					Log in
				</button>
			</form>
		</div>
	);
}
