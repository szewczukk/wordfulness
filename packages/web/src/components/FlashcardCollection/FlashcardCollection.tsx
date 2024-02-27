'use client';

import { Flashcard, User } from '@/utils/types';
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
	userRole: User['role'];
};

export default function FlashcardCollection({
	flashcards,
	userRole,
	usersDeck,
}: Props) {
	const columnHelper = createColumnHelper<Flashcard>();
	const columns = [
		columnHelper.accessor('id', { cell: (info) => info.getValue() }),
		columnHelper.accessor('front', { cell: (info) => info.getValue() }),
		columnHelper.accessor('back', { cell: (info) => info.getValue() }),
		columnHelper.display({
			header: 'Actions',
			cell: ({ row }) => (
				<FlashcardControls
					flashcardId={row.original.id}
					isInDeck={!!usersDeck.find((f) => f.id === row.original.id)}
					userRole={userRole}
				/>
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
