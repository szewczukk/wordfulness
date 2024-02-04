import api from '@/utils/api';
import { z } from 'zod';
import { flashcardSchema } from '@/utils/types';

export default async function RepeatPage() {
	const deckResult = await api(`/deck`, { next: { tags: ['deck'] } });
	const deck = z.array(flashcardSchema).parse(deckResult);

	return (
		<div className="container mx-auto mt-8 flex flex-col items-start gap-2 bg-slate-200 p-8">
			<h1>Repeat</h1>
		</div>
	);
}
