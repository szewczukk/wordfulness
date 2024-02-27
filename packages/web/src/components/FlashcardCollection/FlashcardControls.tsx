'use client';

import Button from '@/ui/Button';
import {
	addFlashcardToDeck,
	deleteFlashcard,
	removeFlashcardFromDeck,
} from '@/utils/actions';
import { User } from '@/utils/types';

type Props = {
	flashcardId: number;
	isInDeck: boolean;
	userRole: User['role'];
};

export default function FlashcardControls({
	isInDeck,
	flashcardId,
	userRole,
}: Props) {
	if (!['student', 'teacher'].includes(userRole)) {
		return '-';
	}

	if (userRole === 'teacher') {
		return (
			<Button
				className="btn-error btn-xs"
				onClick={() => deleteFlashcard(flashcardId)}
			>
				Delete
			</Button>
		);
	}

	if (isInDeck) {
		return (
			<Button
				onClick={() => removeFlashcardFromDeck(flashcardId)}
				className="btn-error btn-xs"
			>
				Remove from deck
			</Button>
		);
	}

	return (
		<Button
			onClick={() => addFlashcardToDeck(flashcardId)}
			className="btn-success btn-xs"
		>
			Add to deck
		</Button>
	);
}
