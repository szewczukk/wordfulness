import api from '@/utils/api';
import { userSchema, schoolSchema } from '@/utils/types';
import { z } from 'zod';
import AdminDashboard from './AdminDashboard';
import { redirect } from 'next/navigation';

const fetchSchoolsSchema = z.array(schoolSchema);

export default async function Page() {
	let result: unknown;
	try {
		result = await api('/me');
	} catch {
		redirect('/login');
	}

	const currentUser = userSchema.parse(result);

	if (currentUser.role !== 'superuser') {
		return <h1>No access</h1>;
	}

	const schoolsResult = await api('/schools', {
		next: { tags: ['admin-dashboard-schools'] },
	});

	const schools = fetchSchoolsSchema.parse(schoolsResult);

	return <AdminDashboard schools={schools} />;
}
