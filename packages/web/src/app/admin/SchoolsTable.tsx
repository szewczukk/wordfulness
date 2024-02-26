import { School } from '@/utils/types';
import { deleteSchoolAction } from './actions';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import Table from '@/ui/Table';
import Button from '@/ui/Button';

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
				<div className="space-x-2">
					<Button
						className="btn-error btn-xs"
						onClick={() => deleteSchoolAction(row.original.id)}
					>
						Delete
					</Button>
					<Button
						className={`btn-xs ${selectedSchoolId === row.original.id ? 'btn-primary' : 'btn-neutral'}`}
						onClick={() => selectSchool(row.original)}
					>
						Select
					</Button>
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
