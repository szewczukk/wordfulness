import { getCurrentUser } from '@/utils/helpers';
import UserProfile from './UserProfile';

export default async function ProfilePage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return <h1>Not found!</h1>;
	}

	return <UserProfile user={currentUser} isCurrentUser />;
}
