import Button from '@/ui/Button';
import Input from '@/ui/Input';
import EditIcon from '@/ui/icons/EditIcon';
import api from '@/utils/api';
import { flashcardSchema, lessonSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import { z } from 'zod';

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

	const flashcardsResult = await api(`/lessons/${params.lessonId}/flashcards`, {
		next: { tags: ['flashcards'] },
	});

	const flashcards = z.array(flashcardSchema).parse(flashcardsResult);

	async function createFlashcardFormAction(formData: FormData) {
		'use server';

		await api(`/lessons/${params.lessonId}/flashcards`, {
			method: 'POST',
			body: JSON.stringify({
				front: formData.get('front'),
				back: formData.get('back'),
			}),
		});

		revalidateTag('flashcards');
	}

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">{lesson.name}</h1>
			<Link className="h-8 w-8" href={`/lessons/${lesson.id}/edit`}>
				<EditIcon />
			</Link>
			<div className="whitespace-pre-wrap">
				{lesson.description || <p>No description</p>}
			</div>
			<h2 className="font-semibold">Flashcards</h2>
			<ul>
				{flashcards.map((flashcard) => (
					<li key={flashcard.id}>
						{flashcard.front} / {flashcard.back}
					</li>
				))}
			</ul>
			<form
				action={createFlashcardFormAction}
				className="flex items-center gap-4"
			>
				<Input type="text" name="front" placeholder="Enter front.." />
				<Input type="text" name="back" placeholder="Enter back.." />

				<Button type="submit">Create flashcard</Button>
			</form>
		</div>
	);
}
