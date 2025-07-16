import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  Settings,
  Building2,
  Users,
  TrendingUp,
  FileText,
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
  Sun,
  Moon,
  ArrowLeft,
  GitCompare,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: never;
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
    label: "Branch Intelligence",
    icon: <Building2 className="w-5 h-5" />,
    path: "/dashboard/branches",
  },
  {
    id: "compare-branches",
    label: "Branches Comparison",
    icon: <GitCompare className="w-5 h-5" />,
    path: "/dashboard/compare-branches",
  },
  {
    id: "departments",
    label: "Geographical intelligence",
    icon: <Users className="w-5 h-5" />,
    path: "/dashboard/departments",
  },
  {
    id: "competitors",
    label: "National Intelligence",
    icon: <Target className="w-5 h-5" />,
    path: "/dashboard/competitors",
  },

  {
    id: "reports-alerts",
    label: "Reports & Alerts",
    icon: <FileText className="w-5 h-5" />,
    path: "/dashboard/reports",
  },
];

const branchesNavigation: SidebarItem[] = [
  {
    id: "branches-overview",
    label: "Overview",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/dashboard/branches/overview",
  },
  {
    id: "branches-performance",
    label: "Performance",
    icon: <TrendingUp className="w-5 h-5" />,
    path: "/dashboard/branches/performance",
  },
];

const competitorsNavigation: SidebarItem[] = [
  {
    id: "competitors-analysis",
    label: "Analysis",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/dashboard/competitors/analysis",
  },
  {
    id: "competitors-tracking",
    label: "Tracking",
    icon: <TrendingUp className="w-5 h-5" />,
    path: "/dashboard/competitors/tracking",
  },
  {
    id: "competitors-benchmarks",
    label: "Benchmarks",
    icon: <Target className="w-5 h-5" />,
    path: "/dashboard/competitors/benchmarks",
  },
];

const departmentsNavigation: SidebarItem[] = [
  {
    id: "departments-overview",
    label: "Overview",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/dashboard/departments/overview",
  },
  {
    id: "departments-staff",
    label: "Staff Management",
    icon: <UserCheck className="w-5 h-5" />,
    path: "/dashboard/departments/staff",
  },
  {
    id: "departments-projects",
    label: "Projects",
    icon: <Briefcase className="w-5 h-5" />,
    path: "/dashboard/departments/projects",
  },
  {
    id: "departments-schedules",
    label: "Schedules",
    icon: <Calendar className="w-5 h-5" />,
    path: "/dashboard/departments/schedules",
  },
];

const reportsNavigation: SidebarItem[] = [
  {
    id: "reports-dashboard",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/dashboard/reports/dashboard",
  },
  {
    id: "reports-financial",
    label: "Financial Reports",
    icon: <FileBarChart className="w-5 h-5" />,
    path: "/dashboard/reports/financial",
  },
  {
    id: "reports-alerts",
    label: "Alerts",
    icon: <Bell className="w-5 h-5" />,
    path: "/dashboard/reports/alerts",
  },
  {
    id: "reports-scheduled",
    label: "Scheduled Reports",
    icon: <Clock className="w-5 h-5" />,
    path: "/dashboard/reports/scheduled",
  },
];

export const Sidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const location = useLocation();

  const getCurrentNavigation = () => {
    const pathname = location.pathname;

    // Check if we're viewing a specific branch (overview or performance)
    if (pathname.match(/\/dashboard\/branches\/(overview|performance)\/(.+)/)) {
      const match = pathname.match(
        /\/dashboard\/branches\/(overview|performance)\/(.+)/
      );
      const branchId = match?.[2];

      return {
        navigation: branchesNavigation.map((item) => ({
          ...item,
          path: `${item.path}/${branchId}`,
        })),
        title: "Branch Details",
        backPath: "/dashboard/branches",
      };
    }

    if (pathname.startsWith("/dashboard/competitors/")) {
      return {
        navigation: competitorsNavigation,
        title: "Competitors",
        backPath: "/dashboard",
      };
    }

    if (pathname.startsWith("/dashboard/departments/")) {
      return {
        navigation: departmentsNavigation,
        title: "Departments",
        backPath: "/dashboard",
      };
    }

    if (pathname.startsWith("/dashboard/reports/")) {
      return {
        navigation: reportsNavigation,
        title: "Reports & Alerts",
        backPath: "/dashboard",
      };
    }

    return { navigation: mainNavigation, title: "Halo", backPath: null };
  };

  const { navigation, title, backPath } = getCurrentNavigation();

  const isItemActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const renderNavItem = (item: SidebarItem) => {
    const isActive = isItemActive(item.path);

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={onClose}
        className={({ isActive: navIsActive }) =>
          `block ${
            isCollapsed ? "px-4" : "px-6 pr-6"
          } py-3 text-sm font-medium transition-all duration-200 ${
            navIsActive || isActive
              ? "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-r-2 border-green-500 dark:border-green-400"
              : "text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
          <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            {item.label}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:flex lg:flex-col transition-all duration-300 ${
          isOpen ? "block" : "hidden lg:block"
        } ${isCollapsed ? "lg:w-16 " : "lg:w-64"}`}
      >
        <div
          className={`flex h-screen flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center px-4" : "justify-between px-6"
            } py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
            )}

            <button
              onClick={onToggleCollapse}
              className={`hidden lg:block p-1.5 bg-green-500 hover:bg-green-600 text-white absolute rounded-full transition-all duration-200 transform hover:scale-105 ${
                isCollapsed ? "left-[50px]" : "left-[240px]"
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCollapsed ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {backPath && !isCollapsed && (
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <NavLink
                to={backPath}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </NavLink>
            </div>
          )}

          <nav className="flex-1 py-4 min-h-0 overflow-y-auto">
            <div className="space-y-1 h-full flex flex-col">
              {navigation.map((item) => renderNavItem(item))}
            </div>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
};
