'use client';

import { Flashcard } from '@/utils/types';
import FlashcardControls from './FlashcardControls';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import Table from '@/ui/Table';

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
	// if (!flashcards.length) {
	// 	return <p>No flashcards!</p>;
	// }

	// return (
	// 	<ul>
	// 		{flashcards.map((flashcard) => (
	// 			<li key={flashcard.id}>
	// 				<FlashcardCard flashcard={flashcard} />
	// 				{isStudent && (
	// 					<FlashcardControls
	// 						flashcardId={flashcard.id}
	// 						isInDeck={!!usersDeck.find((f) => f.id === flashcard.id)}
	// 					/>
	// 				)}
	// 			</li>
	// 		))}
	// 	</ul>
	// );
	const columnHelper = createColumnHelper<Flashcard>();
	const columns = [
		columnHelper.accessor('id', { cell: (info) => info.getValue() }),
		columnHelper.accessor('front', { cell: (info) => info.getValue() }),
		columnHelper.accessor('back', { cell: (info) => info.getValue() }),
		columnHelper.display({
			header: 'Actions',
			cell: ({ row }) =>
				isStudent ? (
					<FlashcardControls
						flashcardId={row.original.id}
						isInDeck={!!usersDeck.find((f) => f.id === row.original.id)}
					/>
				) : (
					'-'
				),
		}),
	];

	const table = useReactTable({
		columns,
		data: flashcards,
		getCoreRowModel: getCoreRowModel(),
	});

	return <Table table={table} />;
}
