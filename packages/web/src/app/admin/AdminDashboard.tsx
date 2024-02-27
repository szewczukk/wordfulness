'use client';

import { School } from '@/utils/types';
import SchoolsTable from './SchoolsTable';
import { useEffect, useState } from 'react';
import CreateSchoolForm from './CreateSchoolForm';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import useSchoolsUsers from '@/hooks/useSchoolsUsers';
import { fetchUsers } from './actions';

type Props = {
	schools: School[];
};

export default function AdminDashboard({ schools }: Props) {
	const [selectedSchool, setSelectedSchool] = useState<School | undefined>();
	const {
		deleteUser,
		handleCreateUserFormSubmit,
		schoolsUsers,
		setSchoolsUsers,
	} = useSchoolsUsers([]);

	const handleSelectSchool = (school: School) => {
		setSelectedSchool((prev) => {
			if (prev?.id === school.id) {
				return undefined;
			}

			return school;
		});
	};

	useEffect(() => {
		(async () => {
			if (!selectedSchool) {
				return;
			}

			const users = await fetchUsers(selectedSchool.id);

			setSchoolsUsers(users);
		})();
	}, [selectedSchool, setSchoolsUsers]);

	return (
		<div className="container mx-auto mt-8 space-y-8">
			<div className="space-y-4">
				<CreateSchoolForm />
				<h1 className="text-xl font-semibold">Schools</h1>
				<SchoolsTable
					schools={schools}
					selectSchool={handleSelectSchool}
					selectedSchoolId={selectedSchool?.id}
				/>
			</div>
			{selectedSchool && schoolsUsers && (
				<>
					<h1 className="text-xl font-semibold">
						Selected school: {selectedSchool.name}
					</h1>
					<CreateUserForm
						onSubmit={handleCreateUserFormSubmit}
						schoolId={selectedSchool.id}
					/>
					<UsersTable users={schoolsUsers} onUserDeleted={deleteUser} />
				</>
			)}
		</div>
	);
}
