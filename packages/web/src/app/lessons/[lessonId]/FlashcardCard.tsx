'use client';

import Button from '@/ui/Button';
import { Flashcard } from '@/utils/types';
import { addFlashcardToDeck, removeFlashcardFromDeck } from './actions';

type Props = {
	flashcard: Flashcard;
	isInDeck: boolean;
	isStudent: boolean;
};

export default function FlashcardCard({
	flashcard,
	isInDeck,
	isStudent,
}: Props) {
	return (
		<div>
			{flashcard.front} / {flashcard.back}
			{isInDeck && isStudent ? (
				<Button onClick={() => removeFlashcardFromDeck(flashcard.id)}>
					Remove from deck
				</Button>
			) : (
				<Button onClick={() => addFlashcardToDeck(flashcard.id)}>
					Add to deck
				</Button>
			)}
		</div>
	);
}
