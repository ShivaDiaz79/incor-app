/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Power,
  Users,
  Clock,
  Building2,
  X,
  AlertTriangle,
  Printer,
  RefreshCw,
  Download,
  Save,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDoctorSchedules,
  useDoctorScheduleActions,
} from "@/hooks/useDoctorSchedules";
import { useDoctors } from "@/hooks/useDoctors";
import { useOffices } from "@/hooks/useOffices";
import { useFloors } from "@/hooks/useFloors";
import type {
  DoctorSchedule,
  CreateDoctorScheduleRequest,
  DoctorOfficeSchedule,
  DoctorScheduleSlot,
  DayOfWeek,
} from "@/types/doctor-schedules";
import { Floor } from "@/types/floors";

// Constantes
const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "monday", label: "Lunes", short: "LUN" },
  { value: "tuesday", label: "Martes", short: "MAR" },
  { value: "wednesday", label: "Miércoles", short: "MIE" },
  { value: "thursday", label: "Jueves", short: "JUE" },
  { value: "friday", label: "Viernes", short: "VIE" },
  { value: "saturday", label: "Sábado", short: "SAB" },
  { value: "sunday", label: "Domingo", short: "DOM" },
];

// Formulario para crear/editar horarios de doctor
const DoctorScheduleFormDialog = ({
  schedule = null,
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  schedule?: DoctorSchedule | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<CreateDoctorScheduleRequest>(() => ({
    doctorUserId: schedule?.doctorUserId || "",
    schedules: schedule?.schedules || [],
    effectiveFrom: schedule?.effectiveFrom
      ? new Date(schedule.effectiveFrom).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    effectiveTo: schedule?.effectiveTo
      ? new Date(schedule.effectiveTo).toISOString().split("T")[0]
      : "",
    notes: schedule?.notes || "",
    isActive: schedule?.isActive ?? true,
  }));

  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [newSlot, setNewSlot] = useState({
    startTime: "08:00",
    endTime: "09:00",
    isAvailable: true,
    appointmentDuration: 30,
    maxAppointments: 1,
  });

  const { create, update, loading } = useDoctorScheduleActions();
  const { doctors } = useDoctors({ limit: 100, isActive: true });
  const { offices } = useOffices({ limit: 1000, isActive: true });

  const handleSave = async () => {
    try {
      if (schedule) {
        await update(schedule.id, formData);
      } else {
        await create(formData);
      }

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        doctorUserId: "",
        schedules: [],
        effectiveFrom: new Date().toISOString().split("T")[0],
        effectiveTo: "",
        notes: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const addTimeSlot = () => {
    if (!selectedOffice || !selectedDay) return;

    const existingScheduleIndex = formData.schedules.findIndex(
      (s) => s.officeId === selectedOffice && s.dayOfWeek === selectedDay
    );

    if (existingScheduleIndex >= 0) {
      // Agregar slot al horario existente
      const updatedSchedules = [...formData.schedules];
      updatedSchedules[existingScheduleIndex] = {
        ...updatedSchedules[existingScheduleIndex],
        slots: [...updatedSchedules[existingScheduleIndex].slots, newSlot],
      };
      setFormData((prev) => ({ ...prev, schedules: updatedSchedules }));
    } else {
      // Crear nuevo horario de oficina
      const newOfficeSchedule: DoctorOfficeSchedule = {
        officeId: selectedOffice,
        dayOfWeek: selectedDay,
        slots: [newSlot],
      };
      setFormData((prev) => ({
        ...prev,
        schedules: [...prev.schedules, newOfficeSchedule],
      }));
    }

    // Reset slot form
    setNewSlot({
      startTime: "08:00",
      endTime: "09:00",
      isAvailable: true,
      appointmentDuration: 30,
      maxAppointments: 1,
    });
  };

  const removeTimeSlot = (
    officeId: string,
    dayOfWeek: DayOfWeek,
    slotIndex: number
  ) => {
    const updatedSchedules = formData.schedules
      .map((schedule) => {
        if (
          schedule.officeId === officeId &&
          schedule.dayOfWeek === dayOfWeek
        ) {
          return {
            ...schedule,
            slots: schedule.slots.filter((_, index) => index !== slotIndex),
          };
        }
        return schedule;
      })
      .filter((schedule) => schedule.slots.length > 0);

    setFormData((prev) => ({ ...prev, schedules: updatedSchedules }));
  };

  const removeOfficeSchedule = (officeId: string, dayOfWeek: DayOfWeek) => {
    const updatedSchedules = formData.schedules.filter(
      (schedule) =>
        !(schedule.officeId === officeId && schedule.dayOfWeek === dayOfWeek)
    );
    setFormData((prev) => ({ ...prev, schedules: updatedSchedules }));
  };

  const getOfficeName = (officeId: string) => {
    const office = offices.find((o) => o.id === officeId);
    return office ? office.name : `Consultorio ${officeId}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Editar Horario de Doctor" : "Crear Horario de Doctor"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select
                value={formData.doctorUserId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, doctorUserId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.userId}>
                      Dr. {doctor.user?.name} {doctor.user?.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vigente desde</Label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    effectiveFrom: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Vigente hasta (opcional)</Label>
              <Input
                type="date"
                value={formData.effectiveTo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    effectiveTo: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notas adicionales sobre el horario"
              rows={2}
            />
          </div>

          <Separator />

          {/* Agregar horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurar Horarios</h3>

            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Consultorio</Label>
                  <Select
                    value={selectedOffice}
                    onValueChange={setSelectedOffice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona consultorio" />
                    </SelectTrigger>
                    <SelectContent>
                      {offices.map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name} - {office.floor?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Día</Label>
                  <Select
                    value={selectedDay}
                    onValueChange={(value: DayOfWeek) => setSelectedDay(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Hora inicio</Label>
                  <Input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hora fin</Label>
                  <Input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duración cita (min)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="180"
                    value={newSlot.appointmentDuration}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        appointmentDuration: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Máx. citas</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlot.maxAppointments}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        maxAppointments: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSlot.isAvailable}
                    onCheckedChange={(checked) =>
                      setNewSlot((prev) => ({ ...prev, isAvailable: checked }))
                    }
                  />
                  <Label>Disponible</Label>
                </div>

                <Button
                  onClick={addTimeSlot}
                  disabled={!selectedOffice || !selectedDay}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Horario
                </Button>
              </div>
            </Card>
          </div>

          {/* Lista de horarios configurados */}
          {formData.schedules.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Horarios Configurados</h4>
              <div className="space-y-3">
                {formData.schedules.map((schedule, scheduleIndex) => (
                  <Card
                    key={`${schedule.officeId}-${schedule.dayOfWeek}`}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium">
                          {getOfficeName(schedule.officeId)}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {
                            DAYS_OF_WEEK.find(
                              (d) => d.value === schedule.dayOfWeek
                            )?.label
                          }
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeOfficeSchedule(
                            schedule.officeId,
                            schedule.dayOfWeek
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {schedule.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-mono">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span>{slot.appointmentDuration} min</span>
                            <span>Máx: {slot.maxAppointments}</span>
                            <Badge
                              variant={
                                slot.isAvailable ? "default" : "secondary"
                              }
                            >
                              {slot.isAvailable
                                ? "Disponible"
                                : "No disponible"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeTimeSlot(
                                schedule.officeId,
                                schedule.dayOfWeek,
                                slotIndex
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                loading ||
                !formData.doctorUserId ||
                formData.schedules.length === 0
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : schedule ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Lista de horarios de doctores
export const DoctorScheduleManagement = () => {
  const {
    schedules,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  } = useDoctorSchedules();
  const {
    activate,
    deactivate,
    loading: actionLoading,
  } = useDoctorScheduleActions();
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule: DoctorSchedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleStatusToggle = async (schedule: DoctorSchedule) => {
    try {
      if (schedule.isActive) {
        await deactivate(schedule.id);
      } else {
        await activate(schedule.id);
      }
      refresh();
    } catch (error) {
      console.error("Error toggling schedule status:", error);
    }
  };

  const handleFormSuccess = () => {
    refresh();
    setEditingSchedule(null);
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center text-destructive">
          <AlertTriangle className="h-6 w-6 mr-2" />
          Error: {error}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Horarios de Doctores</h2>
          <p className="text-muted-foreground">
            Configura los horarios de atención por doctor
          </p>
        </div>

        <Button onClick={handleCreateSchedule}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Horario
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por doctor..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Solo activos</SelectItem>
              <SelectItem value="inactive">Solo inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Lista de horarios */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay horarios configurados</p>
            <p>Crea el primer horario para un doctor</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {schedule.doctor
                        ? `Dr. ${schedule.doctor.name} ${schedule.doctor.lastName}`
                        : "Doctor"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={schedule.isActive ? "default" : "secondary"}
                      >
                        {schedule.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Vigente desde:{" "}
                        {new Date(schedule.effectiveFrom).toLocaleDateString()}
                        {schedule.effectiveTo &&
                          ` hasta ${new Date(
                            schedule.effectiveTo
                          ).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(schedule)}
                        disabled={actionLoading}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        {schedule.isActive ? "Desactivar" : "Activar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {schedule.notes && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {schedule.notes}
                  </p>
                )}

                {/* Resumen de horarios */}
                <div className="space-y-3">
                  {schedule.schedules.map((officeSchedule, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Consultorio</span>
                        <span className="text-sm font-medium">
                          {
                            DAYS_OF_WEEK.find(
                              (d) => d.value === officeSchedule.dayOfWeek
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {officeSchedule.slots.map((slot, slotIndex) => (
                          <Badge
                            key={slotIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {slot.startTime}-{slot.endTime}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {schedules.length} de {pagination.total} horarios
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                updateFilters({ page: pagination.currentPage - 1 })
              }
            >
              Anterior
            </Button>

            <span className="flex items-center px-3 text-sm">
              {pagination.currentPage} de {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                updateFilters({ page: pagination.currentPage + 1 })
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Dialog para crear/editar */}
      <DoctorScheduleFormDialog
        schedule={editingSchedule}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

// Vista de horarios en grid - Versión completa corregida
export const ScheduleGridView = ({
  selectedFloor,
}: {
  selectedFloor: Floor;
}) => {
  const { getByOfficeId } = useDoctorScheduleActions();
  const { offices } = useOffices({
    floorId: selectedFloor?.id,
    isActive: true,
    limit: 100,
  });

  const [scheduleData, setScheduleData] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("daily");
  const gridRef = useRef<HTMLDivElement>(null);

  // Función helper para obtener el día de la semana
  const getDayOfWeek = (dateString: string) => {
    // Método más seguro para evitar problemas de zona horaria
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  // Generar slots de media hora de 8:00 a 20:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 19) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    slots.push("20:00");
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generar días de la semana para vista semanal
  const generateWeekDays = (startDate: string) => {
    const date = new Date(startDate + "T00:00:00");
    const days = [];
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    // Encontrar el lunes de la semana
    const currentDay = date.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    date.setDate(date.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(date);
      dayDate.setDate(date.getDate() + i);
      days.push({
        date: dayDate.toISOString().split("T")[0],
        name: dayNames[dayDate.getDay()],
        shortName: dayNames[dayDate.getDay()].substring(0, 3).toUpperCase(),
      });
    }
    return days;
  };

  const weekDays = generateWeekDays(selectedDate);

  const loadScheduleData = async () => {
    if (!selectedFloor || offices.length === 0) return;

    setLoading(true);
    try {
      const datesToLoad =
        viewMode === "weekly" ? weekDays.map((d) => d.date) : [selectedDate];
      const schedulePromises = [];

      for (const date of datesToLoad) {
        for (const office of offices) {
          schedulePromises.push(
            getByOfficeId(office.id, date)
              .then((response) => ({
                officeId: office.id,
                date,
                data: response.data || [],
              }))
              .catch((error) => {
                console.error(
                  `Error loading schedule for office ${office.id} on ${date}:`,
                  error
                );
                return { officeId: office.id, date, data: [] };
              })
          );
        }
      }

      const results = await Promise.all(schedulePromises);
      const newScheduleData: { [date: string]: { [officeId: string]: any } } =
        {};

      results.forEach(({ officeId, date, data }) => {
        if (!newScheduleData[date]) {
          newScheduleData[date] = {};
        }
        newScheduleData[date][officeId] = data;
      });

      setScheduleData(newScheduleData);
    } catch (error) {
      console.error("Error loading schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, [selectedFloor, offices, selectedDate, viewMode]);

  const getScheduleForTimeSlot = (
    officeId: string,
    time: string,
    date = selectedDate
  ) => {
    const officeSchedules: DoctorSchedule[] =
      scheduleData[date]?.[officeId] || [];
    const [hours, minutes] = time.split(":").map(Number);
    const slotMinutes = hours * 60 + minutes;
    const currentDayOfWeek = getDayOfWeek(date);

    return officeSchedules.filter((doctorSchedule) => {
      // Verificar si este doctor tiene horarios para el día actual
      return doctorSchedule.schedules?.some((officeSchedule) => {
        // Verificar que sea el día correcto
        if (officeSchedule.dayOfWeek !== currentDayOfWeek) {
          return false;
        }

        // Verificar que tenga slots que abarquen esta hora
        return officeSchedule.slots?.some((slot) => {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);
          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;

          return (
            slotMinutes >= startMinutes &&
            slotMinutes < endMinutes &&
            slot.isAvailable
          );
        });
      });
    });
  };

  const handlePrint = () => {
    if (gridRef.current) {
      const printContent = gridRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        console.error("No se pudo abrir la ventana de impresión");
        return;
      }

      const title =
        viewMode === "weekly"
          ? `Horarios Semanal - ${selectedFloor?.name}`
          : `Horarios - ${selectedFloor?.name}`;

      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 4px; text-align: center; }
              th { background-color: #f5f5f5; font-weight: bold; font-size: 11px; }
              .time-cell { background-color: #f9f9f9; font-weight: bold; min-width: 60px; }
              .schedule-item { 
                background-color: #e3f2fd; 
                margin: 1px 0; 
                padding: 1px 2px; 
                border-radius: 2px; 
                font-size: 9px;
                display: block;
              }
              .header { text-align: center; margin-bottom: 20px; }
              .office-header { writing-mode: vertical-rl; text-orientation: mixed; min-width: 80px; }
              @media print { 
                body { margin: 0; font-size: 10px; } 
                .schedule-item { font-size: 8px; }
              }
              @page { size: A3 landscape; margin: 0.5in; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <p>${
                viewMode === "weekly"
                  ? `Semana del ${weekDays[0].date} al ${weekDays[6].date}`
                  : `Fecha: ${new Date(selectedDate).toLocaleDateString()}`
              }</p>
              <p>Generado: ${new Date().toLocaleString()}</p>
            </div>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const changeWeek = (direction: number) => {
    const currentDate = new Date(selectedDate + "T00:00:00");
    currentDate.setDate(currentDate.getDate() + direction * 7);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  if (!selectedFloor) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Selecciona un piso</p>
          <p>Elige un piso para ver los horarios de sus consultorios</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vista de Horarios</h2>
          <p className="text-muted-foreground">
            {selectedFloor.name} -{" "}
            {viewMode === "weekly" ? "Vista Semanal" : "Vista Diaria"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Vista Diaria</SelectItem>
              <SelectItem value="weekly">Vista Semanal</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "weekly" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeWeek(-1)}
              >
                ←
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {weekDays[0]?.date} - {weekDays[6]?.date}
              </span>
              <Button variant="outline" size="sm" onClick={() => changeWeek(1)}>
                →
              </Button>
            </div>
          ) : (
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          )}

          <Button
            variant="outline"
            onClick={loadScheduleData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir PDF
          </Button>
        </div>
      </div>

      {/* Grid de horarios */}
      <Card>
        <CardContent className="p-0">
          <div ref={gridRef} className="overflow-x-auto">
            {viewMode === "daily" ? (
              // Vista diaria
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium sticky left-0 bg-muted/50 min-w-[80px]">
                      Horario
                    </th>
                    {offices.map((office) => (
                      <th
                        key={office.id}
                        className="p-2 text-center font-medium min-w-[200px]"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {office.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-normal">
                            #{office.officeNumber}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr
                      key={time}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-2 font-medium bg-muted/30 sticky left-0 border-r text-center text-sm">
                        {time}
                      </td>
                      {offices.map((office) => (
                        <td
                          key={`${time}-${office.id}`}
                          className="p-1 border-l"
                        >
                          <div className="min-h-[40px] space-y-1">
                            {getScheduleForTimeSlot(office.id, time).map(
                              (schedule: DoctorSchedule, index: number) => (
                                <div
                                  key={`${schedule.id}-${index}`}
                                  className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border"
                                >
                                  <div className="font-medium truncate">
                                    Dr. {schedule.doctor?.name || "N/A"}{" "}
                                    {schedule.doctor?.lastName || ""}
                                  </div>
                                  {schedule.doctor?.speciality && (
                                    <div className="opacity-75 text-[10px] truncate">
                                      {schedule.doctor.speciality}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Vista semanal
              <div className="space-y-6">
                {offices.map((office) => (
                  <div key={office.id} className="border rounded-lg">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-3 border-b">
                      <h3 className="font-bold text-center text-lg">
                        {office.name} (#{office.officeNumber})
                      </h3>
                    </div>

                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium min-w-[80px] border-r">
                            Horarios
                          </th>
                          {weekDays.map((day) => (
                            <th
                              key={day.date}
                              className="p-2 text-center font-medium min-w-[120px] border-r"
                            >
                              <div>
                                <div className="font-semibold">
                                  {day.shortName}
                                </div>
                                <div className="text-xs text-muted-foreground font-normal">
                                  {new Date(day.date + "T00:00:00").getDate()}/
                                  {new Date(day.date + "T00:00:00").getMonth() +
                                    1}
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time) => (
                          <tr
                            key={time}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-2 font-medium bg-muted/30 border-r text-center text-sm">
                              {time}
                            </td>
                            {weekDays.map((day) => (
                              <td
                                key={`${time}-${day.date}`}
                                className="p-1 border-r"
                              >
                                <div className="min-h-[35px] space-y-1">
                                  {getScheduleForTimeSlot(
                                    office.id,
                                    time,
                                    day.date
                                  ).map((schedule, index) => (
                                    <div
                                      key={`${schedule.id}-${index}`}
                                      className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border"
                                    >
                                      <div className="font-medium truncate">
                                        Dr. {schedule.doctor?.name || "N/A"}{" "}
                                        {schedule.doctor?.lastName || ""}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando horarios...</span>
        </div>
      )}

      {!loading && offices.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay consultorios activos</p>
            <p>Este piso no tiene consultorios activos para mostrar horarios</p>
          </div>
        </Card>
      )}
    </div>
  );
};
