import Button from '@/ui/Button';
import Input from '@/ui/Input';
import api from '@/utils/api';
import { lessonSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'path';

type Props = {
	params: {
		lessonId: number;
	};
};

export default async function Page({ params }: Props) {
	const result = await api(`/lessons/${params.lessonId}`, {
		next: { tags: ['lesson'] },
	});

	const lesson = lessonSchema.parse(result);

	async function updateLessonFormAction(formData: FormData) {
		'use server';

		await api(`/lessons/${params.lessonId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name: formData.get('name'),
				description: formData.get('description'),
			}),
		});

		revalidateTag('lesson');
		redirect(`/lessons/${params.lessonId}`);
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{lesson.name}</h1>
			<form
				action={updateLessonFormAction}
				className="flex flex-col items-start gap-2"
			>
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
		</div>
	);
}