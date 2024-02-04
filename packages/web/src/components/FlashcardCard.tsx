import { Flashcard } from '@/utils/types';

type Props = {
	flashcard: Flashcard;
};

export default function FlashcardCard({ flashcard }: Props) {
	return (
		<div>
			{flashcard.front} / {flashcard.back}
		</div>
	);
}
