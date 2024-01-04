import Button from '@/ui/Button';
import Input from '@/ui/Input';
import TrashIcon from '@/ui/icons/TrashIcon';
import api from '@/utils/api';
import { courseSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
	params: {
		courseId: number;
	};
};

export default async function Page({ params }: Props) {
	const result = await api(`/courses/${params.courseId}`);

	const course = courseSchema.parse(result);

	async function editCourseFormAction(formData: FormData) {
		'use server';

		await api(`/courses/${params.courseId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				name: formData.get('name'),
			}),
		});

		revalidateTag('course');
		redirect(`/courses/${params.courseId}`);
	}

	async function deleteCourseFormAction() {
		'use server';

		await api(`/courses/${params.courseId}`, { method: 'DELETE' });

		revalidateTag('courses');
		redirect('/');
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">Edit {course.name}</h1>
			<form
				action={editCourseFormAction}
				className="flex flex-col items-start gap-2"
			>
				<label htmlFor="name">Course name</label>
				<Input type="text" name="name" defaultValue={course.name} id="name" />

				<Button type="submit">Edit course</Button>
			</form>
			<div className="flex gap-4 border-t border-gray-950 pt-4">
				<form action={deleteCourseFormAction}>
					<button
						type="submit"
						className="cursor-pointer p-2 hover:bg-slate-300"
					>
						<TrashIcon />
					</button>
				</form>
			</div>
		</div>
	);
}
