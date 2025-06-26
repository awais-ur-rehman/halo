import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Bell,
  Search,
} from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", path: "/dashboard" },
  ];

  if (segments.length > 1) {
    switch (segments[1]) {
      case "control-center":
        breadcrumbs.push({ label: "Control Center" });
        break;
      case "branches":
        breadcrumbs.push({ label: "Branches", path: "/dashboard/branches" });
        if (segments[2]) {
          const subPages: Record<string, string> = {
            overview: "Overview",
            locations: "Locations",
            performance: "Performance",
          };
          if (subPages[segments[2]]) {
            breadcrumbs.push({ label: subPages[segments[2]] });
          }
        }
        break;
      case "compare-branches":
        breadcrumbs.push({ label: "Compare Branches" });
        break;
      case "competitors":
        breadcrumbs.push({
          label: "Competitors",
          path: "/dashboard/competitors",
        });
        if (segments[2]) {
          const subPages: Record<string, string> = {
            analysis: "Analysis",
            tracking: "Tracking",
            benchmarks: "Benchmarks",
          };
          if (subPages[segments[2]]) {
            breadcrumbs.push({ label: subPages[segments[2]] });
          }
        }
        break;
      case "departments":
        breadcrumbs.push({
          label: "Departments",
          path: "/dashboard/departments",
        });
        if (segments[2]) {
          const subPages: Record<string, string> = {
            overview: "Overview",
            staff: "Staff Management",
            projects: "Projects",
            schedules: "Schedules",
          };
          if (subPages[segments[2]]) {
            breadcrumbs.push({ label: subPages[segments[2]] });
          }
        }
        break;
      case "reports":
        breadcrumbs.push({
          label: "Reports & Alerts",
          path: "/dashboard/reports",
        });
        if (segments[2]) {
          const subPages: Record<string, string> = {
            dashboard: "Dashboard",
            financial: "Financial Reports",
            alerts: "Alerts",
            scheduled: "Scheduled Reports",
          };
          if (subPages[segments[2]]) {
            breadcrumbs.push({ label: subPages[segments[2]] });
          }
        }
        break;
      case "branch":
        breadcrumbs.push({
          label: "Branch Details",
          path: "/dashboard/branch",
        });
        if (segments[2]) {
          const subPages: Record<string, string> = {
            dashboard: "Dashboard",
            staff: "Staff",
            operations: "Operations",
            customers: "Customers",
            reports: "Reports",
          };
          if (subPages[segments[2]]) {
            breadcrumbs.push({ label: subPages[segments[2]] });
          }
        }
        break;
    }
  }

  return breadcrumbs;
};

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    console.log(newTheme);
    setIsDarkMode(newTheme);
    console.log(newTheme);

    if (typeof window !== "undefined") {
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const notifications = [
    {
      id: 1,
      title: "New branch report available",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "System maintenance scheduled",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Monthly performance summary",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Mobile Menu & Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-black rounded-md p-2 transition-colors duration-200"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  )}
                  {breadcrumb.path ? (
                    <button
                      onClick={() => navigate(breadcrumb.path!)}
                      className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200"
                    >
                      {breadcrumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {breadcrumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Section - Search, Notifications, Theme Toggle, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-800 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-black rounded-md transition-colors duration-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transition-colors duration-200">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                          notification.unread
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "bg-white dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-medium transition-colors duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-black rounded-md transition-all duration-200 hover:scale-105"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-black rounded-md transition-colors duration-200"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || user?.email}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[1000] transition-colors duration-200">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors duration-200">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for closing dropdowns */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};
