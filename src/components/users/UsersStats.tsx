"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Badge from "@/components/ui/badge/Badge";

import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxIconLine } from "@/icons";
import { usersService } from "@/features/users/service";
import StatCard from "./stats/StatCard";
import UsersByRoleChart from "./stats/UsersByRolChart";
import ActiveRadialCard from "./stats/ActiveRadialCard";

type Stats = {
	total: number;
	active: number;
	inactive: number;
	byRole?: Record<string, number>;
};

const pct1 = (n: number) => Math.round(n * 10) / 10;

function CardSkeleton() {
	return (
		<div className="h-[144px] rounded-2xl ring-1 ring-gray-200/70 bg-white p-5 shadow-sm dark:ring-white/10 dark:bg-white/[0.04] md:p-6" />
	);
}

export default function UsersStats({ className = "" }: { className?: string }) {
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		try {
			setError(null);
			setLoading(true);
			const s = await usersService.getStats();
			setStats(s as unknown as Stats);
		} catch (e: unknown) {
			setError(
				(e as Error)?.message ?? "No se pudieron cargar las estadísticas"
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const total = stats?.total ?? 0;
	const active = stats?.active ?? 0;
	const inactive = stats?.inactive ?? Math.max(0, total - active);

	const { pctActive, pctInactive } = useMemo(() => {
		const pA = total ? pct1((active / total) * 100) : 0;
		const pI = total ? Math.round((inactive / total) * 100) : 0;
		return { pctActive: pA, pctInactive: pI };
	}, [total, active, inactive]);

	return (
		<div className={`grid grid-cols-12 gap-5 md:gap-6 ${className}`}>
			<section className="col-span-12 space-y-5 xl:col-span-7">
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{loading ? (
						<>
							<CardSkeleton />
							<CardSkeleton />
						</>
					) : (
						<>
							<StatCard
								icon={
									<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
								}
								title="Usuarios (total)"
								value={total.toLocaleString()}
								badge={
									<Badge color="success">
										<ArrowUpIcon />
										{pctActive}%
									</Badge>
								}
							/>
							<StatCard
								icon={
									<BoxIconLine className="text-gray-800 dark:text-white/90" />
								}
								title="Inactivos"
								value={inactive.toLocaleString()}
								badge={
									<Badge color="error">
										<ArrowDownIcon className="text-error-500" />
										{pctInactive}%
									</Badge>
								}
							/>
						</>
					)}
				</div>

				<UsersByRoleChart loading={loading} byRole={stats?.byRole} />
			</section>

			<aside className="col-span-12 xl:col-span-5">
				<ActiveRadialCard
					loading={loading}
					error={error}
					total={total}
					active={active}
					onRefresh={refresh}
				/>
			</aside>
		</div>
	);
}
