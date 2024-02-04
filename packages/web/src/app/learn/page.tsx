import api from '@/utils/api';
import FlashcardCollection from '@/components/FlashcardCollection';
import { z } from 'zod';
import { flashcardSchema } from '@/utils/types';
import Button from '@/ui/Button';
import Link from 'next/link';

export default async function LearningPage() {
	const deckResult = await api(`/deck`, { next: { tags: ['deck'] } });
	const deck = z.array(flashcardSchema).parse(deckResult);

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1 className="text-xl font-semibold">User&apos;s deck</h1>
			<FlashcardCollection
				flashcards={deck}
				usersDeck={deck}
				isStudent={true}
			/>
			<Link href="/repeat">
				<Button>Repeat flashcards</Button>
			</Link>
		</div>
	);
}
