import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: Props) {
	return (
		<button
			className={`bg-green-700 px-8 py-1 text-neutral-50 transition-colors hover:bg-green-800 ${className}`}
			{...props}
		>
			{props.children}
		</button>
	);
}
