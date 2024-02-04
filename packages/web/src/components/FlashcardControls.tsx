'use client';

import Button from '@/ui/Button';
import { addFlashcardToDeck, removeFlashcardFromDeck } from '@/utils/actions';

type Props = {
	flashcardId: number;
	isInDeck: boolean;
	isStudent: boolean;
};

export default function FlashcardControls({
	isInDeck,
	isStudent,
	flashcardId,
}: Props) {
	if (isInDeck && isStudent) {
		return (
			<Button onClick={() => removeFlashcardFromDeck(flashcardId)}>
				Remove from deck
			</Button>
		);
	}

	return (
		<Button onClick={() => addFlashcardToDeck(flashcardId)}>Add to deck</Button>
	);
}
