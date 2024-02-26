import api from '@/utils/api';
import { lessonSchema } from '@/utils/types';
import EditLessonForm from './EditLessonForm';

type Props = {
	params: {
		lessonId: number;
	};
};

export default async function Page({ params }: Props) {
	const lesson = await getLesson(params.lessonId);

	return (
		<div className="container mx-auto mt-8 space-y-2">
			<EditLessonForm lesson={lesson} />
		</div>
	);
}

export async function getLesson(lessonId: number) {
	const result = await api(`/lessons/${lessonId}`, {
		next: { tags: ['lesson'] },
	});

	const lesson = lessonSchema.parse(result);
	return lesson;
}
