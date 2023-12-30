import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import api from '@/utils/api';
import { User, userSchema } from '@/utils/types';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let user: User | undefined;
	try {
		const result = await api('/me');

		user = userSchema.parse(result);
	} catch (e) {
		console.log(e);
	}

	return (
		<html lang="en">
			<body className={`${inter.className} bg-slate-100`}>
				<nav className="flex items-center justify-between bg-slate-200 p-4">
					<h1>Wordfulness</h1>
					<ul>
						{user && (
							<li>
								<Link href="/logout">Logout</Link>
							</li>
						)}
					</ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
