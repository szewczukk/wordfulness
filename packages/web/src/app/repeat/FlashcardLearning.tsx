'use client';

import Button from '@/ui/Button';
import { Flashcard } from '@/utils/types';
import { useState } from 'react';
import { fetchNthFlashcardFromDeck, increaseFlashcardScore } from './actions';

type Props = {
	defaultFlashcard: Flashcard;
};

type LearningStatus = 'covered' | 'revealed';

export default function FlashcardLearning({ defaultFlashcard }: Props) {
	const [currentFlashcard, setCurrentFlashcard] =
		useState<Flashcard>(defaultFlashcard);
	const [status, setStatus] = useState<LearningStatus>('covered');

	const handleFlashcardEasy = async () => {
		const newFlashcard = await increaseFlashcardScore(currentFlashcard.id);

		setCurrentFlashcard(newFlashcard);
		setStatus('covered');
	};

	const handleFlashcardHard = async () => {
		const newFlashcard = await fetchNthFlashcardFromDeck(1);

		setCurrentFlashcard(newFlashcard);
		setStatus('covered');
	};

	return (
		<div className="flex h-[320px] w-[320px] flex-col space-y-4">
			<div className="bg-base-300 flex-1 rounded-xl p-4">
				{currentFlashcard.front}
				{status === 'revealed' && <div>{currentFlashcard.back}</div>}
			</div>
			<div className="flex gap-2">
				{status === 'covered' && (
					<Button
						onClick={() => setStatus('revealed')}
						className="btn-primary grow"
					>
						Show answer
					</Button>
				)}
				{status === 'revealed' && (
					<>
						<Button onClick={handleFlashcardEasy} className="btn-primary grow">
							It was easy
						</Button>
						<Button onClick={handleFlashcardHard} className="btn-primary grow">
							It was hard
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
