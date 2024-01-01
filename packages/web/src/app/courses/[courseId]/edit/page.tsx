import Button from '@/ui/Button';
import Input from '@/ui/Input';
import TrashIcon from '@/ui/icons/TrashIcon';
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
		<div className="container mx-auto mt-8 flex flex-col gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">Edit {course.name}</h1>
			<form action="" className="flex flex-col items-start gap-2">
				<Input type="text" name="name" defaultValue={course.name} />

				<Button type="submit">Edit course</Button>
			</form>
			<div className="flex gap-4 border-t border-gray-950 pt-4">
				<div className="cursor-pointer p-2 hover:bg-slate-300">
					<TrashIcon />
				</div>
			</div>
		</div>
	);
}
