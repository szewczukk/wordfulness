import api from '@/utils/api';
import { currentUserSchema } from '@/utils/schemas';

export default async function Page() {
	const result = await api('/me');

	const currentUser = currentUserSchema.parse(result);

	return (
		<div className="container mx-auto">
			<h1>
				{currentUser.username} ({currentUser.role})
			</h1>
		</div>
	);
}
