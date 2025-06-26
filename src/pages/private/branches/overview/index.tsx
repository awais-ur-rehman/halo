import { useParams, Navigate } from "react-router-dom";
import {
  Building2,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  BarChart3,
  MessageSquare,
  Award,
  AlertCircle,
} from "lucide-react";
import { useBranchesData } from "../../../../hook/useBranchesData";

const MetricRow = ({
  label,
  value,
  maxValue,
  unit = "",
  icon,
  trend,
}: {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}) => {
  const percentage = maxValue ? (value / maxValue) * 100 : value;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600 dark:text-gray-400">{icon}</div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {value}
            {unit}
            {maxValue && maxValue !== 100 && (
              <span className="text-sm text-gray-500">/{maxValue}</span>
            )}
          </div>
          {maxValue && (
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
              <div
                className="h-1 rounded-full bg-orange-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          )}
        </div>
        {trend && (
          <div className="text-gray-400">
            {trend === "up" && <TrendingUp className="w-4 h-4" />}
            {trend === "down" && <TrendingDown className="w-4 h-4" />}
            {trend === "neutral" && <Minus className="w-4 h-4" />}
          </div>
        )}
      </div>
    </div>
  );
};

const SentimentBar = ({
  positive,
  negative,
  neutral,
}: {
  positive: number;
  negative: number;
  neutral: number;
}) => {
  const total = positive + negative + neutral;
  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Customer Sentiment
        </span>
        <span className="text-gray-900 dark:text-white font-medium">
          {total} reviews
        </span>
      </div>

      <div className="flex rounded-lg overflow-hidden h-2">
        <div
          className="bg-gray-900 dark:bg-white"
          style={{ width: `${positivePercent}%` }}
        />
        <div className="bg-gray-400" style={{ width: `${negativePercent}%` }} />
        <div className="bg-gray-300" style={{ width: `${neutralPercent}%` }} />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{positive} positive</span>
        <span>{negative} negative</span>
        <span>{neutral} neutral</span>
      </div>
    </div>
  );
};

const IssuesList = ({ issues }: { issues: any }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-gray-900 dark:text-white";
      case "High":
        return "text-orange-600 dark:text-orange-400";
      case "Medium":
        return "text-gray-600 dark:text-gray-400";
      case "Low":
        return "text-gray-500 dark:text-gray-500";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="w-4 h-4" />;
      case "High":
        return <AlertTriangle className="w-4 h-4" />;
      case "Medium":
        return <AlertCircle className="w-4 h-4" />;
      case "Low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Issues Overview
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {issues.total_count} total
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {issues.critical_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Critical</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {issues.high_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
            {issues.medium_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Medium</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-500">
            {issues.low_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
        </div>
      </div>

      <div className="space-y-2">
        {issues.details.slice(0, 3).map((issue: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
              <div className={getSeverityColor(issue.severity)}>
                {getSeverityIcon(issue.severity)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {issue.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {issue.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {issue.count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {issue.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmployeeHighlights = ({ employees }: { employees: any[] }) => {
  const positiveEmployees = employees.filter(
    (emp) => emp.highlight_type === "positive"
  );
  const negativeEmployees = employees.filter(
    (emp) => emp.highlight_type === "negative"
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
        Employee Highlights
      </h3>

      {positiveEmployees.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              Top Performers
            </span>
          </div>
          {positiveEmployees.slice(0, 2).map((employee, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {employee.position}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {employee.mention_count}
              </span>
            </div>
          ))}
        </div>
      )}

      {negativeEmployees.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Needs Attention
            </span>
          </div>
          {negativeEmployees.slice(0, 2).map((employee, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {employee.position}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {employee.mention_count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewsList = ({ reviews }: { reviews: any[] }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <TrendingUp className="w-4 h-4 text-gray-900 dark:text-white" />;
      case "Negative":
        return (
          <TrendingDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        );
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {reviews.slice(0, 6).map((review, index) => (
        <div key={review.review_id} className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {getSentimentIcon(review.sentiment)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {review.reviewer.name}
                </p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating
                          ? "text-orange-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {review.review_text}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Mentioned: {review.mentioned_employee}</span>
            <span>{review.helpful_votes} helpful</span>
          </div>

          {index < reviews.slice(0, 6).length - 1 && (
            <div className="border-b border-gray-100 dark:border-gray-800 pt-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export const BranchesOverviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBranchById, loading } = useBranchesData();

  if (!id) {
    return <Navigate to="/dashboard/branches" replace />;
  }

  const branch = getBranchById(id);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading branch details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-6 bg-white dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Branch Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The requested branch could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "B":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "C":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "D":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-black h-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2 pb-2 ">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Building2 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {branch.branch_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Branch ID: {branch.place_id.slice(-12)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-white border border-black/10 dark:bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Metrics
              </h2>
              <div className="space-y-1">
                <MetricRow
                  label="Customer Satisfaction"
                  value={branch.performance_metrics.customer_satisfaction}
                  maxValue={100}
                  unit="%"
                  icon={<Star className="w-4 h-4" />}
                  trend="up"
                />
                <MetricRow
                  label="Service Quality"
                  value={branch.performance_metrics.service_quality}
                  maxValue={100}
                  unit="%"
                  icon={<BarChart3 className="w-4 h-4" />}
                  trend="neutral"
                />
                <MetricRow
                  label="Average Wait Time"
                  value={branch.performance_metrics.wait_time_avg}
                  unit=" min"
                  icon={<Clock className="w-4 h-4" />}
                  trend="down"
                />
                <MetricRow
                  label="Resolution Rate"
                  value={branch.performance_metrics.resolution_rate}
                  maxValue={100}
                  unit="%"
                  icon={<CheckCircle className="w-4 h-4" />}
                  trend="up"
                />
              </div>
            </div>

            <div className="bg-white border border-black/10 dark:bg-gray-900 rounded-xl p-6">
              <SentimentBar
                positive={branch.sentiment_analysis.total_positive}
                negative={branch.sentiment_analysis.total_negative}
                neutral={branch.sentiment_analysis.total_neutral}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-black/10 dark:bg-gray-900 rounded-xl p-6">
                <IssuesList issues={branch.issues} />
              </div>

              <div className="bg-white border border-black/10 dark:bg-gray-900 rounded-xl p-6">
                <EmployeeHighlights employees={branch.highlighted_employees} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 dark:bg-gray-900 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Reviews
              </h2>
            </div>
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              <ReviewsList reviews={branch.reviews.customer_reviews} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
      `}</style>
    </div>
  );
};
