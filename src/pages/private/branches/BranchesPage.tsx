import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  RefreshCw,
  MapPin,
  Clock,
} from "lucide-react";
import {
  useBranchesData,
  type BranchScorecard,
} from "../../../hook/useBranchesData";

const BranchCard = ({ branch }: { branch: BranchScorecard }) => {
  const navigate = useNavigate();

  const handleBranchClick = () => {
    navigate(`/dashboard/branches/overview/${branch.place_id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

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
    <div
      onClick={handleBranchClick}
      className="bg-white dark:bg-white/20 rounded-xl shadow-sm border border-gray-200 dark:border-white/20 p-6 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 group backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {branch.branch_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {branch.place_id.slice(-8)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${getScoreColor(
              branch.overall_score
            )}`}
          >
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.reviews.total}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reviews</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {branch.issues.critical_count > 0 ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.issues.critical_count || branch.issues.total_count}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {branch.issues.critical_count > 0 ? "Critical" : "Issues"}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${
                branch.sentiment_analysis.positive_percentage > 50
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.sentiment_analysis.positive_percentage.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Positive</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>
            Updated {new Date(branch.last_updated).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>{branch.all_employees.length} Staff</span>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}) => (
  <div className="bg-white dark:bg-white/20 rounded-xl p-6 border border-gray-200 dark:border-white/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div
        className={`p-3 rounded-lg ${
          color.includes("green")
            ? "bg-green-100 dark:bg-green-900/30"
            : color.includes("blue")
            ? "bg-blue-100 dark:bg-blue-900/30"
            : color.includes("yellow")
            ? "bg-yellow-100 dark:bg-yellow-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        }`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export const BranchesPage = () => {
  const {
    branches,
    loading,
    error,
    searchBranches,
    getBranchStats,
    getBranchesByGrade,
    refreshBranches,
  } = useBranchesData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<
    "all" | "A" | "B" | "C" | "D"
  >("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "rating" | "issues">(
    "score"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const stats = getBranchStats();

  const filteredBranches = () => {
    let filtered = searchTerm ? searchBranches(searchTerm) : branches;

    if (selectedGrade !== "all") {
      filtered = getBranchesByGrade(selectedGrade);
      if (searchTerm) {
        filtered = filtered.filter((branch) =>
          branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    return filtered.sort((a, b) => {
      let aValue: number | string, bValue: number | string;

      switch (sortBy) {
        case "score":
          aValue = a.overall_score;
          bValue = b.overall_score;
          break;
        case "name":
          aValue = a.branch_name;
          bValue = b.branch_name;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "issues":
          aValue = a.issues.critical_count;
          bValue = b.issues.critical_count;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
            <span className="ml-3 text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading branches...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Failed to Load Branches
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={refreshBranches}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayedBranches = filteredBranches();

  return (
    <div className="p-6 bg-white dark:bg-black h-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Branch Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and analyze performance across all branch locations
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Branches"
              value={stats.totalBranches}
              icon={
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              }
              color="text-black dark:text-blue-400"
              description={`Avg Score: ${stats.averageScore}`}
            />
            <StatsCard
              title="Grade A Branches"
              value={stats.gradeDistribution.A}
              icon={
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              }
              color="text-black dark:text-green-400"
              description={`${(
                (stats.gradeDistribution.A / stats.totalBranches) *
                100
              ).toFixed(1)}% of total`}
            />
            <StatsCard
              title="Critical Issues"
              value={stats.criticalIssues}
              icon={
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              }
              color="text-black dark:text-red-400"
              description={`${stats.totalIssues} total issues`}
            />
            <StatsCard
              title="Total Reviews"
              value={stats.totalReviews.toLocaleString()}
              icon={
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              }
              color="text-dark dark:text-yellow-400"
              description="Customer feedback"
            />
          </div>
        )}

        <div className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 lg:mr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as any)}
                  className="border border-gray-300 dark:border-white/20 rounded-lg px-3 py-2 bg-white dark:bg-white/20 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                </select>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="border border-gray-300 dark:border-white/20 rounded-lg px-3 py-2 bg-white dark:bg-white/20 text-gray-900 dark:text-white text-sm"
              >
                <option value="score-desc">Score (High to Low)</option>
                <option value="score-asc">Score (Low to High)</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="rating-desc">Rating (High to Low)</option>
                <option value="issues-desc">Most Issues</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-[450px] overflow-y-auto p-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedBranches.map((branch) => (
              <BranchCard key={branch.place_id} branch={branch} />
            ))}
          </div>
        </div>

        {displayedBranches.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No branches found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
