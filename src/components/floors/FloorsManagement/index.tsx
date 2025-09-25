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
  Building2,
  Plus,
  Edit2,
  MoreHorizontal,
  Search,
  Filter,
  Power,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFloors, useFloorActions } from "@/hooks/useFloors";
import type { Floor, CreateFloorRequest } from "@/types/floors";

// Componente para crear/editar pisos
const FloorFormDialog = ({
  floor = null,
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  floor?: Floor | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<CreateFloorRequest>(() => ({
    name: floor?.name || "",
    floorNumber: floor?.floorNumber || 1,
    buildingSection: floor?.buildingSection || "",
    description: floor?.description || "",
    isActive: floor?.isActive ?? true,
  }));

  const { create, update, loading } = useFloorActions();

  const handleSave = async () => {
    try {
      if (floor) {
        await update(floor.id, formData);
      } else {
        await create(formData);
      }

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        floorNumber: 1,
        buildingSection: "",
        description: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error saving floor:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {floor ? "Editar Piso" : "Crear Nuevo Piso"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Piso</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="ej. PRIMER PISO (1A)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floorNumber">Número de Piso</Label>
              <Input
                id="floorNumber"
                type="number"
                min="0"
                value={formData.floorNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    floorNumber: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingSection">Sección del Edificio</Label>
            <Select
              value={formData.buildingSection || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  buildingSection: value === "" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">Sin sección</SelectItem>
                <SelectItem value="A">Sección A</SelectItem>
                <SelectItem value="B">Sección B</SelectItem>
                <SelectItem value="C">Sección C</SelectItem>
                <SelectItem value="D">Sección D</SelectItem>
              </SelectContent>
            </Select>
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
              placeholder="Descripción del piso (opcional)"
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
              {loading ? "Guardando..." : floor ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Tarjeta individual de piso
const FloorCard = ({
  floor,
  onEdit,
  onRefresh,
  onSelect,
  isSelected,
}: {
  floor: Floor;
  onEdit: (floor: Floor) => void;
  onRefresh: () => void;
  onSelect: (floor: Floor) => void;
  isSelected: boolean;
}) => {
  const { activate, deactivate, loading } = useFloorActions();

  const handleStatusToggle = async () => {
    try {
      if (floor.isActive) {
        await deactivate(floor.id);
      } else {
        await activate(floor.id);
      }
      onRefresh();
    } catch (error) {
      console.error("Error toggling floor status:", error);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      onClick={() => onSelect(floor)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{floor.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Piso {floor.floorNumber}</Badge>
              {floor.buildingSection && (
                <Badge variant="secondary">
                  Sección {floor.buildingSection}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={floor.isActive ? "default" : "secondary"}
              className={floor.isActive ? "bg-green-500" : "bg-gray-500"}
            >
              {floor.isActive ? "Activo" : "Inactivo"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(floor)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleStatusToggle}
                  disabled={loading}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {floor.isActive ? "Desactivar" : "Activar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {floor.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {floor.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Creado: {new Date(floor.createdAt).toLocaleDateString()}</span>
          <span>ID: {floor.id.slice(-6)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Filtros de búsqueda
const FloorsFilters = ({ filters, onFiltersChange }: any) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pisos..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Sección</Label>
              <Select
                value={filters.buildingSection || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    buildingSection: value === "" ? undefined : value,
                    page: 1,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Todas las secciones</SelectItem>
                  <SelectItem value="A">Sección A</SelectItem>
                  <SelectItem value="B">Sección B</SelectItem>
                  <SelectItem value="C">Sección C</SelectItem>
                  <SelectItem value="D">Sección D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={filters.isActive?.toString() || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    isActive: value === "" ? undefined : value === "true",
                    page: 1,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Todos los estados</SelectItem>
                  <SelectItem value="true">Solo activos</SelectItem>
                  <SelectItem value="false">Solo inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select
                value={filters.sortBy || "floorNumber"}
                onValueChange={(value) =>
                  onFiltersChange({ sortBy: value, page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floorNumber">Número de piso</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="createdAt">Fecha de creación</SelectItem>
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

// Componente principal
export const FloorsManagement = ({ onFloorSelect, selectedFloor }: any) => {
  const {
    floors,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  } = useFloors();

  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateFloor = () => {
    setEditingFloor(null);
    setIsFormOpen(true);
  };

  const handleEditFloor = (floor: Floor) => {
    setEditingFloor(floor);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    refresh();
    setEditingFloor(null);
  };

  const handleFloorSelect = (floor: Floor) => {
    onFloorSelect(floor);
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
          <h2 className="text-2xl font-bold">Gestión de Pisos</h2>
          <p className="text-muted-foreground">
            Administra los pisos del edificio
          </p>
        </div>

        <Button onClick={handleCreateFloor}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Piso
        </Button>
      </div>

      {/* Filtros */}
      <FloorsFilters filters={filters} onFiltersChange={updateFilters} />

      {/* Lista de pisos */}
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
      ) : floors.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay pisos registrados</p>
            <p>Crea el primer piso para comenzar</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {floors.map((floor) => (
            <FloorCard
              key={floor.id}
              floor={floor}
              onEdit={handleEditFloor}
              onRefresh={refresh}
              onSelect={handleFloorSelect}
              isSelected={selectedFloor?.id === floor.id}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {floors.length} de {pagination.total} pisos
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
      <FloorFormDialog
        floor={editingFloor}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
