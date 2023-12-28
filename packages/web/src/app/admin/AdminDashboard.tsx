'use client';

import { School, User } from '@/utils/types';
import SchoolsTable from './SchoolsTable';
import { useEffect, useState } from 'react';
import CreateSchoolForm from './CreateSchoolForm';
import UsersTable from './UsersTable';
import { fetchUsers } from './actions';

type Props = {
	schools: School[];
};

export default function AdminDashboard({ schools }: Props) {
	const [selectedSchool, setSelectedSchool] = useState<School | undefined>();
	const [schoolsUsers, setSchoolsUsers] = useState<User[]>();

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
	}, [selectedSchool]);

	return (
		<div className="container mx-auto flex flex-col gap-8 items-start mt-8 bg-slate-200 p-12 min-h-[704px]">
			<div className="flex flex-col gap-4">
				<CreateSchoolForm />
				<h1 className="font-semibold text-xl">Schools</h1>
				<SchoolsTable
					schools={schools}
					selectSchool={handleSelectSchool}
					selectedSchoolId={selectedSchool?.id}
				/>
			</div>
			{selectedSchool && schoolsUsers && (
				<>
					<h1 className="font-semibold text-xl">
						Selected school: {selectedSchool.name}
					</h1>
					<UsersTable users={schoolsUsers} />
				</>
			)}
		</div>
	);
}
