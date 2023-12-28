import { School } from '@/utils/types';

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
	return (
		<table>
			<thead>
				<tr className="font-normal text-neutral-50">
					<th className="bg-slate-400 px-4 py-1">Id</th>
					<th className="bg-slate-400 px-4 py-1">Name</th>
					<th className="bg-slate-400 px-4 py-1">Actions</th>
				</tr>
			</thead>
			<tbody>
				{schools.map((school) => (
					<tr key={school.id} className="group">
						<td className="bg-slate-100 group-hover:bg-slate-300 px-4 py-1 transition-colors">
							{school.id}
						</td>
						<td className="bg-slate-100 group-hover:bg-slate-300 px-4 py-1 transition-colors">
							{school.name}
						</td>
						<td className="bg-slate-100 group-hover:bg-slate-300 px-4 py-1 transition-colors">
							<div className="flex items-center gap-4">
								<button
									className={` border px-6 py-1 ${
										selectedSchoolId === school.id
											? 'border-gray-800 bg-transparent text-gray-800 hover:bg-gray-400 hover:text-gray-50 hover:border-gray-300'
											: 'border-transparent bg-gray-800 text-gray-50 hover:bg-gray-700'
									} transition-colors`}
									onClick={() => selectSchool(school)}
								>
									Select
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
