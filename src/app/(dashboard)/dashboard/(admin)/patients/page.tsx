// app/(admin)/dashboard/patients/page.tsx
"use client";

import { PatientsList } from "@/components/patients/PatientList";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PatientsList />
    </div>
  );
}
