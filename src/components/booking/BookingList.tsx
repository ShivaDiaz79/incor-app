"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

import BookingModal from "@/components/booking/BookingModal";

export type Option = { label: string; value: string };

export type Booking = {
  id: string;
  clientId: string;
  medicalId: string;
  date: string;
  area: string;
  observation?: string;
  code: string;
};

type BookingListProps = {
  clientOptions: Option[];
  medicalOptions: Option[];
  initialData?: Booking[];
  pageSize?: number;
};

export default function BookingList({
  clientOptions,
  medicalOptions,
  initialData = [],
  pageSize = 10,
}: BookingListProps) {
  const [items, setItems] = useState<Booking[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);

  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const findBooking = (id?: string | null) => items.find((b) => b.id === id);

  const clientLabel = (id: string) =>
    clientOptions.find((o) => o.value === id)?.label ?? id;

  const medicalLabel = (id: string) =>
    medicalOptions.find((o) => o.value === id)?.label ?? id;

  const fmtDate = (iso: string) => {
    try {
      return format(parseISO(iso), "dd MMM yyyy", { locale: es });
    } catch {
      return iso;
    }
  };

  const onCreate = (values: Omit<Booking, "id">) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setItems((prev) => [{ id, ...values }, ...prev]);
    setOpenCreate(false);
  };

  const onEdit = (id: string, values: Omit<Booking, "id">) => {
    setItems((prev) => prev.map((b) => (b.id === id ? { id, ...values } : b)));
    setOpenEdit(false);
    setEditId(null);
  };

  const onDelete = (id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
    setOpenDelete(false);
    setDeleteId(null);

    setCurrentPage((p) => {
      const newTotal = Math.max(1, Math.ceil((items.length - 1) / pageSize));
      return Math.min(p, newTotal);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <Button onClick={() => setOpenCreate(true)}>Nueva reserva</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <Table className="divide-y divide-gray-200 dark:divide-gray-800">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/40">
              <TableCell isHeader className="px-4 py-3">
                Código
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Fecha
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Cliente
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Médico
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Área
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Observación
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                <span className="sr-only">Acciones</span>
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-6">
                  Sin registros.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((b) => (
                <TableRow
                  key={b.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {b.code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {fmtDate(b.date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {clientLabel(b.clientId)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {medicalLabel(b.medicalId)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">{b.area}</TableCell>
                  <TableCell className="px-4 py-3 text-sm truncate max-w-[260px]">
                    {b.observation || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right relative">
                    <button
                      className="dropdown-toggle rounded-lg border px-2.5 py-1.5 text-sm"
                      onClick={() =>
                        setMenuOpenFor((prev) => (prev === b.id ? null : b.id))
                      }
                    >
                      ⋯
                    </button>
                    <Dropdown
                      isOpen={menuOpenFor === b.id}
                      onClose={() => setMenuOpenFor(null)}
                      className="min-w-[180px]"
                    >
                      <DropdownItem
                        onClick={() => {
                          setMenuOpenFor(null);
                          setEditId(b.id);
                          setOpenEdit(true);
                        }}
                      >
                        Editar
                      </DropdownItem>
                      <DropdownItem
                        className="text-red-600"
                        onClick={() => {
                          setMenuOpenFor(null);
                          setDeleteId(b.id);
                          setOpenDelete(true);
                        }}
                      >
                        Eliminar
                      </DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      <BookingModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        clientOptions={clientOptions}
        medicalOptions={medicalOptions}
        onSubmitLocal={(vals) => onCreate(vals)}
      />

      <BookingModal
        isOpen={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditId(null);
        }}
        clientOptions={clientOptions}
        medicalOptions={medicalOptions}
        onSubmitLocal={(vals) => {
          if (!editId) return;
          onEdit(editId, vals);
        }}
      />

      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Eliminar reserva"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          ¿Deseas eliminar esta reserva? Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenDelete(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => deleteId && onDelete(deleteId)}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
