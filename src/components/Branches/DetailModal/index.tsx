import React from "react";
import {
  X,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  Users,
  Target,
} from "lucide-react";

const DetailModal = ({ isOpen, onClose, cardData, cardKey }) => {
  if (!isOpen || !cardData) return null;

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

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "number") {
      if (key.includes("percentage") || key.includes("rate")) {
        return `${value}%`;
      } else if (key.includes("score") && value < 1) {
        return `${(value * 100).toFixed(1)}%`;
      } else if (key.includes("time")) {
        return `${value} min`;
      }
      return value.toFixed(1);
    }

    if (Array.isArray(value) && value.length > 0) {
      return value;
    }

    if (typeof value === "object" && value !== null) {
      return value;
    }

    return value;
  };

  const getKeyMetrics = () => {
    const metrics = cardData.metrics;
    const keyMetrics = [];

    Object.entries(metrics).forEach(([key, value]) => {
      const formattedValue = formatValue(key, value);
      if (
        formattedValue !== null &&
        !Array.isArray(formattedValue) &&
        typeof formattedValue !== "object"
      ) {
        keyMetrics.push({
          key,
          value: formattedValue,
          label: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });
      }
    });

    return keyMetrics.slice(0, 6);
  };

  const getMetricIcon = (key) => {
    if (key.includes("score") || key.includes("rating"))
      return <Star className="w-4 h-4 text-green-500" />;
    if (key.includes("time"))
      return <Clock className="w-4 h-4 text-blue-500" />;
    if (key.includes("count") || key.includes("total"))
      return <Users className="w-4 h-4 text-green-500" />;
    if (key.includes("percentage"))
      return <TrendingUp className="w-4 h-4 text-purple-500" />;
    return <Target className="w-4 h-4 text-gray-500" />;
  };

  const renderKeyMetrics = () => {
    const keyMetrics = getKeyMetrics();

    if (keyMetrics.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No key metrics available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3">
        {keyMetrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getMetricIcon(metric.key)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {metric.label}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (title, data, type = "list") => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
          {type === "positive" && (
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          )}
          {type === "negative" && (
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
          )}
          {type === "services" && (
            <Target className="w-4 h-4 text-blue-500 mr-2" />
          )}
          {type === "needs" && (
            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
          )}
          {type === "emotions" && (
            <Activity className="w-4 h-4 text-purple-500 mr-2" />
          )}
          {title}
        </h4>

        {type === "services_satisfaction" ? (
          <div className="space-y-2">
            {data.slice(0, 4).map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                  {service[0].replace(/_/g, " ")}
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {service[1]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(data) ? data.slice(0, 6) : [data]).map(
              (item, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    type === "positive"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : type === "negative"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      : type === "needs"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : type === "emotions"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  }`}
                >
                  {typeof item === "string" ? item.replace(/_/g, " ") : item}
                </span>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const getAvailableSections = () => {
    const sections = [];
    const metrics = cardData.metrics;

    if (metrics.top_performing_aspects?.length > 0) {
      sections.push({
        title: "Top Performing Aspects",
        data: metrics.top_performing_aspects,
        type: "positive",
      });
    }

    if (metrics.improvement_needed_aspects?.length > 0) {
      sections.push({
        title: "Areas Needing Improvement",
        data: metrics.improvement_needed_aspects,
        type: "negative",
      });
    }

    if (metrics.most_mentioned_services?.length > 0) {
      sections.push({
        title: "Most Mentioned Services",
        data: metrics.most_mentioned_services,
        type: "services",
      });
    }

    if (metrics.highest_satisfaction_services?.length > 0) {
      sections.push({
        title: "Highest Satisfaction Services",
        data: metrics.highest_satisfaction_services,
        type: "services_satisfaction",
      });
    }

    if (metrics.lowest_satisfaction_services?.length > 0) {
      sections.push({
        title: "Lowest Satisfaction Services",
        data: metrics.lowest_satisfaction_services,
        type: "services_satisfaction",
      });
    }

    if (metrics.upgrade_needs?.length > 0) {
      sections.push({
        title: "Upgrade Needs",
        data: metrics.upgrade_needs,
        type: "needs",
      });
    }

    if (metrics.dominant_emotions?.length > 0) {
      sections.push({
        title: "Dominant Emotions",
        data: metrics.dominant_emotions,
        type: "emotions",
      });
    }

    return sections;
  };

  const availableSections = getAvailableSections();
  const hasAnyData = getKeyMetrics().length > 0 || availableSections.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white dark:bg-black border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${getTitleBackgroundColor(
                cardData.alert_level
              )}`}
            >
              {getAlertIcon(cardData.alert_level)}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {cardData.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!hasAnyData ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    There is no detailed information available for this section
                    at the moment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-6 h-full">
                {getKeyMetrics().length > 0 && (
                  <div className="col-span-4">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Key Metrics
                    </h3>
                    {renderKeyMetrics()}
                  </div>
                )}

                {availableSections.length > 0 && (
                  <div
                    className={`${
                      getKeyMetrics().length > 0 ? "col-span-8" : "col-span-12"
                    } space-y-6`}
                  >
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Detailed Analysis
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {availableSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                          {renderSection(
                            section.title,
                            section.data,
                            section.type
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailModal;
