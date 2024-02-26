import Button from '@/ui/Button';
import Input from '@/ui/Input';
import api from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { courseSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export default async function Page() {
	const currentUser = await getCurrentUser();

	if (currentUser === undefined) {
		redirect('/login');
	}

	if (currentUser.role === 'superuser') {
		redirect('/admin');
	}

	const courses = await getCourses(currentUser.schoolId);

	return (
		<div className="container mx-auto mt-8 space-y-8">
			<div className="card bg-base-200">
				<div className="card-body space-y-4">
					<h1 className="text-xl font-semibold">Courses</h1>
					<ul className="space-y-2">
						{courses.map((course) => (
							<li key={course.id} className="list-inside list-disc">
								<Link href={`/courses/${course.id}`}>{course.name}</Link>
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

							<Button type="submit" className="btn-success">
								Create course
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}

async function getCourses(schoolId: number) {
	const coursesResult = await api(`/schools/${schoolId}/courses`, {
		next: { tags: ['courses'] },
	});

	const courses = z.array(courseSchema).parse(coursesResult);
	return courses;
}

async function createCourseAction(formData: FormData) {
	'use server';

	await api(`/schools/${formData.get('schoolId')}/courses`, {
		method: 'POST',
		body: JSON.stringify({ name: formData.get('name') }),
	});

	revalidateTag('courses');
}
