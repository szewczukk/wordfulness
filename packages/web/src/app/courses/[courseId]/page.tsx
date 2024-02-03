import Button from '@/ui/Button';
import Input from '@/ui/Input';
import EditIcon from '@/ui/icons/EditIcon';
import api from '@/utils/api';
import { courseSchema, lessonSchema, userSchema } from '@/utils/types';
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
	let userResult: any;
	try {
		userResult = await api('/me');
	} catch {
		redirect('/login');
	}

	const currentUser = userSchema.parse(userResult);

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
			{isAdminOrTeacher && (
				<Link className="h-8 w-8" href={`/courses/${course.id}/edit`}>
					<EditIcon />
				</Link>
			)}
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
