import EditIcon from '@/ui/icons/EditIcon';
import api from '@/utils/api';
import { lessonSchema } from '@/utils/types';
import Link from 'next/link';

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

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{lesson.name}</h1>
			<Link className="h-8 w-8" href={`/lessons/${lesson.id}/edit`}>
				<EditIcon />
			</Link>
			<div className="whitespace-pre-wrap">
				{lesson.description || <p>No description</p>}
			</div>
		</div>
	);
}
