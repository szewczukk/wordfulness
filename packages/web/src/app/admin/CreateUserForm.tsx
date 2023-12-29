import { User } from '@/utils/types';
import { createUserAction } from './actions';
import { FormEvent } from 'react';

type Props = {
	schoolId: number;
	onUserCreated: (user: User) => void;
};

export default function CreateUserForm({ schoolId, onUserCreated }: Props) {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const user = await createUserAction(formData);

		if (!user) {
			return;
		}

		onUserCreated(user);
	};

	return (
		<form className="flex items-center gap-2" onSubmit={handleSubmit}>
			<input
				type="text"
				name="username"
				placeholder="Enter user name.."
				className="px-2 py-1 border-gray-900 border bg-gray-300 text-gray-800 placeholder:text-gray-50"
			/>
			<input
				type="password"
				name="password"
				placeholder="Enter password.."
				className="px-2 py-1 border-gray-900 border bg-gray-300 text-gray-800 placeholder:text-gray-50"
			/>
			<input type="number" name="schoolId" value={schoolId} hidden />
			<select name="role" className="bg-gray-300 px-8 py-1 border">
				<option value="admin">Admin</option>
				<option value="teacher">Teacher</option>
				<option value="student">Student</option>
			</select>
			<button
				type="submit"
				className="bg-green-700 px-8 py-1 text-neutral-50 hover:bg-green-800 transition-colors"
			>
				Create user
			</button>
		</form>
	);
}
