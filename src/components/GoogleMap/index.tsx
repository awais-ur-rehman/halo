import { useEffect, useRef, useState } from "react";
import { Navigation, RefreshCw, AlertCircle } from "lucide-react";
import type { Branch, UserLocation } from "../../hook/useControlCenter";

interface GoogleMapProps {
  userLocation: UserLocation | null;
  branches: Branch[];
  onBranchSelect?: (branch: Branch) => void;
  loading?: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

export const GoogleMap = ({
  userLocation,
  branches,
  onBranchSelect,
  loading,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        initializeMap();
        return;
      }

      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJS.crossOrigin = "";
      leafletJS.onload = () => {
        setTimeout(initializeMap, 100);
      };
      leafletJS.onerror = () => {
        setMapError("Failed to load map library");
      };
      document.head.appendChild(leafletJS);
    };

    if (userLocation) {
      loadLeaflet();
    }
  }, [userLocation]);

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !window.L) return;

    try {
      const map = window.L.map(mapRef.current).setView(
        [userLocation.lat, userLocation.lng],
        12
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;

      const userIcon = window.L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="
            width: 20px; 
            height: 20px; 
            background-color: #4285F4; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>")
        .openPopup();

      setMapLoaded(true);
      setMapError(null);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
    }
  };

  const createCustomIcon = (type: Branch["type"], status: Branch["status"]) => {
    let color = "#FF6B35";
    if (status === "maintenance") color = "#FFC107";
    if (status === "closed") color = "#6C757D";

    let symbol = "🏦";
    if (type === "atm") symbol = "🏧";
    if (type === "main") symbol = "🏛️";

    return window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 32px; 
            height: 40px; 
            background-color: ${color}; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          "></div>
          <div style="
            position: absolute;
            top: 6px;
            left: 6px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transform: rotate(45deg);
          ">${symbol}</div>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  };

  useEffect(() => {
    if (!leafletMapRef.current || !mapLoaded || !branches.length) return;

    markersRef.current.forEach((marker) =>
      leafletMapRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    branches.forEach((branch) => {
      const icon = createCustomIcon(branch.type, branch.status);

      const marker = window.L.marker(
        [branch.coordinates.lat, branch.coordinates.lng],
        { icon }
      ).addTo(leafletMapRef.current);

      const popupContent = `
        <div style="max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            ${branch.name}
          </h3>
          
          <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" style="margin-top: 2px; flex-shrink: 0;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style="color: #6b7280; font-size: 14px; line-height: 1.4;">
              ${branch.address}
            </span>
          </div>
          
          ${
            branch.phone
              ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span style="color: #6b7280; font-size: 14px;">
                ${branch.phone}
              </span>
            </div>
          `
              : ""
          }
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span style="color: ${
              branch.status === "active"
                ? "#059669"
                : branch.status === "maintenance"
                ? "#d97706"
                : "#6b7280"
            }; font-size: 14px; font-weight: 500;">
              ${branch.workingHours}
            </span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="
              padding: 4px 12px; 
              border-radius: 16px; 
              font-size: 12px; 
              font-weight: 600;
              background-color: ${
                branch.type === "main"
                  ? "#dbeafe"
                  : branch.type === "branch"
                  ? "#fef3c7"
                  : "#f3f4f6"
              };
              color: ${
                branch.type === "main"
                  ? "#1e40af"
                  : branch.type === "branch"
                  ? "#92400e"
                  : "#374151"
              };
            ">
              ${branch.type.toUpperCase()}
            </span>
            <span style="
              padding: 4px 12px; 
              border-radius: 16px; 
              font-size: 12px; 
              font-weight: 600;
              background-color: ${
                branch.status === "active"
                  ? "#d1fae5"
                  : branch.status === "maintenance"
                  ? "#fef3c7"
                  : "#f3f4f6"
              };
              color: ${
                branch.status === "active"
                  ? "#065f46"
                  : branch.status === "maintenance"
                  ? "#92400e"
                  : "#374151"
              };
            ">
              ${branch.status.toUpperCase()}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelectedBranch(branch);
        onBranchSelect?.(branch);
      });

      markersRef.current.push(marker);
    });
  }, [branches, mapLoaded, onBranchSelect]);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 mb-4 max-w-md">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
        <div className="text-center">
          <Navigation className="w-12 h-12 text-orange-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Getting your location...
          </h3>
          <p className="text-gray-500">
            Please allow location access to view nearby branches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-sm" />

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-[1000]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
            <span className="text-gray-700 font-medium">
              Loading branches...
            </span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 z-[1000]">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Active Branch/ATM</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Under Maintenance</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-gray-600">Closed</span>
          </div>
        </div>
      </div>

      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm z-[1000]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">
              Map Ready • {branches.length} locations
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded px-2 py-1 text-xs text-gray-600 z-[1000]">
        Powered by{" "}
        <a
          href="https://www.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
};
