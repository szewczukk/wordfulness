'use client';

import { Flashcard } from '@/utils/types';
import FlashcardCard from './FlashcardCard';
import { addFlashcardToDeck, removeFlashcardFromDeck } from './actions';

type Props = {
	flashcards: Flashcard[];
	usersDeck: Flashcard[];
	isStudent: boolean;
};

export default function FlashcardCollection({
	flashcards,
	isStudent,
	usersDeck,
}: Props) {
	return (
		<ul>
			{flashcards.map((flashcard) => (
				<li key={flashcard.id}>
					<FlashcardCard
						flashcard={flashcard}
						isInDeck={!!usersDeck.find((f) => f.id === flashcard.id)}
						isStudent={isStudent}
						onAddToDeck={() => addFlashcardToDeck(flashcard.id)}
						onRemoveFromDeck={() => removeFlashcardFromDeck(flashcard.id)}
					/>
				</li>
			))}
			{!flashcards.length && <p>No flashcards!</p>}
		</ul>
	);
}
