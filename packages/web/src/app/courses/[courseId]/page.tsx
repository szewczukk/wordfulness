import EditIcon from '@/ui/icons/EditIcon';
import api from '@/utils/api';
import { courseSchema, lessonSchema } from '@/utils/types';
import Link from 'next/link';
import { z } from 'zod';

type Props = {
	params: {
		courseId: number;
	};
};

export default async function Page({ params }: Props) {
	const result = await api(`/courses/${params.courseId}`, {
		next: { tags: ['course'] },
	});

	const course = courseSchema.parse(result);

	const lessonsResult = await api(`/courses/${params.courseId}/lessons`);

	const lessons = z.array(lessonSchema).parse(lessonsResult);

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{course.name}</h1>
			<Link className="h-8 w-8" href={`/courses/${course.id}/edit`}>
				<EditIcon />
			</Link>
			<ul>
				{lessons.map((lesson) => (
					<li key={lesson.id} className="list-inside list-disc">
						{lesson.name}
					</li>
				))}
			</ul>
		</div>
	);
}
