"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const btnRef = useRef<HTMLButtonElement>(null);

	const logout = useAuthStore((s) => s.logout);
	const router = useRouter();
	const user = useAuthStore((s) => s.user);

	function updateAnchorRect() {
		setAnchorRect(btnRef.current?.getBoundingClientRect() ?? null);
	}

	function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.stopPropagation();
		if (!isOpen) {
			updateAnchorRect(); // calcular ancla al abrir
		}
		setIsOpen((prev) => !prev);
	}

	function closeDropdown() {
		setIsOpen(false);
	}

	// Recalcula posición al hacer scroll o resize mientras está abierto
	useEffect(() => {
		if (!isOpen) return;
		const onScrollOrResize = () => updateAnchorRect();
		window.addEventListener("scroll", onScrollOrResize, true);
		window.addEventListener("resize", onScrollOrResize);
		return () => {
			window.removeEventListener("scroll", onScrollOrResize, true);
			window.removeEventListener("resize", onScrollOrResize);
		};
	}, [isOpen]);

	return (
		<div className="relative">
			<button
				ref={btnRef}
				onClick={toggleDropdown}
				className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				<span className="mr-3 overflow-hidden rounded-full h-11 w-11">
					<Image
						width={44}
						height={44}
						src={"/images/user/owner.jpg"}
						alt="Usuario"
					/>
				</span>

				<span className="block mr-1 font-medium text-theme-sm">
					{user?.name} {user?.lastName}
				</span>

				<svg
					className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
					width="18"
					height="20"
					viewBox="0 0 18 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<Dropdown
				isOpen={isOpen}
				onClose={closeDropdown}
				anchorRect={anchorRect}
				// OJO: sin "absolute/right/mt"; Dropdown ya usa position: fixed
				className="w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
			>
				<div>
					<span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
						{user?.name} {user?.lastName}
					</span>
					<span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
						{user?.email}
					</span>
				</div>

				<ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
					<li>
						<DropdownItem
							onItemClick={closeDropdown}
							tag="a"
							href="/profile"
							className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<svg
								className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							/>
							Editar perfil
						</DropdownItem>
					</li>
					<li>
						<DropdownItem
							onItemClick={closeDropdown}
							tag="a"
							href="/profile"
							className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<svg
								className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							/>
							Configuración de cuenta
						</DropdownItem>
					</li>
					<li>
						<DropdownItem
							onItemClick={closeDropdown}
							tag="a"
							href="/profile"
							className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							<svg
								className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							/>
							Soporte
						</DropdownItem>
					</li>
				</ul>

				<button
					className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
					onClick={async () => {
						await logout();
						closeDropdown();
						router.push("/signin");
					}}
				>
					<svg
						className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					/>
					Cerrar sesión
				</button>
			</Dropdown>
		</div>
	);
}
