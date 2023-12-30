import Input from '@/ui/Input';
import api from '@/utils/api';
import { courseSchema, userSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

async function createCourseAction(formData: FormData) {
	'use server';

	await api(`/schools/${formData.get('schoolId')}/courses`, {
		method: 'POST',
		body: JSON.stringify({ name: formData.get('name') }),
	});

	revalidateTag('courses');
}

export default async function Page() {
	let result: any;
	try {
		result = await api('/me');
	} catch {
		redirect('/login');
	}

	const currentUser = userSchema.parse(result);

	if (currentUser.role === 'superuser') {
		redirect('/admin');
	}

	const coursesResult = await api(`/schools/${currentUser.schoolId}/courses`, {
		next: { tags: ['courses'] },
	});

	const courses = z.array(courseSchema).parse(coursesResult);

	return (
		<div className="container mx-auto">
			<h1>
				{currentUser.username} ({currentUser.role})
			</h1>
			<h1>Courses</h1>
			{currentUser.role === 'admin' && (
				<form action={createCourseAction}>
					<Input type="text" name="name" placeholder="Enter name.." />
					<Input
						type="number"
						name="schoolId"
						defaultValue={currentUser.schoolId}
						hidden
					/>

					<button type="submit">Create course</button>
				</form>
			)}
			<ul>
				{courses.map((course) => (
					<li key={course.id}>{course.name}</li>
				))}
			</ul>
		</div>
	);
}
