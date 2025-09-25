/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DoorOpen,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Power,
  Users,
  Stethoscope,
  Building2,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOffices, useOfficeActions } from "@/hooks/useOffices";
import { useFloors } from "@/hooks/useFloors";
import type { Office, CreateOfficeRequest } from "@/types/offices";
import { Floor } from "@/types/floors";

// Componente para crear/editar consultorios
const OfficeFormDialog = ({
  office = null,
  selectedFloorId = null,
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  office?: Office | null;
  selectedFloorId?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<CreateOfficeRequest>(() => ({
    name: office?.name || "",
    officeNumber: office?.officeNumber || 1,
    floorId: office?.floorId || selectedFloorId || "",
    capacity: office?.capacity || 4,
    equipment: office?.equipment || [],
    specialties: office?.specialties || [],
    description: office?.description || "",
    isActive: office?.isActive ?? true,
  }));

  const [newEquipment, setNewEquipment] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");

  const { create, update, loading } = useOfficeActions();
  const { floors } = useFloors({ limit: 100, isActive: true });

  const handleSave = async () => {
    try {
      if (office) {
        await update(office.id, formData);
      } else {
        await create(formData);
      }

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        officeNumber: 1,
        floorId: selectedFloorId || "",
        capacity: 4,
        equipment: [],
        specialties: [],
        description: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error saving office:", error);
    }
  };

  const addEquipment = () => {
    if (
      newEquipment.trim() &&
      !formData.equipment?.includes(newEquipment.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...(prev.equipment || []), newEquipment.trim()],
      }));
      setNewEquipment("");
    }
  };

  const removeEquipment = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment?.filter((e) => e !== equipment) || [],
    }));
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !formData.specialties?.includes(newSpecialty.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...(prev.specialties || []), newSpecialty.trim()],
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties?.filter((s) => s !== specialty) || [],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {office ? "Editar Consultorio" : "Crear Nuevo Consultorio"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Consultorio</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="ej. CONSULTORIO 6"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeNumber">Número</Label>
              <Input
                id="officeNumber"
                type="number"
                min="1"
                value={formData.officeNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    officeNumber: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floorId">Piso</Label>
              <Select
                value={formData.floorId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, floorId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un piso" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Equipamiento */}
          <div className="space-y-2">
            <Label>Equipamiento Médico</Label>
            <div className="flex gap-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="ej. ECG Machine"
                onKeyPress={(e) => e.key === "Enter" && addEquipment()}
              />
              <Button type="button" onClick={addEquipment} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.equipment?.map((equipment) => (
                <Badge
                  key={equipment}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {equipment}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeEquipment(equipment)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <Label>Especialidades Médicas</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="ej. Cardiología"
                onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
              />
              <Button type="button" onClick={addSpecialty} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialties?.map((specialty) => (
                <Badge
                  key={specialty}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {specialty}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descripción del consultorio (opcional)"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Estado Activo</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Guardando..." : office ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Tarjeta individual de consultorio
const OfficeCard = ({
  office,
  onEdit,
  onRefresh,
}: {
  office: Office;
  onEdit: (office: Office) => void;
  onRefresh: () => void;
}) => {
  const { activate, deactivate, loading } = useOfficeActions();

  const handleStatusToggle = async () => {
    try {
      if (office.isActive) {
        await deactivate(office.id);
      } else {
        await activate(office.id);
      }
      onRefresh();
    } catch (error) {
      console.error("Error toggling office status:", error);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{office.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">#{office.officeNumber}</Badge>
              {office.floor && (
                <Badge variant="secondary">{office.floor.name}</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={office.isActive ? "default" : "secondary"}
              className={office.isActive ? "bg-green-500" : "bg-gray-500"}
            >
              {office.isActive ? "Activo" : "Inactivo"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(office)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleStatusToggle}
                  disabled={loading}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {office.isActive ? "Desactivar" : "Activar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Capacidad: {office.capacity} personas</span>
          </div>

          {office.specialties && office.specialties.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Stethoscope className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {office.specialties.slice(0, 3).map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {office.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{office.specialties.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {office.equipment && office.equipment.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Equipos: {office.equipment.slice(0, 2).join(", ")}
              {office.equipment.length > 2 &&
                ` y ${office.equipment.length - 2} más`}
            </div>
          )}
        </div>

        {office.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {office.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Creado: {new Date(office.createdAt).toLocaleDateString()}</span>
          <span>ID: {office.id.slice(-6)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Filtros de búsqueda para consultorios
const OfficesFilters = ({ filters, onFiltersChange, floors }: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const { getSpecialties } = useOfficeActions();
  const [specialties, setSpecialties] = useState<string[]>([]);

  React.useEffect(() => {
    getSpecialties().then(setSpecialties).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar consultorios..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ search: e.target.value, page: 1 })
            }
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Piso</Label>
              <Select
                value={filters.floorId || ""}
                onValueChange={(value) =>
                  onFiltersChange({ floorId: value || undefined, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los pisos</SelectItem>
                  {floors.map((floor: Floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Especialidad</Label>
              <Select
                value={filters.specialty || ""}
                onValueChange={(value) =>
                  onFiltersChange({ specialty: value || undefined, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={filters.isActive?.toString() || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    isActive: value ? value === "true" : undefined,
                    page: 1,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="true">Solo activos</SelectItem>
                  <SelectItem value="false">Solo inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select
                value={filters.sortBy || "officeNumber"}
                onValueChange={(value) =>
                  onFiltersChange({ sortBy: value, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officeNumber">Número</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="capacity">Capacidad</SelectItem>
                  <SelectItem value="createdAt">Fecha creación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Orden</Label>
              <Select
                value={filters.sortOrder || "asc"}
                onValueChange={(value) =>
                  onFiltersChange({ sortOrder: value, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Componente principal de gestión de consultorios
export const OfficesManagement = ({ selectedFloor }: any) => {
  const {
    offices,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  } = useOffices({
    floorId: selectedFloor?.id,
  });
  const { floors } = useFloors({ limit: 100, isActive: true });
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateOffice = () => {
    setEditingOffice(null);
    setIsFormOpen(true);
  };

  const handleEditOffice = (office: Office) => {
    setEditingOffice(office);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    refresh();
    setEditingOffice(null);
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
          <h2 className="text-2xl font-bold">Consultorios</h2>
          <p className="text-muted-foreground">
            {selectedFloor
              ? `Gestiona los consultorios del ${selectedFloor.name}`
              : "Gestiona todos los consultorios del edificio"}
          </p>
        </div>

        <Button onClick={handleCreateOffice}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Consultorio
        </Button>
      </div>

      {/* Filtros */}
      <OfficesFilters
        filters={filters}
        onFiltersChange={updateFilters}
        floors={floors}
      />

      {/* Lista de consultorios */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : offices.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <DoorOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay consultorios registrados</p>
            <p>
              {selectedFloor
                ? `Crea el primer consultorio en ${selectedFloor.name}`
                : "Crea un consultorio para comenzar"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office) => (
            <OfficeCard
              key={office.id}
              office={office}
              onEdit={handleEditOffice}
              onRefresh={refresh}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {offices.length} de {pagination.total} consultorios
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
      <OfficeFormDialog
        office={editingOffice}
        selectedFloorId={selectedFloor?.id}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
