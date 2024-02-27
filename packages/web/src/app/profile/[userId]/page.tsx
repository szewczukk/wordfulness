import api from '@/utils/api';
import { userSchema } from '@/utils/types';
import UserProfile from '../UserProfile';

type Props = {
	params: {
		userId: number;
	};
};

export default async function ProfilePage({ params: { userId } }: Props) {
	const user = await getUser(userId);

	return <UserProfile user={user} isCurrentUser={false} />;
}

async function getUser(userId: number) {
	const result = await api(`/users/${userId}`, {
		next: { tags: [`user-${userId}`] },
	});

	const user = userSchema.parse(result);
	return user;
}
