import { useState } from "react";
import {
  MapPin,
  Building2,
  Navigation,
  RefreshCw,
  Phone,
  Clock,
  Filter,
  Search,
  List,
  Map as MapIcon,
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
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="h-40 bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Control Center</h1>
            <p className="text-gray-600 mt-1">
              {locationPermissionDenied
                ? "Showing branches around Karachi (location access denied)"
                : "Showing branches near your location"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>

            <button
              onClick={refreshBranches}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search branches by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="main">Main Branch</option>
            <option value="branch">Branch</option>
            <option value="atm">ATM</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {viewMode === "map" ? (
          <>
            <div className="flex-1 p-6 min-w-0 h-[90%]">
              <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden">
                <GoogleMap
                  userLocation={userLocation}
                  branches={filteredBranches}
                  onBranchSelect={handleBranchSelect}
                  loading={loading}
                />
              </div>
            </div>

            <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-[90%]">
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nearby Branches ({filteredBranches.length})
                </h3>
                {selectedBranch && (
                  <p className="text-sm text-orange-600">
                    {selectedBranch.name} selected
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredBranches.map((branch) => {
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
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedBranch?.id === branch.id
                          ? "bg-orange-50 border-orange-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getTypeIcon(branch.type)}
                          </span>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {branch.name}
                          </h4>
                        </div>
                        {distance && (
                          <span className="text-xs text-gray-500">
                            {distance} km
                          </span>
                        )}
                      </div>

                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {branch.address}
                        </p>
                      </div>

                      {branch.phone && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {branch.phone}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {branch.workingHours}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {branch.type.toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No branches found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 min-w-0">
            <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {userLocation && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distance
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBranches.map((branch) => {
                      const distance = userLocation
                        ? calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            branch.coordinates.lat,
                            branch.coordinates.lng
                          )
                        : null;

                      return (
                        <tr
                          key={branch.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleBranchSelect(branch)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg mr-3">
                                {getTypeIcon(branch.type)}
                              </span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {branch.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {branch.type.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {branch.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {branch.phone || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {branch.workingHours}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                branch.status
                              )}`}
                            >
                              {branch.status.toUpperCase()}
                            </span>
                          </td>
                          {userLocation && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {distance ? `${distance} km` : "N/A"}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredBranches.length === 0 && !loading && (
                  <div className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No branches found matching your criteria
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading branches...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
