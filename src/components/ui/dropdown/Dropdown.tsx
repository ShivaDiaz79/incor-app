"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
	anchorRect?: DOMRect | null;
	offset?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
	isOpen,
	onClose,
	children,
	className = "",
	anchorRect,
	offset = 8,
}) => {
	const menuRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	const [pos, setPos] = useState<{
		top: number;
		left?: number;
		right?: number;
	}>({ top: 0, right: 0 });

	useEffect(() => {
		if (!isOpen || !anchorRect) return;

		const compute = () => {
			const top = Math.round(anchorRect.bottom + offset);
			const right = Math.round(window.innerWidth - anchorRect.right);

			setPos({ top, right });
		};

		compute();

		const onScrollOrResize = () => compute();
		window.addEventListener("scroll", onScrollOrResize, true);
		window.addEventListener("resize", onScrollOrResize);

		return () => {
			window.removeEventListener("scroll", onScrollOrResize, true);
			window.removeEventListener("resize", onScrollOrResize);
		};
	}, [isOpen, anchorRect, offset]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				!(event.target as HTMLElement).closest(".dropdown-toggle")
			) {
				onClose();
			}
		};
		const handleEsc = (event: KeyboardEvent) =>
			event.key === "Escape" && onClose();

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	const initial = prefersReducedMotion
		? { opacity: 0 }
		: { opacity: 0, scale: 0.96, y: -6 };
	const animate = prefersReducedMotion
		? { opacity: 1 }
		: { opacity: 1, scale: 1, y: 0 };
	const exit = prefersReducedMotion
		? { opacity: 0 }
		: { opacity: 0, scale: 0.98, y: -6 };

	if (!isOpen || !anchorRect) return null;

	return createPortal(
		<AnimatePresence>
			<motion.div
				ref={menuRef}
				initial={initial}
				animate={animate}
				exit={exit}
				transition={{
					type: prefersReducedMotion ? "tween" : "spring",
					duration: prefersReducedMotion ? 0.15 : undefined,
					stiffness: 500,
					damping: 32,
					mass: 0.55,
				}}
				style={{
					position: "fixed",
					top: pos.top,
					right: pos.right,
					zIndex: 1000,
				}}
				className={`rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
			>
				{children}
			</motion.div>
		</AnimatePresence>,
		document.body
	);
};
