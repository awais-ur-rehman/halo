// src/components/Layout/Sidebar/index.tsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Settings,
  Building2,
  Users,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronRight,
  Monitor,
  MapPin,
  Calendar,
  BarChart3,
  Bell,
  FileBarChart,
  Target,
  Briefcase,
  UserCheck,
  Clock,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const mainNavigation: SidebarItem[] = [
  {
    id: "control-center",
    label: "Control Center",
    icon: <Monitor className="w-5 h-5" />,
    path: "/dashboard/control-center",
  },
  {
    id: "branches",
    label: "Branches",
    icon: <Building2 className="w-5 h-5" />,
    path: "/dashboard/branches",
    children: [
      {
        id: "branch-overview",
        label: "Overview",
        icon: <BarChart3 className="w-4 h-4" />,
        path: "/dashboard/branches/overview",
      },
      {
        id: "branch-locations",
        label: "Locations",
        icon: <MapPin className="w-4 h-4" />,
        path: "/dashboard/branches/locations",
      },
      {
        id: "branch-performance",
        label: "Performance",
        icon: <TrendingUp className="w-4 h-4" />,
        path: "/dashboard/branches/performance",
      },
    ],
  },
  {
    id: "competitors",
    label: "Competitors",
    icon: <Target className="w-5 h-5" />,
    path: "/dashboard/competitors",
    children: [
      {
        id: "competitor-analysis",
        label: "Analysis",
        icon: <BarChart3 className="w-4 h-4" />,
        path: "/dashboard/competitors/analysis",
      },
      {
        id: "competitor-tracking",
        label: "Tracking",
        icon: <TrendingUp className="w-4 h-4" />,
        path: "/dashboard/competitors/tracking",
      },
      {
        id: "competitor-benchmarks",
        label: "Benchmarks",
        icon: <Target className="w-4 h-4" />,
        path: "/dashboard/competitors/benchmarks",
      },
    ],
  },
  {
    id: "departments",
    label: "Departments",
    icon: <Users className="w-5 h-5" />,
    path: "/dashboard/departments",
    children: [
      {
        id: "dept-overview",
        label: "Overview",
        icon: <BarChart3 className="w-4 h-4" />,
        path: "/dashboard/departments/overview",
      },
      {
        id: "dept-staff",
        label: "Staff Management",
        icon: <UserCheck className="w-4 h-4" />,
        path: "/dashboard/departments/staff",
      },
      {
        id: "dept-projects",
        label: "Projects",
        icon: <Briefcase className="w-4 h-4" />,
        path: "/dashboard/departments/projects",
      },
      {
        id: "dept-schedule",
        label: "Schedules",
        icon: <Calendar className="w-4 h-4" />,
        path: "/dashboard/departments/schedules",
      },
    ],
  },
  {
    id: "reports-alerts",
    label: "Reports & Alerts",
    icon: <FileText className="w-5 h-5" />,
    path: "/dashboard/reports",
    children: [
      {
        id: "reports-dashboard",
        label: "Dashboard",
        icon: <BarChart3 className="w-4 h-4" />,
        path: "/dashboard/reports/dashboard",
      },
      {
        id: "reports-financial",
        label: "Financial Reports",
        icon: <FileBarChart className="w-4 h-4" />,
        path: "/dashboard/reports/financial",
      },
      {
        id: "reports-alerts",
        label: "Alerts",
        icon: <Bell className="w-4 h-4" />,
        path: "/dashboard/reports/alerts",
      },
      {
        id: "reports-scheduled",
        label: "Scheduled Reports",
        icon: <Clock className="w-4 h-4" />,
        path: "/dashboard/reports/scheduled",
      },
    ],
  },
];

const branchSpecificNavigation: SidebarItem[] = [
  {
    id: "branch-dashboard",
    label: "Branch Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/dashboard/branch/dashboard",
  },
  {
    id: "branch-staff",
    label: "Staff",
    icon: <Users className="w-5 h-5" />,
    path: "/dashboard/branch/staff",
  },
  {
    id: "branch-operations",
    label: "Operations",
    icon: <Settings className="w-5 h-5" />,
    path: "/dashboard/branch/operations",
  },
  {
    id: "branch-customers",
    label: "Customers",
    icon: <UserCheck className="w-5 h-5" />,
    path: "/dashboard/branch/customers",
  },
  {
    id: "branch-reports",
    label: "Reports",
    icon: <FileText className="w-5 h-5" />,
    path: "/dashboard/branch/reports",
  },
];

export const Sidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<"main" | "branch">("main");

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isParentActive = (item: SidebarItem) => {
    if (item.path && isItemActive(item.path)) return true;
    if (item.children) {
      return item.children.some(
        (child) => child.path && isItemActive(child.path)
      );
    }
    return false;
  };

  const renderNavItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path && isItemActive(item.path);
    const isParentItemActive = isParentActive(item);

    const paddingLeft =
      level === 0
        ? isCollapsed
          ? "pl-4"
          : "pl-6"
        : isCollapsed
        ? "pl-6"
        : "pl-12";

    if (isCollapsed && level > 0) return null;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } ${paddingLeft} ${
              isCollapsed ? "px-4" : "pr-6"
            } py-3 text-left text-sm font-medium transition-all duration-200 ${
              isParentItemActive
                ? "text-orange-500 bg-orange-50 border-r-2 border-orange-500"
                : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
            } group relative`}
            title={isCollapsed ? item.label : ""}
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
            {isCollapsed && (
              <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        ) : (
          <NavLink
            to={item.path || "#"}
            onClick={onClose}
            className={({ isActive: navIsActive }) =>
              `block ${paddingLeft} ${
                isCollapsed ? "px-4" : "pr-6"
              } py-3 text-sm font-medium transition-all duration-200 ${
                navIsActive || isActive
                  ? "text-orange-500 bg-orange-50 border-r-2 border-orange-500"
                  : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
              } group relative`
            }
            title={isCollapsed ? item.label : ""}
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {isCollapsed && (
              <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </NavLink>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-gray-25">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const currentNavigation =
    currentView === "main" ? mainNavigation : branchSpecificNavigation;

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:flex lg:flex-col transition-all duration-300 ${
          isOpen ? "block" : "hidden lg:block"
        } ${isCollapsed ? "lg:w-16" : "lg:w-64"}`}
      >
        <div
          className={`flex h-screen flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center px-4" : "justify-between px-6"
            } py-4 border-b border-gray-200 flex-shrink-0`}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Halo</h1>
                </div>
              </div>
            )}
            {isCollapsed && <div className="h-8"></div>}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:block p-1.5 bg-orange-500 text-white hover:text-gray-700 hover:bg-orange-300 absolute  rounded-full transition-colors ${
                isCollapsed ? "left-[50px] " : "left-[240px]"
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCollapsed ? "rotate-0 " : "rotate-180"
                }`}
              />
            </button>
          </div>

          <nav className="flex-1 py-4 min-h-0">
            <div className="space-y-1 h-full flex flex-col">
              {currentNavigation.map((item) => renderNavItem(item))}
            </div>
          </nav>

          {currentView === "branch" && !isCollapsed && (
            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <button
                onClick={() => setCurrentView("main")}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Main Menu
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-50"
          onClick={onClose}
        />
      )}
    </>
  );
};
