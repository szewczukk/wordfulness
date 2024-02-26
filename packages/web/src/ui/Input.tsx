import { InputHTMLAttributes } from 'react';

export default function Input({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={`input input-bordered max-w-xs ${className}`}
			{...props}
		/>
	);
}
