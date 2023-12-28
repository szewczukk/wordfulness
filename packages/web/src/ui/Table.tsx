import { Table, flexRender } from '@tanstack/react-table';

type Props<T> = {
	table: Table<T>;
};

export default function Table<T>({ table }: Props<T>) {
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
