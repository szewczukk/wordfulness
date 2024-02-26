import { User } from '@/utils/types';
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

export default function UsersTable({ users, onUserDeleted }: Props) {
	const columnHelper = createColumnHelper<User>();
	const columns = [
		columnHelper.accessor('id', { cell: (info) => info.getValue() }),
		columnHelper.accessor('username', { cell: (info) => info.getValue() }),
		columnHelper.accessor('role', { cell: (info) => info.getValue() }),
		columnHelper.display({
			header: 'Actions',
			cell: ({ row }) => (
				<button
					className="btn btn-error btn-xs"
					onClick={() => onUserDeleted(row.original.id)}
				>
					Delete
				</button>
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
