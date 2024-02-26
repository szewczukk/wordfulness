import Button from '@/ui/Button';
import Input from '@/ui/Input';
import { noContentTypeApi } from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return <h1>Not found!</h1>;
	}

	return (
		<div className="container mx-auto mt-8 space-y-8">
			<form className="card bg-base-200" action={updateUser}>
				<div className="card-body">
					<h1 className="card-title">Edit profile</h1>
					<div className="flex items-center gap-4">
						<Input
							type="number"
							defaultValue={currentUser.id}
							name="id"
							hidden
						/>
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

					<div className="flex items-center gap-4">
						<label htmlFor="avatar">Avatar</label>
						<Input
							type="file"
							name="avatar"
							id="avatar"
							className="file-input file-input-bordered"
						/>
					</div>

					<div className="card-actions justify-end">
						<Button type="submit" className="btn-success">
							Save
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

async function updateUser(formData: FormData) {
	'use server';

	await noContentTypeApi(`/users/${formData.get('id')}`, {
		method: 'PATCH',
		body: formData,
	});

	revalidateTag('current-user');
	redirect('/profile');
}
