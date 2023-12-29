import api from '@/utils/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';
import Input from '@/ui/Input';

const loginPayloadSchema = z.object({
	token: z.string(),
});

export default async function Page() {
	async function handleSubmit(formData: FormData) {
		'use server';

		const result = await api('/login', {
			method: 'POST',
			body: JSON.stringify({
				username: formData.get('username'),
				password: formData.get('password'),
			}),
		});

		const payload = loginPayloadSchema.parse(result);

		cookies().set('token', payload.token, { httpOnly: true, sameSite: true });

		redirect('/dashboard');
	}

	return (
		<div className="container mx-auto">
			<form
				action={handleSubmit}
				className="mt-8 flex flex-col items-start gap-2 bg-slate-300 p-8"
			>
				<label htmlFor="username">Username</label>
				<Input
					type="text"
					name="username"
					id="username"
					placeholder="Enter username"
				/>

				<label htmlFor="password">Password</label>
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="Enter password"
				/>

				<button
					type="submit"
					className="bg-green-700 px-8 py-1 text-neutral-50 transition-colors hover:bg-green-800"
				>
					Log in
				</button>
			</form>
		</div>
	);
}
