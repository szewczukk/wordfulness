'use client';

import Button from '@/ui/Button';
import { Flashcard } from '@/utils/types';
import { useState } from 'react';
import { fetchNthFlashcardFromDeck, increaseFlashcardScore } from './actions';

type Props = {
	defaultFlashcard: Flashcard;
};

type LearningStatus = 'answerCovered' | 'answerRevealed';

export default function FlashcardLearning({ defaultFlashcard }: Props) {
	const [currentFlashcard, setCurrentFlashcard] =
		useState<Flashcard>(defaultFlashcard);
	const [status, setStatus] = useState<LearningStatus>('answerCovered');

	const handleFlashcardEasy = async () => {
		const newFlashcard = await increaseFlashcardScore(currentFlashcard.id);

		setCurrentFlashcard(newFlashcard);
		setStatus('answerCovered');
	};

	const handleFlashcardHard = async () => {
		const newFlashcard = await fetchNthFlashcardFromDeck(1);

		setCurrentFlashcard(newFlashcard);
		setStatus('answerCovered');
	};

	return (
		<div className="flex flex-col gap-4">
			<div>{currentFlashcard.front}</div>

			{status === 'answerCovered' && (
				<Button onClick={() => setStatus('answerRevealed')}>Show answer</Button>
			)}
			{status === 'answerRevealed' && (
				<>
					<div>{currentFlashcard.back}</div>
					<div className="flex gap-4">
						<Button onClick={handleFlashcardEasy}>It was easy</Button>
						<Button onClick={handleFlashcardHard}>It was hard</Button>
					</div>
				</>
			)}
		</div>
	);
}
