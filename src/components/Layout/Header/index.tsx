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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md p-2"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  {breadcrumb.path ? (
                    <button
                      onClick={() => navigate(breadcrumb.path!)}
                      className="text-gray-500 hover:text-orange-500 font-medium transition-colors"
                    >
                      {breadcrumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {breadcrumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-sm text-orange-600 hover:text-orange-500 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">
                  {user?.name || user?.email}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000]">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
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
