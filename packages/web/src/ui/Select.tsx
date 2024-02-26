import { SelectHTMLAttributes } from 'react';

type Props = {
	options: Record<string, string>;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ options, className, ...props }: Props) {
	return (
		<select
			className={`select select-bordered max-w-xs ${className}`}
			{...props}
		>
			{Object.keys(options).map((value) => (
				<option key={value} value={value}>
					{options[value]}
				</option>
			))}
		</select>
	);
}
