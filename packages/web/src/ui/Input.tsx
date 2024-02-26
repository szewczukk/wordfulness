import { InputHTMLAttributes } from 'react';

export default function Input({
	className,
	autoComplete,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={`input input-bordered max-w-xs ${className}`}
			autoComplete={autoComplete || 'off'}
			{...props}
		/>
	);
}
