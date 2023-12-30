import Button from '@/ui/Button';
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
		<div className="container mx-auto mt-8 flex flex-col gap-8 bg-slate-200 p-8">
			<h1>
				Hello, {currentUser.username} ({currentUser.role})!
			</h1>
			<div className="flex flex-col gap-4">
				<h1 className="text-xl font-semibold">Courses</h1>
				<ul>
					{courses.map((course) => (
						<li key={course.id} className="list-inside list-disc">
							{course.name}
						</li>
					))}
				</ul>
				{currentUser.role === 'admin' && (
					<form action={createCourseAction} className="flex gap-4">
						<Input type="text" name="name" placeholder="Enter name.." />
						<Input
							type="number"
							name="schoolId"
							defaultValue={currentUser.schoolId}
							hidden
						/>

						<Button type="submit">Create course</Button>
					</form>
				)}
			</div>
		</div>
	);
}
