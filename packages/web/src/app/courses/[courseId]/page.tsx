import Button from '@/ui/Button';
import EditLink from '@/ui/EditLink';
import Input from '@/ui/Input';
import api from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { courseSchema, lessonSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

type Props = {
	params: {
		courseId: number;
	};
};

export default async function Page({ params }: Props) {
	const currentUser = await getCurrentUser();

	if (currentUser === undefined) {
		redirect('/login');
	}

	if (currentUser.role === 'superuser') {
		redirect('/admin');
	}

	const course = await getCourse(params.courseId);
	const lessons = await getCoursesLessons(params.courseId);
	const createLesson = createLessonFormAction(params.courseId);

	const isAdminOrTeacher =
		currentUser.role === 'admin' || currentUser.role === 'teacher';

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{course.name}</h1>
			<pre>{course.description}</pre>
			{isAdminOrTeacher && <EditLink href={`/courses/${course.id}/edit`} />}
			<h1 className="text-xl font-semibold">Lessons</h1>
			<ul>
				{lessons.map((lesson) => (
					<li key={lesson.id} className="list-inside list-disc">
						<Link href={`/lessons/${lesson.id}`}>{lesson.name}</Link>
					</li>
				))}
				{!lessons.length && <p>No lessons</p>}
			</ul>
			{isAdminOrTeacher && (
				<form action={createLesson} className="flex gap-4">
					<Input type="text" name="name" placeholder="Enter name.." />

					<Button type="submit">Create course</Button>
				</form>
			)}
		</div>
	);
}

async function getCoursesLessons(courseId: number) {
	const result = await api(`/courses/${courseId}/lessons`, {
		next: { tags: ['lessons'] },
	});

	const lessons = z.array(lessonSchema).parse(result);
	return lessons;
}

async function getCourse(courseId: number) {
	const result = await api(`/courses/${courseId}`, {
		next: { tags: ['course'] },
	});

	const course = courseSchema.parse(result);
	return course;
}

function createLessonFormAction(courseId: number) {
	return async (formData: FormData) => {
		'use server';

		await api(`/courses/${courseId}/lessons`, {
			method: 'POST',
			body: JSON.stringify({ name: formData.get('name') }),
		});

		revalidateTag('lessons');
	};
}
