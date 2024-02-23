'use client';

import { School } from '@/utils/types';
import SchoolsTable from './SchoolsTable';
import { useEffect, useState } from 'react';
import CreateSchoolForm from './CreateSchoolForm';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import { fetchUsers } from '@/utils/actions';
import useSchoolsUsers from '@/hooks/useSchoolsUsers';

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
		<div className="container mx-auto mt-8 flex min-h-[704px] flex-col items-start gap-8 bg-slate-200 p-12">
			<div className="flex flex-col gap-4">
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
