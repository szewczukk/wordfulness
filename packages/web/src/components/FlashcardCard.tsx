'use client';

import Button from '@/ui/Button';
import { Flashcard } from '@/utils/types';

type Props = {
	flashcard: Flashcard;
	isInDeck: boolean;
	isStudent: boolean;

	onRemoveFromDeck: () => void;
	onAddToDeck: () => void;
};

export default function FlashcardCard({
	flashcard,
	isInDeck,
	isStudent,
	onAddToDeck,
	onRemoveFromDeck,
}: Props) {
	return (
		<div>
			{flashcard.front} / {flashcard.back}
			{isInDeck && isStudent ? (
				<Button onClick={onRemoveFromDeck}>Remove from deck</Button>
			) : (
				<Button onClick={onAddToDeck}>Add to deck</Button>
			)}
		</div>
	);
}
