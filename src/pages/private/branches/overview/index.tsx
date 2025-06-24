// src/pages/private/branches/overview/index.tsx
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

const ScoreCard = ({
  title,
  score,
  maxScore = 100,
  color,
  icon,
  description,
}: {
  title: string;
  score: number;
  maxScore?: number;
  color: string;
  icon: React.ReactNode;
  description?: string;
}) => {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black/20 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
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
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {score}
          {maxScore !== 100 && (
            <span className="text-sm text-gray-500">/{maxScore}</span>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            percentage >= 80
              ? "bg-green-500"
              : percentage >= 60
              ? "bg-blue-500"
              : percentage >= 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const SentimentChart = ({
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black/20 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Customer Sentiment
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Positive
            </span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {positive} ({positivePercent.toFixed(1)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Negative
            </span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {negative} ({negativePercent.toFixed(1)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Neutral
            </span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {neutral} ({neutralPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="mt-4 flex rounded-lg overflow-hidden h-3">
        <div
          className="bg-green-500"
          style={{ width: `${positivePercent}%` }}
        />
        <div className="bg-red-500" style={{ width: `${negativePercent}%` }} />
        <div className="bg-gray-400" style={{ width: `${neutralPercent}%` }} />
      </div>
    </div>
  );
};

const IssuesOverview = ({ issues }: { issues: any }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "High":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Low":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400";
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black/20 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Issues Overview
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {issues.total_count} Total Issues
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
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
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {issues.medium_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Medium</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {issues.low_count}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {issues.details.slice(0, 5).map((issue: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-1 rounded ${getSeverityColor(issue.severity)}`}
              >
                {getSeverityIcon(issue.severity)}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {issue.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {issue.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black/20 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Employee Highlights
      </h3>

      <div className="space-y-4">
        {positiveEmployees.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Top Performers
            </h4>
            <div className="space-y-2">
              {positiveEmployees.slice(0, 3).map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {employee.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.position}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    {employee.mention_count} mentions
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {negativeEmployees.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Needs Attention
            </h4>
            <div className="space-y-2">
              {negativeEmployees.slice(0, 3).map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {employee.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.position}
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                    {employee.mention_count} complaints
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {positiveEmployees.length === 0 && negativeEmployees.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No highlighted employees in recent reviews
          </p>
        )}
      </div>
    </div>
  );
};

const RecentReviews = ({ reviews }: { reviews: any[] }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "text-green-600 dark:text-green-400";
      case "Negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <TrendingUp className="w-4 h-4" />;
      case "Negative":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black/20 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Recent Reviews
        </h3>
        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.slice(0, 5).map((review, index) => (
          <div
            key={review.review_id}
            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-1 rounded ${getSentimentColor(
                    review.sentiment
                  )}`}
                >
                  {getSentimentIcon(review.sentiment)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {review.reviewer.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
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

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
              {review.review_text}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Mentioned: {review.mentioned_employee}</span>
              <span>{review.helpful_votes} helpful votes</span>
            </div>
          </div>
        ))}
      </div>
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
    <div className="p-6 bg-white dark:bg-black min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Building2 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {branch.branch_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Branch ID: {branch.place_id.slice(-12)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  branch.overall_score
                )} mb-2`}
              >
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            title="Customer Satisfaction"
            score={branch.performance_metrics.customer_satisfaction}
            color="text-green-600 dark:text-green-400"
            icon={
              <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
            }
            description="Overall satisfaction rating"
          />

          <ScoreCard
            title="Service Quality"
            score={branch.performance_metrics.service_quality}
            color="text-blue-600 dark:text-blue-400"
            icon={
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            }
            description="Quality of service delivery"
          />

          <ScoreCard
            title="Wait Time"
            score={branch.performance_metrics.wait_time_avg}
            maxScore={30}
            color="text-yellow-600 dark:text-yellow-400"
            icon={
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            }
            description="Average wait time (min)"
          />

          <ScoreCard
            title="Resolution Rate"
            score={branch.performance_metrics.resolution_rate}
            color="text-green-600 dark:text-green-400"
            icon={
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            }
            description="Issue resolution success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SentimentChart
            positive={branch.sentiment_analysis.total_positive}
            negative={branch.sentiment_analysis.total_negative}
            neutral={branch.sentiment_analysis.total_neutral}
          />

          <IssuesOverview issues={branch.issues} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmployeeHighlights employees={branch.highlighted_employees} />
          <RecentReviews reviews={branch.reviews.customer_reviews} />
        </div>
      </div>
    </div>
  );
};
