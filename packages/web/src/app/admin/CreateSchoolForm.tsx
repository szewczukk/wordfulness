import createSchoolFormAction from './createSchoolFormAction';

export default function CreateSchoolForm() {
	return (
		<form action={createSchoolFormAction} className="flex items-center gap-2">
			<input
				type="text"
				name="name"
				placeholder="Enter school name"
				className="px-2 py-1 border-gray-900 border bg-gray-300 text-gray-800 placeholder:text-gray-50"
			/>

			<button
				type="submit"
				className="bg-green-700 px-8 py-1 text-neutral-50 hover:bg-green-800 transition-colors"
			>
				Create a school
			</button>
		</form>
	);
}
