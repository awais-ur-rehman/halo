// src/pages/private/compare-branches/index.tsx
import { useState } from "react";
import {
  Plus,
  Building2,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  Award,
  Target,
  MessageSquare,
  Shield,
  Zap,
  MapPin,
  Calendar,
  ArrowRight,
  Minus,
} from "lucide-react";
import {
  useBranchesData,
  type BranchScorecard,
} from "../../../hook/useBranchesData";
import { BranchSelectionModal } from "./BranchSelectionModal";

interface ComparisonCardProps {
  branch: BranchScorecard | null;
  onSelect: () => void;
  title: string;
}

const ComparisonCard = ({ branch, onSelect, title }: ComparisonCardProps) => {
  if (!branch) {
    return (
      <div
        className="bg-white dark:bg-black border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-200 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
        onClick={onSelect}
      >
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <Plus className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Click to select a branch for comparison
        </p>
      </div>
    );
  }

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
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {branch.branch_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {branch.place_id.slice(-8)}
            </p>
          </div>
        </div>
        <button
          onClick={onSelect}
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
        >
          Change
        </button>
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
          {branch.overall_score}
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeBadgeColor(
            branch.score_grade
          )}`}
        >
          Grade {branch.score_grade}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
        </div>

        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {branch.reviews.total}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reviews</p>
        </div>
      </div>
    </div>
  );
};

interface MetricComparisonProps {
  title: string;
  icon: React.ReactNode;
  branch1Value: number;
  branch2Value: number;
  unit?: string;
  higherIsBetter?: boolean;
  format?: "number" | "percentage";
}

const MetricComparison = ({
  title,
  icon,
  branch1Value,
  branch2Value,
  unit = "",
  higherIsBetter = true,
  format = "number",
}: MetricComparisonProps) => {
  const formatValue = (value: number) => {
    if (format === "percentage") {
      return `${value.toFixed(1)}%`;
    }
    return `${value}${unit}`;
  };

  const getDifference = () => {
    const diff = branch1Value - branch2Value;
    const isPositive = higherIsBetter ? diff > 0 : diff < 0;
    return { diff: Math.abs(diff), isPositive };
  };

  const { diff, isPositive } = getDifference();

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="text-green-600 dark:text-green-400">{icon}</div>
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatValue(branch1Value)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Branch 1</p>
        </div>

        <div className="flex items-center space-x-2">
          {diff > 0 && (
            <>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatValue(diff)}
              </span>
            </>
          )}
          {diff === 0 && <Minus className="w-4 h-4 text-gray-400" />}
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatValue(branch2Value)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Branch 2</p>
        </div>
      </div>
    </div>
  );
};

interface SentimentComparisonProps {
  branch1: BranchScorecard;
  branch2: BranchScorecard;
}

const SentimentComparison = ({
  branch1,
  branch2,
}: SentimentComparisonProps) => {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        Customer Sentiment Analysis
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            {branch1.branch_name}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Positive
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {branch1.sentiment_analysis.positive_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Negative
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {branch1.sentiment_analysis.negative_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Neutral
              </span>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {branch1.sentiment_analysis.neutral_percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            {branch2.branch_name}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Positive
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {branch2.sentiment_analysis.positive_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Negative
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {branch2.sentiment_analysis.negative_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Neutral
              </span>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {branch2.sentiment_analysis.neutral_percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IssuesComparisonProps {
  branch1: BranchScorecard;
  branch2: BranchScorecard;
}

const IssuesComparison = ({ branch1, branch2 }: IssuesComparisonProps) => {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        Issues & Performance Analysis
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            {branch1.branch_name}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {branch1.issues.critical_count}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">Critical</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {branch1.issues.high_count}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">High</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {branch1.issues.medium_count}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Medium
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {branch1.issues.low_count}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            {branch2.branch_name}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {branch2.issues.critical_count}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">Critical</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {branch2.issues.high_count}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">High</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {branch2.issues.medium_count}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Medium
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {branch2.issues.low_count}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PerformanceRecommendationsProps {
  branch1: BranchScorecard;
  branch2: BranchScorecard;
}

const PerformanceRecommendations = ({
  branch1,
  branch2,
}: PerformanceRecommendationsProps) => {
  const getBetterPerformer = () => {
    return branch1.overall_score > branch2.overall_score ? branch1 : branch2;
  };

  const getWeakerPerformer = () => {
    return branch1.overall_score < branch2.overall_score ? branch1 : branch2;
  };

  const betterBranch = getBetterPerformer();
  const weakerBranch = getWeakerPerformer();

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Target className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        Performance Insights & Recommendations
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-400 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-1" />
            Best Performer: {betterBranch.branch_name}
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            This branch excels with a score of {betterBranch.overall_score} and
            shows strong customer satisfaction (
            {betterBranch.performance_metrics.customer_satisfaction}%) with
            effective issue resolution (
            {betterBranch.performance_metrics.resolution_rate}%).
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
            Key Success Factors from {betterBranch.branch_name}:
          </h4>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>
              • Superior service quality score:{" "}
              {betterBranch.performance_metrics.service_quality}%
            </li>
            <li>
              • Efficient wait time management:{" "}
              {betterBranch.performance_metrics.wait_time_avg} minutes average
            </li>
            <li>
              • Strong staff efficiency:{" "}
              {betterBranch.performance_metrics.staff_efficiency}%
            </li>
            <li>
              • Positive customer sentiment:{" "}
              {betterBranch.sentiment_analysis.positive_percentage.toFixed(1)}%
            </li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
            Improvement Opportunities for {weakerBranch.branch_name}:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {weakerBranch.performance_metrics.customer_satisfaction <
              betterBranch.performance_metrics.customer_satisfaction && (
              <li>
                • Focus on customer satisfaction improvement (currently{" "}
                {weakerBranch.performance_metrics.customer_satisfaction}%)
              </li>
            )}
            {weakerBranch.performance_metrics.wait_time_avg >
              betterBranch.performance_metrics.wait_time_avg && (
              <li>
                • Optimize wait time management (currently{" "}
                {weakerBranch.performance_metrics.wait_time_avg} minutes)
              </li>
            )}
            {weakerBranch.issues.critical_count >
              betterBranch.issues.critical_count && (
              <li>
                • Address {weakerBranch.issues.critical_count} critical issues
                immediately
              </li>
            )}
            {weakerBranch.performance_metrics.resolution_rate <
              betterBranch.performance_metrics.resolution_rate && (
              <li>
                • Improve issue resolution processes (currently{" "}
                {weakerBranch.performance_metrics.resolution_rate}%)
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const CompareBranchesPage = () => {
  const { branches, loading } = useBranchesData();
  const [selectedBranch1, setSelectedBranch1] =
    useState<BranchScorecard | null>(null);
  const [selectedBranch2, setSelectedBranch2] =
    useState<BranchScorecard | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"branch1" | "branch2">(
    "branch1"
  );

  const handleBranchSelect = (branch: BranchScorecard) => {
    if (selectingFor === "branch1") {
      setSelectedBranch1(branch);
    } else {
      setSelectedBranch2(branch);
    }
    setShowModal(false);
  };

  const openBranchSelection = (forBranch: "branch1" | "branch2") => {
    setSelectingFor(forBranch);
    setShowModal(true);
  };

  const canCompare = selectedBranch1 && selectedBranch2;

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading branches...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-black min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Branch Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare performance metrics between two branches to identify best
            practices and improvement opportunities
          </p>
        </div>

        {/* Branch Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComparisonCard
            branch={selectedBranch1}
            onSelect={() => openBranchSelection("branch1")}
            title="Select First Branch"
          />
          <ComparisonCard
            branch={selectedBranch2}
            onSelect={() => openBranchSelection("branch2")}
            title="Select Second Branch"
          />
        </div>

        {/* Compare Button */}
        {canCompare && <div className="text-center mb-8"></div>}

        {/* Comparison Results */}
        {canCompare && (
          <div className="space-y-8">
            {/* Key Metrics Comparison */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Performance Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricComparison
                  title="Overall Score"
                  icon={<BarChart3 className="w-5 h-5" />}
                  branch1Value={selectedBranch1.overall_score}
                  branch2Value={selectedBranch2.overall_score}
                />
                <MetricComparison
                  title="Customer Satisfaction"
                  icon={<Star className="w-5 h-5" />}
                  branch1Value={
                    selectedBranch1.performance_metrics.customer_satisfaction
                  }
                  branch2Value={
                    selectedBranch2.performance_metrics.customer_satisfaction
                  }
                  unit="%"
                  format="percentage"
                />
                <MetricComparison
                  title="Service Quality"
                  icon={<Award className="w-5 h-5" />}
                  branch1Value={
                    selectedBranch1.performance_metrics.service_quality
                  }
                  branch2Value={
                    selectedBranch2.performance_metrics.service_quality
                  }
                  unit="%"
                  format="percentage"
                />
                <MetricComparison
                  title="Wait Time"
                  icon={<Clock className="w-5 h-5" />}
                  branch1Value={
                    selectedBranch1.performance_metrics.wait_time_avg
                  }
                  branch2Value={
                    selectedBranch2.performance_metrics.wait_time_avg
                  }
                  unit=" min"
                  higherIsBetter={false}
                />
                <MetricComparison
                  title="Resolution Rate"
                  icon={<CheckCircle className="w-5 h-5" />}
                  branch1Value={
                    selectedBranch1.performance_metrics.resolution_rate
                  }
                  branch2Value={
                    selectedBranch2.performance_metrics.resolution_rate
                  }
                  unit="%"
                  format="percentage"
                />
                <MetricComparison
                  title="Staff Efficiency"
                  icon={<Users className="w-5 h-5" />}
                  branch1Value={
                    selectedBranch1.performance_metrics.staff_efficiency
                  }
                  branch2Value={
                    selectedBranch2.performance_metrics.staff_efficiency
                  }
                  unit="%"
                  format="percentage"
                />
              </div>
            </div>

            {/* Sentiment Analysis */}
            <SentimentComparison
              branch1={selectedBranch1}
              branch2={selectedBranch2}
            />

            {/* Issues Comparison */}
            <IssuesComparison
              branch1={selectedBranch1}
              branch2={selectedBranch2}
            />

            {/* Performance Recommendations */}
            <PerformanceRecommendations
              branch1={selectedBranch1}
              branch2={selectedBranch2}
            />
          </div>
        )}

        {/* Branch Selection Modal */}
        {showModal && (
          <BranchSelectionModal
            branches={branches}
            onSelect={handleBranchSelect}
            onClose={() => setShowModal(false)}
            excludeId={
              selectingFor === "branch1"
                ? selectedBranch2?.place_id
                : selectedBranch1?.place_id
            }
          />
        )}
      </div>
    </div>
  );
};
