import api from '@/utils/api';
import { currentUserSchema } from '@/utils/schemas';
import { schoolSchema } from '@/utils/types';
import { z } from 'zod';
import AdminDashboard from './AdminDashboard';

const fetchSchoolsSchema = z.array(schoolSchema);

export default async function Page() {
	const result = await api.get('/me');

	const currentUser = currentUserSchema.parse(result.data);

	if (currentUser.role !== 'superuser') {
		return <h1>No access</h1>;
	}

	const schoolsResult = await api.get('/schools');

	const schools = fetchSchoolsSchema.parse(schoolsResult.data);

	return <AdminDashboard schools={schools} />;
}
