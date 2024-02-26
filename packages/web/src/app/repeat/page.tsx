import api from '@/utils/api';
import { flashcardSchema } from '@/utils/types';
import FlashcardLearning from './FlashcardLearning';

export default async function RepeatPage() {
	const currentFlashcardResult = await api(`/deck/nth/0`, {
		next: { tags: ['current-flashcard'] },
	});
	const currentFlashcard = flashcardSchema.parse(currentFlashcardResult);

	return (
		<div className="container mx-auto mt-8 space-y-2">
			<div className="bg-base-200 flex justify-center rounded-xl p-4">
				<FlashcardLearning defaultFlashcard={currentFlashcard} />
			</div>
		</div>
	);
}
