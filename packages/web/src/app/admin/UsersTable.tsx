import TrashIcon from '@/ui/icons/TrashIcon';
import { School, User } from '@/utils/types';
import { deleteSchoolAction } from './actions';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import Table from '@/ui/Table';

type Props = {
	users: User[];
	onUserDeleted: (userId: number) => void;
};

export default function SchoolsTable({ users, onUserDeleted }: Props) {
	const columnHelper = createColumnHelper<User>();
	const columns = [
		columnHelper.accessor('id', { cell: (info) => info.getValue() }),
		columnHelper.accessor('username', { cell: (info) => info.getValue() }),
		columnHelper.accessor('role', { cell: (info) => info.getValue() }),
		columnHelper.display({
			header: 'Actions',
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-4">
					<button
						className="p-2 hover:bg-slate-400 transition-colors"
						onClick={() => onUserDeleted(row.original.id)}
					>
						<TrashIcon />
					</button>
				</div>
			),
		}),
	];

	const table = useReactTable({
		columns,
		data: users,
		getCoreRowModel: getCoreRowModel(),
	});

	return <Table table={table} />;
}
