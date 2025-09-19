import RecentUsersTable from "@/components/users/recents/RecentsUsersList";
import UsersStats from "@/components/users/UsersStats";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "INCOR - Dashboard",
	description: "Pagina en desarrollo",
};

export default function Page() {
	return (
		<div className="grid gap-4 md:gap-6">
			<UsersStats />

			<RecentUsersTable />
		</div>
	);
}
