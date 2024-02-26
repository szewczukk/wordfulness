import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: Props) {
	return (
		<button className={`btn ${className}`} {...props}>
			{props.children}
		</button>
	);
}
