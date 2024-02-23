import Button from '@/ui/Button';
import Input from '@/ui/Input';
import TrashIcon from '@/ui/icons/TrashIcon';
import api from '@/utils/api';
import { lessonSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
	params: {
		lessonId: number;
	};
};

export default async function Page({ params }: Props) {
	const lesson = await getLesson(params.lessonId);

	const updateLesson = updateLessonFormAction(params.lessonId);
	const deleteLesson = deleteLessonFormaction(params.lessonId, lesson.courseId);

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{lesson.name}</h1>
			<form action={updateLesson} className="flex flex-col items-start gap-2">
				<label htmlFor="name">Name</label>
				<Input type="text" id="name" name="name" defaultValue={lesson.name} />
				<label htmlFor="description">Description</label>
				<textarea
					name="description"
					id="description"
					className="h-64 w-80 resize-none outline-none"
				>
					{lesson.description}
				</textarea>
				<Button type="submit">Save</Button>
			</form>
			<form
				action={deleteLesson}
				className='pt-4" flex gap-4 border-t border-gray-950'
			>
				<button type="submit" className="cursor-pointer p-2 hover:bg-slate-300">
					<TrashIcon />
				</button>
			</form>
		</div>
	);
}

async function getLesson(lessonId: number) {
	const result = await api(`/lessons/${lessonId}`, {
		next: { tags: ['lesson'] },
	});

	const lesson = lessonSchema.parse(result);
	return lesson;
}

function updateLessonFormAction(lessonId: number) {
	return async function (formData: FormData) {
		'use server';

		await api(`/lessons/${lessonId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name: formData.get('name'),
				description: formData.get('description'),
			}),
		});

		revalidateTag('lesson');
		redirect(`/lessons/${lessonId}`);
	};
}

function deleteLessonFormaction(lessonId: number, courseId: number) {
	return async function () {
		'use server';

		await api(`/lessons/${lessonId}`, {
			method: 'DELETE',
		});

		revalidateTag('course');
		redirect(`/courses/${courseId}`);
	};
}
