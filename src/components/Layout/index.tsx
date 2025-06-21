// src/components/Layout/index.tsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const ControlCenter = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Control Center</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          System Overview
        </h3>
        <p className="text-gray-600">
          Monitor your system status and performance.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          Quick Actions
        </h3>
        <p className="text-gray-600">Perform common administrative tasks.</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Alerts</h3>
        <p className="text-gray-600">View system alerts and notifications.</p>
      </div>
    </div>
  </div>
);

const BranchesOverview = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branches Overview</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Branch Management
      </h3>
      <p className="text-gray-600">
        Manage your organization's branches and locations.
      </p>
    </div>
  </div>
);

const BranchLocations = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Locations</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Location Management
      </h3>
      <p className="text-gray-600">View and manage all branch locations.</p>
    </div>
  </div>
);

const BranchPerformance = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Branch Performance
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Performance Analytics
      </h3>
      <p className="text-gray-600">Analyze branch performance metrics.</p>
    </div>
  </div>
);

const CompetitorsAnalysis = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Competitor Analysis
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Market Analysis
      </h3>
      <p className="text-gray-600">
        Analyze competitor strategies and market position.
      </p>
    </div>
  </div>
);

const CompetitorsTracking = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Competitor Tracking
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Real-time Tracking
      </h3>
      <p className="text-gray-600">Track competitor activities and updates.</p>
    </div>
  </div>
);

const CompetitorsBenchmarks = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Competitor Benchmarks
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Benchmark Analysis
      </h3>
      <p className="text-gray-600">
        Compare performance against industry benchmarks.
      </p>
    </div>
  </div>
);

const DepartmentsOverview = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Departments Overview
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Department Management
      </h3>
      <p className="text-gray-600">
        Overview of all organizational departments.
      </p>
    </div>
  </div>
);

const DepartmentStaff = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Staff Management</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Employee Management
      </h3>
      <p className="text-gray-600">Manage staff across all departments.</p>
    </div>
  </div>
);

const DepartmentProjects = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Department Projects
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Project Management
      </h3>
      <p className="text-gray-600">Track and manage departmental projects.</p>
    </div>
  </div>
);

const DepartmentSchedules = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Department Schedules
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Schedule Management
      </h3>
      <p className="text-gray-600">
        Manage departmental schedules and timelines.
      </p>
    </div>
  </div>
);

const ReportsDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports Dashboard</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Analytics Dashboard
      </h3>
      <p className="text-gray-600">
        Comprehensive view of all reports and analytics.
      </p>
    </div>
  </div>
);

const FinancialReports = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Reports</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Financial Analytics
      </h3>
      <p className="text-gray-600">
        View detailed financial reports and metrics.
      </p>
    </div>
  </div>
);

const AlertsCenter = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Alerts Center</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        System Alerts
      </h3>
      <p className="text-gray-600">
        Monitor and manage system alerts and notifications.
      </p>
    </div>
  </div>
);

const ScheduledReports = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Reports</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Automated Reports
      </h3>
      <p className="text-gray-600">
        Manage scheduled and automated report generation.
      </p>
    </div>
  </div>
);

const BranchDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Dashboard</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Branch Overview
      </h3>
      <p className="text-gray-600">
        Detailed view of specific branch performance.
      </p>
    </div>
  </div>
);

const BranchStaff = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Staff</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Staff Management
      </h3>
      <p className="text-gray-600">Manage staff for this specific branch.</p>
    </div>
  </div>
);

const BranchOperations = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Operations</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Operations Management
      </h3>
      <p className="text-gray-600">Manage daily operations for this branch.</p>
    </div>
  </div>
);

const BranchCustomers = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Customers</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Customer Management
      </h3>
      <p className="text-gray-600">
        Manage customers for this specific branch.
      </p>
    </div>
  </div>
);

const BranchReports = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Branch Reports</h1>
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Branch Analytics
      </h3>
      <p className="text-gray-600">View reports specific to this branch.</p>
    </div>
  </div>
);

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={toggleSidebar} />

          <main className="flex-1">
            <Routes>
              <Route index element={<Navigate to="control-center" replace />} />
              <Route path="control-center" element={<ControlCenter />} />

              <Route path="branches" element={<BranchesOverview />} />
              <Route path="branches/overview" element={<BranchesOverview />} />
              <Route path="branches/locations" element={<BranchLocations />} />
              <Route
                path="branches/performance"
                element={<BranchPerformance />}
              />

              <Route path="competitors" element={<CompetitorsAnalysis />} />
              <Route
                path="competitors/analysis"
                element={<CompetitorsAnalysis />}
              />
              <Route
                path="competitors/tracking"
                element={<CompetitorsTracking />}
              />
              <Route
                path="competitors/benchmarks"
                element={<CompetitorsBenchmarks />}
              />

              <Route path="departments" element={<DepartmentsOverview />} />
              <Route
                path="departments/overview"
                element={<DepartmentsOverview />}
              />
              <Route path="departments/staff" element={<DepartmentStaff />} />
              <Route
                path="departments/projects"
                element={<DepartmentProjects />}
              />
              <Route
                path="departments/schedules"
                element={<DepartmentSchedules />}
              />

              <Route path="reports" element={<ReportsDashboard />} />
              <Route path="reports/dashboard" element={<ReportsDashboard />} />
              <Route path="reports/financial" element={<FinancialReports />} />
              <Route path="reports/alerts" element={<AlertsCenter />} />
              <Route path="reports/scheduled" element={<ScheduledReports />} />

              <Route path="branch" element={<BranchDashboard />} />
              <Route path="branch/dashboard" element={<BranchDashboard />} />
              <Route path="branch/staff" element={<BranchStaff />} />
              <Route path="branch/operations" element={<BranchOperations />} />
              <Route path="branch/customers" element={<BranchCustomers />} />
              <Route path="branch/reports" element={<BranchReports />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};
