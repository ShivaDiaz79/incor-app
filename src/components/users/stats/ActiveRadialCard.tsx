"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import Button from "@/components/ui/button/Button";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const pct1 = (n: number) => Math.round(n * 10) / 10;

export default function ActiveRadialCard({
  loading,
  error,
  total,
  active,
  onRefresh,
}: {
  loading: boolean;
  error?: string | null;
  total: number;
  active: number;
  onRefresh: () => void;
}) {
  const percent = useMemo(
    () => (total ? pct1((active / total) * 100) : 0),
    [active, total]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "radialBar",
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      labels: ["Activos"],
      colors: ["#465fff"],
      plotOptions: {
        radialBar: {
          hollow: { size: "70%" },
          track: { background: "rgba(0,0,0,0.08)" },
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontWeight: 600,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "26px",
              fontWeight: 800,
              offsetY: 8,
              formatter: (v) => `${v}%`,
            },
          },
        },
      },

      fill: { opacity: 1 },
      stroke: { lineCap: "round" },
    }),
    []
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Porcentaje de activos
      </h3>

      {loading ? (
        <div className="h-[260px] animate-pulse rounded bg-gray-100 dark:bg-white/10" />
      ) : (
        <div className="flex flex-col items-center">
          <ReactApexChart
            options={options}
            series={[percent]}
            type="radialBar"
            height={260}
          />
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            {active} activos de {total} usuarios.
          </p>
          {error && (
            <p className="mt-3 rounded-lg border border-error-500/40 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
              {error}
            </p>
          )}
          <div className="mt-5">
            <Button variant="outline" onClick={onRefresh}>
              Actualizar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
