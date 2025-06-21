import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const ControlCenter = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Control Center</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">System Overview</h3>
        <p className="text-gray-600">
          Monitor your system status and performance.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <p className="text-gray-600">Perform common administrative tasks.</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Alerts</h3>
        <p className="text-gray-600">View system alerts and notifications.</p>
      </div>
    </div>
  </div>
);

const Branches = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branches</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Branch Management</h3>
      <p className="text-gray-600">
        Manage your organization's branches and locations.
      </p>
    </div>
  </div>
);

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { name: "Control Center", href: "/dashboard/control-center" },
    { name: "Branches", href: "/dashboard/branches" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">Halo</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="lg:flex">
        <div
          className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:flex lg:w-64 lg:flex-col ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">H</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">Halo</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="lg:hidden text-gray-300 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-8 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
              <div className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <div className="inline-block h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {user?.name || user?.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-0">
          <main className="flex-1">
            <Routes>
              <Route index element={<Navigate to="control-center" replace />} />
              <Route path="control-center" element={<ControlCenter />} />
              <Route path="branches" element={<Branches />} />
            </Routes>
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}
    </div>
  );
};
