import api from '@/utils/api';
import { FlashcardCollection } from '@/components/FlashcardCollection';
import { z } from 'zod';
import { flashcardSchema } from '@/utils/types';
import Button from '@/ui/Button';
import Link from 'next/link';

export default async function LearningPage() {
	const deck = await getDeck();

	return (
		<div className="container mx-auto mt-8 space-y-4">
			<div className="card bg-base-200">
				<div className="card-body space-y-4">
					<h1 className="card-title">User&apos;s deck</h1>
					<FlashcardCollection
						flashcards={deck}
						usersDeck={deck}
						userRole="student"
					/>
					<Link href="/repeat">
						<Button className="btn-success">Repeat flashcards</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}

async function getDeck() {
	const deckResult = await api(`/deck`, { next: { tags: ['deck'] } });
	const deck = z.array(flashcardSchema).parse(deckResult);
	return deck;
}
