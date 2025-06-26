// src/pages/private/branches/performance/index.tsx
import { useParams, Navigate } from "react-router-dom";
import { useBranchesData } from "../../../../hook/useBranchesData";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Star,
  Building2,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const IssueEscalationChart = ({ branch }) => {
  const escalationData = branch.reviews.customer_reviews
    .filter((review) => review.rating <= 2)
    .slice(0, 8)
    .map((review, index) => {
      const helpfulVotes = review.helpful_votes || 0;
      const riskScore = Math.min(
        (5 - review.rating) * 20 +
          helpfulVotes * 5 +
          (review.verified ? 10 : 0) +
          (review.sentiment === "Negative" ? 15 : 0),
        100
      );

      return {
        name: `R${index + 1}`,
        risk: riskScore,
        rating: review.rating,
        helpful: helpfulVotes,
        date: new Date(review.date).toLocaleDateString(),
      };
    });

  const maxRisk = Math.max(...escalationData.map((d) => d.risk));

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        Issue Escalation Prediction
      </h3>
      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
          {escalationData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 group relative"
            >
              <div className="relative">
                <div
                  className="w-8 bg-gradient-to-t from-red-500 to-red-300 rounded-t-md transition-all duration-300 hover:shadow-lg"
                  style={{ height: `${(item.risk / maxRisk) * 200}px` }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    Risk: {item.risk}%
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
    </div>
  );
};

const TrendAnalysisChart = ({ branch }) => {
  const trendData = branch.monthly_trends.map((trend, index) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index] || `M${index + 1}`,
    score: trend.score,
    reviews: trend.reviews,
    issues: trend.issues,
  }));

  const maxScore = Math.max(...trendData.map((d) => d.score));
  const minScore = Math.min(...trendData.map((d) => d.score));

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
        Performance Trend Analysis
      </h3>
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={`M ${trendData
              .map(
                (item, index) =>
                  `${index * (400 / (trendData.length - 1))},${
                    200 -
                    ((item.score - minScore) / (maxScore - minScore)) * 160
                  }`
              )
              .join(" L ")}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          <path
            d={`M ${trendData
              .map(
                (item, index) =>
                  `${index * (400 / (trendData.length - 1))},${
                    200 -
                    ((item.score - minScore) / (maxScore - minScore)) * 160
                  }`
              )
              .join(" L ")} L ${
              (trendData.length - 1) * (400 / (trendData.length - 1))
            },200 L 0,200 Z`}
            fill="url(#scoreGradient)"
          />

          {trendData.map((item, index) => (
            <g key={index}>
              <circle
                cx={index * (400 / (trendData.length - 1))}
                cy={
                  200 - ((item.score - minScore) / (maxScore - minScore)) * 160
                }
                r="5"
                fill="#3b82f6"
                className="hover:r-7 transition-all duration-200 cursor-pointer"
              />
              <text
                x={index * (400 / (trendData.length - 1))}
                y="220"
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {item.month}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
          <span>{maxScore.toFixed(1)}</span>
          <span>{((maxScore + minScore) / 2).toFixed(1)}</span>
          <span>{minScore.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

const PerformancePieChart = ({ branch }) => {
  const data = [
    {
      name: "Positive",
      value: branch.sentiment_analysis.positive_percentage,
      color: "#10b981",
    },
    {
      name: "Negative",
      value: branch.sentiment_analysis.negative_percentage,
      color: "#ef4444",
    },
    {
      name: "Neutral",
      value: branch.sentiment_analysis.neutral_percentage,
      color: "#f59e0b",
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createArcPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Star className="w-5 h-5 text-orange-500 mr-2" />
        Customer Sentiment Distribution
      </h3>
      <div className="flex items-center justify-center h-48">
        <svg width="180" height="180" className="drop-shadow-sm">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            cumulativePercentage += percentage;

            return (
              <g key={index}>
                <path
                  d={createArcPath(90, 90, 70, startAngle, endAngle)}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                />
                <text
                  x={
                    90 +
                    50 *
                      Math.cos(
                        (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180
                      )
                  }
                  y={
                    90 +
                    50 *
                      Math.sin(
                        (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180
                      )
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-white text-sm font-semibold"
                  style={{ fontSize: "12px" }}
                >
                  {percentage > 5 ? `${Math.round(percentage)}%` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.name} ({item.value.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceSuggestions = ({ branch }) => {
  const getPerformanceMetrics = () => {
    const metrics = branch.performance_metrics;
    const suggestions = [];

    if (metrics.customer_satisfaction < 80) {
      suggestions.push({
        type: "critical",
        title: "Customer Satisfaction",
        description:
          "Focus on improving customer experience and service quality",
        value: metrics.customer_satisfaction,
        target: 85,
        trend: "down",
      });
    }

    if (metrics.wait_time_avg > 15) {
      suggestions.push({
        type: "warning",
        title: "Wait Time Optimization",
        description:
          "Implement queue management system to reduce waiting times",
        value: metrics.wait_time_avg,
        target: 10,
        trend: "up",
      });
    }

    if (metrics.resolution_rate < 90) {
      suggestions.push({
        type: "info",
        title: "Resolution Rate",
        description: "Enhance staff training for better issue resolution",
        value: metrics.resolution_rate,
        target: 95,
        trend: "up",
      });
    }

    if (branch.issues.critical_count > 0) {
      suggestions.push({
        type: "critical",
        title: "Critical Issues",
        description:
          "Address critical issues immediately to prevent escalation",
        value: branch.issues.critical_count,
        target: 0,
        trend: "down",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: "success",
        title: "Excellent Performance",
        description: "Branch is performing well across all metrics",
        value: branch.overall_score,
        target: branch.overall_score,
        trend: "stable",
      });
    }

    return suggestions.slice(0, 4);
  };

  const suggestions = getPerformanceMetrics();

  const getTypeStyles = (type) => {
    switch (type) {
      case "critical":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "info":
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
      case "success":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-80 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Target className="w-5 h-5 text-purple-500 mr-2" />
        Performance Suggestions
      </h3>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getTypeStyles(
              suggestion.type
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {suggestion.title}
              </h4>
              {getTrendIcon(suggestion.trend)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {suggestion.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Current: {suggestion.value}
                {suggestion.title.includes("Wait")
                  ? " min"
                  : suggestion.title.includes("Issues")
                  ? ""
                  : "%"}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Target: {suggestion.target}
                {suggestion.title.includes("Wait")
                  ? " min"
                  : suggestion.title.includes("Issues")
                  ? ""
                  : "%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BranchPerformancePage = () => {
  const { id } = useParams();
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
              Loading performance data...
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
              The requested branch performance data could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-black h-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Building2 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {branch.branch_name} Performance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced analytics and performance insights
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {branch.overall_score}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overall Score
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          <div className="lg:col-span-2 space-y-6">
            <IssueEscalationChart branch={branch} />
            <TrendAnalysisChart branch={branch} />
          </div>

          <div className="space-y-6">
            <PerformancePieChart branch={branch} />
            <PerformanceSuggestions branch={branch} />
          </div>
        </div>
      </div>
    </div>
  );
};
