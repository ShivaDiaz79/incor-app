"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppFooter from "@/layout/AppFooter";
import React from "react";
import { ChatbotBubble } from "@/components/ChatbotBubble";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex relative">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />

        {/* Main content area que crece para empujar el footer hacia abajo */}
        <main className="flex-1 p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 w-full">
          {children}
        </main>

        {/* Footer siempre al final */}
        <AppFooter />
      </div>

      {/* Chatbot flotante - posicionado de manera absoluta */}
      <div className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8">
        <ChatbotBubble />
      </div>
    </div>
  );
}
