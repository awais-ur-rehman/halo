import React, { useState } from "react";
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
  BarChart3,
  Award,
  Target,
  MessageSquare,
  Shield,
  Zap,
  ChevronRight,
  Calendar,
  Activity,
  DollarSign,
  UserCheck,
  Settings,
  FileText,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

import analysisData from "../../../../data/agg_analysis.json";
import DetailModal from "../../../../components/Branches/DetailModal";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  color = "text-gray-900 dark:text-white",
}) => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg py-4 px-2 space-y-1">
    <div className="flex items-center space-x-2">
      <Icon className="w-4 h-4 text-green-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
    <div className={`text-xl text-gray-700`}>{value}</div>
  </div>
);

const DataCard = ({ title, alertLevel, metrics, cardKey, onClick }) => {
  const getAlertColor = (level) => {
    switch (level) {
      case "critical":
        return "border-black/10 ";
      case "warning":
        return "border-black/10";
      case "normal":
        return "border-black/10";
      default:
        return "border-black/10";
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "normal":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTitleBackgroundColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/40";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/40";
      case "normal":
        return "bg-green-50 dark:bg-green-900/40";
      default:
        return "bg-white dark:bg-black";
    }
  };

  const renderMetrics = () => {
    const metricConfigs = {
      overall_performance: [
        { key: "overall_score", label: "Overall Score" },
        { key: "total_reviews", label: "Total Reviews" },
        { key: "google_rating_average", label: "Google Rating" },
      ],
      staff_performance: [
        { key: "overall_staff_score", label: "Overall Staff Score" },
        { key: "compliments_count", label: "Compliments" },
        { key: "critical_issues", label: "Critical Issues" },
      ],
      management_effectiveness: [
        { key: "management_rating", label: "Management Rating" },
        { key: "escalation_rate", label: "Escalation Rate", suffix: "%" },
        { key: "complaints", label: "Complaints" },
      ],
      operational_efficiency: [
        { key: "avg_wait_time", label: "Avg Wait Time", suffix: " min" },
        { key: "overall_operational_score", label: "Overall Score" },
        { key: "operational_issues_count", label: "Issues Count" },
      ],
      service_quality: [
        { key: "overall_service_quality", label: "Overall Quality" },
        { key: "account_services", label: "Account Services" },
        { key: "average_service_satisfaction", label: "Avg Satisfaction" },
      ],
      facility_infrastructure: [
        { key: "overall_facility_score", label: "Overall Facility Score" },
        { key: "cleanliness", label: "Cleanliness" },
        { key: "atm_availability", label: "ATM Availability" },
      ],
      customer_experience: [
        { key: "overall_customer_experience", label: "Overall Experience" },
        {
          key: "brand_advocacy_percentage",
          label: "Brand Advocacy",
          suffix: "%",
        },
        { key: "loyalty_indicators", label: "Loyalty Indicators", suffix: "%" },
      ],
      sentiment_analysis: [
        { key: "positive", label: "Positive", suffix: "%" },
        { key: "negative", label: "Negative", suffix: "%" },
        { key: "emotional_intensity", label: "Emotional Intensity" },
      ],
      business_impact: [
        { key: "high_risk", label: "High Risk" },
        { key: "revenue_impact", label: "Revenue Impact" },
        { key: "business_risk_assessment", label: "Risk Assessment" },
      ],
      reviewer_credibility: [
        { key: "avg_level", label: "Avg Level" },
        { key: "local_guides", label: "Local Guides", suffix: "%" },
        {
          key: "authenticity_score",
          label: "Authenticity Score",
          transform: (val) => `${(val * 100).toFixed(1)}%`,
        },
      ],
    };

    const config = metricConfigs[cardKey] || [];

    return config.map((item, index) => {
      let value = metrics[item.key];
      if (item.transform) {
        value = item.transform(value);
      } else if (item.suffix) {
        value = `${value}${item.suffix}`;
      }

      return (
        <div key={index} className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {item.label}
          </span>
          <span className="text-sm text-gray-600 dark:text-white">{value}</span>
        </div>
      );
    });
  };

  return (
    <div
      className={`border rounded-xl px-6 py-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getAlertColor(
        alertLevel
      )} `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`flex items-center space-x-3 py-1 px-3 rounded-[4px] ${getTitleBackgroundColor(
            alertLevel
          )}`}
        >
          {getAlertIcon(alertLevel)}
          <h3 className={`text-[14px] text-gray-900 dark:text-white `}>
            {title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-3">{renderMetrics()}</div>
    </div>
  );
};

const ChartCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4 ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const RecommendationSection = ({
  title,
  items,
  icon: Icon,
  bgColor,
  iconColor,
}) => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <Icon className={`w-5 h-5 ${iconColor} mr-2`} />
      {title}
    </h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 p-3 ${bgColor} rounded-lg`}
        >
          <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ActionCard = ({ title, items, priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "immediate":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "long":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className={`border rounded-xl p-6 border-black/10`}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-2">
            <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BranchOverviewPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardKey, setSelectedCardKey] = useState(null);

  const handleCardClick = (cardData, cardKey) => {
    setSelectedCard(cardData);
    setSelectedCardKey(cardKey);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
    setSelectedCardKey(null);
  };

  if (!id) {
    return <Navigate to="/dashboard/branches" replace />;
  }

  const data = analysisData;

  const HeaderSection = () => (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {data.metadata.branch_name}
            </h1>

            <span className=" text-gray-900/40 dark:text-white/40 text-[12px]">
              {new Date(
                data.metadata.analysis_period.start
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(data.metadata.analysis_period.end).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {data.summary_metrics.overall_score}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {data.summary_metrics.performance_level}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        <MetricCard
          icon={Star}
          label="Google Rating"
          value={data.summary_metrics.google_rating_average}
          color="text-yellow-600 dark:text-yellow-400"
        />
        <MetricCard
          icon={TrendingUp}
          label="Positive %"
          value={`${data.summary_metrics.sentiment_positive_percentage}%`}
          color="text-green-600 dark:text-green-400"
        />
        <MetricCard
          icon={Users}
          label="Satisfaction"
          value={data.summary_metrics.customer_satisfaction}
          color="text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          icon={AlertTriangle}
          label="High Risk"
          value={data.summary_metrics.high_risk_customers}
          color="text-red-600 dark:text-red-400"
        />
        <MetricCard
          icon={Clock}
          label="Urgent Actions"
          value={data.summary_metrics.urgent_actions_needed}
          color="text-purple-600 dark:text-purple-400"
        />
        <MetricCard
          icon={FileText}
          label="Reviews"
          value={data.metadata.total_reviews_analyzed}
          color="text-green-600 dark:text-green-400"
        />
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { key: "details", label: "Details", icon: FileText },
            { key: "analytics", label: "Analytics", icon: BarChart3 },
            {
              key: "recommendations",
              label: "Recommendations",
              icon: Lightbulb,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  const DetailsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
      {Object.entries(data.data_cards).map(([key, card]) => (
        <DataCard
          key={key}
          title={card.title}
          alertLevel={card.alert_level}
          metrics={card.metrics}
          cardKey={key}
          onClick={() => handleCardClick(card, key)}
        />
      ))}
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data.chart_data.performance_radar}>
              <PolarGrid gridType="polygon" stroke="#f1f5f9" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) =>
                  value.length > 12 ? value.substring(0, 12) + "..." : value
                }
              />
              <PolarRadiusAxis
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickCount={5}
                angle={90}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.08}
                strokeWidth={2}
                dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.chart_data.sentiment_pie}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.chart_data.sentiment_pie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
                formatter={(value) => [`${value}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.chart_data.sentiment_pie.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Staff Performance
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data.chart_data.staff_performance_bar}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#f1f5f9"
                strokeWidth={1}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value.length > 8 ? value.substring(0, 8) + "..." : value
                }
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
                cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
              />
              <Bar
                dataKey="score"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.chart_data.risk_distribution}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                strokeWidth={0}
                paddingAngle={2}
              >
                {data.chart_data.risk_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {data.chart_data.risk_distribution.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data.chart_data.trend_lines}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#f1f5f9"
              strokeWidth={1}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
              cursor={{ stroke: "rgba(99, 102, 241, 0.2)", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="overall_score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-6 flex justify-center space-x-8">
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Score
            </span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Satisfaction
            </span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Efficiency
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const RecommendationsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecommendationSection
          title="Top Strengths"
          items={data.insights_and_recommendations.top_strengths}
          icon={TrendingUp}
          bgColor="bg-[#fafafa]"
          iconColor="text-green-500"
        />
        <RecommendationSection
          title="Critical Weaknesses"
          items={data.insights_and_recommendations.critical_weaknesses}
          icon={AlertTriangle}
          bgColor="bg-[#fafafa]"
          iconColor="text-red-500"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Action Plan
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Immediate Actions"
            items={data.insights_and_recommendations.immediate_actions}
            priority="immediate"
          />
          <ActionCard
            title="Medium-term Improvements"
            items={data.insights_and_recommendations.medium_term_improvements}
            priority="medium"
          />
          <ActionCard
            title="Long-term Strategic"
            items={
              data.insights_and_recommendations
                .long_term_strategic_recommendations
            }
            priority="long"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Success Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Primary KPIs
            </h4>
            <div className="space-y-3">
              {Object.entries(
                data.insights_and_recommendations.success_metrics.primary_kpis
              ).map(([key, metric]) => (
                <div
                  key={key}
                  className="flex justify-between items-center bg-[#fafafa] p-3 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {metric.target} ({metric.timeframe})
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Secondary KPIs
            </h4>
            <div className="space-y-3">
              {Object.entries(
                data.insights_and_recommendations.success_metrics.secondary_kpis
              ).map(([key, metric]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 bg-[#fafafa] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {metric.target} ({metric.timeframe})
                    </div>
                  </div>
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white dark:bg-black h-full transition-colors duration-200">
      <div className="max-w-8xl mx-auto h-full flex flex-col px-8">
        <HeaderSection />
        <TabNavigation />
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === "details" && <DetailsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "recommendations" && <RecommendationsTab />}
        </div>
      </div>

      <DetailModal
        isOpen={modalOpen}
        onClose={closeModal}
        cardData={selectedCard}
        cardKey={selectedCardKey}
      />
    </div>
  );
};

export default BranchOverviewPage;
