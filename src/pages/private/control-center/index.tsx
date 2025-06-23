import { useState } from "react";
import {
  MapPin,
  Building2,
  RefreshCw,
  Phone,
  Clock,
  X,
  List,
} from "lucide-react";
import { GoogleMap } from "../../../components/GoogleMap";
import { useBranches, type Branch } from "../../../hook/useControlCenter";

export const ControlCenterPage = () => {
  const {
    branches,
    userLocation,
    loading,
    error,
    locationPermissionDenied,
    refreshBranches,
    getBranchesByDistance,
    calculateDistance,
  } = useBranches();

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "maintenance" | "closed"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "main" | "branch" | "atm"
  >("all");
  const [showBranchPanel, setShowBranchPanel] = useState(false);

  const filteredBranches = getBranchesByDistance().filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || branch.status === statusFilter;
    const matchesType = typeFilter === "all" || branch.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const getStatusColor = (status: Branch["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: Branch["type"]) => {
    switch (type) {
      case "main":
        return "🏛️";
      case "branch":
        return "🏦";
      case "atm":
        return "🏧";
      default:
        return "🏦";
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Branches
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refreshBranches}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden p-6">
      <style>{`
        .leaflet-container {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          ) !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }

        .leaflet-tile-pane {
          filter: grayscale(20%) contrast(1.1) brightness(0.95)
            hue-rotate(15deg);
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          backdrop-filter: blur(20px) !important;
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #1f2937 !important;
          border: none !important;
          backdrop-filter: blur(10px) !important;
          font-weight: 600 !important;
          font-size: 18px !important;
          transition: all 0.3s ease !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }

        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          transform: scale(1.05) !important;
          color: #111827 !important;
        }

        .leaflet-control-zoom a:first-child {
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
        }

        .leaflet-control-zoom a:last-child {
          border-bottom-left-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border-radius: 16px !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          padding: 0 !important;
        }

        .leaflet-popup-content {
          margin: 16px !important;
        }

        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .leaflet-popup-close-button {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
          border-radius: 50% !important;
          width: 24px !important;
          height: 24px !important;
          font-size: 14px !important;
          font-weight: bold !important;
          right: 8px !important;
          top: 8px !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-popup-close-button:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          transform: scale(1.1) !important;
        }

        .custom-marker {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
          transition: all 0.3s ease;
        }

        .custom-marker:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35));
        }

        .user-location-marker {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 8px !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
        }

        .legend-card {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        }

        .status-indicator {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(15px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>

      <div className="absolute inset-0 p-6">
        <GoogleMap
          userLocation={userLocation}
          branches={filteredBranches}
          onBranchSelect={handleBranchSelect}
          loading={loading}
        />
      </div>

      <div className="absolute top-8 left-25 z-[999]">
        <button
          onClick={() => setShowBranchPanel(true)}
          className="group relative px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center space-x-3">
            <List className="w-6 h-6 text-gray-900" />
            <span className="font-semibold text-gray-900 text-base">
              View Branches
            </span>
            <div className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
              {filteredBranches.length}
            </div>
          </div>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {showBranchPanel && (
        <>
          <div
            className="absolute inset-0 pt-10  z-[998] transition-all duration-300"
            onClick={() => setShowBranchPanel(false)}
          />

          <div className="absolute top-10 right-10 h-[90%] w-96 z-[1000] transform transition-transform duration-500 ease-out">
            <div
              className="h-full relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="relative p-6 border-b border-white/20">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Nearby Branches
                    </h3>
                    <p className="text-sm text-gray-600">
                      {filteredBranches.length} locations found
                    </p>
                    {selectedBranch && (
                      <p className="text-sm text-orange-600 mt-1">
                        {selectedBranch.name} selected
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowBranchPanel(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent backdrop-blur-sm"
                  />

                  <div className="flex space-x-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/50 backdrop-blur-sm text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/50 backdrop-blur-sm text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="main">Main</option>
                      <option value="branch">Branch</option>
                      <option value="atm">ATM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto max-h-[calc(94vh-280px)] min-h-0">
                {filteredBranches.map((branch, index) => {
                  const distance = userLocation
                    ? calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        branch.coordinates.lat,
                        branch.coordinates.lng
                      )
                    : null;

                  return (
                    <div
                      key={branch.id}
                      onClick={() => handleBranchSelect(branch)}
                      className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/20 transition-all duration-300 ${
                        selectedBranch?.id === branch.id
                          ? "bg-orange-400/20 border-orange-400/30"
                          : ""
                      }`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg filter drop-shadow-sm">
                            {getTypeIcon(branch.type)}
                          </span>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {branch.name}
                          </h4>
                        </div>
                        {distance && (
                          <span className="text-xs text-gray-600 bg-white/30 px-2 py-1 rounded-full">
                            {distance} km
                          </span>
                        )}
                      </div>

                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {branch.address}
                        </p>
                      </div>

                      {branch.phone && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-700">
                            {branch.phone}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-700">
                          {branch.workingHours}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-400/30 text-blue-900 backdrop-blur-sm">
                            {branch.type.toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(
                              branch.status
                            )}`}
                          >
                            {branch.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredBranches.length === 0 && !loading && (
                  <div className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4 filter drop-shadow-sm" />
                    <p className="text-gray-600">
                      No branches found matching your criteria
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4 filter drop-shadow-sm" />
                    <p className="text-gray-600">Loading branches...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
