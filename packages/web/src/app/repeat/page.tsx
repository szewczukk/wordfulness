import api from '@/utils/api';
import { flashcardSchema } from '@/utils/types';
import FlashcardLearning from './FlashcardLearning';

export default async function RepeatPage() {
	const currentFlashcardResult = await api(`/deck/nth/0`, {
		next: { tags: ['current-flashcard'] },
	});
	const currentFlashcard = flashcardSchema.parse(currentFlashcardResult);

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<FlashcardLearning defaultFlashcard={currentFlashcard} />
		</div>
	);
}
