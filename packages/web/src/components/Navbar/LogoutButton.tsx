'use client';

import { logoutAction } from '@/utils/actions';

export default function LogoutButton() {
	return (
		<button type="submit" onClick={() => logoutAction()}>
			Logout
		</button>
	);
}
