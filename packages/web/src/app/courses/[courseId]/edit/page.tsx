import api from '@/utils/api';
import { courseSchema } from '@/utils/types';
import EditCourseForm from './EditCourseForm';

type Props = {
	params: {
		courseId: number;
	};
};

export default async function Page({ params }: Props) {
	const result = await api(`/courses/${params.courseId}`);
	const course = courseSchema.parse(result);

	return (
		<div className="container mx-auto mt-8 space-y-2">
			<EditCourseForm course={course} />
		</div>
	);
}
