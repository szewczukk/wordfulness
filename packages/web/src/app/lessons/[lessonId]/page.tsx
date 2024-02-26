import Button from '@/ui/Button';
import Input from '@/ui/Input';
import api from '@/utils/api';
import { getCurrentUser } from '@/utils/helpers';
import { flashcardSchema, lessonSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { FlashcardCollection } from '@/components/FlashcardCollection';
import Link from 'next/link';

type Props = {
	params: {
		lessonId: number;
	};
};

export default async function Page({ params }: Props) {
	const currentUser = await getCurrentUser();

	if (currentUser === undefined) {
		redirect('/login');
	}

	if (currentUser.role === 'superuser') {
		redirect('/admin');
	}

	const result = await api(`/lessons/${params.lessonId}`, {
		next: { tags: ['lesson'] },
	});

	const lesson = lessonSchema.parse(result);

	const flashcardsResult = await api(`/lessons/${params.lessonId}/flashcards`, {
		next: { tags: ['flashcards'] },
	});

	const flashcards = z.array(flashcardSchema).parse(flashcardsResult);

	const deckResult = await api(`/deck`, { next: { tags: ['deck'] } });
	const deck = z.array(flashcardSchema).parse(deckResult);

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

	const isAdminOrTeacher =
		currentUser.role === 'admin' || currentUser.role === 'teacher';

	return (
		<div className="container mx-auto mt-8 space-y-8">
			<div className="card bg-base-200">
				<div className="card-body">
					<h1 className="card-title">{lesson.name}</h1>
					<pre>{lesson.description}</pre>
					{isAdminOrTeacher && (
						<div className="card-actions justify-end">
							<Link
								href={`/lessons/${lesson.id}/edit`}
								className="btn btn-primary"
							>
								Edit
							</Link>
						</div>
					)}
				</div>
			</div>
			<div className="card bg-base-200">
				<div className="card-body space-y-4">
					<h1 className="card-title">Lessons</h1>
					<FlashcardCollection
						flashcards={flashcards}
						usersDeck={deck}
						isStudent={currentUser.role === 'student'}
					/>
					{isAdminOrTeacher && (
						<form action={createFlashcardFormAction} className="flex gap-4">
							<Input type="text" name="front" placeholder="Enter front.." />
							<Input type="text" name="back" placeholder="Enter back.." />

							<Button type="submit" className="btn-success">
								Create
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
