import api from '@/utils/api';
import { userSchema } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function Page() {
	let result: any;
	try {
		result = await api('/me');
	} catch {
		redirect('/login');
	}

	const currentUser = userSchema.parse(result);

	if (currentUser.role === 'superuser') {
		redirect('/admin');
	}

	return (
		<div className="container mx-auto">
			<h1>
				{currentUser.username} ({currentUser.role})
			</h1>
		</div>
	);
}
