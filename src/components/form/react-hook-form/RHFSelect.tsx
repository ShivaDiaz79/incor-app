import React from "react";

type Option = { value: string; label: string };

// Quitamos onChange/value/defaultValue de las props nativas del <select>
type NativeProps = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	"onChange" | "value" | "defaultValue"
>;

export interface SelectProps extends NativeProps {
	options: Option[];
	placeholder?: string;
	value?: string; // controlado
	defaultValue?: string; // no controlado (si no pasas value)
	onChange: (value: string) => void; // devolvemos solo el string
	className?: string;
	error?: boolean;
	hint?: string;
	disablePlaceholder?: boolean;
}

const RHFSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			options,
			placeholder = "Selecciona una opción…",
			value,
			defaultValue = "",
			onChange,
			className = "",
			error,
			hint,
			disablePlaceholder = true,
			...rest
		},
		ref
	) => {
		const isControlled = value !== undefined;
		const hasSelection = (isControlled ? value : defaultValue) !== "";

		return (
			<div className="w-full">
				<select
					ref={ref}
					className={[
						"h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs",
						"placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10",
						"border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
						hasSelection
							? "text-gray-800 dark:text-white/90"
							: "text-gray-400 dark:text-gray-400",
						error
							? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
							: "",
						className,
					].join(" ")}
					{...(isControlled ? { value } : { defaultValue })}
					onChange={(e) => onChange(e.target.value)}
					{...rest}
				>
					<option
						value=""
						disabled={disablePlaceholder}
						className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
					>
						{placeholder}
					</option>

					{options.map((opt) => (
						<option
							key={opt.value}
							value={opt.value}
							className="text-gray-700 dark:bg-gray-900 dark:text-gray-200"
						>
							{opt.label}
						</option>
					))}
				</select>

				{hint && (
					<p
						className={`mt-1.5 text-xs ${
							error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
						}`}
					>
						{hint}
					</p>
				)}
			</div>
		);
	}
);

RHFSelect.displayName = "Select";
export default RHFSelect;
