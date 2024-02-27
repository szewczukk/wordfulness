import Image from 'next/image';
import { User } from '@/utils/types';
import Link from 'next/link';
import Button from '@/ui/Button';

type Props = {
	user: User;
	isCurrentUser: boolean;
};

export default function UserProfile({ user, isCurrentUser }: Props) {
	return (
		<div className="container mx-auto mt-8 space-y-8">
			<div className="card bg-base-200">
				<div className="card-body">
					<p className="card-title">{user.username}</p>
					<p>Role: {user.role}</p>
					<Image
						src={user.avatarUrl}
						alt={`${user.username} avatar`}
						width={256}
						height={256}
					/>
					<div className="card-actions justify-end">
						{isCurrentUser && (
							<Link href="/profile/edit">
								<Button className="btn-primary">Edit</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
