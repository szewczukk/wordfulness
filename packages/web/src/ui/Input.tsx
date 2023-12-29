import { InputHTMLAttributes } from 'react';

export default function Input({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={`px-2 py-1	${className}`} {...props} />;
}
