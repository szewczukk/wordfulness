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

	const lesson = await getLesson(params.lessonId);
	const flashcards = await getFlashcards(params.lessonId);
	const deck = await getDeck();

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
						userRole={currentUser.role}
					/>
					{isAdminOrTeacher && (
						<form action={createFlashcardFormAction} className="flex gap-4">
							<input
								type="number"
								name="lessonId"
								defaultValue={lesson.id}
								hidden
							/>
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

async function getDeck() {
	const result = await api(`/deck`, { next: { tags: ['deck'] } });

	const deck = z.array(flashcardSchema).parse(result);
	return deck;
}

async function createFlashcardFormAction(formData: FormData) {
	'use server';

	const lessonId = formData.get('lessonId');

	await api(`/lessons/${lessonId}/flashcards`, {
		method: 'POST',
		body: JSON.stringify({
			front: formData.get('front'),
			back: formData.get('back'),
		}),
	});

	revalidateTag('flashcards');
}

async function getFlashcards(lessonId: number) {
	const result = await api(`/lessons/${lessonId}/flashcards`, {
		next: { tags: ['flashcards'] },
	});

	const flashcards = z.array(flashcardSchema).parse(result);
	return flashcards;
}

async function getLesson(lessonId: number) {
	const result = await api(`/lessons/${lessonId}`, {
		next: { tags: ['lesson'] },
	});

	const lesson = lessonSchema.parse(result);
	return lesson;
}
