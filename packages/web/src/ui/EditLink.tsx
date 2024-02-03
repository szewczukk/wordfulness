import Link from 'next/link';
import EditIcon from './icons/EditIcon';

type Props = {
	href: string;
};

export default function EditLink({ href }: Props) {
	return (
		<Link className="h-8 w-8" href={href}>
			<EditIcon />
		</Link>
	);
}
