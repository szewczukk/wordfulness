import TrashIcon from '@/ui/icons/TrashIcon';
import { School } from '@/utils/types';
import { deleteSchoolAction } from './actions';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import Table from '@/ui/Table';

type Props = {
	schools: School[];
	selectedSchoolId: number | undefined;
	selectSchool: (school: School) => void;
};

export default function SchoolsTable({
	selectedSchoolId,
	schools,
	selectSchool,
}: Props) {
	const columnHelper = createColumnHelper<School>();
	const columns = [
		columnHelper.accessor('id', { cell: (info) => info.getValue() }),
		columnHelper.accessor('name', { cell: (info) => info.getValue() }),
		columnHelper.display({
			header: 'Actions',
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-4">
					<button
						className="p-2 transition-colors hover:bg-slate-400"
						onClick={() => deleteSchoolAction(row.original.id)}
					>
						<TrashIcon />
					</button>
					<button
						className={`border px-6 py-1 ${
							selectedSchoolId === row.original.id
								? 'border-gray-800 bg-transparent text-gray-800 hover:border-gray-300 hover:bg-gray-400 hover:text-gray-50'
								: 'border-transparent bg-gray-800 text-gray-50 hover:bg-gray-700'
						} transition-colors`}
						onClick={() => selectSchool(row.original)}
					>
						Select
					</button>
				</div>
			),
		}),
	];

	const table = useReactTable({
		columns,
		data: schools,
		getCoreRowModel: getCoreRowModel(),
	});

	return <Table table={table} />;
}
