import { FormEventHandler } from 'react';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';

type Props = {
	schoolId: number;
	onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function CreateUserForm({ onSubmit, schoolId }: Props) {
	return (
		<form className="flex items-center gap-2" onSubmit={onSubmit}>
			<Input type="text" name="username" placeholder="Enter username.." />
			<Input type="password" name="password" placeholder="Enter password.." />
			<Input type="number" name="schoolId" defaultValue={schoolId} hidden />

			<Select
				name="role"
				options={{ admin: 'Admin', teacher: 'Teacher', student: 'Student' }}
			/>

			<Button type="submit">Create user</Button>
		</form>
	);
}
