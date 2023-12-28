import TrashIcon from '@/ui/icons/TrashIcon';
import { School } from '@/utils/types';
import { deleteSchoolAction } from './actions';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

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
						className="p-2 hover:bg-slate-400 transition-colors"
						onClick={() => deleteSchoolAction(row.original.id)}
					>
						<TrashIcon />
					</button>
					<button
						className={`border px-6 py-1 ${
							selectedSchoolId === row.original.id
								? 'border-gray-800 bg-transparent text-gray-800 hover:bg-gray-400 hover:text-gray-50 hover:border-gray-300'
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

	return (
		<table>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="font-normal text-neutral-50">
						{headerGroup.headers.map((header) => (
							<th key={header.id} className="bg-slate-400 px-4 py-1">
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id} className="group">
						{row.getVisibleCells().map((cell) => (
							<td
								key={cell.id}
								className="bg-slate-100 group-hover:bg-slate-300 px-4 py-1 transition-colors"
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
