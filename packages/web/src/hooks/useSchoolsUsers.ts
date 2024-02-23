import { createUserAction, deleteUserAction } from '@/utils/actions';
import { User } from '@/utils/types';
import { FormEvent, useState } from 'react';

export default function useSchoolsUsers(defaultUsers: User[]) {
	const [schoolsUsers, setSchoolsUsers] = useState<User[]>(defaultUsers);

	// Works well with @/components/CreateUserForm
	const handleCreateUserFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const user = await createUserAction(formData);
		if (!user) {
			return;
		}

		setSchoolsUsers((prev) => [...prev, user]);
	};

	const deleteUser = async (userId: number) => {
		await deleteUserAction(userId);

		setSchoolsUsers((prev) => prev.filter((user) => user.id !== userId));
	};

	return {
		handleCreateUserFormSubmit,
		deleteUser,
		schoolsUsers,
		setSchoolsUsers,
	};
}
