import RegisterUserButton from "@/components/auth/RegisterUserButton";

export default function UsersPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-slate-900">Usuarios</h1>
				<RegisterUserButton />
			</div>
		</div>
	);
}
