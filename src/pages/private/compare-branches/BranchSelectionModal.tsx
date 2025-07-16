// src/pages/private/compare-branches/BranchSelectionModal.tsx
import { useState } from "react";
import {
  X,
  Search,
  Building2,
  Star,
  Users,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";
import type { BranchScorecard } from "../../../hook/useBranchesData";

interface BranchSelectionModalProps {
  branches: BranchScorecard[];
  onSelect: (branch: BranchScorecard) => void;
  onClose: () => void;
  excludeId?: string;
}

export const BranchSelectionModal = ({
  branches,
  onSelect,
  onClose,
  excludeId,
}: BranchSelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<
    "all" | "A" | "B" | "C" | "D"
  >("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "rating">("score");

  const filteredBranches = branches
    .filter((branch) => {
      if (excludeId && branch.place_id === excludeId) return false;

      const matchesSearch =
        branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.place_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade =
        selectedGrade === "all" || branch.score_grade === selectedGrade;

      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.overall_score - a.overall_score;
        case "name":
          return a.branch_name.localeCompare(b.branch_name);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "B":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "C":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "D":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pt-20">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* <div
          className="fixed inset-0 transition-opacity bg-gray-500/10 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        /> */}

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Branch
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose a branch to compare from the list below
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="D">Grade D</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branch List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
            {filteredBranches.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No branches found matching your criteria
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredBranches.map((branch) => (
                  <div
                    key={branch.place_id}
                    onClick={() => onSelect(branch)}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {branch.branch_name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {branch.place_id.slice(-8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {branch.overall_score}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeBadgeColor(
                              branch.score_grade
                            )}`}
                          >
                            Grade {branch.score_grade}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center min-w-[180px]">
                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {branch.rating.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Rating
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Users className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {branch.reviews.total}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reviews
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              {branch.issues.critical_count > 0 ? (
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                              ) : (
                                <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400" />
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {branch.issues.critical_count || 0}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {branch.issues.critical_count > 0
                                ? "Critical"
                                : "Issues"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
