import api from '@/utils/api';
import { courseSchema } from '@/utils/types';

type Props = {
	params: {
		courseId: number;
	};
};

export default async function Page({ params }: Props) {
	const result = await api(`/courses/${params.courseId}`);

	const course = courseSchema.parse(result);

	return (
		<div className="container mx-auto mt-8 flex flex-col gap-8 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{course.name}</h1>
		</div>
	);
}
