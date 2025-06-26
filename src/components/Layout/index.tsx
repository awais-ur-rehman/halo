// src/components/Layout/index.tsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

import { ControlCenterPage } from "../../pages/private/control-center";

import {
  BranchesPage,
  BranchesOverviewPage,
  BranchLocationsPage,
  BranchPerformancePage,
} from "../../pages/private/branches";

import {
  CompetitorsPage,
  CompetitorsAnalysisPage,
  CompetitorsTrackingPage,
  CompetitorsBenchmarksPage,
} from "../../pages/private/competitors";

import {
  DepartmentsPage,
  DepartmentsOverviewPage,
  DepartmentStaffPage,
  DepartmentProjectsPage,
  DepartmentSchedulesPage,
} from "../../pages/private/departments";

import {
  ReportsPage,
  ReportsDashboardPage,
  FinancialReportsPage,
  AlertsCenterPage,
  ScheduledReportsPage,
} from "../../pages/private/reports";
import { CompareBranchesPage } from "../../pages/private/compare-branches";

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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
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
              <Route path="control-center" element={<ControlCenterPage />} />

              <Route path="branches" element={<BranchesPage />} />
              <Route
                path="branches/overview/:id"
                element={<BranchesOverviewPage />}
              />
              <Route
                path="branches/performance/:id"
                element={<BranchPerformancePage />}
              />
              <Route
                path="branches/locations"
                element={<BranchLocationsPage />}
              />

              <Route
                path="compare-branches"
                element={<CompareBranchesPage />}
              />

              <Route path="competitors" element={<CompetitorsPage />} />
              <Route
                path="competitors/analysis"
                element={<CompetitorsAnalysisPage />}
              />
              <Route
                path="competitors/tracking"
                element={<CompetitorsTrackingPage />}
              />
              <Route
                path="competitors/benchmarks"
                element={<CompetitorsBenchmarksPage />}
              />

              <Route path="departments" element={<DepartmentsPage />} />
              <Route
                path="departments/overview"
                element={<DepartmentsOverviewPage />}
              />
              <Route
                path="departments/staff"
                element={<DepartmentStaffPage />}
              />
              <Route
                path="departments/projects"
                element={<DepartmentProjectsPage />}
              />
              <Route
                path="departments/schedules"
                element={<DepartmentSchedulesPage />}
              />

              <Route path="reports" element={<ReportsPage />} />
              <Route
                path="reports/dashboard"
                element={<ReportsDashboardPage />}
              />
              <Route
                path="reports/financial"
                element={<FinancialReportsPage />}
              />
              <Route path="reports/alerts" element={<AlertsCenterPage />} />
              <Route
                path="reports/scheduled"
                element={<ScheduledReportsPage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};
