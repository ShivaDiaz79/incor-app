"use client";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-dark dark:border-gray-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
          {/* Left side - Copyright */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-left sm:text-sm">
            © {currentYear} Clínica Incor. Todos los derechos reservados.
          </div>

          {/* Right side - Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:justify-end sm:gap-4 sm:text-sm">
            <a
              href="/privacy"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Privacidad
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a
              href="/terms"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Términos
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a
              href="/support"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Soporte
            </a>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">
              •
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Bottom section - Optional company info */}
        <div className="mt-3 border-t border-gray-100 pt-3 text-center dark:border-gray-800 sm:mt-4 sm:pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Sistema de gestión clínica desarrollado para mejorar la atención
            médica
          </p>
        </div>
      </div>
    </footer>
  );
}
