'use client';

import { School, User } from '@/utils/types';
import SchoolsTable from './SchoolsTable';
import { FormEvent, useEffect, useState } from 'react';
import CreateSchoolForm from './CreateSchoolForm';
import UsersTable from '@/components/UsersTable';
import CreateUserForm from '@/components/CreateUserForm';
import {
	createUserAction,
	deleteUserAction,
	fetchUsers,
} from '@/utils/actions';

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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const user = await createUserAction(formData);
		if (!user) {
			return;
		}

		setSchoolsUsers((prev) => {
			if (!prev) {
				return [user];
			}

			return [...prev, user];
		});
	};

	const handleUserDeleted = async (userId: number) => {
		await deleteUserAction(userId);

		setSchoolsUsers((prev) => prev?.filter((user) => user.id !== userId));
	};

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
						onSubmit={handleSubmit}
						schoolId={selectedSchool.id}
					/>
					<UsersTable users={schoolsUsers} onUserDeleted={handleUserDeleted} />
				</>
			)}
		</div>
	);
}
