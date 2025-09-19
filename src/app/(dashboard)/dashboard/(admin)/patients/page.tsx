"use client";
import PatientsList from "@/components/patients/PatientsList";
import RegisterPatientModal from "@/components/patients/RegisterPatientModal";
import Button from "@/components/ui/button/Button";
import { useState } from "react";

export default function PatientsPage() {
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-slate-900">Pacientes</h1>

				<Button
					onClick={() => setOpen(true)}
					className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					Nuevo Paciente
				</Button>
			</div>
			<PatientsList />

			<RegisterPatientModal isOpen={open} onClose={() => setOpen(false)} />
		</div>
	);
}
