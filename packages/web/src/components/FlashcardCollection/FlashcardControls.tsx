'use client';

import Button from '@/ui/Button';
import { addFlashcardToDeck, removeFlashcardFromDeck } from '@/utils/actions';

type Props = {
	flashcardId: number;
	isInDeck: boolean;
};

export default function FlashcardControls({ isInDeck, flashcardId }: Props) {
	if (isInDeck) {
		return (
			<Button
				onClick={() => removeFlashcardFromDeck(flashcardId)}
				className="btn-error"
			>
				Remove from deck
			</Button>
		);
	}

	return (
		<Button
			onClick={() => addFlashcardToDeck(flashcardId)}
			className="btn-success"
		>
			Add to deck
		</Button>
	);
}
