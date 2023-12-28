'use client';

import { School } from '@/utils/types';
import SchoolsTable from './SchoolsTable';
import { useState } from 'react';
import CreateSchoolForm from './CreateSchoolForm';

type Props = {
	schools: School[];
};

export default function AdminDashboard({ schools }: Props) {
	const [selectedSchool, setSelectedSchool] = useState<School | undefined>();

	const handleSelectSchool = (school: School) => {
		setSelectedSchool((prev) => {
			if (prev?.id === school.id) {
				return undefined;
			}

			return school;
		});
	};

	return (
		<div className="container mx-auto flex flex-col gap-8 items-start mt-8 bg-slate-200 p-12 min-h-[624px]">
			<div className="flex flex-col gap-4">
				<CreateSchoolForm />
				<h1 className="font-semibold text-xl">Schools</h1>
				<SchoolsTable
					schools={schools}
					selectSchool={handleSelectSchool}
					selectedSchoolId={selectedSchool?.id}
				/>
			</div>
			{selectedSchool && (
				<>
					<h1 className="font-semibold text-xl">
						Selected school: {selectedSchool.name}
					</h1>
				</>
			)}
		</div>
	);
}
