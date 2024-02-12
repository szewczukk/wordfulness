import Button from '@/ui/Button';
import Input from '@/ui/Input';
import api from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function updateUser(formData: FormData) {
	'use server';

	await api(`/users/${formData.get('id')}`, {
		method: 'PATCH',
		body: JSON.stringify({ username: formData.get('username') }),
	});

	revalidateTag('current-user');
	redirect('/profile');
}

export default async function ProfilePage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return <h1>Not found!</h1>;
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-300 p-8">
			<form className="flex flex-col items-start gap-4" action={updateUser}>
				<div className="flex items-center gap-4">
					<Input type="number" defaultValue={currentUser.id} name="id" hidden />
					<label htmlFor="username">Username</label>
					<Input
						type="text"
						defaultValue={currentUser.username}
						name="username"
						id="username"
						minLength={1}
						maxLength={20}
					/>
				</div>

				<Button type="submit">Save</Button>
			</form>
		</div>
	);
}
