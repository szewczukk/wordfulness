import Button from '@/ui/Button';
import { getCurrentUser } from '@/utils/helpers';
import Link from 'next/link';

export default async function ProfilePage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return <h1>Not found!</h1>;
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-300 p-8">
			<p>{currentUser.username}</p>
			<p>{currentUser.role}</p>
			<Link href={`/profile/edit/`}>
				<Button>Edit</Button>
			</Link>
		</div>
	);
}
