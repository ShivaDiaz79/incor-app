"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon } from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import {
  LayoutDashboard,
  Users,
  Heart,
  Bot,
  MessageCircle,
  MoreHorizontal,
  BriefcaseMedicalIcon,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Usuarios",
    icon: <Users className="w-5 h-5" />,
    path: "/users",
  },
  {
    name: "Doctores",
    icon: <BriefcaseMedicalIcon className="w-5 h-5" />,
    path: "/doctors",
  },
  {
    name: "Pacientes",
    icon: <Heart className="w-5 h-5" />,
    path: "/patients",
  },
  {
    name: "Asistente",
    icon: <Bot className="w-5 h-5" />,
    path: "/assistant",
  },
  {
    name: "Chatbot-Prompts",
    icon: <MessageCircle className="w-5 h-5" />,
    path: "/chatbot-prompt",
  },
];

const othersItems: NavItem[] = [
  // Items comentados mantenidos como estaban
];

const DASHBOARD_BASE = "/dashboard";

const useResolveHref = () => {
  return useCallback((path: string) => {
    if (/^https?:\/\//i.test(path)) return path;

    if (!path || path === "/") return DASHBOARD_BASE;

    const absolute = path.startsWith("/") ? path : `/${path}`;

    if (
      absolute === DASHBOARD_BASE ||
      absolute.startsWith(`${DASHBOARD_BASE}/`)
    ) {
      return absolute;
    }

    return `${DASHBOARD_BASE}${absolute}`.replace(/\/{2,}/g, "/");
  }, []);
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const resolveHref = useResolveHref();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group relative overflow-hidden ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
                  : "menu-item-inactive hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700"
              } cursor-pointer transition-all duration-200 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } rounded-xl border border-transparent`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              <span
                className={`relative z-10 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active text-blue-600"
                    : "menu-item-icon-inactive group-hover:text-blue-600"
                } transition-colors duration-200`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text relative z-10 font-medium`}>
                  {nav.name}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 relative z-10 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-blue-500"
                      : "group-hover:text-blue-500"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={resolveHref(nav.path)}
                className={`menu-item group relative overflow-hidden ${
                  isActive(nav.path)
                    ? "menu-item-active bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
                    : "menu-item-inactive hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700"
                } transition-all duration-200 rounded-xl border border-transparent`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                <span
                  className={`relative z-10 ${
                    isActive(nav.path)
                      ? "menu-item-icon-active text-blue-600"
                      : "menu-item-icon-inactive group-hover:text-blue-600"
                  } transition-colors duration-200`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text relative z-10 font-medium`}>
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-3 space-y-2 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={resolveHref(subItem.path)}
                      className={`menu-dropdown-item relative group ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active bg-gradient-to-r from-blue-500/5 to-purple-500/5 text-blue-600"
                          : "menu-dropdown-item-inactive hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50"
                      } rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/10`}
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-current opacity-60" />
                      <span className="ml-3">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active bg-gradient-to-r from-green-500 to-emerald-500"
                                : "menu-dropdown-badge-inactive bg-gradient-to-r from-gray-400 to-gray-500"
                            } menu-dropdown-badge px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm`}
                          >
                            nuevo
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active bg-gradient-to-r from-amber-500 to-orange-500"
                                : "menu-dropdown-badge-inactive bg-gradient-to-r from-gray-400 to-gray-500"
                            } menu-dropdown-badge px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => resolveHref(path) === pathname,
    [pathname, resolveHref]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200/60 shadow-xl
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href={DASHBOARD_BASE} className="group">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                INCOR
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Heart className="w-4 h-4 text-white" />
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-semibold tracking-wider ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menú Principal"
                ) : (
                  <MoreHorizontal className="w-4 h-4" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {othersItems.length > 0 && (
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-semibold tracking-wider ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Otros"
                  ) : (
                    <MoreHorizontal className="w-4 h-4" />
                  )}
                </h2>
                {renderMenuItems(othersItems, "others")}
              </div>
            )}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
