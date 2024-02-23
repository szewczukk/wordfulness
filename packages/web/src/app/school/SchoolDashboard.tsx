'use client';

import { School, User } from '@/utils/types';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import { createUserAction } from '@/utils/actions';
import { FormEvent } from 'react';

type Props = {
	school: School;
	users: User[];
};

export default function SchoolDashboard({ users, school }: Props) {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		await createUserAction(formData);
	};

	return (
		<div className="container mx-auto mt-8 space-y-2 bg-slate-200 p-8">
			<h1>{school.name}</h1>
			<h2>Users</h2>
			<UsersTable
				users={users}
				onUserDeleted={(userId) => console.log(userId)}
			/>
			<CreateUserForm onSubmit={handleSubmit} schoolId={school.id} />
		</div>
	);
}
