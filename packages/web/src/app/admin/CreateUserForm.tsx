import { User } from '@/utils/types';
import { createUserAction } from './actions';
import { FormEvent } from 'react';
import Input from '@/ui/Input';

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
			<Input type="text" name="username" placeholder="Enter username.." />
			<Input type="password" name="password" placeholder="Enter password.." />
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
