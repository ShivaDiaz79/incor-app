import React, { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	size?: "xs" | "sm" | "md" | "lg";
	variant?: "primary" | "outline" | "secondary" | "ghost" | "danger";
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	loading?: boolean;
	fullWidth?: boolean;
	iconOnly?: boolean;
}

const Spinner = () => (
	<svg
		className="h-4 w-4 animate-spin"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		/>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
		/>
	</svg>
);

const Button: React.FC<ButtonProps> = ({
	children,
	size = "md",
	variant = "primary",
	startIcon,
	endIcon,
	loading = false,
	fullWidth = false,
	iconOnly = false,
	className = "",
	disabled = false,
	type = "button",
	...props
}) => {
	const isDisabled = disabled || loading;

	// Tamaños
	const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
		xs: iconOnly ? "h-8 w-8" : "px-3 py-2 text-xs",
		sm: iconOnly ? "h-9 w-9" : "px-4 py-2.5 text-sm",
		md: iconOnly ? "h-10 w-10" : "px-5 py-3.5 text-sm",
		lg: iconOnly ? "h-11 w-11" : "px-6 py-4 text-base",
	};

	// Variantes
	const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
		primary:
			"bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 focus-visible:ring-brand-500/40 disabled:bg-brand-300",
		outline:
			"bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400/40 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]",
		secondary:
			"bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500/40 dark:bg-gray-700 dark:hover:bg-gray-600",
		ghost:
			"bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400/30 dark:text-gray-300 dark:hover:bg-white/[0.06]",
		danger:
			"bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/40 disabled:bg-rose-300",
	};

	const base =
		"inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";
	const disabledClasses = isDisabled ? "cursor-not-allowed opacity-70" : "";
	const widthClass = fullWidth ? "w-full" : "";
	const contentGap = iconOnly ? "" : "gap-2";

	return (
		<button
			type={type}
			disabled={isDisabled}
			className={[
				base,
				sizeClasses[size],
				variantClasses[variant],
				disabledClasses,
				widthClass,
				contentGap,
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{loading ? (
				<Spinner />
			) : (
				startIcon && <span className="flex items-center">{startIcon}</span>
			)}

			{!iconOnly && children}

			{!loading && endIcon && (
				<span className="flex items-center">{endIcon}</span>
			)}
		</button>
	);
};

export default Button;
