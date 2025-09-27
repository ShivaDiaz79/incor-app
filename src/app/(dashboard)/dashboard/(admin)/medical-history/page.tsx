import { MedicalHistoryList } from "@/components/medical-history/MedicalHistoryList";

export default function MedicalHistoryPage() {
  return (
    <div className="p-6">
      <MedicalHistoryList />
    </div>
  );
}

// Opcional: Metadatos para la página
export const metadata = {
  title: "Historias Clínicas | Sistema Médico",
  description:
    "Gestiona las historias clínicas de los pacientes del sistema médico",
};
