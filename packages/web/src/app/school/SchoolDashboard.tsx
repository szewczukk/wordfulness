'use client';

import { School, User } from '@/utils/types';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import useSchoolsUsers from '@/hooks/useSchoolsUsers';

type Props = {
	school: School;
	users: User[];
};

export default function SchoolDashboard({ users, school }: Props) {
	const { deleteUser, handleCreateUserFormSubmit, schoolsUsers } =
		useSchoolsUsers(users);

	return (
		<div className="container mx-auto mt-8 space-y-2 bg-slate-200 p-8">
			<h1>{school.name}</h1>
			<h2>Users</h2>
			<UsersTable users={schoolsUsers} onUserDeleted={deleteUser} />
			<CreateUserForm
				onSubmit={handleCreateUserFormSubmit}
				schoolId={school.id}
			/>
		</div>
	);
}
