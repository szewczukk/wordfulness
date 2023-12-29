import api from '@/utils/api';
import { userSchema, schoolSchema } from '@/utils/types';
import { z } from 'zod';
import AdminDashboard from './AdminDashboard';

const fetchSchoolsSchema = z.array(schoolSchema);

export default async function Page() {
	const result = await api('/me');

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
