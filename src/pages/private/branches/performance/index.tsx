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
  Users,
  MessageSquare,
} from "lucide-react";

const IssueEscalationChart = ({ branch }) => {
  const escalationData = branch.reviews.customer_reviews
    .filter((review) => review.rating <= 2)
    .slice(0, 10)
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
        name: `Issue ${index + 1}`,
        risk: riskScore,
        engagement: Math.random() * 40 + 20,
        virality: Math.random() * 60 + 10,
        day: index + 1,
      };
    });

  const maxValue = 100;
  const minValue = 0;

  const getYPosition = (value) => {
    return 250 - ((value - minValue) / (maxValue - minValue)) * 200;
  };

  const createPath = (dataKey) => {
    return escalationData
      .map(
        (item, index) =>
          `${index === 0 ? "M" : "L"} ${
            index * (500 / (escalationData.length - 1)) + 40
          },${getYPosition(item[dataKey])}`
      )
      .join(" ");
  };

  const createAreaPath = (dataKey) => {
    const linePath = createPath(dataKey);
    const startX = 40;
    const endX =
      (escalationData.length - 1) * (500 / (escalationData.length - 1)) + 40;
    return `${linePath} L ${endX},250 L ${startX},250 Z`;
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        Issue Escalation Prediction
      </h3>

      <div className="relative h-64">
        <svg
          width="100%"
          height="100%"
          viewBox="0 100 660 40"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="engagementGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="viralityGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line
                  x1="40"
                  y1={getYPosition(value)}
                  x2="540"
                  y2={getYPosition(value)}
                  stroke="#e5e7eb"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />
                <text
                  x="30"
                  y={getYPosition(value) + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {value}
                </text>
              </g>
            ))}
          </g>

          <path d={createAreaPath("risk")} fill="url(#riskGradient)" />
          <path
            d={createAreaPath("engagement")}
            fill="url(#engagementGradient)"
          />
          <path d={createAreaPath("virality")} fill="url(#viralityGradient)" />

          <path
            d={createPath("risk")}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createPath("engagement")}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createPath("virality")}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {escalationData.map((item, index) => (
            <g key={index}>
              <circle
                cx={index * (500 / (escalationData.length - 1)) + 40}
                cy={getYPosition(item.risk)}
                r="4"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={index * (500 / (escalationData.length - 1)) + 40}
                cy={getYPosition(item.engagement)}
                r="4"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={index * (500 / (escalationData.length - 1)) + 40}
                cy={getYPosition(item.virality)}
                r="4"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />

              <text
                x={index * (500 / (escalationData.length - 1)) + 40}
                y="265"
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {item.day}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute top-0 right-0 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Risk Score
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Engagement
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Viral Potential
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendAnalysisChart = ({ branch }) => {
  const trendData = branch.monthly_trends.map((trend, index) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index] || `M${index + 1}`,
    score: trend.score,
    satisfaction: Math.random() * 30 + 70,
    efficiency: Math.random() * 25 + 75,
  }));

  const maxValue = 100;
  const minValue = 0;

  const getYPosition = (value) => {
    return 250 - ((value - minValue) / (maxValue - minValue)) * 200;
  };

  const createPath = (dataKey) => {
    return trendData
      .map(
        (item, index) =>
          `${index === 0 ? "M" : "L"} ${
            index * (500 / (trendData.length - 1)) + 40
          },${getYPosition(item[dataKey])}`
      )
      .join(" ");
  };

  const createAreaPath = (dataKey) => {
    const linePath = createPath(dataKey);
    const startX = 40;
    const endX = (trendData.length - 1) * (500 / (trendData.length - 1)) + 40;
    return `${linePath} L ${endX},250 L ${startX},250 Z`;
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
        Performance Trend Analysis
      </h3>

      <div className="relative h-64">
        <svg
          width="100%"
          height="100%"
          viewBox="0 100 660 40"
          className="overflow-visible"
        >
          <defs>
            <linearGradient
              id="scoreAreaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="satisfactionAreaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="efficiencyAreaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line
                  x1="40"
                  y1={getYPosition(value)}
                  x2="540"
                  y2={getYPosition(value)}
                  stroke="#e5e7eb"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />
                <text
                  x="30"
                  y={getYPosition(value) + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {value}
                </text>
              </g>
            ))}
          </g>

          <path d={createAreaPath("score")} fill="url(#scoreAreaGradient)" />
          <path
            d={createAreaPath("satisfaction")}
            fill="url(#satisfactionAreaGradient)"
          />
          <path
            d={createAreaPath("efficiency")}
            fill="url(#efficiencyAreaGradient)"
          />

          <path
            d={createPath("score")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createPath("satisfaction")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={createPath("efficiency")}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {trendData.map((item, index) => (
            <g key={index}>
              <circle
                cx={index * (500 / (trendData.length - 1)) + 40}
                cy={getYPosition(item.score)}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={index * (500 / (trendData.length - 1)) + 40}
                cy={getYPosition(item.satisfaction)}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={index * (500 / (trendData.length - 1)) + 40}
                cy={getYPosition(item.efficiency)}
                r="4"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />

              <text
                x={index * (500 / (trendData.length - 1)) + 40}
                y="265"
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {item.month}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute top-0 right-0 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Overall Score
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Satisfaction
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Efficiency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SentimentPieChart = ({ branch }) => {
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
      color: "#6b7280",
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const radius = 70;
  const centerX = 100;
  const centerY = 100;

  const createArcPath = (startAngle, endAngle) => {
    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 text-orange-500 mr-2" />
        Customer Sentiment Distribution
      </h3>

      <div className="flex items-center justify-center mb-4">
        <svg width="200" height="200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            cumulativePercentage += percentage;

            return (
              <path
                key={index}
                d={createArcPath(startAngle, endAngle)}
                fill={item.color}
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              />
            );
          })}

          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className="text-xl font-bold fill-gray-900 dark:fill-white"
          >
            {branch.reviews.total}
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-sm fill-gray-500 dark:fill-gray-400"
          >
            Total Reviews
          </text>
        </svg>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.value.toFixed(1)}%
              </div>
            </div>
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
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-full overflow-y-auto">
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
      <div className="max-w-7xl mx-auto h-full flex flex-col">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-2 space-y-2 h-full">
            <div className="h-1/2">
              <IssueEscalationChart branch={branch} />
            </div>
            <div className="h-1/2">
              <TrendAnalysisChart branch={branch} />
            </div>
          </div>

          <div className="space-y-2 h-full">
            <div className="h-1/2">
              <SentimentPieChart branch={branch} />
            </div>
            <div className="h-1/2">
              <PerformanceSuggestions branch={branch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
