'use client';

import Button from '@/ui/Button';
import { Flashcard } from '@/utils/types';
import { addFlashcardToDeck } from './actions';

type Props = {
	flashcard: Flashcard;
	isInDeck: boolean;
};

export default function FlashcardCard({ flashcard, isInDeck }: Props) {
	return (
		<div>
			{flashcard.front} / {flashcard.back}
			{isInDeck ? (
				<Button>Remove from deck</Button>
			) : (
				<Button onClick={() => addFlashcardToDeck(flashcard.id)}>
					Add to deck
				</Button>
			)}
		</div>
	);
}
