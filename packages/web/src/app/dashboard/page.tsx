import api from '@/utils/api';
import { userSchema } from '@/utils/types';

export default async function Page() {
	const result = await api('/me');

	const currentUser = userSchema.parse(result);

	return (
		<div className="container mx-auto">
			<h1>
				{currentUser.username} ({currentUser.role})
			</h1>
		</div>
	);
}
