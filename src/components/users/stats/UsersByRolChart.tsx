import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
	ssr: false,
});

export default function UsersByRoleChart({
	loading,
	byRole,
}: {
	loading: boolean;
	byRole?: Record<string, number>;
}) {
	const [menuOpen, setMenuOpen] = useState(false);

	const entries = useMemo(
		() => Object.entries(byRole ?? {}).sort((a, b) => b[1] - a[1]),
		[byRole]
	);

	const categories = entries.map(([k]) => k);
	const values = entries.map(([, v]) => v);

	const options: ApexOptions = useMemo(
		() => ({
			colors: ["#465fff"],
			chart: {
				type: "bar",
				toolbar: { show: false },
				height: 220,
				fontFamily: "Outfit, sans-serif",
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: "39%",
					borderRadius: 5,
					borderRadiusApplication: "end",
				},
			},
			dataLabels: { enabled: false },
			xaxis: {
				categories,
				axisBorder: { show: false },
				axisTicks: { show: false },
				labels: { style: { fontFamily: "Outfit" } },
			},
			yaxis: { labels: { style: { fontFamily: "Outfit" } } },
			grid: { yaxis: { lines: { show: true } } },
			tooltip: { y: { formatter: (val: number) => `${val}` } },
			noData: { text: "Sin datos" },
		}),
		[categories]
	);

	const series = useMemo(
		() => [{ name: "Usuarios por rol", data: values }],
		[values]
	);

	return (
		<div className="col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
			<div className="mb-2 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
					Usuarios por rol
				</h3>
				<div className="relative inline-block">
					<button
						onClick={() => setMenuOpen((v) => !v)}
						className="dropdown-toggle"
					>
						<MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
					</button>
					<Dropdown
						isOpen={menuOpen}
						onClose={() => setMenuOpen(false)}
						className="w-40 p-2"
					>
						<DropdownItem
							onItemClick={() => setMenuOpen(false)}
							className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							Opciones
						</DropdownItem>
					</Dropdown>
				</div>
			</div>

			<div className="max-w-full overflow-x-auto custom-scrollbar">
				<div className="-ml-5 min-w-[420px] pl-2 xl:min-w-full">
					{loading ? (
						<div className="h-[220px] animate-pulse rounded bg-gray-100 dark:bg-white/10" />
					) : entries.length === 0 ? (
						<div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
							No hay usuarios por rol para mostrar
						</div>
					) : (
						<ReactApexChart
							options={options}
							series={series}
							type="bar"
							height={220}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
