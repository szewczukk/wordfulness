import { User } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
	currentUser: User | undefined;
};

export default async function Navbar({ currentUser }: Props) {
	return (
		<nav className="navbar bg-base-100">
			<div className="flex-1">
				<Link href="/" className="btn btn-ghost">
					Wordfulness
				</Link>
			</div>
			<div className="flex-none gap-2">
				{currentUser && (
					<>
						<ul className="menu menu-horizontal">
							<li>
								<Link href="/school">School</Link>
							</li>
							<li>
								<Link href="/learn">Learn</Link>
							</li>
						</ul>
						<div className="dropdown dropdown-end">
							<div
								tabIndex={0}
								role="button"
								className="btn btn-ghost btn-circle avatar"
							>
								<div className="w-10 rounded-full">
									<Image
										alt="User's avatar"
										src={currentUser.avatarUrl}
										width={40}
										height={40}
									/>
								</div>
							</div>
							<ul
								tabIndex={0}
								className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
							>
								<li>
									<Link href="/profile">Profile</Link>
								</li>
								<li>
									<Link href="/logout">Logout</Link>
								</li>
							</ul>
						</div>
					</>
				)}
			</div>
		</nav>
	);
}
