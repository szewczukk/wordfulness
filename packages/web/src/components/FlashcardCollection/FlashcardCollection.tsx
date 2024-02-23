import { Flashcard } from '@/utils/types';
import FlashcardCard from './FlashcardCard';
import FlashcardControls from './FlashcardControls';

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
					<FlashcardCard flashcard={flashcard} />
					{isStudent && (
						<FlashcardControls
							flashcardId={flashcard.id}
							isInDeck={!!usersDeck.find((f) => f.id === flashcard.id)}
						/>
					)}
				</li>
			))}
			{!flashcards.length && <p>No flashcards!</p>}
		</ul>
	);
}
