"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Building2,
  DoorOpen,
  Calendar,
  Users,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Floor } from "@/types/floors";
// Importar los componentes reales
import { FloorsManagement } from "@/components/floors/FloorsManagement";
import { OfficesManagement } from "@/components/offices/OfficeManagement";
import {
  DoctorScheduleManagement,
  ScheduleGridView,
} from "@/components/schedules/ScheduleManagement";

export default function AdminDashboard() {
  const [selectedFloor, setSelectedFloor] = useState<Floor>({} as Floor);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background ${isDark ? "dark" : ""}`}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Panel Administrativo</h1>
                <p className="text-sm text-muted-foreground">
                  Gestión de Pisos, Consultorios y Horarios
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="floors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="floors" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Pisos
            </TabsTrigger>
            <TabsTrigger value="offices" className="flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              Consultorios
            </TabsTrigger>
            <TabsTrigger
              value="schedule-view"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Vista Horarios
            </TabsTrigger>
            <TabsTrigger
              value="doctor-schedules"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Horarios Doctores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="floors" className="space-y-6">
            <FloorsManagement
              selectedFloor={selectedFloor}
              onFloorSelect={setSelectedFloor}
            />
          </TabsContent>

          <TabsContent value="offices" className="space-y-6">
            <OfficesManagement selectedFloor={selectedFloor} />
          </TabsContent>

          <TabsContent value="schedule-view" className="space-y-6">
            <ScheduleGridView selectedFloor={selectedFloor} />
          </TabsContent>

          <TabsContent value="doctor-schedules" className="space-y-6">
            <DoctorScheduleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
