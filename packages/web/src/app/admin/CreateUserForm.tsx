import { User } from '@/utils/types';
import { createUserAction } from './actions';
import { FormEvent } from 'react';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';

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
			<Input type="number" name="schoolId" defaultValue={schoolId} hidden />

			<Select
				name="role"
				options={{ admin: 'Admin', teacher: 'Teacher', student: 'Student' }}
			/>

			<Button type="submit">Create user</Button>
		</form>
	);
}
