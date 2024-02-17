import Image from 'next/image';
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
			<Image
				src={currentUser.avatarUrl}
				alt={`${currentUser.username} avatar`}
				width={256}
				height={256}
			/>
			<Link href={`/profile/edit/`}>
				<Button>Edit</Button>
			</Link>
		</div>
	);
}
