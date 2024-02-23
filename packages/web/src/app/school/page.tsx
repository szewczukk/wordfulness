import api from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { schoolSchema, userSchema } from '@/utils/types';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import SchoolDashboard from './SchoolDashboard';

export default async function SchoolPage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect('/login');
	}

	const school = await getSchool(currentUser.schoolId);
	const users = await getSchoolsUsers(currentUser.schoolId);

	return <SchoolDashboard users={users} school={school} />;
}

async function getSchool(schoolId: number) {
	const result = await api(`/schools/${schoolId}`, {
		next: { tags: ['school'] },
	});

	const school = schoolSchema.parse(result);
	return school;
}

async function getSchoolsUsers(schoolId: number) {
	const result = await api(`/schools/${schoolId}/users`, {
		next: { tags: ['school'] },
	});

	const school = z.array(userSchema).parse(result);
	return school;
}
