import Input from '@/ui/Input';
import { createSchoolFormAction } from './actions';

export default function CreateSchoolForm() {
	return (
		<form action={createSchoolFormAction} className="flex items-center gap-2">
			<Input type="text" name="name" placeholder="Enter school name" />

			<button
				type="submit"
				className="bg-green-700 px-8 py-1 text-neutral-50 transition-colors hover:bg-green-800"
			>
				Create school
			</button>
		</form>
	);
}
