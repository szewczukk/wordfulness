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

	const result = await api(`/courses/${params.courseId}`, {
		next: { tags: ['course'] },
	});

	const course = courseSchema.parse(result);

	const lessonsResult = await api(`/courses/${params.courseId}/lessons`, {
		next: { tags: ['lessons'] },
	});

	const lessons = z.array(lessonSchema).parse(lessonsResult);

	async function createLessonFormAction(formData: FormData) {
		'use server';

		await api(`/courses/${params.courseId}/lessons`, {
			method: 'POST',
			body: JSON.stringify({ name: formData.get('name') }),
		});

		revalidateTag('lessons');
	}

	const isAdminOrTeacher =
		currentUser.role === 'admin' || currentUser.role === 'teacher';

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{course.name}</h1>
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
				<form action={createLessonFormAction} className="flex gap-4">
					<Input type="text" name="name" placeholder="Enter name.." />

					<Button type="submit">Create course</Button>
				</form>
			)}
		</div>
	);
}
