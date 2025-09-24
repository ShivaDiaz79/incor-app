// app/dashboard/doctors/page.tsx
"use client";

import { DoctorsList } from "@/components/doctors/DoctorList";

export default function DoctorsPage() {
  return (
    <div className="p-6">
      <DoctorsList />
    </div>
  );
}
