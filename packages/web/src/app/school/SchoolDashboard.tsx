'use client';

import { School, User } from '@/utils/types';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import useSchoolsUsers from '@/hooks/useSchoolsUsers';

type Props = {
	school: School;
	users: User[];
	currentUser: User;
};

export default function SchoolDashboard({ users, school, currentUser }: Props) {
	const { deleteUser, handleCreateUserFormSubmit, schoolsUsers } =
		useSchoolsUsers(users);

	return (
		<div className="container mx-auto mt-8 space-y-2">
			<div className="card bg-base-200">
				<div className="card-body space-y-2">
					<h1 className="card-title">{school.name}</h1>
					<h2>Users</h2>
					<UsersTable users={schoolsUsers} onUserDeleted={deleteUser} />
					{currentUser.role === 'admin' && (
						<CreateUserForm
							onSubmit={handleCreateUserFormSubmit}
							schoolId={school.id}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
