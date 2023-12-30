import Input from '@/ui/Input';
import { createSchoolFormAction } from './actions';
import Button from '@/ui/Button';

export default function CreateSchoolForm() {
	return (
		<form action={createSchoolFormAction} className="flex items-center gap-2">
			<Input type="text" name="name" placeholder="Enter school name" />

			<Button type="submit">Create school</Button>
		</form>
	);
}
