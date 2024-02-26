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
		<div className="container mx-auto mt-8 space-y-8">
			<div className="card bg-base-200">
				<div className="card-body">
					<p className="card-title">{currentUser.username}</p>
					<p>Role: {currentUser.role}</p>
					<Image
						src={currentUser.avatarUrl}
						alt={`${currentUser.username} avatar`}
						width={256}
						height={256}
					/>
					<div className="card-actions justify-end">
						<Link href="/profile/edit">
							<Button className="btn-primary">Edit</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
