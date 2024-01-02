import EditIcon from '@/ui/icons/EditIcon';
import api from '@/utils/api';
import { courseSchema } from '@/utils/types';
import Link from 'next/link';

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

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{course.name}</h1>
			<Link className="h-8 w-8" href={`/courses/${course.id}/edit`}>
				<EditIcon />
			</Link>
		</div>
	);
}
