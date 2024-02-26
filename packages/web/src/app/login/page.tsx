import api from '@/utils/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';
import Input from '@/ui/Input';
import Button from '@/ui/Button';

const loginPayloadSchema = z.object({
	token: z.string(),
});

export default async function Page() {
	return (
		<div className="container mx-auto mt-8 space-y-8">
			<form action={loginAction} className="card bg-base-200 items-center">
				<div className="card-body gap-4">
					<h1 className="card-title">Login</h1>
					<Input type="text" name="username" placeholder="Enter username" />
					<Input type="password" name="password" placeholder="Enter password" />

					<div className="card-actions justify-start">
						<Button type="submit" className="btn-success w-full">
							Log in
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

async function loginAction(formData: FormData) {
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

	redirect('/');
}
